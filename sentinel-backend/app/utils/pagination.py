from typing import TypeVar, List
from math import ceil
from app.schemas.response import PaginatedResponse

T = TypeVar("T")


def paginate(items: List[T], total: int, page: int, page_size: int) -> PaginatedResponse[T]:
    """Calculate pagination metadata and build PaginatedResponse envelope."""
    pages = ceil(total / page_size) if page_size > 0 else 0
    return PaginatedResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        pages=pages
    )
