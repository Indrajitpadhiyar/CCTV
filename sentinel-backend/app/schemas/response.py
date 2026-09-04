from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel

T = TypeVar("T")


class StandardResponse(BaseModel, Generic[T]):
    """Standardized API Response Envelope."""
    success: bool = True
    data: Optional[T] = None
    message: str = "Success"


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized Paginated API Response."""
    items: List[T]
    page: int
    page_size: int
    total: int
    pages: int
