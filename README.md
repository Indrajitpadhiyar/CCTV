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
│   │   ├── enhancement_pipeline.py # Full-frame low-latency enhancement pipeline
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

## Full-Frame Video Enhancement

The camera loop enhances the complete frame before display, then runs face analysis and target matching. Target zoom is applied to the enhanced frame before the HUD is rendered. YuNet and SFace analyze the original frame by default to preserve existing recognition behavior; set `FACE_ANALYSIS_ON_ENHANCED=true` to analyze enhanced frames instead.

The default `BALANCED` profile uses low-light correction, fast denoising, natural color correction, restrained sharpening, and temporal smoothing. Processing is resolution-aware and returns frames at their original dimensions. Enhancement failures fall back to the current original frame.

```bash
# Balanced enhancement (default)
python main.py --video "video/v1.mp4" --target "image/p1.png"

# Lowest-latency profile
python main.py --profile performance

# Disable enhancement while keeping face AI and target zoom
python main.py --no-enhancement
```

Optional AI super-resolution is disabled unless a local OpenCV DNN super-resolution model is configured. It requires `opencv-contrib-python`, a validated local model, and settings such as:

```text
ENABLE_SUPER_RESOLUTION=true
SUPER_RESOLUTION_MODEL=backend/models/EDSR_x2.pb
SUPER_RESOLUTION_MODEL_NAME=edsr
SUPER_RESOLUTION_SCALE=2
```

Enhancement settings are centralized in `backend/config.py` and can be overridden through environment variables, including `ENHANCEMENT_PROFILE`, `ENHANCEMENT_STRENGTH`, `ENHANCEMENT_MAX_WIDTH`, and the individual `ENABLE_*` switches.

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
| **`r`** | Toggle optional super-resolution |
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
