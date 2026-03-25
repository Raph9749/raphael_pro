from datetime import date, datetime, time
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class AttendanceSessionCreate(BaseModel):
    schedule_event_id: Optional[UUID] = None
    class_group_id: UUID
    teacher_id: Optional[UUID] = None
    session_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    notes: Optional[str] = None


class AttendanceSessionUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AttendanceSessionResponse(BaseModel):
    id: UUID
    schedule_event_id: Optional[UUID] = None
    class_group_id: UUID
    teacher_id: Optional[UUID] = None
    session_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AttendanceRecordCreate(BaseModel):
    session_id: UUID
    student_id: UUID
    status: str  # present, absent, late, excused
    check_in_time: Optional[time] = None
    justification: Optional[str] = None
    justified: bool = False


class AttendanceRecordUpdate(BaseModel):
    status: Optional[str] = None
    check_in_time: Optional[time] = None
    justification: Optional[str] = None
    justified: Optional[bool] = None


class AttendanceRecordResponse(BaseModel):
    id: UUID
    session_id: UUID
    student_id: UUID
    status: str
    check_in_time: Optional[time] = None
    justification: Optional[str] = None
    justified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BulkAttendanceRecord(BaseModel):
    student_id: UUID
    status: str
    check_in_time: Optional[time] = None
    justification: Optional[str] = None
    justified: bool = False


class BulkAttendanceCreate(BaseModel):
    session_id: UUID
    records: List[BulkAttendanceRecord]
