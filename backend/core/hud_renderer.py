import cv2
import numpy as np
from typing import List, Dict, Any, Optional

class HUDRenderer:
    """Renders professional Head-Up Display (HUD) overlay and facial analytics on live camera video frames."""

    @staticmethod
    def draw_hud(
        frame: np.ndarray,
        camera_code: str,
        pts_ms: float,
        is_live: bool = True,
        faces: Optional[List[Dict[str, Any]]] = None,
        face_analysis_active: bool = True
    ) -> np.ndarray:
        h, w, _ = frame.shape

        # Draw Face Analytics overlays if enabled
        if face_analysis_active and faces is not None:
            HUDRenderer.draw_face_overlays(frame, faces)

        # Top Header Overlay Bar (dark transparent background)
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 50), (10, 15, 26), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)

        # Status Indicator Dot (Green = Live, Red = Reconnecting)
        dot_color = (0, 230, 118) if is_live else (0, 0, 255)
        cv2.circle(frame, (22, 25), 6, dot_color, -1)

        # Camera Code Header Text
        title_text = f"CAM: {camera_code.upper()}  |  SENTINEL CCTV AI MONITOR"
        cv2.putText(frame, title_text, (38, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)

        # Monotonic Presentation Timestamp (PTS)
        pts_text = f"PTS: {int(pts_ms):,} ms"
        cv2.putText(frame, pts_text, (w - 210, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 229, 255), 1, cv2.LINE_AA)

        # Face AI Status Badge on Top Header
        if face_analysis_active:
            face_count = len(faces) if faces is not None else 0
            badge_color = (0, 230, 118) if face_count > 0 else (180, 190, 200)
            face_status_text = f"DEEP FACE AI: ONLINE  |  FACES: {face_count}"
            cv2.putText(frame, face_status_text, (w - 410, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.45, badge_color, 1, cv2.LINE_AA)
        else:
            cv2.putText(frame, "FACE AI: OFF (Press 'f')", (w - 410, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (120, 130, 150), 1, cv2.LINE_AA)

        # Bottom Information Bar
        cv2.rectangle(frame, (0, h - 30), (w, h), (10, 15, 26), -1)
        info_text = f"Protocol: RTSP/TCP | Resolution: {w}x{h} | 'f': Toggle Face AI | 's': Save Snapshot | 'q'/ESC: Exit"
        cv2.putText(frame, info_text, (15, h - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 190, 200), 1, cv2.LINE_AA)

        return frame

    @staticmethod
    def draw_face_overlays(frame: np.ndarray, faces: List[Dict[str, Any]]):
        """Renders futuristic targeting reticles, facial landmarks, face ID badges, and centroids around detected faces."""
        for face in faces:
            (x, y, w, h) = face["bbox"]
            (cx, cy) = face["centroid"]
            face_id = face["id"]
            label = face["label"]
            proximity = face["proximity"]
            confidence = face["confidence"]
            landmarks = face.get("landmarks")

            # Color scheme based on face ID
            base_colors = [
                (0, 229, 255),  # Cyan
                (0, 230, 118),  # Vibrant Green
                (255, 171, 0),  # Amber
                (255, 64, 129), # Magenta
                (124, 77, 255)  # Purple
            ]
            color = base_colors[face_id % len(base_colors)]

            # Draw bounding box rectangle
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 1, cv2.LINE_AA)

            # Draw corner brackets (tech UI reticle)
            line_len = max(10, min(25, int(min(w, h) * 0.25)))
            thick = 2

            # Top-Left corner
            cv2.line(frame, (x, y), (x + line_len, y), color, thick)
            cv2.line(frame, (x, y), (x, y + line_len), color, thick)

            # Top-Right corner
            cv2.line(frame, (x + w, y), (x + w - line_len, y), color, thick)
            cv2.line(frame, (x + w, y), (x + w, y + line_len), color, thick)

            # Bottom-Left corner
            cv2.line(frame, (x, y + h), (x + line_len, y + h), color, thick)
            cv2.line(frame, (x, y + h), (x, y + h - line_len), color, thick)

            # Bottom-Right corner
            cv2.line(frame, (x + w, y + h), (x + w - line_len, y + h), color, thick)
            cv2.line(frame, (x + w, y + h), (x + w, y + h - line_len), color, thick)

            # Render Facial Landmarks (Eyes, Nose, Mouth) if detected by YuNet
            if landmarks:
                re = landmarks.get("right_eye")
                le = landmarks.get("left_eye")
                nose = landmarks.get("nose")
                rm = landmarks.get("right_mouth")
                lm = landmarks.get("left_mouth")

                # Eye landmarks
                if re: cv2.circle(frame, re, 3, (0, 255, 255), -1)
                if le: cv2.circle(frame, le, 3, (0, 255, 255), -1)
                if re and le: cv2.line(frame, re, le, (0, 255, 255), 1, cv2.LINE_AA)

                # Nose landmark
                if nose: cv2.circle(frame, nose, 3, (0, 230, 118), -1)

                # Mouth landmarks
                if rm: cv2.circle(frame, rm, 2, (255, 171, 0), -1)
                if lm: cv2.circle(frame, lm, 2, (255, 171, 0), -1)
                if rm and lm: cv2.line(frame, rm, lm, (255, 171, 0), 1, cv2.LINE_AA)
            else:
                # Center Crosshair fallback
                cv2.circle(frame, (cx, cy), 3, color, -1)
                cv2.line(frame, (cx - 6, cy), (cx + 6, cy), color, 1)
                cv2.line(frame, (cx, cy - 6), (cx, cy + 6), color, 1)

            # Tag Label Background Header
            tag_text = f"{label} | {confidence}% | {proximity}"
            (text_w, text_h), baseline = cv2.getTextSize(tag_text, cv2.FONT_HERSHEY_SIMPLEX, 0.42, 1)
            
            tag_y = max(y - 8, text_h + 10)
            cv2.rectangle(frame, (x, tag_y - text_h - 6), (x + text_w + 10, tag_y + 4), (10, 15, 26), -1)
            cv2.rectangle(frame, (x, tag_y - text_h - 6), (x + text_w + 10, tag_y + 4), color, 1)
            
            cv2.putText(frame, tag_text, (x + 5, tag_y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1, cv2.LINE_AA)

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

        return HUDRenderer.draw_hud(frame, camera_code, pts_ms, is_live=False, face_analysis_active=False)
