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

def main():
    parser = argparse.ArgumentParser(
        description="Sentinel CCTV — Professional Live Camera Footage & Face AI Platform"
    )
    parser.add_argument(
        "--camera",
        type=str,
        default="cam08",
        help="Camera code to stream (e.g. cam01, cam04, cam15, cam30). Default: cam03"
    )
    parser.add_argument(
        "--rtsp-url",
        type=str,
        default=None,
        help="Custom RTSP URL override"
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
    args = parser.parse_args()

    print("=" * 70)
    print("      SENTINEL CCTV PLATFORM — LIVE FOOTAGE & FACE AI MONITOR       ")
    print("=" * 70)
    print(f" Camera Code:    {args.camera.upper()}")
    print(" Transport:      RTSP over TCP (OpenCV FFmpeg Low-Delay)")
    print(" Face AI:        " + ("ENABLED (Har Cascade + Centroid Tracking)" if args.analyze_faces else "DISABLED"))
    print(" Controls:")
    print("   - Press 'f' to toggle Face AI overlay on/off")
    print("   - Press 's' to save snapshot image to backend/snapshots/")
    print("   - Press 'q' or ESC in video window to exit")
    print("=" * 70)

    try:
        service = CameraService(
            camera_code=args.camera,
            rtsp_url=args.rtsp_url,
            analyze_faces=args.analyze_faces
        )
        service.run()
    except KeyboardInterrupt:
        logger.info("Shutdown signal received (Ctrl+C). Exiting...")
        sys.exit(0)

if __name__ == "__main__":
    main()
