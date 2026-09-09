import os
import sys

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import time
import copy
import cv2

import config
from core.stream_reader import StreamReader
from core.hud_renderer import HUDRenderer
from core.face_analyzer import FaceAnalyzer
from core.enhancement_pipeline import EnhancementPipeline
from utils.logger import setup_logger

logger = setup_logger("CameraService")

class CameraService:
    """Manages camera playback lifecycle, face detection analytics, and GUI rendering."""

    def __init__(self, camera_code: str = None, rtsp_url: str = None, video_path: str = None, target_path: str = None, match_only: bool = False, analyze_faces: bool = True, multi_face: bool = True, enhancement_enabled: bool = None, enhancement_profile: str = None, enhancement_strength: float = None):
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
        self.target_zoom_enabled = False
        self.target_zoom_factor = config.TARGET_ZOOM_DEFAULT
        self.enhancement = EnhancementPipeline(profile=enhancement_profile, enabled=enhancement_enabled)
        if enhancement_strength is not None:
            self.enhancement.set_strength(enhancement_strength)
        self.display_fps = 0.0
        self.processed_frames = 0
        self.dropped_frames = 0
        
        # Initialize Face Analyzer module & Load Reference Target Photos
        logger.info("Initializing Real-Time Face Detection & Deep Recognition Engine...")
        self.face_analyzer = FaceAnalyzer(multi_face_mode=multi_face)
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
        logger.info("Controls: 'u' multi-face mode, 'm' match-only mode, 't' target matching, 'z' zoom, 'e' enhancement, 's' snapshot, 'q'/ESC exit.")

        window_created = False

        while self.is_running:
            connected = self.reader.connect()

            if connected:
                self.backoff_sec = config.MIN_RECONNECT_SEC
                
                # Dynamic frame timing delay for 60 FPS playback vs live streams
                if self.video_path and self.reader.cap is not None:
                    target_fps = float(os.getenv("TARGET_FPS", "60.0"))
                    target_frame_ms = 1000.0 / target_fps
                else:
                    target_frame_ms = 1.0

                while self.is_running:
                    loop_started = time.perf_counter()
                    success, frame, pts_ms = self.reader.read_frame()

                    if not success:
                        logger.warning(f"Frame drop detected on camera [{label}]. Reconnecting...")
                        break

                    if not window_created and frame is not None:
                        h_native, w_native = frame.shape[:2]
                        cv2.namedWindow(self.window_name, cv2.WINDOW_NORMAL)
                        aspect = w_native / float(max(1, h_native))
                        win_w = 1280
                        win_h = int(win_w / aspect) if aspect > 0 else 720
                        if win_h > 720:
                            win_h = 720
                            win_w = int(win_h * aspect)
                        cv2.resizeWindow(self.window_name, max(320, win_w), max(240, win_h))
                        window_created = True

                    if pts_ms <= 0:
                        pts_ms = (time.time() - self.start_time) * 1000

                    original_frame = frame
                    enhanced_frame, enhancement_metrics = self.enhancement.process(frame)
                    analysis_frame = enhanced_frame if config.FACE_ANALYSIS_ON_ENHANCED else original_frame

                    # Analyze faces on the configured source while displaying enhanced footage.
                    faces = []
                    if self.face_analysis_active:
                        try:
                            faces = self.face_analyzer.analyze_frame(analysis_frame)
                        except Exception as e:
                            logger.error(f"Error during face analysis: {e}")

                    if self.target_zoom_enabled:
                        enhanced_frame, faces = self._zoom_to_targets(enhanced_frame, faces)

                    self.processed_frames += 1
                    elapsed = time.perf_counter() - loop_started
                    if elapsed > 0:
                        instant_fps = 1.0 / elapsed
                        self.display_fps = instant_fps if self.display_fps == 0 else (self.display_fps * 0.9) + (instant_fps * 0.1)

                    # Draw HUD & Render on Screen
                    target_loaded = len(self.face_analyzer.target_features) > 0 and self.face_analyzer.target_matching_enabled
                    target_name = self.face_analyzer.target_features[0]["name"] if self.face_analyzer.target_features else ""

                    rendered = HUDRenderer.draw_hud(
                        enhanced_frame,
                        self.camera_code if not self.video_path else "FILE",
                        pts_ms,
                        is_live=True,
                        faces=faces,
                        face_analysis_active=self.face_analysis_active,
                        target_loaded=target_loaded,
                        target_name=target_name,
                        enhancement_metrics=enhancement_metrics,
                        display_fps=self.display_fps,
                        target_zoom=self.target_zoom_factor if self.target_zoom_enabled else 1.0
                    )
                    cv2.imshow(self.window_name, rendered)

                    # Handle key presses with dynamic frame rate pacing for local video
                    if self.video_path:
                        elapsed_ms = (time.perf_counter() - loop_started) * 1000.0
                        wait_delay = max(1, int(target_frame_ms - elapsed_ms))
                    else:
                        wait_delay = 1

                    key = cv2.waitKey(wait_delay) & 0xFF
                    if key == ord('q') or key == 27:
                        logger.info("User requested exit.")
                        self.is_running = False
                        break
                    elif key == ord('m') or key == ord('M'):
                        self.face_analyzer.match_only_mode = not self.face_analyzer.match_only_mode
                        status = "MATCH-ONLY (Tracking Only Target Match)" if self.face_analyzer.match_only_mode else "ALL FACES (Tracking Every Face)"
                        logger.info(f"Mode switched to: {status}")
                    elif key == ord('z') or key == ord('Z'):
                        self.target_zoom_enabled = not self.target_zoom_enabled
                        status = "ACTIVATED" if self.target_zoom_enabled else "DEACTIVATED"
                        logger.info(f"Target Zoom {status} by user toggle ('z').")
                    elif key in (ord('+'), ord('=')):
                        self.target_zoom_factor = min(self.target_zoom_factor + 0.5, 5.0)
                        logger.info(f"Target Zoom level: {self.target_zoom_factor:.1f}x")
                    elif key in (ord('-'), ord('_')):
                        self.target_zoom_factor = max(self.target_zoom_factor - 0.5, 1.0)
                        logger.info(f"Target Zoom level: {self.target_zoom_factor:.1f}x")
                    elif key == ord('e') or key == ord('E'):
                        status = self.enhancement.toggle("enhancement")
                        logger.info("Full-frame enhancement %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord('d') or key == ord('D'):
                        status = self.enhancement.toggle("denoise")
                        logger.info("Denoising %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord('l') or key == ord('L'):
                        status = self.enhancement.toggle("low_light")
                        logger.info("Low-light enhancement %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord('r') or key == ord('R'):
                        status = self.enhancement.toggle("super_resolution")
                        logger.info("Super-resolution %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord('k') or key == ord('K'):
                        status = self.enhancement.toggle("sharpen")
                        logger.info("Sharpening %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord('c') or key == ord('C'):
                        status = self.enhancement.toggle("color")
                        logger.info("Color correction %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord('y') or key == ord('Y'):
                        status = self.enhancement.toggle("temporal")
                        logger.info("Temporal stability %s.", "ACTIVATED" if status else "DEACTIVATED")
                    elif key == ord(']'):
                        self.enhancement.set_strength(self.enhancement.strength + 0.05)
                        logger.info("Enhancement strength: %.2f", self.enhancement.strength)
                    elif key == ord('['):
                        self.enhancement.set_strength(self.enhancement.strength - 0.05)
                        logger.info("Enhancement strength: %.2f", self.enhancement.strength)
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

    def _zoom_to_targets(self, frame, faces):
        """Zoom the frame around all currently matched target faces."""
        target_faces = [face for face in faces if face.get("is_match")]
        if not target_faces or self.target_zoom_factor <= 1.0:
            return frame, faces

        frame_height, frame_width = frame.shape[:2]
        boxes = [face["bbox"] for face in target_faces]
        left = min(box[0] for box in boxes)
        top = min(box[1] for box in boxes)
        right = max(box[0] + box[2] for box in boxes)
        bottom = max(box[1] + box[3] for box in boxes)
        target_width = max(right - left, 1)
        target_height = max(bottom - top, 1)
        aspect_ratio = frame_width / frame_height

        crop_height = max(int(target_height * self.target_zoom_factor), 1)
        crop_width = max(int(target_width * self.target_zoom_factor), 1)
        if crop_width / crop_height < aspect_ratio:
            crop_width = int(crop_height * aspect_ratio)
        else:
            crop_height = int(crop_width / aspect_ratio)
        crop_width = min(crop_width, frame_width)
        crop_height = min(crop_height, frame_height)

        center_x = (left + right) // 2
        center_y = (top + bottom) // 2
        crop_left = max(0, min(center_x - crop_width // 2, frame_width - crop_width))
        crop_top = max(0, min(center_y - crop_height // 2, frame_height - crop_height))
        crop = frame[crop_top:crop_top + crop_height, crop_left:crop_left + crop_width]
        zoomed_frame = cv2.resize(crop, (frame_width, frame_height), interpolation=cv2.INTER_LINEAR)

        scale_x = frame_width / crop_width
        scale_y = frame_height / crop_height
        transformed_faces = copy.deepcopy(faces)
        for face in transformed_faces:
            x, y, width, height = face["bbox"]
            face["bbox"] = (
                int((x - crop_left) * scale_x),
                int((y - crop_top) * scale_y),
                int(width * scale_x),
                int(height * scale_y)
            )
            cx, cy = face["centroid"]
            face["centroid"] = (int((cx - crop_left) * scale_x), int((cy - crop_top) * scale_y))
            landmarks = face.get("landmarks")
            if landmarks:
                face["landmarks"] = {
                    name: (int((point[0] - crop_left) * scale_x), int((point[1] - crop_top) * scale_y))
                    for name, point in landmarks.items()
                }

        return zoomed_frame, transformed_faces
