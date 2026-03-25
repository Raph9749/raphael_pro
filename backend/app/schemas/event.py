from datetime import date, datetime, time
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    description: Optional[str] = None
    event_type: str
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    max_participants: Optional[int] = None
    registration_required: bool = False
    registration_deadline: Optional[datetime] = None
    target_audience: str = "all"
    image_url: Optional[str] = None
    is_published: bool = True


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    max_participants: Optional[int] = None
    registration_required: Optional[bool] = None
    registration_deadline: Optional[datetime] = None
    target_audience: Optional[str] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = None
    is_cancelled: Optional[bool] = None
    cancellation_reason: Optional[str] = None


class EventResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    event_type: str
    organizer_id: Optional[UUID] = None
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    max_participants: Optional[int] = None
    current_participants: int
    registration_required: bool
    registration_deadline: Optional[datetime] = None
    target_audience: str
    image_url: Optional[str] = None
    is_published: bool
    is_cancelled: bool
    cancellation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
