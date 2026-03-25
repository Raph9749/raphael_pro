import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    degree_level = Column(String(50), nullable=False)  # Licence, Master, MBA, etc.
    duration_years = Column(Integer, nullable=False, default=3)
    total_credits = Column(Integer, nullable=True)
    tuition_fee = Column(Float, nullable=True)  # Annual fee in EUR
    is_active = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    students = relationship("Student", back_populates="program")
    class_groups = relationship("ClassGroup", back_populates="program")
    course_modules = relationship("CourseModule", back_populates="program")
    candidates = relationship("Candidate", back_populates="program")


class AcademicYear(Base):
    __tablename__ = "academic_years"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)  # e.g., "2024-2025"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_current = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    semesters = relationship("Semester", back_populates="academic_year")


class Semester(Base):
    __tablename__ = "semesters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    academic_year_id = Column(UUID(as_uuid=True), ForeignKey("academic_years.id"), nullable=False)
    name = Column(String(50), nullable=False)  # e.g., "Semestre 1"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_current = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    academic_year = relationship("AcademicYear", back_populates="semesters")
    exams = relationship("Exam", back_populates="semester")


class CourseModule(Base):
    __tablename__ = "course_modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)
    credits = Column(Integer, default=3, nullable=False)
    hours_total = Column(Integer, nullable=True)
    hours_lecture = Column(Integer, nullable=True)
    hours_tutorial = Column(Integer, nullable=True)
    semester_number = Column(Integer, nullable=True)  # Which semester of the program
    year_of_study = Column(Integer, nullable=True)
    coefficient = Column(Float, default=1.0, nullable=False)
    is_mandatory = Column(Boolean, default=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    program = relationship("Program", back_populates="course_modules")
    teacher = relationship("Teacher", back_populates="course_modules")
    enrollments = relationship("Enrollment", back_populates="course_module")
    schedule_events = relationship("ScheduleEvent", back_populates="course_module")
    exams = relationship("Exam", back_populates="course_module")
    grades = relationship("Grade", back_populates="course_module")
    grade_components = relationship("GradeComponent", back_populates="course_module")


class ClassGroup(Base):
    __tablename__ = "class_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, index=True)  # e.g., "BBA1-A"
    code = Column(String(20), unique=True, nullable=False)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=False)
    year_of_study = Column(Integer, nullable=False, default=1)
    max_students = Column(Integer, default=35, nullable=False)
    academic_year = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    program = relationship("Program", back_populates="class_groups")
    students = relationship("Student", back_populates="class_group")
    schedule_events = relationship("ScheduleEvent", back_populates="class_group")
    attendance_sessions = relationship("AttendanceSession", back_populates="class_group")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    course_module_id = Column(UUID(as_uuid=True), ForeignKey("course_modules.id"), nullable=False)
    academic_year = Column(String(20), nullable=True)
    status = Column(String(20), default="enrolled", nullable=False)  # enrolled, completed, failed, withdrawn
    enrolled_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    final_grade = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="enrollments")
    course_module = relationship("CourseModule", back_populates="enrollments")
