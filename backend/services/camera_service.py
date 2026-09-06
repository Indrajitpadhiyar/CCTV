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

    def __init__(self, camera_code: str = None, rtsp_url: str = None, video_path: str = None, target_path: str = None, match_only: bool = False, analyze_faces: bool = True):
        self.camera_code = (camera_code or config.CAMERA_CODE).lower()
        self.rtsp_url = rtsp_url
        self.video_path = video_path
        self.target_path = target_path
        self.reader = StreamReader(self.camera_code, self.rtsp_url, video_path=self.video_path)
        
        display_label = os.path.basename(video_path) if video_path else self.camera_code.upper()
        self.window_name = f"Sentinel CCTV — Live AI Stream [{display_label}]"
        self.backoff_sec = config.MIN_RECONNECT_SEC
        self.start_time = time.time()
        self.is_running = False
        self.face_analysis_active = analyze_faces
        
        # Initialize Face Analyzer module & Load Reference Target Photos
        logger.info("Initializing Real-Time Face Detection & Deep Recognition Engine...")
        self.face_analyzer = FaceAnalyzer()
        self.face_analyzer.load_target_photos(self.target_path)
        self.face_analyzer.match_only_mode = match_only

        # Ensure snapshot directory exists
        self.snapshot_dir = os.path.join(BACKEND_DIR, "snapshots")
        os.makedirs(self.snapshot_dir, exist_ok=True)

    def run(self):
        """Runs the main camera display loop with live face detection & target photo matching."""
        self.is_running = True
        label = os.path.basename(self.video_path) if self.video_path else self.camera_code.upper()
        logger.info(f"Launching Live AI Screen for Source '{label}'...")
        logger.info("Controls: Press 'm' (Match-Only Mode), 't' (Target Match), 'f' (Face AI), 's' (Snapshot), 'q'/ESC (exit).")

        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
        cv2.resizeWindow(self.window_name, 1024, 576)

        while self.is_running:
            connected = self.reader.connect()

            if connected:
                self.backoff_sec = config.MIN_RECONNECT_SEC
                
                # Dynamic frame timing delay for local video playback vs live streams
                if self.video_path and self.reader.cap is not None:
                    fps = self.reader.cap.get(cv2.CAP_PROP_FPS)
                    wait_delay = int(1000 / fps) if fps and fps > 0 else 33
                else:
                    wait_delay = 1

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
                    target_loaded = len(self.face_analyzer.target_features) > 0 and self.face_analyzer.target_matching_enabled
                    target_name = self.face_analyzer.target_features[0]["name"] if self.face_analyzer.target_features else ""

                    rendered = HUDRenderer.draw_hud(
                        frame,
                        self.camera_code if not self.video_path else "FILE",
                        pts_ms,
                        is_live=True,
                        faces=faces,
                        face_analysis_active=self.face_analysis_active,
                        target_loaded=target_loaded,
                        target_name=target_name
                    )
                    cv2.imshow(self.window_name, rendered)

                    # Handle key presses with frame rate pacing for local video
                    key = cv2.waitKey(wait_delay) & 0xFF
                    if key == ord('q') or key == 27:
                        logger.info("User requested exit.")
                        self.is_running = False
                        break
                    elif key == ord('m') or key == ord('M'):
                        self.face_analyzer.match_only_mode = not self.face_analyzer.match_only_mode
                        status = "MATCH-ONLY (Tracking Only Target Match)" if self.face_analyzer.match_only_mode else "ALL FACES (Tracking Every Face)"
                        logger.info(f"Mode switched to: {status}")
                    elif key == ord('f') or key == ord('F'):
                        self.face_analysis_active = not self.face_analysis_active
                        status = "ACTIVATED" if self.face_analysis_active else "DEACTIVATED"
                        logger.info(f"Face Analysis AI {status} by user toggle ('f').")
                    elif key == ord('t') or key == ord('T'):
                        self.face_analyzer.target_matching_enabled = not self.face_analyzer.target_matching_enabled
                        status = "ACTIVATED" if self.face_analyzer.target_matching_enabled else "DEACTIVATED"
                        logger.info(f"Target Photo Matching {status} by user toggle ('t').")
                    elif key == ord('s') or key == ord('S'):
                        timestamp_str = time.strftime("%Y%m%d_%H%M%S")
                        matches = [f for f in faces if f.get("is_match")]
                        match_tag = f"_match_{matches[0]['match_name']}" if matches else ""
                        filename = f"{self.camera_code}_{timestamp_str}{match_tag}_faces_{len(faces)}.jpg"
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
