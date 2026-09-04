from enum import Enum


class EventType(str, Enum):
    CAMERA_STATUS = "camera.status"
    CAMERA_OFFLINE = "camera.offline"
    DETECTION_CREATED = "detection.created"
    VEHICLE_DETECTED = "vehicle.detected"
    ANPR_DETECTED = "anpr.detected"
    TRACKING_UPDATED = "tracking.updated"
    ALERT_CREATED = "alert.created"
    ALERT_UPDATED = "alert.updated"
