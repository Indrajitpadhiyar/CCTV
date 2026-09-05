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
        description="Sentinel CCTV — Professional Live Camera Footage Viewer"
    )
    parser.add_argument(
        "--camera",
        type=str,
        default="cam01",
        help="Camera code to stream (e.g. cam01, cam04, cam15, cam30). Default: cam04"
    )
    parser.add_argument(
        "--rtsp-url",
        type=str,
        default=None,
        help="Custom RTSP URL override"
    )
    args = parser.parse_args()

    print("=" * 65)
    print("        SENTINEL CCTV PLATFORM — LIVE FOOTAGE MONITOR        ")
    print("=" * 65)
    print(f" Camera Code: {args.camera.upper()}")
    print(" Transport:   RTSP over TCP (OpenCV FFmpeg Low-Delay)")
    print(" Playback:    Monotonic PTS Timing HUD Enabled")
    print(" Controls:    Press 'q' or ESC in video window to exit")
    print("=" * 65)

    try:
        service = CameraService(camera_code=args.camera, rtsp_url=args.rtsp_url)
        service.run()
    except KeyboardInterrupt:
        logger.info("Shutdown signal received (Ctrl+C). Exiting...")
        sys.exit(0)

if __name__ == "__main__":
    main()
