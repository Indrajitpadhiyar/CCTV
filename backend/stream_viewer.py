import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import time
import logging
import cv2
import numpy as np

import config

# Force FFMPEG to use TCP transport for RTSP streams to avoid packet loss
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("SingleCameraViewer")


class SingleCameraViewer:
    """Professional, lightweight single camera stream viewer using OpenCV."""

    def __init__(self, camera_code: str = None, rtsp_url: str = None, hls_url: str = None):
        self.camera_code = (camera_code or config.CAMERA_CODE).lower()
        
        # Build URLs if not provided
        if not rtsp_url:
            user = config.ENCODED_USER
            pwd = config.ENCODED_PASS
            self.rtsp_url = f"rtsp://{user}:{pwd}@{config.RTSP_HOST}:{config.RTSP_PORT}/stream/{self.camera_code}"
        else:
            self.rtsp_url = rtsp_url

        self.hls_url = hls_url or f"https://{config.CDN_HOST}/{self.camera_code}/index.m3u8"
        self.window_name = f"Sentinel CCTV — Live Feed [{self.camera_code.upper()}]"
        
        self.backoff = config.MIN_RECONNECT_SEC
        self.frame_count = 0
        self.start_time = time.time()
        self.running = False

    def connect_stream(self):
        """Attempts to open RTSP stream over TCP, falling back to HLS stream if needed."""
        logger.info(f"Connecting to RTSP stream (TCP): {self.rtsp_url}")
        cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)
        
        if cap.isOpened():
            ret, _ = cap.read()
            if ret:
                logger.info("Successfully connected to live RTSP camera feed!")
                self.backoff = config.MIN_RECONNECT_SEC
                return cap
            cap.release()

        logger.warning(f"RTSP stream unavailable. Attempting HLS fallback stream: {self.hls_url}")
        cap = cv2.VideoCapture(self.hls_url, cv2.CAP_FFMPEG)
        if cap.isOpened():
            ret, _ = cap.read()
            if ret:
                logger.info("Successfully connected to live HLS camera feed!")
                self.backoff = config.MIN_RECONNECT_SEC
                return cap
            cap.release()

        return None

    def draw_hud(self, frame: np.ndarray, pts_ms: float, is_live: bool = True) -> np.ndarray:
        """Draws a professional Head-Up Display (HUD) overlay on the camera frame."""
        h, w, _ = frame.shape

        # Top Overlay Bar (semi-transparent dark background)
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 50), (10, 15, 26), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)

        # Status Indicator Dot
        dot_color = (0, 230, 118) if is_live else (0, 0, 255) # Green vs Red
        cv2.circle(frame, (20, 25), 6, dot_color, -1)

        # Camera Code & Title
        title_text = f"CAM: {self.camera_code.upper()}  |  SENTINEL CCTV MONITOR"
        cv2.putText(frame, title_text, (36, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # Monotonic Presentation Timestamp (PTS) Counter
        pts_text = f"PTS: {int(pts_ms):,} ms"
        cv2.putText(frame, pts_text, (w - 220, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 229, 255), 1, cv2.LINE_AA)

        # Bottom Info Bar
        cv2.rectangle(frame, (0, h - 30), (w, h), (10, 15, 26), -1)
        info_text = f"Protocol: RTSP/TCP  |  FPS: 25  |  Resolution: {w}x{h}  |  Press 'q' or ESC to Exit"
        cv2.putText(frame, info_text, (15, h - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (180, 190, 200), 1, cv2.LINE_AA)

        return frame

    def create_fallback_frame(self, message: str = "RECONNECTING TO CAMERA...") -> np.ndarray:
        """Generates a clean simulated camera frame when stream is reconnecting."""
        w, h = 960, 540
        frame = np.zeros((h, w, 3), dtype=np.uint8)

        # Gradient background
        for y in range(h):
            color = int(15 + (y / h) * 20)
            frame[y, :] = (color, color + 5, color + 15)

        # Grid lines
        for x in range(0, w, 60):
            cv2.line(frame, (x, 0), (x, h), (40, 45, 60), 1)
        for y in range(0, h, 60):
            cv2.line(frame, (0, y), (w, y), (40, 45, 60), 1)

        # Reconnecting text
        pts_ms = (time.time() - self.start_time) * 1000
        cv2.putText(frame, f"[!] {message}", (w // 2 - 200, h // 2), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 200, 255), 2)
        cv2.putText(frame, f"Next retry in: {int(self.backoff)}s", (w // 2 - 100, h // 2 + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 160, 180), 1)

        return self.draw_hud(frame, pts_ms, is_live=False)

    def start(self):
        """Starts live stream viewing in a native Python GUI window."""
        self.running = True
        logger.info(f"Starting Single Camera Live Feed for '{self.camera_code.upper()}'...")
        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_name, 1024, 576)

        last_frame_time = time.time()

        while self.running:
            cap = self.connect_stream()

            if cap is not None:
                while self.running:
                    ret, frame = cap.read()

                    if not ret:
                        logger.warning("Stream frame drop or disconnect detected.")
                        break

                    last_frame_time = time.time()
                    self.frame_count += 1
                    
                    # Extract Monotonic Presentation Timestamp (PTS)
                    pts_ms = cap.get(cv2.CAP_PROP_POS_MSEC)
                    if pts_ms <= 0:
                        pts_ms = (time.time() - self.start_time) * 1000

                    # Draw HUD Overlay
                    rendered_frame = self.draw_hud(frame, pts_ms, is_live=True)
                    cv2.imshow(self.window_name, rendered_frame)

                    # Handle Key Press ('q' or ESC to exit)
                    key = cv2.waitKey(1) & 0xFF
                    if key == ord('q') or key == 27:
                        logger.info("Exit requested by user.")
                        self.running = False
                        break

                cap.release()

            if not self.running:
                break

            # Show Reconnecting screen during backoff delay
            logger.info(f"Reconnecting in {self.backoff:.1f} seconds...")
            backoff_start = time.time()
            while time.time() - backoff_start < self.backoff and self.running:
                fallback_frame = self.create_fallback_frame()
                cv2.imshow(self.window_name, fallback_frame)
                key = cv2.waitKey(100) & 0xFF
                if key == ord('q') or key == 27:
                    self.running = False
                    break

            # Exponential backoff update (capped at MAX_RECONNECT_SEC)
            self.backoff = min(self.backoff * config.BACKOFF_FACTOR, config.MAX_RECONNECT_SEC)

        cv2.destroyAllWindows()
        logger.info("Single camera stream viewer closed cleanly.")


if __name__ == "__main__":
    viewer = SingleCameraViewer()
    viewer.start()
