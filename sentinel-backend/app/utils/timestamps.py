from datetime import datetime, timezone


def utc_now() -> datetime:
    """Returns timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)


def parse_iso_timestamp(timestamp_str: str) -> datetime:
    """Parses ISO timestamp string to timezone-aware UTC datetime."""
    dt = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt
