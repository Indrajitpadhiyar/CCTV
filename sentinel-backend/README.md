# Sentinel AI CCTV Platform - Backend

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

Production-grade, highly scalable Python backend for an AI-powered centralized CCTV management, video analytics, ANPR (Automatic Number Plate Recognition), multi-camera vehicle/person tracking, real-time alert broadcasting, and evidence management system designed to eventually scale up to **80,000+ heterogeneous CCTV cameras**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Directory Structure](#4-directory-structure)
5. [Requirements & Prerequisites](#5-requirements--prerequisites)
6. [Local Environment Setup](#6-local-environment-setup)
7. [Environment Variables](#7-environment-variables)
8. [Docker Setup](#8-docker-setup)
9. [Database Migrations](#9-database-migrations)
10. [Running the Application](#10-running-the-application)
11. [Running Celery Background Workers](#11-running-celery-background-workers)
12. [Running Automated Tests](#12-running-automated-tests)
13. [API Documentation & Endpoints](#13-api-documentation--endpoints)
14. [Default Demo Credentials](#14-default-demo-credentials)
15. [CCTV Integration Architecture](#15-cctv-integration-architecture)
16. [AI Inference Architecture](#16-ai-inference-architecture)
17. [Scaling Strategy for 80,000+ Cameras](#17-scaling-strategy-for-80000-cameras)
18. [Security & Masking Notes](#18-security--masking-notes)
19. [Production Deployment Guide](#19-production-deployment-guide)

---

## 1. Project Overview

Sentinel AI CCTV Platform provides a unified, enterprise-grade control system for video surveillance operations:
- **CCTV & RTSP Stream Management**: Register, monitor, start/stop, restart, and health check RTSP video streams.
- **AI Analytics Engine**: Pluggable architecture supporting Object Detection (YOLOv8), ANPR (Automatic Number Plate Recognition), Person Re-ID, and Multi-Object Tracking (DeepSORT/BYTETrack).
- **Automated Watchlist & Alert System**: Real-time matching against vehicle license plates or person references with automated WebSocket alert broadcasting.
- **Multi-Camera Vehicle Tracking**: Chronological camera transitions and GIS trajectory data for map rendering.
- **Forensic Search**: Unified multi-entity search across cameras, vehicles, license plates, persons, alerts, and events.
- **Role-Based Access Control (RBAC)**: Fine-grained security for ADMIN, OPERATOR, INVESTIGATOR, and VIEWER roles.

---

## 2. Architecture

Sentinel AI Backend strictly adheres to **Clean & Modular Architecture**:

```
Client (React / WebSockets)
        │
        ▼
   NGINX Proxy
        │
        ▼
Stateless FastAPI Instances  ◄─── Redis Pub/Sub ───► WebSockets Broadcaster
        │
        ├─────────────────────────────┐
        ▼                             ▼
PostgreSQL Database           Redis Cache / Celery Broker
(Async SQLAlchemy 2.0)                │
                                      ▼
                             Distributed Celery Workers
                                      │
                                      ▼
                            Pluggable AI Inference
                        (YOLO / ANPR / ReID / Tracker)
```

---

## 3. Technology Stack

- **Language**: Python 3.12+
- **API Framework**: FastAPI & Uvicorn
- **Database**: PostgreSQL 16
- **ORM & Migrations**: SQLAlchemy 2.x Async (`asyncpg`), Alembic
- **Data Validation & Settings**: Pydantic v2 & `pydantic-settings`
- **Caching & Event Bus**: Redis & Redis Pub/Sub
- **Background Task Queue**: Celery (with Redis broker & result backend)
- **Authentication**: JWT (`PyJWT`), Password Hashing (`passlib` with `bcrypt`)
- **Realtime**: FastAPI WebSockets & Redis Pub/Sub
- **Video & Vision Libraries**: OpenCV, FFmpeg, NumPy, Ultralytics YOLOv8, PyTorch
- **Containers**: Docker & Docker Compose

---

## 4. Directory Structure

```
sentinel-backend/
├── app/
│   ├── main.py                 # FastAPI Application entrypoint & middlewares
│   ├── core/                   # Config, Database engine, Redis pool, Security, Logging, Exceptions
│   ├── api/                    # Dependencies (RBAC, JWT) & API v1 routers
│   ├── models/                 # SQLAlchemy 2.x Mapped models (Base, User, Camera, Alert, etc.)
│   ├── schemas/                # Pydantic v2 validation & response models
│   ├── repositories/           # Async database repositories
│   ├── services/               # Core business logic services
│   ├── ai/                     # Decoupled AI Interfaces, YOLO, ANPR, Person Re-ID, Tracker
│   ├── video/                  # StreamManager, RTSP client, FFmpeg, FrameSampler
│   ├── workers/                # Celery app & background task definitions
│   ├── events/                 # Domain event publisher/subscriber via Redis Pub/Sub
│   └── utils/                  # Pagination, Haversine GIS math, ISO timestamps, Validators
├── alembic/                    # Database migrations
├── tests/                      # Pytest test suite (Auth, Cameras, Streams, ANPR, Tracking, Alerts, Search)
├── scripts/                    # Seed scripts (seed_admin.py, seed_demo_data.py) & healthchecks
├── docker/                     # Production Dockerfile, Dockerfile.worker, nginx.conf
├── .env.example                # Environment configuration template
├── docker-compose.yml          # Container orchestration (API, Worker, Postgres, Redis)
├── alembic.ini                 # Alembic configuration
├── pyproject.toml              # Project dependencies & tool configurations
├── requirements.txt            # Dependency manifest
├── README.md                   # System documentation
└── Makefile                    # Development shortcuts
```

---

## 5. Requirements & Prerequisites

- **Python**: 3.12+
- **PostgreSQL**: 15+ (or Docker image `postgres:16-alpine`)
- **Redis**: 7+ (or Docker image `redis:7-alpine`)
- **Docker & Docker Compose**: (Optional but recommended)

---

## 6. Local Environment Setup

1. **Clone project & create virtual environment**:
   ```bash
   cd sentinel-backend
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On Linux/macOS:
   source .venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Copy `.env.example` to `.env`**:
   ```bash
   cp .env.example .env
   ```

---

## 7. Environment Variables

Key configuration options in `.env`:

| Variable | Default Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://sentinel:sentinel_password@localhost:5432/sentinel` | Async Postgres connection |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection for caching |
| `CELERY_BROKER_URL` | `redis://localhost:6379/1` | Celery broker URL |
| `JWT_SECRET_KEY` | `CHANGE_ME_SECRET` | Secret key for signing JWT tokens |
| `AI_MODE` | `mock` | Set to `mock` for local CPU dev without GPU/weights |
| `VIDEO_FRAME_SAMPLE_RATE` | `5` | Frames sampled per second (FPS) for AI analysis |

---

## 8. Docker Setup

To launch the complete infrastructure stack (FastAPI API, Celery Worker, PostgreSQL, Redis) via Docker Compose:

```bash
docker compose up -d --build
```

To stop containers:
```bash
docker compose down -v
```

---

## 9. Database Migrations

Apply Alembic migrations to create the database schema:

```bash
# Upgrade database to head
alembic upgrade head

# Generate new migration revision after model changes
alembic revision --autogenerate -m "Add new model feature"
```

Seed initial RBAC roles and demo data:
```bash
python scripts/seed_admin.py
python scripts/seed_demo_data.py
```

---

## 10. Running the Application

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Or using Makefile:
```bash
make run
```

---

## 11. Running Celery Background Workers

Start Celery background worker:

```bash
celery -A app.workers.celery_app worker --loglevel=info
```
Or using Makefile:
```bash
make worker
```

---

## 12. Running Automated Tests

Run the test suite using `pytest`:

```bash
pytest
```
Or using Makefile:
```bash
make test
```

---

## 13. API Documentation & Endpoints

Interactive Swagger UI documentation is automatically generated by FastAPI:
- **Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

### Core API Endpoints Summary:

- **Authentication**:
  - `POST /api/v1/auth/register` - Register user
  - `POST /api/v1/auth/login` - Login & obtain JWT bearer tokens
  - `POST /api/v1/auth/refresh` - Refresh access token
  - `GET  /api/v1/auth/me` - Get current user profile
- **Cameras**:
  - `POST   /api/v1/cameras` - Register camera
  - `GET    /api/v1/cameras` - List cameras (filtering & pagination)
  - `GET    /api/v1/cameras/stats` - Camera health metrics
  - `GET    /api/v1/cameras/map` - GIS map points
  - `POST   /api/v1/cameras/{id}/start` - Start stream
  - `POST   /api/v1/cameras/{id}/stop` - Stop stream
- **ANPR & Vehicle Search**:
  - `GET /api/v1/vehicles/search?plate_number=GJ01AB1234` - Vehicle plate search
  - `GET /api/v1/anpr/search` - ANPR search
- **Vehicle Tracking**:
  - `GET /api/v1/tracking/vehicles/search?plate_number=GJ01AB1234` - Multi-camera trajectory timeline
- **Alerts & Watchlists**:
  - `GET /api/v1/alerts` - List alerts
  - `POST /api/v1/alerts/{id}/acknowledge` - Acknowledge alert
  - `POST /api/v1/watchlists` - Add plate/person to watchlist
- **Real-time WebSockets**:
  - `WS /api/v1/ws` - Live WebSocket event feed

---

## 14. Default Demo Credentials

> [!WARNING]
> These credentials are generated strictly for development and testing. Change production secrets in `.env`.

- **Admin User**: `admin@example.com` / `admin`
- **Password**: `Admin123!`
- **Role**: `ADMIN`

---

## 15. CCTV Integration Architecture

```
Camera (RTSP Stream) ──► StreamManager (FrameSampler @ 5 FPS)
                              │
                              ▼
                       Celery Task Queue
                              │
                              ▼
                     AI Inference Engine
                              │
                              ▼
                   Watchlist Match Check
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
           PostgreSQL Storage     Redis Pub/Sub ──► WebSocket Broadcast
```

---

## 16. AI Inference Architecture

AI inference logic is isolated behind strict service interfaces (`ObjectDetectorInterface`, `ANPRDetectorInterface`, `PersonReIDInterface`, `TrackerInterface`):

- **Mock Mode (`AI_MODE=mock`)**: Generates realistic synthetic detections for local dev and testing without GPU requirements.
- **Production Mode (`AI_MODE=production`)**: Dynamically loads real PyTorch / Ultralytics YOLOv8 weights (`models/yolo.pt`) and OCR pipelines.

---

## 17. Scaling Strategy for 80,000+ Cameras

To manage 80,000+ heterogeneous cameras across cities/districts:
1. **Stateless API Tier**: Scale FastAPI API instances horizontally behind NGINX load balancers.
2. **Sharded Camera Gateways**: Group cameras into regional edge gateways using hash sharding (`hash(camera_id) % N`).
3. **Kafka Event Bus**: Transition Redis Pub/Sub to Apache Kafka for persistent high-throughput event streaming.
4. **Time-Series Database Partitioning**: Enable PostgreSQL Table Partitioning by timestamp (`range(timestamp)`) for detection and event history.
5. **Decoupled GPU Worker Pools**: Scale inference workers independently based on frame queue depth.

---

## 18. Security & Masking Notes

- **RTSP Credential Masking**: RTSP connection strings containing passwords (`rtsp://user:pass@host`) are automatically sanitized to `rtsp://***:***@host` in all public API responses.
- **Password Hashing**: Secure password storage using `bcrypt`/`passlib`.
- **RBAC Enforcement**: Strict endpoint protection (`require_role("ADMIN", "OPERATOR")`).

---

## 19. Production Deployment Guide

1. Ensure `.env` contains strong production `JWT_SECRET_KEY` and DB credentials.
2. Execute `alembic upgrade head`.
3. Launch container stack with `docker compose -f docker-compose.yml up -d --build`.
4. Configure SSL/TLS termination on NGINX proxy.
