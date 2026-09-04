import os
from dotenv import load_dotenv

# Suppress verbose FFmpeg macroblock decoding log spew in terminal
os.environ["OPENCV_FFMPEG_LOG_LEVEL"] = "-8"
os.environ["AV_LOG_QUIET"] = "1"

# Load environment variables from .env
load_dotenv()

# App settings
APP_NAME = os.getenv("APP_NAME", "Sentinel AI CCTV Platform")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# Neon PostgreSQL & Redis URLs
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://neondb_owner:npg_1aLBtA0jopMW@ep-super-boat-aeh9ii1j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require")
REDIS_URL = os.getenv("REDIS_URL", "redis://default:BrlD8EIlGYf0RubmbclZyrZBiAvYceRG@redis-15503.c9.us-east-1-2.ec2.cloud.redislabs.com:15503/0")

# CCTV Camera Credentials & Endpoints
CAMERA_CODE = os.getenv("CAMERA_CODE", "cam04").lower()
STREAM_USER = (os.getenv("CCTV_STREAM_USER") or os.getenv("STREAM_USER") or "drumilthakor5348@gmail.com").strip()
STREAM_PASS = (os.getenv("CCTV_STREAM_PASSWORD") or os.getenv("STREAM_PASS") or "MFL3-D4RS-VFEZ").strip()

RTSP_HOST = (os.getenv("CCTV_RTSP_HOST") or os.getenv("RTSP_HOST") or "103.250.160.189").strip()
RTSP_PORT = (os.getenv("CCTV_RTSP_PORT") or os.getenv("RTSP_PORT") or "8554").strip()
CDN_HOST = (os.getenv("CCTV_HLS_BASE_URL", "https://cctv.corp8.cloud").replace("https://", "").replace("http://", "")).strip()

# URL Encoding for user email (@ replaced with %40)
ENCODED_USER = STREAM_USER.replace("@", "%40")
ENCODED_PASS = STREAM_PASS.replace("@", "%40")

# Primary RTSP over TCP & Fallback HLS URLs
RTSP_URL = f"rtsp://{ENCODED_USER}:{ENCODED_PASS}@{RTSP_HOST}:{RTSP_PORT}/stream/{CAMERA_CODE}"
HLS_URL = f"https://{CDN_HOST}/{CAMERA_CODE}/index.m3u8"

# FFmpeg RTSP Capture Options to force TCP transport & low latency
FFMPEG_OPTIONS = "rtsp_transport;tcp|max_delay;500000|buffer_size;1024000|flags;low_delay"

# Resiliency settings
MIN_RECONNECT_SEC = 2.0
MAX_RECONNECT_SEC = 30.0
BACKOFF_FACTOR = 2.0
WINDOW_TITLE = f"Sentinel CCTV — Live Feed [{CAMERA_CODE.upper()}]"
