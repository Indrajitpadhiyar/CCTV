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

# Full-frame real-time enhancement. CPU-safe defaults; optional SR requires a local model.
ENHANCEMENT_PROFILE = os.getenv("ENHANCEMENT_PROFILE", "BALANCED").upper()
ENABLE_ENHANCEMENT = os.getenv("ENABLE_ENHANCEMENT", "true").lower() == "true"
ENABLE_LOW_LIGHT = os.getenv("ENABLE_LOW_LIGHT", "true").lower() == "true"
ENABLE_DENOISE = os.getenv("ENABLE_DENOISE", "true").lower() == "true"
ENABLE_SUPER_RESOLUTION = os.getenv("ENABLE_SUPER_RESOLUTION", "false").lower() == "true"
ENABLE_SHARPEN = os.getenv("ENABLE_SHARPEN", "true").lower() == "true"
ENABLE_COLOR_CORRECTION = os.getenv("ENABLE_COLOR_CORRECTION", "true").lower() == "true"
ENABLE_TEMPORAL_STABILITY = os.getenv("ENABLE_TEMPORAL_STABILITY", "true").lower() == "true"
ENHANCEMENT_STRENGTH = float(os.getenv("ENHANCEMENT_STRENGTH", "0.55"))
SUPER_RESOLUTION_MODEL = os.getenv(
	"SUPER_RESOLUTION_MODEL",
	os.path.join(os.path.dirname(__file__), "models", "EDSR_x2.pb")
)
SUPER_RESOLUTION_MODEL_NAME = os.getenv("SUPER_RESOLUTION_MODEL_NAME", "edsr")
SUPER_RESOLUTION_SCALE = int(os.getenv("SUPER_RESOLUTION_SCALE", "2"))
# Recognition stays on the camera frame by default to preserve existing SFace behavior.
FACE_ANALYSIS_ON_ENHANCED = os.getenv("FACE_ANALYSIS_ON_ENHANCED", "false").lower() == "true"
TARGET_ZOOM_DEFAULT = float(os.getenv("TARGET_ZOOM_DEFAULT", "2.0"))
MAX_PROCESSING_FPS = float(os.getenv("MAX_PROCESSING_FPS", "30"))
ENHANCEMENT_MAX_WIDTH = int(os.getenv("ENHANCEMENT_MAX_WIDTH", "1280"))
