import logging
import sys
from app.core.config import settings


def setup_logging() -> logging.Logger:
    """Configures structured application logging."""
    logger = logging.getLogger("sentinel")
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))

    if not logger.handlers:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
        
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger


logger = setup_logging()
