import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, Text, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String(50), nullable=False)
    # conference, workshop, seminar, ceremony, sports, cultural, career_fair, orientation, other
    organizer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    location = Column(String(200), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    max_participants = Column(Integer, nullable=True)
    current_participants = Column(Integer, default=0, nullable=False)
    registration_required = Column(Boolean, default=False, nullable=False)
    registration_deadline = Column(DateTime(timezone=True), nullable=True)
    target_audience = Column(String(50), default="all", nullable=False)  # all, students, teachers, staff
    image_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    is_cancelled = Column(Boolean, default=False, nullable=False)
    cancellation_reason = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
