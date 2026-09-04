from typing import Any, Optional
from app.core.config import settings


class FrameSampler:
    """Samples video frames according to VIDEO_FRAME_SAMPLE_RATE."""

    def __init__(self, sample_rate: int = settings.VIDEO_FRAME_SAMPLE_RATE):
        self.sample_rate = sample_rate
        self.frame_counter = 0

    def should_sample(self) -> bool:
        self.frame_counter += 1
        if self.frame_counter % self.sample_rate == 0:
            return True
        return False
