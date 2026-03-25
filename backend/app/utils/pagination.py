import math
from typing import Any, Generic, List, Optional, Type, TypeVar

from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Query, Session

from app.schemas.common import PaginatedResponse


def paginate(
    query: Query,
    page: int = 1,
    page_size: int = 20,
    sort_by: Optional[str] = None,
    sort_order: str = "desc",
    model: Optional[Any] = None,
) -> dict:
    """Apply pagination, sorting to a SQLAlchemy query and return a PaginatedResponse-compatible dict."""
    # Apply sorting
    if sort_by and model and hasattr(model, sort_by):
        column = getattr(model, sort_by)
        if sort_order == "asc":
            query = query.order_by(asc(column))
        else:
            query = query.order_by(desc(column))

    # Count total
    total = query.count()
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0

    # Apply pagination
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }
