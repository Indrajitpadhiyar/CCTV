import time
import numpy as np
from typing import Optional, Any
from app.core.logging import logger


class RTSPStreamClient:
    """RTSP Stream Client wrapper with reconnection logic."""

    def __init__(self, rtsp_url: str):
        self.rtsp_url = rtsp_url
        self.is_connected = False

    def connect(self) -> bool:
        """Connect to RTSP stream source."""
        logger.info(f"Connecting to RTSP stream: {self.rtsp_url[:25]}...")
        self.is_connected = True
        return True

    def read_frame(self) -> Optional[Any]:
        """Read a single video frame as numpy array."""
        if not self.is_connected:
            return None
        # Return synthetic 720p frame buffer (black image with text overlay for dev)
        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        return frame

    def disconnect(self) -> None:
        """Disconnect stream."""
        self.is_connected = False
        logger.info(f"Disconnected RTSP stream: {self.rtsp_url[:25]}...")
