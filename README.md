# Sentinel CCTV — Professional Live Camera & Real-Time Face AI Platform

A robust, production-grade Python solution for live CCTV camera streaming (`cam01`–`cam30`), real-time face detection, and deep learning **Target Photo Face Recognition & Matching** using OpenCV (YuNet ONNX Detector & SFace 128-d Feature Embedding Recognizer).

---

## 🌟 Key Features

- **YuNet Deep Learning Detection Engine**: Utilizes OpenCV YuNet ONNX neural model with multi-scale upscaling passes and aspect ratio filtering for accurate face detection across CCTV feeds and local test videos.
- **SFace Deep Learning Face Recognition (128-d Embeddings)**: Computes 128-dimensional feature vectors to match live faces against target reference photos (`--target`) using cosine similarity scoring (75%–99% match accuracy).
- **"TARGET FACE NOT FOUND" Visual Alerts**: Automatically displays clear HUD status badges and on-screen alert banners (`[!] TARGET FACE NOT FOUND`) when a target face is absent from the feed, labeling non-matching faces as `NO MATCH`.
- **Match-Only Display Mode (`-m` / `--match-only`)**: Option to hide all non-matching individuals/strangers and track **ONLY** the target matched person on screen.
- **Offline Video Testing (`-v` / `--video`)**: Run face detection and recognition on local `.mp4`, `.avi`, `.mov` test videos with native FPS synchronization and automatic file detection in `backend/video/`.
- **Facial Landmark Estimation**: Detects and highlights 5 key facial landmarks (right eye, left eye, nose, right mouth, left mouth).
- **Persistent Centroid Tracking**: Assigns stable, persistent face IDs (`FACE #01`, `FACE #02`) and tracks individuals across frames.
- **RTSP/TCP Transport & HLS Fallback**: Forces `rtsp_transport;tcp` via OpenCV FFmpeg options to eliminate packet loss, with automatic CDN HLS fallback (`.m3u8`).
- **Sci-Fi Head-Up Display (HUD)**: Displays presentation timestamps (PTS), status indicators (LIVE / RECONNECTING), target match counters, and tech UI reticles.
- **Instant Snapshot Saver**: Save high-resolution timestamped frame snapshots with bounding box and match badges directly to `backend/snapshots/`.
- **Automatic Fallbacks**: Includes Haar Cascade detector fallback for 100% offline detection availability.

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
│   │   ├── face_analyzer.py     # YuNet Detector, SFace Recognizer & Centroid Tracker
│   │   ├── hud_renderer.py      # Sci-fi HUD overlay & target match graphics
│   │   └── stream_reader.py     # OpenCV VideoCapture manager for RTSP/HLS/Video
│   ├── services/
│   │   └── camera_service.py    # Main camera playback loop & snapshot controller
│   ├── models/                  # Downloaded ONNX neural model files (YuNet, SFace)
│   ├── targets/                 # Target reference photos for face matching
│   ├── image/                   # Additional reference images (e.g. kig.png)
│   ├── video/                   # Local video files for testing
│   ├── snapshots/               # Saved snapshot outputs
│   └── utils/
│       └── logger.py            # Formatted log outputs
├── .gitignore                   # Ignores models, virtualenvs, snapshots, and temp files
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start

### 1. Installation

Ensure Python 3.10+ is installed on your system.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 2. Live Camera Stream & Face AI

```bash
# Run default camera (cam17) with Face AI enabled
python main.py

# Stream a specific camera code (e.g., cam04, cam15, cam30)
python main.py --camera cam04

# Run with custom RTSP URL
python main.py --rtsp-url "rtsp://user:pass@host:port/stream/cam01"
```

---

## 🎯 Target Photo Face Matching

Place any target reference photo(s) in `backend/targets/` or `backend/image/` (e.g., `kig.png`, `john.jpg`).

```bash
# 1. Run Target Photo Matching on live camera stream
python main.py --target "image/kig.png"

# 2. Run Target Photo Matching on a local test video
python main.py --video --target "image/kig.png"

# 3. Run in Match-Only Mode (hides non-matching faces, tracks ONLY the target)
python main.py --video --target "image/kig.png" --match-only
```

---

## 🎥 Local Video File Testing

```bash
# Auto-detect and play test video from backend/video/ folder
python main.py --video

# Specify a custom video file path
python main.py --video "video/WhatsApp Video 2026-01-31 at 9.24.24 PM.mp4"
```

---

## 🎮 Live GUI Keyboard Controls

While the video window is focused:

| Key | Action |
|---|---|
| **`m`** | Toggle **Match-Only Mode** (Only target face tracked vs All faces tracked) |
| **`t`** | Toggle **Target Photo Matching** ON / OFF |
| **`f`** | Toggle **Deep Face AI Overlay** ON / OFF |
| **`s`** | Save timestamped frame snapshot to `backend/snapshots/` |
| **`q`** / **`ESC`** | Cleanly exit viewer window |

---

## 🛠️ Tech Stack & Dependencies

- **OpenCV (`opencv-python`)**: Video stream ingestion, YuNet ONNX detection, SFace ONNX face recognition, graphics HUD rendering.
- **NumPy**: Matrix operations for centroid tracking and cosine distance vector computation.
- **python-dotenv**: Environment configuration loading.
- **httpx**: HTTP operations & API utilities.
