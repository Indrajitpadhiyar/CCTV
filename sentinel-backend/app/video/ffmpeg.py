import subprocess
from typing import Optional
from app.core.logging import logger


class FFmpegTranscoder:
    """FFmpeg subprocess wrapper for stream transcoding (RTSP -> HLS/WebRTC)."""

    @staticmethod
    def generate_hls_command(input_rtsp: str, output_hls_dir: str) -> list[str]:
        return [
            "ffmpeg",
            "-rtsp_transport", "tcp",
            "-i", input_rtsp,
            "-c:v", "copy",
            "-c:a", "aac",
            "-f", "hls",
            "-hls_time", "2",
            "-hls_list_size", "5",
            f"{output_hls_dir}/playlist.m3u8"
        ]
