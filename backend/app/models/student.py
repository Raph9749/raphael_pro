import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, ForeignKey, String, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String(20), unique=True, nullable=False, index=True)  # e.g., STU-2024-0001
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=True)
    class_group_id = Column(UUID(as_uuid=True), ForeignKey("class_groups.id"), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)  # M, F, Autre
    nationality = Column(String(100), default="Française", nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    postal_code = Column(String(10), nullable=True)
    country = Column(String(100), default="France", nullable=True)
    admission_date = Column(Date, nullable=True)
    graduation_date = Column(Date, nullable=True)
    status = Column(String(20), default="active", nullable=False)  # active, graduated, suspended, withdrawn
    year_of_study = Column(Integer, default=1, nullable=False)
    scholarship_holder = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="student")
    program = relationship("Program", back_populates="students")
    class_group = relationship("ClassGroup", back_populates="students")
    guardians = relationship("Guardian", back_populates="student", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="student")
    attendance_records = relationship("AttendanceRecord", back_populates="student")
    grades = relationship("Grade", back_populates="student")
    invoices = relationship("Invoice", back_populates="student")
    internships = relationship("Internship", back_populates="student")
    documents = relationship("Document", back_populates="student")
    scholarships = relationship("Scholarship", back_populates="student")


class Guardian(Base):
    __tablename__ = "guardians"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    relationship_type = Column(String(50), nullable=False)  # Père, Mère, Tuteur, Autre
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="guardians")
