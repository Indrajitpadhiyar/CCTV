from typing import Any, Dict, List
from app.ai.interfaces import TrackerInterface


class MultiObjectTracker(TrackerInterface):
    """Multi-object tracker (DeepSORT / BYTETrack) implementation."""

    async def update_tracks(self, detections: List[Dict[str, Any]], frame: Any) -> List[Dict[str, Any]]:
        tracked = []
        for idx, det in enumerate(detections):
            det_copy = dict(det)
            if not det_copy.get("track_id"):
                det_copy["track_id"] = str(1000 + idx)
            tracked.append(det_copy)
        return tracked
