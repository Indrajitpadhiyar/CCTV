# Sentinel AI CCTV Platform

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0+-red.svg)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

An enterprise-grade, high-performance distributed AI CCTV surveillance platform for centralized video stream monitoring, AI analytics (YOLOv8 Object Detection, ANPR - Automatic Number Plate Recognition, Multi-Camera Tracking, Person Re-ID), real-time WebSocket alert broadcasting, and forensic search.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Full Python & Project Directory Structure](#2-full-python--project-directory-structure)
3. [Tech Stack](#3-tech-stack)
4. [Prerequisites](#4-prerequisites)
5. [Environment Configuration](#5-environment-configuration)
6. [How to Run - Step by Step](#6-how-to-run---step-by-step)
   - [Option A: Local Development Run (Backend & Frontend)](#option-a-local-development-run-backend--frontend)
   - [Option B: Docker Compose Run (Full Stack)](#option-b-docker-compose-run-full-stack)
7. [Running Celery Background Workers](#7-running-celery-background-workers)
8. [Running Automated Tests](#8-running-automated-tests)
9. [API Documentation & Swagger UI](#9-api-documentation--swagger-ui)
10. [Default Credentials](#10-default-credentials)
11. [Useful Makefile Commands](#11-useful-makefile-commands)

---

## 1. Project Overview

Sentinel AI CCTV Platform connects heterogeneous RTSP video streams and processes frames using distributed background workers and AI inference pipelines:

- **Stream Management**: Register, start, stop, restart, and sample RTSP/HLS video feeds dynamically.
- **Dynamic Catalogue Sync**: Auto-fetch cameras from `https://cctv.corp8.cloud/cameras.json` (`cam01`...`cam30`).
- **Protocol Support**: RTSP over TCP (`rtsp_transport;tcp`), HLS fallback (`.m3u8`), WebRTC (WHEP).
- **PTS Monotonic Timing**: Timestamps derived strictly from `CAP_PROP_POS_MSEC` (never `CAP_PROP_FPS`).
- **Resilient Stream Client**: Exponential backoff reconnection (2s to 30s cap), inter-frame gap tolerance, join-time decoder warning tolerance, and scene loop cut discontinuity recovery.
- **AI Analytics Engine**: Pluggable architecture supporting YOLOv8 Object Detection, ANPR plate recognition, DeepSORT tracking, and Person Re-ID.
- **Real-time Alerting**: Automated matching against watchlists with WebSocket alert broadcasting via Redis Pub/Sub.
- **Vehicle Tracking & GIS**: Multi-camera vehicle trajectory timeline and GIS map visualization.
- **Database & Cache**: Supabase PostgreSQL database + Redis caching & Celery task broker.

---

## Live CCTV Stream Connection Specifications

### Protocols & Endpoints

| Protocol | Endpoint Template | Access | Intended For |
|---|---|---|---|
| **HLS** | `https://cctv.corp8.cloud/<id>/index.m3u8` | Public / Session | Dashboards, Mobile, Remote AI |
| **RTSP** | `rtsp://<email>:<password>@103.250.160.189:8554/stream/<id>` | Direct Public IP | AI Inference (OpenCV / FFmpeg) |
| **WebRTC (WHEP)** | `http://<email>:<password>@103.250.160.189:8889/stream/<id>/whep` | Direct Public IP | Low-Latency Browser Preview |

### 7-Point Pre-Submission Checklist Compliance

1. **RTSP forced over TCP**: Sets `OPENCV_FFMPEG_CAPTURE_OPTIONS=rtsp_transport;tcp` to eliminate UDP corrupt frame artifacts across NAT/firewalls. HLS fallback is enabled if RTSP port 8554 is unreachable.
2. **PTS Monotonic Timing**: Drives timing from Presentation Timestamps (`CAP_PROP_POS_MSEC`), ignoring `CAP_PROP_FPS` or arrival time jitter.
3. **Inter-frame Gap Tolerance**: Handles variable frame rates gracefully without crashing or false disconnect triggers.
4. **Exponential Backoff Reconnects**: Reconnection logic uses exponential backoff (`2s -> 4s -> 8s -> ... -> 30s max cap`) with non-tight-loop delay.
5. **Non-fatal Decoder Warnings**: Join-time warnings (e.g. `Could not find ref with POC until first IDR`) are logged without aborting decoding.
6. **Dynamic Catalogue Fetching**: Reads camera catalogue dynamically from `https://cctv.corp8.cloud/cameras.json` via `/api/v1/cameras/sync-catalog`.
7. **Scene Cut Discontinuity Recovery**: Detects loop point jumps (`PTS` reset / backward jump) and resets tracking state to prevent tracking ghosts across cuts.

---

## Database Configuration (Supabase PostgreSQL + Redis)

Sentinel supports local PostgreSQL or cloud-hosted **Supabase PostgreSQL** alongside **Redis**:

### Supabase Connection Setup
In your `sentinel-backend/.env`:
```env
# Supabase PostgreSQL Connection String
DATABASE_URL=postgresql+asyncpg://postgres:<YOUR_SUPABASE_PASSWORD>@db.<YOUR_PROJECT_REF>.supabase.co:5432/postgres
DATABASE_URL_SYNC=postgresql://postgres:<YOUR_SUPABASE_PASSWORD>@db.<YOUR_PROJECT_REF>.supabase.co:5432/postgres

# Redis Connection (Local or Upstash Redis)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

---

## 2. Full Python & Project Directory Structure

```text
d:\hackethon\
├── sentinel-backend/                 # Python FastAPI Backend Architecture
│   ├── app/                          # Main Application Package
│   │   ├── main.py                   # FastAPI Application Entrypoint, Middlewares & CORS
│   │   ├── core/                     # Core Configuration, Security, DB Engine & Logging
│   │   │   ├── config.py             # Pydantic BaseSettings management
│   │   │   ├── database.py           # Async SQLAlchemy Engine & SessionLocal sessionmaker
│   │   │   ├── redis.py              # Redis connection pool & caching client
│   │   │   ├── security.py           # Password hashing (bcrypt) & JWT token generation
│   │   │   └── logging.py            # Structured logging config
│   │   ├── api/                      # REST API & WebSockets Layer
│   │   │   ├── deps.py               # Dependency injections (Auth JWT, Current User, RBAC)
│   │   │   └── v1/                   # API v1 Versioned Endpoints
│   │   │       ├── auth.py           # Authentication routes (Login, Register, Me)
│   │   │       ├── cameras.py        # Camera CRUD & Stream Control APIs
│   │   │       ├── alerts.py         # Real-time Alerts & Watchlists APIs
│   │   │       ├── tracking.py       # Multi-camera vehicle tracking & GIS routes
│   │   │       ├── search.py         # Unified forensic search endpoints
│   │   │       └── ws.py             # WebSocket endpoint for real-time live events
│   │   ├── models/                   # SQLAlchemy 2.x Async ORM Data Models
│   │   │   ├── base.py               # Declarative Base & Timestamp mixins
│   │   │   ├── user.py               # User & RBAC Role models
│   │   │   ├── camera.py             # Camera entity & RTSP configurations
│   │   │   ├── alert.py              # Alert & Watchlist models
│   │   │   ├── vehicle.py            # Vehicle detection & ANPR logs
│   │   │   └── person.py             # Person detection & Re-ID logs
│   │   ├── schemas/                  # Pydantic v2 Input/Output Validation Schemas
│   │   │   ├── auth.py               # User login/token schemas
│   │   │   ├── camera.py             # Camera request/response schemas
│   │   │   ├── alert.py              # Alert notification schemas
│   │   │   └── tracking.py           # Trajectory & GIS map schemas
│   │   ├── repositories/             # Database Access Layer (Async Repository Pattern)
│   │   │   ├── user_repo.py
│   │   │   ├── camera_repo.py
│   │   │   └── alert_repo.py
│   │   ├── services/                 # Core Business Logic Layer
│   │   │   ├── auth_service.py
│   │   │   ├── camera_service.py
│   │   │   └── tracking_service.py
│   │   ├── ai/                       # AI Inference & Vision Analytics Package
│   │   │   ├── base.py               # Decoupled AI Detector Interfaces
│   │   │   ├── yolo.py               # YOLOv8 Object Detection implementation
│   │   │   ├── anpr.py               # ANPR (Number Plate Recognition) pipeline
│   │   │   ├── tracker.py            # Multi-object tracking (DeepSORT/BYTETrack)
│   │   │   └── reid.py               # Person Re-Identification feature extraction
│   │   ├── video/                    # Video Streaming & Processing Pipeline
│   │   │   ├── manager.py            # RTSP Stream Manager & lifecycle controller
│   │   │   ├── sampler.py            # Frame Sampler (FPS extraction engine)
│   │   │   └── rtsp.py               # OpenCV / FFmpeg RTSP client handler
│   │   ├── workers/                  # Distributed Celery Async Workers
│   │   │   ├── celery_app.py         # Celery instance configuration
│   │   │   └── tasks.py              # Frame processing & detection tasks
│   │   ├── events/                   # Event Bus & Real-time Publisher
│   │   │   └── publisher.py          # Redis Pub/Sub alert event broadcaster
│   │   └── utils/                    # Common Utilities
│   │       ├── gis.py                # Haversine distance & GIS map calculation
│   │       └── pagination.py         # Response paginator
│   ├── alembic/                      # Database Migration Scripts
│   │   ├── env.py                    # Alembic environment runner
│   │   └── versions/                 # Migration version history files
│   ├── scripts/                      # Utility & Seeding Scripts
│   │   ├── seed_admin.py             # Script to initialize admin user
│   │   └── seed_demo_data.py         # Script to seed demo cameras & alerts
│   ├── tests/                        # Automated Pytest Suite
│   ├── docker/                       # Dockerfiles & Nginx Config
│   ├── .env.example                  # Backend Environment variables template
│   ├── alembic.ini                   # Database migration settings
│   ├── docker-compose.yml            # Multi-container orchestration config
│   ├── Makefile                      # Command shortcut Makefile
│   ├── pyproject.toml                # Python project configuration & tool settings
│   ├── requirements.txt              # Python dependencies specification
│   └── README.md                     # Backend specific documentation
│
└── frontend/                         # React 19 + Vite Frontend Application
    ├── src/                          # Application Source Code
    ├── public/                       # Static Assets
    ├── index.html                    # HTML Entry Point
    ├── package.json                  # Node.js dependencies & scripts
    ├── vite.config.js                # Vite build & development config
    └── README.md                     # Frontend specific documentation
```

---

## 3. Tech Stack

- **Backend Framework**: Python 3.12+, FastAPI, Uvicorn
- **Database & ORM**: PostgreSQL 16, SQLAlchemy 2.0 Async (`asyncpg`), Alembic
- **Caching & Message Broker**: Redis 7, Celery
- **Computer Vision & AI**: OpenCV, NumPy, Ultralytics YOLOv8, PyTorch
- **Data Validation & Auth**: Pydantic v2, PyJWT, Passlib (`bcrypt`)
- **Frontend**: React 19, Vite, JavaScript
- **DevOps**: Docker, Docker Compose, Makefile

---

## 4. Prerequisites

Before running the application locally, ensure you have installed:

1. **Python**: Version `3.12` or higher
2. **Node.js**: Version `18.x` or higher (with `npm`)
3. **PostgreSQL**: Version `15` or `16` (Running locally or via Docker)
4. **Redis**: Version `7.x` (Running locally or via Docker)
5. **Docker & Docker Compose**: *(Optional, required for containerized setup)*

---

## 5. Environment Configuration

1. Navigate to `sentinel-backend`:
   ```bash
   cd sentinel-backend
   ```
2. Copy the template `.env.example` file to create `.env`:
   ```bash
   cp .env.example .env
   ```
3. Default `.env` configurations:
   ```env
   PROJECT_NAME="Sentinel AI CCTV Platform"
   ENV="development"
   DEBUG=True
   API_V1_STR="/api/v1"
   SECRET_KEY="change_this_to_a_secure_secret_key_in_production"
   ACCESS_TOKEN_EXPIRE_MINUTES=11520

   # Database
   POSTGRES_SERVER="localhost"
   POSTGRES_PORT=5432
   POSTGRES_USER="sentinel"
   POSTGRES_PASSWORD="sentinel_password"
   POSTGRES_DB="sentinel"

   # Redis & Celery
   REDIS_HOST="localhost"
   REDIS_PORT=6379
   REDIS_DB=0
   CELERY_BROKER_URL="redis://localhost:6379/1"
   CELERY_RESULT_BACKEND="redis://localhost:6379/2"

   # AI Inference Settings
   AI_MODE="mock"  # Use 'mock' for CPU dev, 'production' for PyTorch weights
   ```

---

## 6. How to Run - Step by Step

### Option A: Local Development Run (Backend & Frontend)

#### Step 1: Set Up & Run Python Backend

1. **Open a terminal** and navigate to `sentinel-backend`:
   ```bash
   cd sentinel-backend
   ```

2. **Create and Activate a Virtual Environment**:
   - On Windows (PowerShell):
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - On Linux / macOS:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure PostgreSQL & Redis are Running**:
   *(If PostgreSQL/Redis are installed locally on default ports 5432 and 6379)*

5. **Apply Database Migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Seed Initial Admin User & Demo Data**:
   ```bash
   python scripts/seed_admin.py
   python scripts/seed_demo_data.py
   ```

7. **Start the FastAPI Backend Server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *(Or run `make run` if `make` is installed)*

   The backend API will be available at: **http://localhost:8000**

---

#### Step 2: Set Up & Run React Frontend

1. **Open a second terminal** and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```

   The frontend application will be available at: **http://localhost:5173**

---

### Option B: Docker Compose Run (Full Stack)

If you prefer to launch the complete system (PostgreSQL, Redis, FastAPI Backend, Celery Worker) using Docker:

1. Navigate to `sentinel-backend`:
   ```bash
   cd sentinel-backend
   ```

2. Launch all services:
   ```bash
   docker compose up -d --build
   ```

3. Check logs:
   ```bash
   docker compose logs -f
   ```

4. Stop all services:
   ```bash
   docker compose down -v
   ```

---

## 7. Running Celery Background Workers

Background video stream analysis and AI inference tasks are handled by Celery workers.

In a separate terminal (with virtual environment activated):

```bash
cd sentinel-backend
celery -A app.workers.celery_app worker --loglevel=info
```
*(Or run `make worker`)*

---

## 8. Running Automated Tests

Run the full pytest suite for auth, cameras, streams, ANPR, tracking, and alerts:

```bash
cd sentinel-backend
pytest
```
*(Or run `make test`)*

---

## 9. API Documentation & Swagger UI

Once the backend is running, access the interactive API documentation at:

- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Schema (JSON)**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 10. Default Credentials

Initial demo admin user created by the seed script:

- **Email**: `admin@example.com`
- **Password**: `Admin123!`
- **Role**: `ADMIN`

---

## 11. Useful Makefile Commands

Inside `sentinel-backend/`, you can use `make` shortcuts:

| Command | Description |
|---|---|
| `make install` | Install Python dependencies from `requirements.txt` |
| `make run` | Start FastAPI uvicorn development server |
| `make worker` | Run Celery background worker |
| `make migrate` | Apply database migrations with Alembic |
| `make seed` | Seed database with admin user & demo cameras |
| `make test` | Execute pytest test suite |
| `make docker-up` | Build & launch Docker Compose containers |
| `make docker-down` | Stop and tear down Docker containers |
| `make clean` | Clean temporary `__pycache__` and test caches |
