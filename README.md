# Sentinel CCTV — Professional Camera & Face AI Monitor

A clean, professional, and robust Python solution for accessing, analyzing, and displaying live CCTV camera feeds (`cam01`–`cam30`) directly on screen using OpenCV and Real-Time Face Detection AI.

## Features
- **Real-Time Face Detection & Tracking**: Detects human faces in live CCTV footage with OpenCV Haar Cascade / Profile Cascade engines.
- **Persistent Centroid Tracking**: Assigns persistent IDs (`FACE #01`, `FACE #02`) and tracks individuals across frames.
- **Facial Analytics HUD**: Displays sci-fi target reticles, face confidence percentage, proximity metrics (`CLOSE`, `MID`, `FAR`), and real-time face counts.
- **TCP Transport Forcing**: Forces `rtsp_transport;tcp` via FFmpeg to prevent packet loss over UDP.
- **Monotonic PTS Timing**: Displays exact Presentation Timestamps on the live HUD overlay.
- **Snapshot Generator**: Press `s` to instantly save a timestamped frame snapshot with bounding box overlays to `backend/snapshots/`.
- **Resilient Reconnection**: Built-in exponential backoff if stream drops or network reconnects.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Live Camera Footage & Face AI
```bash
# Stream default camera (cam03) with Face AI enabled
python main.py

# Stream a specific camera (e.g. cam04 or cam15)
python main.py --camera cam04

# Disable face detection overlay
python main.py --camera cam04 --no-faces
```

### Controls in Video Window
- **`f`**: Toggle Face Detection AI overlay ON / OFF
- **`s`**: Take and save a snapshot of the current frame with detected faces
- **`q`** or **`ESC`**: Cleanly close the viewer
