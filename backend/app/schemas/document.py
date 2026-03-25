from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class DocumentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    document_type: str
    student_id: Optional[UUID] = None
    file_name: str
    file_url: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    description: Optional[str] = None
    academic_year: Optional[str] = None
    is_confidential: bool = False


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    document_type: Optional[str] = None
    description: Optional[str] = None
    is_confidential: Optional[bool] = None


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    document_type: str
    student_id: Optional[UUID] = None
    uploaded_by_id: Optional[UUID] = None
    file_name: str
    file_url: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    description: Optional[str] = None
    academic_year: Optional[str] = None
    is_confidential: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
