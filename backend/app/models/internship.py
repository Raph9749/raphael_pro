import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, index=True)
    industry = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    postal_code = Column(String(10), nullable=True)
    country = Column(String(100), default="France", nullable=True)
    website = Column(String(300), nullable=True)
    contact_name = Column(String(150), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    is_partner = Column(Boolean, default=False, nullable=False)
    partnership_start_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    internships = relationship("Internship", back_populates="company")


class Internship(Base):
    __tablename__ = "internships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    department = Column(String(100), nullable=True)
    supervisor_name = Column(String(150), nullable=True)
    supervisor_email = Column(String(255), nullable=True)
    supervisor_phone = Column(String(20), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    duration_weeks = Column(Integer, nullable=True)
    compensation = Column(Float, nullable=True)  # Monthly gratification in EUR
    currency = Column(String(3), default="EUR", nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    # pending, approved, active, completed, terminated, cancelled
    convention_signed = Column(Boolean, default=False, nullable=False)
    convention_url = Column(String(500), nullable=True)
    report_url = Column(String(500), nullable=True)
    final_grade = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="internships")
    company = relationship("Company", back_populates="internships")
    evaluations = relationship("InternshipEvaluation", back_populates="internship", cascade="all, delete-orphan")


class InternshipEvaluation(Base):
    __tablename__ = "internship_evaluations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    internship_id = Column(UUID(as_uuid=True), ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    evaluator_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)
    evaluation_type = Column(String(50), nullable=False)  # mid_term, final, company
    score = Column(Float, nullable=True)  # /20
    comments = Column(Text, nullable=True)
    strengths = Column(Text, nullable=True)
    areas_for_improvement = Column(Text, nullable=True)
    evaluation_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    internship = relationship("Internship", back_populates="evaluations")
    evaluator = relationship("Teacher", back_populates="internship_evaluations")
