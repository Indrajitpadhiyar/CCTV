import json
import os
from typing import List, Union, Any
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Settings using Pydantic v2 pydantic-settings."""

    APP_NAME: str = "Sentinel AI CCTV Platform"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://sentinel:sentinel_password@localhost:5432/sentinel",
        description="Async PostgreSQL Database URL for SQLAlchemy"
    )
    DATABASE_URL_SYNC: str = Field(
        default="postgresql://sentinel:sentinel_password@localhost:5432/sentinel",
        description="Sync PostgreSQL Database URL for Alembic migrations"
    )

    REDIS_URL: str = "redis://localhost:6379/0"

    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    JWT_SECRET_KEY: str = "SECRET_KEY_CHANGE_IN_PRODUCTION_MIN_32_CHARS"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for dev convenience
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "*"
    ]

    LOG_LEVEL: str = "INFO"

    # AI Integration Settings
    AI_MODE: str = Field(default="mock", description="'mock' or 'production'")
    AI_DEVICE: str = "cpu"
    YOLO_MODEL_PATH: str = "models/yolo.pt"
    OCR_ENABLED: bool = True
    ANPR_ENABLED: bool = True
    TRACKING_ENABLED: bool = True

    # Video Settings
    VIDEO_FRAME_SAMPLE_RATE: int = 5
    VIDEO_MAX_RECONNECT_ATTEMPTS: int = 10

    # Storage Settings
    STORAGE_TYPE: str = "local"
    STORAGE_PATH: str = "./storage"

    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minio_admin"
    MINIO_SECRET_KEY: str = "minio_password"
    MINIO_BUCKET: str = "evidence"

    # Pagination
    DEFAULT_PAGE_SIZE: int = 50
    MAX_PAGE_SIZE: int = 200

    WEBSOCKET_ENABLED: bool = True

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(item) for item in parsed]
            return [i.strip() for i in v.split(",") if i.strip()]
        if isinstance(v, list):
            return [str(i) for i in v]
        return [str(v)]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
