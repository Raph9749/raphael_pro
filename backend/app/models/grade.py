import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Exam(Base):
    __tablename__ = "exams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    course_module_id = Column(UUID(as_uuid=True), ForeignKey("course_modules.id"), nullable=False)
    semester_id = Column(UUID(as_uuid=True), ForeignKey("semesters.id"), nullable=True)
    exam_type = Column(String(50), nullable=False)  # partiel, final, controle_continu, projet, oral
    exam_date = Column(Date, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    max_score = Column(Float, default=20.0, nullable=False)  # French grading: /20
    coefficient = Column(Float, default=1.0, nullable=False)
    description = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    course_module = relationship("CourseModule", back_populates="exams")
    semester = relationship("Semester", back_populates="exams")
    grades = relationship("Grade", back_populates="exam")


class Grade(Base):
    __tablename__ = "grades"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    exam_id = Column(UUID(as_uuid=True), ForeignKey("exams.id"), nullable=False)
    course_module_id = Column(UUID(as_uuid=True), ForeignKey("course_modules.id"), nullable=False)
    score = Column(Float, nullable=True)
    grade_letter = Column(String(5), nullable=True)  # A, B, C, D, F or mention
    remarks = Column(Text, nullable=True)
    is_absent = Column(Boolean, default=False, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    graded_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    graded_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="grades")
    exam = relationship("Exam", back_populates="grades")
    course_module = relationship("CourseModule", back_populates="grades")


class GradeComponent(Base):
    __tablename__ = "grade_components"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_module_id = Column(UUID(as_uuid=True), ForeignKey("course_modules.id"), nullable=False)
    name = Column(String(100), nullable=False)  # e.g., "Contrôle Continu", "Examen Final", "Projet"
    weight = Column(Float, nullable=False)  # Percentage weight, e.g., 0.4 for 40%
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    course_module = relationship("CourseModule", back_populates="grade_components")
