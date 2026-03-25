import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, Text, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, index=True)
    code = Column(String(20), unique=True, nullable=False)
    building = Column(String(100), nullable=True)
    floor = Column(Integer, nullable=True)
    capacity = Column(Integer, nullable=False, default=30)
    room_type = Column(String(50), nullable=False, default="classroom")  # classroom, lab, amphitheater, meeting_room
    equipment = Column(Text, nullable=True)  # JSON list of equipment
    is_available = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    schedule_events = relationship("ScheduleEvent", back_populates="room")


class ScheduleEvent(Base):
    __tablename__ = "schedule_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    course_module_id = Column(UUID(as_uuid=True), ForeignKey("course_modules.id"), nullable=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)
    class_group_id = Column(UUID(as_uuid=True), ForeignKey("class_groups.id"), nullable=True)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=True)
    event_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    event_type = Column(String(50), default="course", nullable=False)  # course, tutorial, exam, other
    recurrence = Column(String(50), nullable=True)  # weekly, biweekly, monthly, none
    color = Column(String(7), nullable=True)  # Hex color code
    notes = Column(Text, nullable=True)
    is_cancelled = Column(Boolean, default=False, nullable=False)
    cancellation_reason = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    course_module = relationship("CourseModule", back_populates="schedule_events")
    teacher = relationship("Teacher", back_populates="schedule_events")
    class_group = relationship("ClassGroup", back_populates="schedule_events")
    room = relationship("Room", back_populates="schedule_events")
    attendance_sessions = relationship("AttendanceSession", back_populates="schedule_event")
