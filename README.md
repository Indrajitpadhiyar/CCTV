# Sentinel CCTV — Professional Live Camera & Real-Time Face AI Monitor

A robust, production-grade Python solution for streaming, analyzing, and monitoring live CCTV feeds (`cam01`–`cam30`) in real time using OpenCV and Deep Learning Face Detection AI (YuNet ONNX Engine).

---

## 🌟 Key Features

- **YuNet Deep Learning AI Engine**: Utilizes OpenCV YuNet ONNX neural model with a 1.5x upscaling pass and aspect ratio filtering tailored for small faces in outdoor CCTV streams.
- **Facial Landmark Estimation**: Detects and highlights 5 key facial landmarks (right eye, left eye, nose, right mouth, left mouth).
- **Persistent Centroid Tracking**: Assigns stable, persistent IDs (`FACE #01`, `FACE #02`) and tracks individuals across frames even with temporary occlusions.
- **Proximity & Confidence Metrics**: Automatically calculates real-time confidence scores (72%–98%) and distance proximity (`CLOSE`, `MID`, `FAR`).
- **RTSP/TCP Transport & HLS Fallback**: Forces `rtsp_transport;tcp` via OpenCV FFmpeg options to prevent UDP packet loss, with automatic failover to CDN HLS stream (`.m3u8`).
- **Sci-Fi Head-Up Display (HUD)**: Displays real-time Presentation Timestamps (PTS in ms), camera status indicator (LIVE / RECONNECTING), face count, and targeting reticles.
- **Instant Snapshot Saver**: Save high-resolution timestamped frame snapshots with bounding box and landmark overlays directly to `backend/snapshots/`.
- **Resilient Exponential Backoff**: Displays a clean reconnecting screen with live retry timers if the network drops.

---

## 🏗️ Project Architecture

```text
.
├── backend/
│   ├── main.py                  # Primary CLI application entry point
│   ├── stream_viewer.py         # Lightweight single-camera stream viewer
│   ├── config.py                # Environment configuration & RTSP URL generator
│   ├── requirements.txt         # Python dependency requirements
│   ├── core/
│   │   ├── face_analyzer.py     # YuNet ONNX Face AI Detector & Centroid Tracker
│   │   ├── hud_renderer.py      # Sci-fi HUD overlay & facial reticle graphics
│   │   └── stream_reader.py     # OpenCV VideoCapture manager for RTSP/HLS
│   ├── services/
│   │   └── camera_service.py    # Main camera playback loop & snapshot controller
│   └── utils/
│       └── logger.py            # Formatted log outputs
├── .gitignore                   # Ignores .env, pycache, models, and temp files
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites & Installation

Ensure Python 3.10+ is installed on your system.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)

Create a `backend/.env` file if you wish to override defaults:

```env
CAMERA_CODE=cam17
CCTV_STREAM_USER=your_email@domain.com
CCTV_STREAM_PASSWORD=your_password
CCTV_RTSP_HOST=103.250.160.189
CCTV_RTSP_PORT=8554
```

### 3. Run Live Camera Stream & Face AI

```bash
# Run default camera (cam17) with Face AI enabled
python main.py

# Stream a specific camera code (e.g., cam04, cam15, cam30)
python main.py --camera cam04

# Run with custom RTSP URL
python main.py --rtsp-url "rtsp://user:pass@host:port/stream/cam01"

# Run camera stream without Face AI overlay
python main.py --camera cam04 --no-faces
```

---

## 🎮 Live GUI Keyboard Controls

While the video stream window is focused:

| Key | Action |
|---|---|
| **`f`** | Toggle Deep Face AI overlay ON / OFF |
| **`s`** | Save timestamped frame snapshot to `backend/snapshots/` |
| **`q`** or **`ESC`** | Cleanly exit viewer window |

---

## 🛠️ Tech Stack & Dependencies

- **OpenCV (`opencv-python`)**: Video stream ingestion, YuNet ONNX inference, graphics rendering.
- **NumPy**: Matrix math for centroid tracking and Euclidean distance computation.
- **python-dotenv**: Environment variable parsing.
- **httpx**: HTTP requests & stream utility operations.
