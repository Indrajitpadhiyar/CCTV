import os
import sys


# Ensure backend root is on sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import time
import cv2
import config
from core.stream_reader import StreamReader
from core.hud_renderer import HUDRenderer
from utils.logger import setup_logger

logger = setup_logger("CameraService")

class CameraService:
    """Manages single camera playback lifecycle and GUI window rendering."""

    def __init__(self, camera_code: str = None, rtsp_url: str = None):
        self.camera_code = (camera_code or config.CAMERA_CODE).lower()
        self.rtsp_url = rtsp_url
        self.reader = StreamReader(self.camera_code, self.rtsp_url)
        self.window_name = f"Sentinel CCTV — Live Feed [{self.camera_code.upper()}]"
        self.backoff_sec = config.MIN_RECONNECT_SEC
        self.start_time = time.time()
        self.is_running = False

    def run(self):
        """Runs the main camera display loop."""
        self.is_running = True
        logger.info(f"Launching Live Footage Screen for Camera '{self.camera_code.upper()}'...")

        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_name, 1024, 576)

        while self.is_running:
            connected = self.reader.connect()

            if connected:
                self.backoff_sec = config.MIN_RECONNECT_SEC
                while self.is_running:
                    success, frame, pts_ms = self.reader.read_frame()

                    if not success:
                        logger.warning(f"Frame drop detected on camera [{self.camera_code.upper()}]. Reconnecting...")
                        break

                    if pts_ms <= 0:
                        pts_ms = (time.time() - self.start_time) * 1000

                    # Draw HUD & Render on Python Screen
                    rendered = HUDRenderer.draw_hud(frame, self.camera_code, pts_ms, is_live=True)
                    cv2.imshow(self.window_name, rendered)

                    # Handle exit keys ('q' or ESC)
                    key = cv2.waitKey(1) & 0xFF
                    if key == ord('q') or key == 27:
                        logger.info("User requested exit.")
                        self.is_running = False
                        break

                self.reader.release()

            if not self.is_running:
                break

            # Show Reconnecting HUD screen during exponential backoff
            logger.info(f"Retrying connection in {self.backoff_sec:.1f}s...")
            backoff_start = time.time()
            while time.time() - backoff_start < self.backoff_sec and self.is_running:
                pts_ms = (time.time() - self.start_time) * 1000
                reconnect_frame = HUDRenderer.draw_reconnecting_screen(self.camera_code, self.backoff_sec, pts_ms)
                cv2.imshow(self.window_name, reconnect_frame)

                key = cv2.waitKey(100) & 0xFF
                if key == ord('q') or key == 27:
                    self.is_running = False
                    break

            # Exponential backoff update
            self.backoff_sec = min(self.backoff_sec * config.BACKOFF_FACTOR, config.MAX_RECONNECT_SEC)

        cv2.destroyAllWindows()
        logger.info("Camera service shutdown complete.")
