from typing import Any, Dict, Optional
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse


class SentinelException(HTTPException):
    """Base exception for Sentinel AI CCTV Platform."""
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: str = "BAD_REQUEST",
        message: str = "An error occurred",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details


class NotFoundException(SentinelException):
    def __init__(self, resource: str = "Resource", identifier: Any = None):
        msg = f"{resource} with identifier '{identifier}' was not found" if identifier else f"{resource} not found"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="RESOURCE_NOT_FOUND",
            message=msg
        )


class UnauthorizedException(SentinelException):
    def __init__(self, message: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            message=message
        )


class ForbiddenException(SentinelException):
    def __init__(self, message: str = "Insufficient permissions to perform this action"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            message=message
        )


class ConflictException(SentinelException):
    def __init__(self, message: str = "Resource conflict occurred"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            code="CONFLICT",
            message=message
        )


class InternalServerErrorException(SentinelException):
    def __init__(self, message: str = "Internal server error"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            code="INTERNAL_SERVER_ERROR",
            message=message
        )


def format_error_response(code: str, message: str, details: Optional[Dict[str, Any]] = None) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message,
                "details": details or {}
            }
        }
    )
