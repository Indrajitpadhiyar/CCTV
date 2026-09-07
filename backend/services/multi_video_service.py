import os
import sys
import time
import copy
import threading
import cv2

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import config
from core.stream_reader import StreamReader
from core.hud_renderer import HUDRenderer
from core.face_analyzer import FaceAnalyzer
from core.enhancement_pipeline import EnhancementPipeline
from utils.logger import setup_logger

logger = setup_logger("MultiVideoService")

# Preset Camera Location & Zone Mapping
CAMERA_LOCATIONS = {
    "v1.mp4": "MAIN ENTRANCE — SECTOR 1 (NORTH GATE)",
    "v2.mp4": "CENTRAL LOBBY & HALLWAY — ZONE B",
    "cam01": "MAIN ENTRANCE — SECTOR 1",
    "cam04": "EAST PERIMETER — FENCE LINE 4",
    "cam17": "PARKING LOT & EXIT GATE — SECTOR 4",
    "cam30": "SERVER ROOM — HIGH SECURITY ZONE"
}

def get_camera_location(name: str) -> str:
    key = name.lower()
    if key in CAMERA_LOCATIONS:
        return CAMERA_LOCATIONS[key]
    stem = os.path.splitext(name)[0].upper()
    return f"SECURITY CAMERA FEED — ZONE [{stem}]"


