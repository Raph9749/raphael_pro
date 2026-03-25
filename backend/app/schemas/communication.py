from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    content: str
    target_audience: str = "all"
    target_class_id: Optional[UUID] = None
    target_program_id: Optional[UUID] = None
    priority: str = "normal"
    is_published: bool = True
    expires_at: Optional[datetime] = None
    attachment_url: Optional[str] = None


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    target_audience: Optional[str] = None
    target_class_id: Optional[UUID] = None
    target_program_id: Optional[UUID] = None
    priority: Optional[str] = None
    is_published: Optional[bool] = None
    expires_at: Optional[datetime] = None
    attachment_url: Optional[str] = None


class AnnouncementResponse(BaseModel):
    id: UUID
    title: str
    content: str
    author_id: UUID
    target_audience: str
    target_class_id: Optional[UUID] = None
    target_program_id: Optional[UUID] = None
    priority: str
    is_published: bool
    published_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    attachment_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    recipient_id: UUID
    subject: Optional[str] = None
    content: str
    parent_id: Optional[UUID] = None
    attachment_url: Optional[str] = None


class MessageResponse(BaseModel):
    id: UUID
    sender_id: UUID
    recipient_id: UUID
    subject: Optional[str] = None
    content: str
    is_read: bool
    read_at: Optional[datetime] = None
    parent_id: Optional[UUID] = None
    attachment_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    notification_type: str
    link: Optional[str] = None
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
