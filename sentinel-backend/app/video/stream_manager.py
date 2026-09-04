import asyncio
from typing import Dict, Optional
from app.video.rtsp import RTSPStreamClient
from app.video.frame_sampler import FrameSampler
from app.video.health_monitor import StreamHealthMonitor
from app.core.logging import logger


class StreamManager:
    """
    Central Stream Manager responsible for managing RTSP stream life-cycles,
    reconnections, frame sampling, and health monitoring.
    """

    def __init__(self):
        self.active_streams: Dict[str, RTSPStreamClient] = {}
        self.samplers: Dict[str, FrameSampler] = {}
        self.health_monitor = StreamHealthMonitor()

    def start_stream(self, camera_id: str, rtsp_url: str) -> bool:
        if camera_id in self.active_streams:
            logger.info(f"Stream for camera {camera_id} is already running.")
            return True

        client = RTSPStreamClient(stream_url=rtsp_url, camera_id=camera_id)
        if client.connect():
            self.active_streams[camera_id] = client
            self.samplers[camera_id] = FrameSampler()
            self.health_monitor.update_health(camera_id, "online")
            logger.info(f"Started stream manager for camera {camera_id}")
            return True
        return False

    def stop_stream(self, camera_id: str) -> bool:
        if camera_id in self.active_streams:
            client = self.active_streams.pop(camera_id)
            client.disconnect()
            self.samplers.pop(camera_id, None)
            self.health_monitor.update_health(camera_id, "offline")
            logger.info(f"Stopped stream for camera {camera_id}")
            return True
        return False

    def get_stream_health(self, camera_id: str) -> str:
        return self.health_monitor.check_health(camera_id)


stream_manager = StreamManager()
