from typing import Dict
from app.core.logging import logger


class StreamHealthMonitor:
    """Monitors connection state and network quality of RTSP streams."""

    def __init__(self):
        self.stream_states: Dict[str, str] = {}

    def check_health(self, camera_id: str) -> str:
        state = self.stream_states.get(camera_id, "online")
        return state

    def update_health(self, camera_id: str, status: str) -> None:
        self.stream_states[camera_id] = status
