import cv2
import numpy as np

class HUDRenderer:
    """Renders professional Head-Up Display (HUD) overlay on live camera video frames."""

    @staticmethod
    def draw_hud(frame: np.ndarray, camera_code: str, pts_ms: float, is_live: bool = True) -> np.ndarray:
        h, w, _ = frame.shape

        # Top Header Overlay Bar (dark background)
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 50), (10, 15, 26), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)

        # Status Indicator Dot (Green = Live, Red = Reconnecting)
        dot_color = (0, 230, 118) if is_live else (0, 0, 255)
        cv2.circle(frame, (22, 25), 6, dot_color, -1)

        # Camera Code Header Text
        title_text = f"CAM: {camera_code.upper()}  |  SENTINEL CCTV MONITOR"
        cv2.putText(frame, title_text, (38, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)

        # Monotonic Presentation Timestamp (PTS)
        pts_text = f"PTS: {int(pts_ms):,} ms"
        cv2.putText(frame, pts_text, (w - 220, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 229, 255), 1, cv2.LINE_AA)

        # Bottom Information Bar
        cv2.rectangle(frame, (0, h - 30), (w, h), (10, 15, 26), -1)
        info_text = f"Protocol: RTSP/TCP  |  FPS: 25  |  Resolution: {w}x{h}  |  Press 'q' or ESC to Exit"
        cv2.putText(frame, info_text, (15, h - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (180, 190, 200), 1, cv2.LINE_AA)

        return frame

    @staticmethod
    def draw_reconnecting_screen(camera_code: str, backoff_sec: float, pts_ms: float) -> np.ndarray:
        """Generates a clean simulated camera screen when stream is reconnecting."""
        w, h = 960, 540
        frame = np.zeros((h, w, 3), dtype=np.uint8)

        # Dark gradient background
        for y in range(h):
            color = int(15 + (y / h) * 20)
            frame[y, :] = (color, color + 5, color + 15)

        # Grid lines
        for x in range(0, w, 60):
            cv2.line(frame, (x, 0), (x, h), (40, 45, 60), 1)
        for y in range(0, h, 60):
            cv2.line(frame, (0, y), (w, y), (40, 45, 60), 1)

        # Warning & Retry Text
        cv2.putText(frame, f"[!] RECONNECTING TO {camera_code.upper()}...", (w // 2 - 200, h // 2), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 200, 255), 2, cv2.LINE_AA)
        cv2.putText(frame, f"Next retry in: {int(backoff_sec)}s", (w // 2 - 90, h // 2 + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 160, 180), 1, cv2.LINE_AA)

        return HUDRenderer.draw_hud(frame, camera_code, pts_ms, is_live=False)
