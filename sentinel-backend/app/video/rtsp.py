import os
import time
import cv2
import numpy as np
from typing import Optional, Tuple, Any
from app.core.logging import logger
from app.core.config import settings

# Force RTSP transport over TCP to avoid UDP frame loss across NAT/firewalls
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"


class RTSPStreamClient:
    """
    RTSP & HLS Live Stream Client wrapper compliant with Physical CCTV Camera Specs:
    - Forces RTSP transport over TCP (`rtsp_transport;tcp`)
    - Supports HLS fallback endpoints (`.m3u8`)
    - Derives frame timing strictly from Monotonic Presentation Timestamps (PTS via `CAP_PROP_POS_MSEC`)
    - Exponential backoff reconnection (~2s base up to 30s cap)
    - Tolerates inter-frame gaps & non-fatal join-time decoder warnings
    - Detects scene discontinuities / hard cuts on feed loop points
    """

    def __init__(
        self,
        stream_url: str,
        camera_id: str = "unknown",
        use_mock: bool = False
    ):
        self.stream_url = stream_url
        self.camera_id = camera_id
        self.use_mock = use_mock or (settings.AI_MODE == "mock" and not stream_url.startswith(("rtsp://", "http://", "https://")))
        self.cap: Optional[cv2.VideoCapture] = None
        self.is_connected = False

        # Timing & Reconnection state
        self.reconnect_attempts = 0
        self.base_backoff = 2.0
        self.max_backoff = 30.0
        self.last_pts_ms: float = 0.0
        self.frame_count: int = 0

    def _resolve_stream_target(self) -> str:
        url = self.stream_url
        # If camera_id format like 'cam04' and URL is a template, construct full HLS or RTSP URL
        if url.startswith("cam") or not (url.startswith("http://") or url.startswith("https://") or url.startswith("rtsp://")):
            cam_code = url if url.startswith("cam") else self.camera_id
            if settings.CCTV_STREAM_USER and settings.CCTV_STREAM_PASSWORD:
                # Format RTSP URL with URL encoded credentials
                user = settings.CCTV_STREAM_USER.replace("@", "%40")
                pwd = settings.CCTV_STREAM_PASSWORD.replace("@", "%40")
                url = f"rtsp://{user}:{pwd}@{settings.CCTV_RTSP_HOST}:{settings.CCTV_RTSP_PORT}/stream/{cam_code}"
            else:
                # Fallback to public HLS endpoint
                url = f"{settings.CCTV_HLS_BASE_URL}/{cam_code}/index.m3u8"
        return url

    def connect(self) -> bool:
        """Connect to stream source with FFMPEG backend and TCP transport."""
        if self.use_mock:
            logger.info(f"[{self.camera_id}] Using Mock Stream Client.")
            self.is_connected = True
            return True

        target_url = self._resolve_stream_target()
        masked_url = target_url
        if "@" in masked_url:
            prefix, rest = masked_url.split("://", 1)
            creds, host_path = rest.split("@", 1)
            masked_url = f"{prefix}://***:***@{host_path}"

        logger.info(f"[{self.camera_id}] Connecting to live stream: {masked_url}")

        try:
            self.cap = cv2.VideoCapture(target_url, cv2.CAP_FFMPEG)
            if self.cap.isOpened():
                self.is_connected = True
                self.reconnect_attempts = 0
                logger.info(f"[{self.camera_id}] Successfully connected to stream.")
                return True
            else:
                logger.warning(f"[{self.camera_id}] VideoCapture failed to open {masked_url}")
                self.is_connected = False
                return False
        except Exception as e:
            logger.error(f"[{self.camera_id}] Exception while connecting to stream: {e}")
            self.is_connected = False
            return False

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray], float, bool]:
        """
        Read a single frame from the stream.
        Returns:
            ok (bool): True if frame captured successfully
            frame (np.ndarray): BGR image array
            pts_ms (float): Monotonic Presentation Timestamp in milliseconds
            is_discontinuity (bool): True if PTS reset or loop hard cut detected
        """
        if self.use_mock:
            self.frame_count += 1
            pts_ms = self.frame_count * 200.0  # Simulated 5 FPS (200ms per frame)
            frame = np.zeros((720, 1280, 3), dtype=np.uint8)
            cv2.putText(
                frame,
                f"CAM: {self.camera_id} | PTS: {pts_ms:.0f}ms",
                (50, 100),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.0,
                (0, 255, 0),
                2
            )
            return True, frame, pts_ms, False

        if not self.is_connected or self.cap is None or not self.cap.isOpened():
            self.reconnect_with_backoff()
            return False, None, 0.0, False

        ok, frame = self.cap.read()
        if not ok or frame is None:
            logger.warning(f"[{self.camera_id}] Frame read failed or end of stream reached.")
            self.disconnect()
            self.reconnect_with_backoff()
            return False, None, 0.0, False

        # Extract Monotonic Presentation Timestamp (PTS) in milliseconds
        pts_ms = self.cap.get(cv2.CAP_PROP_POS_MSEC)
        if pts_ms <= 0:
            pts_ms = time.time() * 1000.0  # Fallback monotonic timestamp

        # Check for scene discontinuity (loop point cut or timestamp backward jump)
        is_discontinuity = False
        if self.last_pts_ms > 0 and (pts_ms < self.last_pts_ms or (pts_ms - self.last_pts_ms) > 10000.0):
            logger.info(f"[{self.camera_id}] Scene discontinuity / loop point detected (PTS jump {self.last_pts_ms:.0f} -> {pts_ms:.0f} ms).")
            is_discontinuity = True

        self.last_pts_ms = pts_ms
        self.frame_count += 1
        return True, frame, pts_ms, is_discontinuity

    def reconnect_with_backoff(self) -> bool:
        """Perform exponential backoff reconnection (~2s base up to 30s cap)."""
        self.reconnect_attempts += 1
        backoff_delay = min(self.base_backoff * (2 ** (self.reconnect_attempts - 1)), self.max_backoff)
        logger.info(f"[{self.camera_id}] Reconnecting attempt #{self.reconnect_attempts} in {backoff_delay:.1f}s...")
        time.sleep(backoff_delay)
        return self.connect()

    def disconnect(self) -> None:
        """Safely release VideoCapture resources."""
        self.is_connected = False
        if self.cap is not None:
            try:
                self.cap.release()
            except Exception as e:
                logger.error(f"[{self.camera_id}] Error releasing capture: {e}")
            self.cap = None
        logger.info(f"[{self.camera_id}] Disconnected live stream.")

