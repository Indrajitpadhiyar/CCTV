# Sentinel CCTV — Professional Live Camera & Real-Time Face AI Platform

A robust, production-grade Python solution for live CCTV camera streaming (`cam01`–`cam30`), real-time face detection, and deep learning **Target Photo Face Recognition & Matching** using OpenCV (YuNet ONNX Detector & SFace 128-d Feature Embedding Recognizer).

---

## 🌟 Key Features

- **Silky Smooth 60 FPS Video Processing Engine**: Optimized 60 FPS loop pacing and multi-threading for real-time live CCTV streams and video playback.
- **Enhanced-First Face AI Pipeline**: Frame enhancement (low-light correction, fast denoising, sharpening, color stabilization) runs **FIRST** before face detection & SFace feature extraction for ultra-high detection precision on low-light or low-contrast footage.
- **Multi-Scale High-Precision YuNet Face Detector**: High-recall YuNet ONNX neural detection model with dynamic multi-scale passes and aspect ratio filtering.
- **SFace Deep Learning Face Recognition (128-d Embeddings)**: Computes 128-dimensional feature vectors to match live faces against target reference photos (`--target`) using cosine similarity scoring (75%–99% match accuracy).
- **Fast Parallel Multi-Video Search (`--video all`)**: Concurrently pre-scans all local video files and pops up active alert windows instantly when a target person is spotted.
- **Match-Only Display Mode (`-m` / `--match-only`)**: Option to hide all non-matching individuals/strangers and track **ONLY** the target matched person on screen.
- **Facial Landmark Estimation**: Detects and highlights 5 key facial landmarks (right eye, left eye, nose, right mouth, left mouth).
- **Persistent Centroid Tracking**: Assigns stable, persistent face IDs (`FACE #01`, `FACE #02`) and tracks individuals across frames.
- **RTSP/TCP Transport & HLS Fallback**: Forces `rtsp_transport;tcp` via OpenCV FFmpeg options to eliminate packet loss, with automatic CDN HLS fallback (`.m3u8`).
- **Sci-Fi Head-Up Display (HUD)**: Displays presentation timestamps (PTS), status indicators (LIVE / RECONNECTING), target match counters, and tech UI reticles.
- **Instant Snapshot Saver**: Save high-resolution timestamped frame snapshots with bounding box and match badges directly to `backend/snapshots/`.

---

## 🏗️ Project Architecture

```text
.
├── backend/
│   ├── main.py                  # Primary CLI application entry point
│   ├── stream_viewer.py         # Lightweight single-camera stream viewer
│   ├── config.py                # Central environment & 60 FPS configuration
│   ├── requirements.txt         # Python dependency requirements
│   ├── core/
│   │   ├── face_analyzer.py     # High-precision YuNet Detector, SFace & Centroid Tracker
│   │   ├── enhancement_pipeline.py # Low-latency frame enhancement pipeline
│   │   ├── hud_renderer.py      # Sci-fi HUD overlay & target match graphics
│   │   └── stream_reader.py     # OpenCV VideoCapture manager for RTSP/HLS/Video
│   ├── services/
│   │   ├── camera_service.py    # Main 60 FPS camera playback loop & snapshot controller
│   │   └── multi_video_service.py # Parallel multi-video search worker threads
│   ├── models/                  # Downloaded ONNX neural model files (YuNet, SFace)
│   ├── targets/                 # Target reference photos (gitignored)
│   ├── image/                   # Target reference images (gitignored)
│   ├── video/                   # Local video test files (gitignored)
│   ├── snapshots/               # Saved snapshot outputs (gitignored)
│   └── utils/
│       └── logger.py            # UTF-8 formatted log outputs
├── .gitignore                   # Excludes media files, models, and virtualenvs
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

Place any target reference photo(s) in `backend/targets/` or `backend/image/` (e.g., `image.png`, `target.jpg`).

```bash
# 1. Run Target Photo Matching on live camera stream
python main.py --target "image/image.png"

# 2. Run Target Photo Matching on a local test video
python main.py --video "video/v1.mp4" --target "image/image.png"

# 3. Run in Match-Only Mode (hides non-matching faces, tracks ONLY the target)
python main.py --video "video/v1.mp4" --target "image/image.png" --match-only
```

---

## 🎥 Multi-Video Parallel Target Search

```bash
# Scan all local video files simultaneously and pop up alert windows instantly
python main.py --video all --target "image/image.png"
```

---

## 🎮 Live GUI Keyboard Controls

While the video window is focused:

| Key | Action |
|---|---|
| **`m`** | Toggle **Match-Only Mode** (Only target face tracked vs All faces tracked) |
| **`t`** | Toggle **Target Photo Matching** ON / OFF |
| **`z`** | Toggle target-person zoom |
| **`+`** / **`-`** | Adjust target zoom level |
| **`e`** | Toggle full-frame enhancement |
| **`d`** | Toggle denoising |
| **`l`** | Toggle low-light enhancement |
| **`r`** | Toggle super-resolution |
| **`k`** | Toggle sharpening |
| **`c`** | Toggle color correction |
| **`y`** | Toggle temporal stabilization |
| **`[`** / **`]`** | Decrease / increase enhancement strength |
| **`f`** | Toggle **Deep Face AI Overlay** ON / OFF |
| **`s`** | Save timestamped frame snapshot to `backend/snapshots/` |
| **`q`** / **`ESC`** | Cleanly exit viewer window |

---

## 🛠️ Tech Stack & Dependencies

- **OpenCV (`opencv-python`)**: Video stream ingestion, YuNet ONNX detection, SFace ONNX face recognition, graphics HUD rendering.
- **NumPy**: Matrix operations for centroid tracking and cosine distance vector computation.
- **python-dotenv**: Environment configuration loading.
- **httpx**: HTTP operations & API utilities.
