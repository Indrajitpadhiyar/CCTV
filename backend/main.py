import os
import sys

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import argparse
from services.camera_service import CameraService
from utils.logger import setup_logger

logger = setup_logger("Main")

def find_test_video(requested_path: str = None) -> str:
    if requested_path and requested_path.lower() != "auto":
        candidates = [
            requested_path,
            os.path.abspath(requested_path),
            os.path.join(BACKEND_DIR, requested_path),
            os.path.join(BACKEND_DIR, "video", requested_path),
            os.path.join(BACKEND_DIR, "video", os.path.basename(requested_path))
        ]
        for cand in candidates:
            if cand and os.path.exists(cand) and not os.path.isdir(cand):
                return os.path.abspath(cand)
        logger.error(f"Specified video file not found: {requested_path}")
        return None

    # Search in backend/video/ directory
    video_dir = os.path.join(BACKEND_DIR, "video")
    if os.path.exists(video_dir):
        valid_exts = (".mp4", ".avi", ".mkv", ".mov", ".webm")
        for fname in os.listdir(video_dir):
            if fname.lower().endswith(valid_exts):
                return os.path.join(video_dir, fname)
    return None

def main():
    parser = argparse.ArgumentParser(
        description="Sentinel CCTV — Professional Live Camera Footage & Face AI Platform"
    )
    parser.add_argument(
        "--camera",
        type=str,
        default="cam17",
        help="Camera code to stream (e.g. cam01, cam04, cam15, cam30). Default: cam17"
    )
    parser.add_argument(
        "--rtsp-url",
        type=str,
        default=None,
        help="Custom RTSP URL override"
    )
    parser.add_argument(
        "-a", "--all-videos",
        action="store_true",
        default=False,
        help="Analyze all local video files in backend/video/ simultaneously and pop up footage when target is spotted"
    )
    parser.add_argument(
        "-v", "--video",
        type=str,
        nargs="?",
        const="auto",
        default=None,
        help="Path to local video file for offline face detection testing. Use '--video all' or '-a' to analyze all videos in parallel"
    )
    parser.add_argument(
        "-t", "--target",
        type=str,
        nargs="?",
        const="auto",
        default="auto",
        help="Path to target reference photo or folder for real-time face matching. Default: auto-detects in backend/targets/"
    )
    parser.add_argument(
        "-m", "--match-only",
        action="store_true",
        default=False,
        help="Only track and draw bounding boxes for faces matching target photo (hides non-matching faces)"
    )
    parser.add_argument(
        "--analyze-faces",
        dest="analyze_faces",
        action="store_true",
        default=True,
        help="Enable real-time face detection and persistent centroid tracking HUD (default: enabled)"
    )
    parser.add_argument(
        "--no-faces",
        dest="analyze_faces",
        action="store_false",
        help="Disable face detection analytics overlay"
    )
    parser.add_argument(
        "--no-enhancement",
        dest="enhancement_enabled",
        action="store_false",
        default=None,
        help="Disable full-frame enhancement while preserving the original processing path"
    )
    parser.add_argument(
        "--profile",
        choices=("performance", "balanced", "quality"),
        default=None,
        help="Enhancement profile; default comes from config or BALANCED"
    )
    parser.add_argument(
        "--enhancement-strength",
        type=float,
        default=None,
        help="Enhancement strength from 0.0 to 1.0"
    )
    args = parser.parse_args()

    target_photo_path = args.target if args.target != "auto" else os.path.join(BACKEND_DIR, "targets")

    if args.all_videos or (args.video and args.video.lower() in ("all", "*")):
        from services.multi_video_service import MultiVideoService
        multi_service = MultiVideoService(target_path=target_photo_path)
        multi_service.run()
        return

    video_file_path = None
    if args.video is not None:
        video_file_path = find_test_video(args.video)
        if not video_file_path:
            logger.error("No valid video file found for testing. Exiting...")
            sys.exit(1)

    print("=" * 70)
    print("      SENTINEL CCTV PLATFORM — LIVE FOOTAGE & FACE AI MONITOR       ")
    print("=" * 70)
    if video_file_path:
        print(f" Input Source:   LOCAL VIDEO FILE ({os.path.basename(video_file_path)})")
    else:
        print(f" Camera Code:    {args.camera.upper()}")
        print(" Transport:      RTSP over TCP (OpenCV FFmpeg Low-Delay)")
    print(" Face AI:        " + ("ENABLED (YuNet Deep Learning + Centroid Tracking)" if args.analyze_faces else "DISABLED"))
    print(" Target Match:   ENABLED (SFace 128-d Deep Feature Vector Matching)")
    print(" Display Mode:   " + ("MATCH-ONLY (Only target faces tracked)" if args.match_only else "ALL FACES (Highlight matches)"))
    print(" Controls:")
    print("   - Press 'm' to toggle Match-Only Mode on/off")
    print("   - Press 't' to toggle Target Photo Matching on/off")
    print("   - Press 'z' to zoom matched target people; use '+'/'-' to adjust zoom")
    print("   - Press 'e' enhancement, 'd' denoise, 'l' low-light, 'r' SR, 'k' sharpen")
    print("   - Press 'c' color, 'y' temporal, '['/']' enhancement strength")
    print("   - Press 'f' to toggle Face AI overlay on/off")
    print("   - Press 's' to save snapshot image to backend/snapshots/")
    print("   - Press 'q' or ESC in video window to exit")
    print("=" * 70)

    try:
        service = CameraService(
            camera_code=args.camera,
            rtsp_url=args.rtsp_url,
            video_path=video_file_path,
            target_path=target_photo_path,
            match_only=args.match_only,
            analyze_faces=args.analyze_faces,
            enhancement_enabled=args.enhancement_enabled,
            enhancement_profile=args.profile,
            enhancement_strength=args.enhancement_strength
        )
        service.run()
    except KeyboardInterrupt:
        logger.info("Shutdown signal received (Ctrl+C). Exiting...")
        sys.exit(0)


if __name__ == "__main__":
    main()
