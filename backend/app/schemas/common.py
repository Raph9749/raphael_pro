from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


class FilterParams(BaseModel):
    search: Optional[str] = None
    status: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"  # asc or desc
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


class SortParams(BaseModel):
    sort_by: str = "created_at"
    sort_order: str = "desc"


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None


class BulkDeleteRequest(BaseModel):
    ids: List[str]


class BulkActionResponse(BaseModel):
    success_count: int
    failure_count: int
    errors: List[str] = []
