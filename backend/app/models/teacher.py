import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, String, Text, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(String(20), unique=True, nullable=False, index=True)  # e.g., TCH-2024-001
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    department = Column(String(100), nullable=True)
    specialization = Column(String(200), nullable=True)
    title = Column(String(50), nullable=True)  # Professeur, Maître de conférences, etc.
    hire_date = Column(Date, nullable=True)
    contract_type = Column(String(50), nullable=True)  # CDI, CDD, Vacataire, Intervenant
    hourly_rate = Column(Float, nullable=True)
    bio = Column(Text, nullable=True)
    office_location = Column(String(100), nullable=True)
    status = Column(String(20), default="active", nullable=False)  # active, on_leave, inactive
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="teacher")
    course_modules = relationship("CourseModule", back_populates="teacher")
    schedule_events = relationship("ScheduleEvent", back_populates="teacher")
    attendance_sessions = relationship("AttendanceSession", back_populates="teacher")
    internship_evaluations = relationship("InternshipEvaluation", back_populates="evaluator")
