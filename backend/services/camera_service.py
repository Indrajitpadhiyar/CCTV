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
from core.face_analyzer import FaceAnalyzer
from utils.logger import setup_logger

logger = setup_logger("CameraService")

class CameraService:
    """Manages camera playback lifecycle, face detection analytics, and GUI rendering."""

    def __init__(self, camera_code: str = None, rtsp_url: str = None, video_path: str = None, analyze_faces: bool = True):
        self.camera_code = (camera_code or config.CAMERA_CODE).lower()
        self.rtsp_url = rtsp_url
        self.video_path = video_path
        self.reader = StreamReader(self.camera_code, self.rtsp_url, video_path=self.video_path)
        
        display_label = os.path.basename(video_path) if video_path else self.camera_code.upper()
        self.window_name = f"Sentinel CCTV — Live AI Stream [{display_label}]"
        self.backoff_sec = config.MIN_RECONNECT_SEC
        self.start_time = time.time()
        self.is_running = False
        self.face_analysis_active = analyze_faces
        
        # Initialize Face Analyzer module
        logger.info("Initializing Real-Time Face Detection & Tracking Engine...")
        self.face_analyzer = FaceAnalyzer()

        # Ensure snapshot directory exists
        self.snapshot_dir = os.path.join(BACKEND_DIR, "snapshots")
        os.makedirs(self.snapshot_dir, exist_ok=True)

    def run(self):
        """Runs the main camera display loop with live face detection."""
        self.is_running = True
        label = os.path.basename(self.video_path) if self.video_path else self.camera_code.upper()
        logger.info(f"Launching Live AI Screen for Source '{label}'...")
        logger.info("Controls: Press 'f' to toggle Face AI overlay, 's' for snapshot, 'q'/ESC to exit.")

        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_name, 1024, 576)

        wait_delay = 33 if self.video_path else 1

        while self.is_running:
            connected = self.reader.connect()

            if connected:
                self.backoff_sec = config.MIN_RECONNECT_SEC
                while self.is_running:
                    success, frame, pts_ms = self.reader.read_frame()

                    if not success:
                        logger.warning(f"Frame drop detected on camera [{label}]. Reconnecting...")
                        break

                    if pts_ms <= 0:
                        pts_ms = (time.time() - self.start_time) * 1000

                    # Analyze faces on current frame if enabled
                    faces = []
                    if self.face_analysis_active:
                        try:
                            faces = self.face_analyzer.analyze_frame(frame)
                        except Exception as e:
                            logger.error(f"Error during face analysis: {e}")

                    # Draw HUD & Render on Screen
                    rendered = HUDRenderer.draw_hud(
                        frame,
                        self.camera_code if not self.video_path else "FILE",
                        pts_ms,
                        is_live=True,
                        faces=faces,
                        face_analysis_active=self.face_analysis_active
                    )
                    cv2.imshow(self.window_name, rendered)

                    # Handle key presses with frame rate pacing for local video
                    key = cv2.waitKey(wait_delay) & 0xFF
                    if key == ord('q') or key == 27:
                        logger.info("User requested exit.")
                        self.is_running = False
                        break
                    elif key == ord('f') or key == ord('F'):
                        self.face_analysis_active = not self.face_analysis_active
                        status = "ACTIVATED" if self.face_analysis_active else "DEACTIVATED"
                        logger.info(f"Face Analysis AI {status} by user toggle ('f').")
                    elif key == ord('s') or key == ord('S'):
                        timestamp_str = time.strftime("%Y%m%d_%H%M%S")
                        filename = f"{self.camera_code}_{timestamp_str}_faces_{len(faces)}.jpg"
                        filepath = os.path.join(self.snapshot_dir, filename)
                        cv2.imwrite(filepath, rendered)
                        logger.info(f"Snapshot saved: {filepath}")

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
                elif key == ord('f') or key == ord('F'):
                    self.face_analysis_active = not self.face_analysis_active

            # Exponential backoff update
            self.backoff_sec = min(self.backoff_sec * config.BACKOFF_FACTOR, config.MAX_RECONNECT_SEC)

        cv2.destroyAllWindows()
        logger.info("Camera service shutdown complete.")
