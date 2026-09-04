import re


def is_valid_rtsp_url(url: str) -> bool:
    """Validate RTSP URL string format."""
    rtsp_pattern = r"^rtsp://([a-zA-Z0-9_.~%-]+(:[a-zA-Z0-9_.~%-]+)?@)?[a-zA-Z0-9.-]+(:[0-9]+)?(/.*)?$"
    return bool(re.match(rtsp_pattern, url))


def is_valid_license_plate(plate: str) -> bool:
    """Validate license plate string format."""
    clean_plate = re.sub(r"[^A-Za-z0-9]", "", plate)
    return len(clean_plate) >= 4 and len(clean_plate) <= 15
