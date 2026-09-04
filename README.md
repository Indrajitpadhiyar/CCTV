# Sentinel CCTV — Professional Single Camera Viewer

A clean, professional, and robust Python solution for accessing and displaying live CCTV camera feeds (`cam01`–`cam30`) directly on screen using OpenCV.

## Features
- **TCP Transport Forcing**: Forces `rtsp_transport;tcp` via FFmpeg to prevent packet loss over UDP.
- **Monotonic PTS Timing**: Displays exact Presentation Timestamps (`cap.get(cv2.CAP_PROP_POS_MSEC)`) on the live HUD overlay.
- **Resilient Reconnection**: Built-in exponential backoff (2s to 30s) if stream drops or network reconnects.
- **HLS Stream Fallback**: Automatic fallback to HLS (`https://cctv.corp8.cloud/camXX/index.m3u8`) if direct RTSP is unreachable.
- **Clean Project Layout**: Zero complex dependencies or unnecessary bloated backend code.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Single Camera Viewer
```bash
# Stream default camera (cam01)
python main.py

# Stream a specific camera (e.g. cam05 or cam12)
python main.py --camera cam05
```

### Controls
- Press **`q`** or **`ESC`** in the video window to cleanly close the viewer.
