import os
import time
from typing import Any, Dict, Optional, Tuple

import cv2
import numpy as np

import config
from utils.logger import setup_logger

logger = setup_logger("EnhancementPipeline")


class EnhancementPipeline:
    """Low-latency full-frame CCTV enhancement with graceful optional SR support."""

    def __init__(self, profile: Optional[str] = None, enabled: Optional[bool] = None):
        self.profile = (profile or config.ENHANCEMENT_PROFILE).upper()
        if self.profile not in {"PERFORMANCE", "BALANCED", "QUALITY"}:
            self.profile = "BALANCED"
        self.enabled = config.ENABLE_ENHANCEMENT if enabled is None else enabled
        self.low_light_enabled = config.ENABLE_LOW_LIGHT
        self.denoise_enabled = config.ENABLE_DENOISE
        self.super_resolution_enabled = config.ENABLE_SUPER_RESOLUTION
        self.sharpen_enabled = config.ENABLE_SHARPEN
        self.color_enabled = config.ENABLE_COLOR_CORRECTION
        self.temporal_enabled = config.ENABLE_TEMPORAL_STABILITY
        self.strength = float(np.clip(config.ENHANCEMENT_STRENGTH, 0.0, 1.0))
        self.previous_frame: Optional[np.ndarray] = None
        self.last_metrics: Dict[str, Any] = {
            "latency_ms": 0.0,
            "device": "CPU",
            "super_resolution": False,
            "status": "OFF",
        }
        self._sr = None
        self._sr_scale = 1
        self._sr_warning_logged = False
        self._load_super_resolution()
        logger.info(
            "Enhancement pipeline: %s profile, %s, SR=%s",
            self.profile,
            "ENABLED" if self.enabled else "DISABLED",
            "ON" if self._sr is not None else "OFF",
        )

    def _load_super_resolution(self) -> None:
        """Load only a local, user-provided OpenCV DNN SR model."""
        if not self.super_resolution_enabled:
            return
        model_path = config.SUPER_RESOLUTION_MODEL
        if not model_path or not os.path.isfile(model_path):
            self._log_sr_warning("No local super-resolution model configured; using resize/detail fallback.")
            return
        if not hasattr(cv2, "dnn_superres"):
            self._log_sr_warning("OpenCV DNN super-resolution is unavailable; install opencv-contrib-python to enable it.")
            return
        try:
            sr = cv2.dnn_superres.DnnSuperResImpl_create()
            sr.readModel(model_path)
            sr.setModel(config.SUPER_RESOLUTION_MODEL_NAME, config.SUPER_RESOLUTION_SCALE)
            self._sr = sr
            self._sr_scale = config.SUPER_RESOLUTION_SCALE
        except Exception as exc:
            self._log_sr_warning(f"Super-resolution model could not be loaded: {exc}")

    def _log_sr_warning(self, message: str) -> None:
        if not self._sr_warning_logged:
            logger.warning(message)
            self._sr_warning_logged = True

    def process(self, frame: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        """Enhance one frame without buffering; on failure return the original frame."""
        started = time.perf_counter()
        if not self._valid_frame(frame):
            return frame, self._metrics(started, "INVALID")
        if not self.enabled:
            self.previous_frame = frame.copy()
            return frame, self._metrics(started, "OFF")

        try:
            original_height, original_width = frame.shape[:2]
            working_frame = frame
            if original_width > config.ENHANCEMENT_MAX_WIDTH:
                working_height = max(1, int(original_height * config.ENHANCEMENT_MAX_WIDTH / original_width))
                working_frame = cv2.resize(
                    frame,
                    (config.ENHANCEMENT_MAX_WIDTH, working_height),
                    interpolation=cv2.INTER_AREA,
                )
            enhanced = working_frame.copy()
            if self.low_light_enabled:
                enhanced = self._low_light(enhanced)
            if self.denoise_enabled:
                enhanced = self._denoise(enhanced)
            if self._sr is not None:
                enhanced = self._super_resolve(enhanced, frame.shape[:2])
            if self.color_enabled:
                enhanced = self._color_correct(enhanced)
            if self.sharpen_enabled:
                enhanced = self._sharpen(enhanced)
            if self.temporal_enabled:
                enhanced = self._temporal_stabilize(enhanced)
            self.previous_frame = enhanced.copy()
            if enhanced.shape[:2] != (original_height, original_width):
                enhanced = cv2.resize(enhanced, (original_width, original_height), interpolation=cv2.INTER_LINEAR)
            return enhanced, self._metrics(started, "ON")
        except Exception as exc:
            logger.error("Enhancement failed; displaying original frame: %s", exc)
            self.previous_frame = frame.copy()
            return frame, self._metrics(started, "FALLBACK")

    @staticmethod
    def _valid_frame(frame: np.ndarray) -> bool:
        return isinstance(frame, np.ndarray) and frame.ndim == 3 and frame.shape[0] > 0 and frame.shape[1] > 0

    def _low_light(self, frame: np.ndarray) -> np.ndarray:
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        lightness, a_channel, b_channel = cv2.split(lab)
        clip_limit = 1.5 + (2.0 * self.strength)
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
        enhanced_lightness = clahe.apply(lightness)
        result = cv2.cvtColor(cv2.merge((enhanced_lightness, a_channel, b_channel)), cv2.COLOR_LAB2BGR)
        gamma = 1.0 - (0.18 * self.strength)
        lookup = np.array([((index / 255.0) ** gamma) * 255 for index in range(256)], dtype=np.uint8)
        result = cv2.LUT(result, lookup)
        return cv2.addWeighted(frame, 1.0 - self.strength * 0.65, result, self.strength * 0.65, 0)

    def _denoise(self, frame: np.ndarray) -> np.ndarray:
        if self.profile != "QUALITY":
            h, w = frame.shape[:2]
            small = cv2.resize(frame, (max(1, w // 2), max(1, h // 2)), interpolation=cv2.INTER_LINEAR)
            filtered_small = cv2.bilateralFilter(small, 3, 20, 20)
            filtered = cv2.resize(filtered_small, (w, h), interpolation=cv2.INTER_LINEAR)
            blend = 0.18 + (0.12 * self.strength)
            return cv2.addWeighted(frame, 1.0 - blend, filtered, blend, 0)
        filter_strength = 2.0 + (3.0 * self.strength)
        return cv2.fastNlMeansDenoisingColored(frame, None, filter_strength, filter_strength, 7, 21)

    def _super_resolve(self, frame: np.ndarray, original_shape: Tuple[int, int]) -> np.ndarray:
        resolved = self._sr.upsample(frame)
        return cv2.resize(resolved, (original_shape[1], original_shape[0]), interpolation=cv2.INTER_AREA)

    def _color_correct(self, frame: np.ndarray) -> np.ndarray:
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        lightness, a_channel, b_channel = cv2.split(lab)
        lightness = cv2.convertScaleAbs(lightness, alpha=1.0 + 0.08 * self.strength, beta=int(2 * self.strength))
        return cv2.cvtColor(cv2.merge((lightness, a_channel, b_channel)), cv2.COLOR_LAB2BGR)

    def _sharpen(self, frame: np.ndarray) -> np.ndarray:
        blurred = cv2.GaussianBlur(frame, (0, 0), 1.0)
        amount = 0.18 + (0.22 * self.strength)
        return cv2.addWeighted(frame, 1.0 + amount, blurred, -amount, 0)

    def _temporal_stabilize(self, frame: np.ndarray) -> np.ndarray:
        if self.previous_frame is None or self.previous_frame.shape != frame.shape:
            return frame
        alpha = 0.12 if self.profile == "PERFORMANCE" else 0.18
        return cv2.addWeighted(frame, 1.0 - alpha, self.previous_frame, alpha, 0)

    def set_strength(self, value: float) -> None:
        self.strength = float(np.clip(value, 0.0, 1.0))

    def toggle(self, feature: str) -> bool:
        if feature == "enhancement":
            self.enabled = not self.enabled
            if not self.enabled:
                self.previous_frame = None
            return self.enabled
        if feature == "super_resolution" and self._sr is None:
            self._log_sr_warning("Super-resolution toggle ignored because no usable local model is loaded.")
            return False
        attribute = f"{feature}_enabled"
        if not hasattr(self, attribute):
            return False
        value = not getattr(self, attribute)
        setattr(self, attribute, value)
        return value

    def _metrics(self, started: float, status: str) -> Dict[str, Any]:
        metrics = {
            "latency_ms": (time.perf_counter() - started) * 1000.0,
            "device": "CPU",
            "super_resolution": self._sr is not None and self.super_resolution_enabled,
            "status": status,
            "strength": self.strength,
        }
        self.last_metrics = metrics
        return metrics
