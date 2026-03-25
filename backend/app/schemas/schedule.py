from datetime import date, datetime, time
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    code: str = Field(min_length=1, max_length=20)
    building: Optional[str] = None
    floor: Optional[int] = None
    capacity: int = 30
    room_type: str = "classroom"
    equipment: Optional[str] = None


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    building: Optional[str] = None
    floor: Optional[int] = None
    capacity: Optional[int] = None
    room_type: Optional[str] = None
    equipment: Optional[str] = None
    is_available: Optional[bool] = None


class RoomResponse(BaseModel):
    id: UUID
    name: str
    code: str
    building: Optional[str] = None
    floor: Optional[int] = None
    capacity: int
    room_type: str
    equipment: Optional[str] = None
    is_available: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ScheduleEventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    course_module_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    class_group_id: Optional[UUID] = None
    room_id: Optional[UUID] = None
    event_date: date
    start_time: time
    end_time: time
    event_type: str = "course"
    recurrence: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None


class ScheduleEventUpdate(BaseModel):
    title: Optional[str] = None
    course_module_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    class_group_id: Optional[UUID] = None
    room_id: Optional[UUID] = None
    event_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    event_type: Optional[str] = None
    recurrence: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None
    is_cancelled: Optional[bool] = None
    cancellation_reason: Optional[str] = None


class ScheduleEventResponse(BaseModel):
    id: UUID
    title: str
    course_module_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    class_group_id: Optional[UUID] = None
    room_id: Optional[UUID] = None
    event_date: date
    start_time: time
    end_time: time
    event_type: str
    recurrence: Optional[str] = None
    color: Optional[str] = None
    notes: Optional[str] = None
    is_cancelled: bool
    cancellation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