class VideoWorker(threading.Thread):
    """Processes an individual video stream in a dedicated thread with fast-forward pre-scan."""

    def __init__(self, video_path: str, target_path: str):
        super().__init__(daemon=True)
        self.video_path = video_path
        self.video_name = os.path.basename(video_path)
        self.location_name = get_camera_location(self.video_name)
        self.target_path = target_path
        self.window_name = f"ALERT — Target Spotted [{self.video_name} - {self.location_name}]"
        
        self.reader = StreamReader(camera_code=self.video_name, video_path=self.video_path)
        self.face_analyzer = FaceAnalyzer()
        self.face_analyzer.load_target_photos(self.target_path)
        self.enhancement = EnhancementPipeline()

        self.is_running = True
        self.has_match = False
        self.matched_faces = []
        self.window_opened = False
        self.latest_rendered = None
        self.match_count = 0
        self.display_fps = 0.0

    def run(self):
        logger.info(f"Worker thread started for video: {self.video_name} (Location: {self.location_name})")
        connected = self.reader.connect()
        if not connected:
            logger.error(f"Failed to load video: {self.video_name}")
            return

        fps = self.reader.cap.get(cv2.CAP_PROP_FPS) if self.reader.cap else 30.0
        target_frame_ms = (1000.0 / fps) if fps and fps > 0 else 33.3

        start_time = time.time()

        while self.is_running:
            loop_started = time.perf_counter()
            success, frame, pts_ms = self.reader.read_frame()

            if not success:
                logger.info(f"End of stream reached for video: {self.video_name}")
                break

            if pts_ms <= 0:
                pts_ms = (time.time() - start_time) * 1000.0

            # Enhance frame
            enhanced_frame, metrics = self.enhancement.process(frame)

            # Analyze faces for target photo match
            faces = []
            try:
                faces = self.face_analyzer.analyze_frame(enhanced_frame)
            except Exception as exc:
                logger.error(f"Error analyzing faces in {self.video_name}: {exc}")

            # Check if target person was matched
            target_matches = [f for f in faces if f.get("is_match")]
            self.has_match = len(target_matches) > 0
            self.matched_faces = target_matches

            if self.has_match:
                self.match_count += 1

            # Update instant FPS
            elapsed = time.perf_counter() - loop_started
            if elapsed > 0:
                instant_fps = 1.0 / elapsed
                self.display_fps = instant_fps if self.display_fps == 0 else (self.display_fps * 0.9) + (instant_fps * 0.1)

            # Render HUD frame
            target_loaded = len(self.face_analyzer.target_features) > 0
            target_name = self.face_analyzer.target_features[0]["name"] if self.face_analyzer.target_features else ""

            rendered = HUDRenderer.draw_hud(
                enhanced_frame,
                f"{self.video_name} | {self.location_name}",
                pts_ms,
                is_live=True,
                faces=faces,
                face_analysis_active=True,
                target_loaded=target_loaded,
                target_name=target_name,
                enhancement_metrics=metrics,
                display_fps=self.display_fps
            )

            # Draw visual alert banner with Camera & Location details if target is detected
            if self.has_match:
                match_name = target_matches[0].get("match_name", "TARGET")
                match_pct = target_matches[0].get("match_score", 95)

                # Multi-line banner overlay
                h, w = rendered.shape[:2]
                cv2.rectangle(rendered, (0, 0), (w, 65), (10, 10, 200), -1)
                cv2.rectangle(rendered, (0, 0), (w, 65), (0, 255, 255), 2)

                banner_line1 = f"★ TARGET DETECTED: {match_name} ({match_pct}% MATCH)"
                banner_line2 = f"CAMERA: {self.video_name}  |  LOCATION: {self.location_name}"

                cv2.putText(rendered, banner_line1, (20, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(rendered, banner_line2, (20, 52), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 1, cv2.LINE_AA)

            self.latest_rendered = rendered

            # BLAZING SPEED PRE-SCAN PACING:
            # If target is detected or window is open, pace at normal playback speed for user view.
            # If target not yet found, scan at MAX CPU speed to locate target INSTANTLY (< 1 sec)!
            if self.has_match or self.window_opened:
                elapsed_ms = (time.perf_counter() - loop_started) * 1000.0
                sleep_sec = max(0.001, (target_frame_ms - elapsed_ms) / 1000.0)
                time.sleep(sleep_sec)
            else:
                time.sleep(0.0001)

        self.reader.release()
        if self.window_opened:
            try:
                cv2.destroyWindow(self.window_name)
            except Exception:
                pass
        logger.info(f"Worker finished for video: {self.video_name}")

    def stop(self):
        self.is_running = False


class MultiVideoService:
    """
    Simultaneously scans and analyzes all video files in parallel.
    Pops up video windows INSTANTLY with Camera & Location metadata when target match is detected.
    """

    def __init__(self, target_path: str = None, video_dir: str = None):
        self.target_path = target_path or os.path.join(BACKEND_DIR, "targets")
        self.video_dir = video_dir or os.path.join(BACKEND_DIR, "video")
        self.workers = []
        self.is_running = False

    def discover_video_files(self):
        """Scans video directory for all playable video formats."""
        if not os.path.exists(self.video_dir):
            logger.error(f"Video directory does not exist: {self.video_dir}")
            return []

        valid_exts = (".mp4", ".avi", ".mkv", ".mov", ".webm")
        files = []
        for fname in os.listdir(self.video_dir):
            if fname.lower().endswith(valid_exts):
                files.append(os.path.join(self.video_dir, fname))
        return sorted(files)

    def run(self):
        video_files = self.discover_video_files()
        if not video_files:
            logger.error(f"No video files found in {self.video_dir} for multi-video analysis.")
            return

        logger.info(f"Initializing Fast Multi-Video Parallel Analysis for {len(video_files)} video file(s):")
        for vf in video_files:
            name = os.path.basename(vf)
            loc = get_camera_location(name)
            logger.info(f"  - Feed '{name}': Location [{loc}]")

        # Create worker threads for each video file
        for vf in video_files:
            worker = VideoWorker(vf, self.target_path)
            self.workers.append(worker)

        self.is_running = True

        # Start all workers concurrently
        for worker in self.workers:
            worker.start()

        logger.info("======================================================================")
        logger.info(" BLAZING FAST MULTI-VIDEO TARGET SEARCH ACTIVE ")
        logger.info(" Footage window will POP UP INSTANTLY with Camera & Location info!")
        logger.info(" Press 'q' or ESC in any active window to exit.")
        logger.info("======================================================================")

        try:
            while self.is_running:
                active_workers = [w for w in self.workers if w.is_alive()]
                if not active_workers:
                    logger.info("All video analysis threads completed.")
                    break

                for worker in self.workers:
                    if worker.latest_rendered is not None:
                        # INSTANT POPUP LOGIC: Open & top-focus window when target match is detected
                        if worker.has_match:
                            if not worker.window_opened:
                                logger.info(
                                    f"★ ALERT! TARGET PERSON SPOTTED IN CAMERA [{worker.video_name}] | "
                                    f"LOCATION: [{worker.location_name}]! POPPING UP WINDOW INSTANTLY!"
                                )
                                cv2.namedWindow(worker.window_name, cv2.WINDOW_NORMAL)
                                h_nat, w_nat = worker.latest_rendered.shape[:2]
                                aspect = w_nat / float(max(1, h_nat))
                                win_w = 1280
                                win_h = int(win_w / aspect) if aspect > 0 else 720
                                if win_h > 720:
                                    win_h = 720
                                    win_w = int(win_h * aspect)
                                cv2.resizeWindow(worker.window_name, max(320, win_w), max(240, win_h))
                                cv2.setWindowProperty(worker.window_name, cv2.WND_PROP_TOPMOST, 1)
                                worker.window_opened = True

                            cv2.imshow(worker.window_name, worker.latest_rendered)
                        elif worker.window_opened:
                            cv2.imshow(worker.window_name, worker.latest_rendered)

                key = cv2.waitKey(10) & 0xFF
                if key == ord('q') or key == 27:
                    logger.info("User requested exit from Multi-Video Analyzer.")
                    self.stop()
                    break

        except KeyboardInterrupt:
            logger.info("Multi-Video Analyzer interrupted by user.")
            self.stop()

        cv2.destroyAllWindows()
        logger.info("Multi-Video Analyzer shutdown complete.")

    def stop(self):
        self.is_running = False
        for worker in self.workers:
            worker.stop()
