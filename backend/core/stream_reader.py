import os
import sys

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import time
import cv2

import config
from utils.logger import setup_logger

logger = setup_logger("StreamReader")

class StreamReader:
    """Manages OpenCV VideoCapture connection and frame decoding for RTSP/HLS streams."""

    def __init__(self, camera_code: str, rtsp_url: str = None, hls_url: str = None):
        self.camera_code = camera_code.lower()
        
        # Build stream URLs
        if not rtsp_url:
            user = config.ENCODED_USER
            pwd = config.ENCODED_PASS
            self.rtsp_url = f"rtsp://{user}:{pwd}@{config.RTSP_HOST}:{config.RTSP_PORT}/stream/{self.camera_code}"
        else:
            self.rtsp_url = rtsp_url

        self.hls_url = hls_url or f"https://{config.CDN_HOST}/{self.camera_code}/index.m3u8"
        self.cap = None

        # Force FFmpeg RTSP options (TCP transport, max_delay, buffer size)
        os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = config.FFMPEG_OPTIONS

    def connect(self):
        """Attempts to open live RTSP stream, falling back to HLS if unavailable."""
        logger.info(f"Connecting to RTSP feed (TCP): {self.rtsp_url}")
        self.cap = cv2.VideoCapture(self.rtsp_url, cv2.CAP_FFMPEG)

        if self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret and frame is not None and frame.size > 0:
                logger.info(f"Connected successfully to live RTSP feed [{self.camera_code.upper()}]")
                return True
            self.cap.release()

        logger.warning(f"RTSP feed unreachable. Trying HLS fallback: {self.hls_url}")
        self.cap = cv2.VideoCapture(self.hls_url, cv2.CAP_FFMPEG)
        if self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret and frame is not None and frame.size > 0:
                logger.info(f"Connected successfully to HLS fallback feed [{self.camera_code.upper()}]")
                return True
            self.cap.release()

        self.cap = None
        return False

    def read_frame(self):
        """Reads next frame and extracts Presentation Timestamp (PTS)."""
        if self.cap is None or not self.cap.isOpened():
            return False, None, 0.0

        ret, frame = self.cap.read()
        if not ret or frame is None or frame.size == 0:
            return False, None, 0.0

        pts_ms = self.cap.get(cv2.CAP_PROP_POS_MSEC)
        return True, frame, pts_ms

    def release(self):
        """Releases the VideoCapture resources."""
        if self.cap is not None:
            self.cap.release()
            self.cap = None
