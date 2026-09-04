import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for adding X-Request-ID header and logging request timing."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id

        start_time = time.time()
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000, 2)

        response.headers["X-Request-ID"] = request_id
        
        logger.info(
            f"req_id={request_id} method={request.method} path={request.url.path} "
            f"status={response.status_code} duration={duration_ms}ms"
        )
        return response
