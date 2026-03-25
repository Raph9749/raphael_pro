import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_number = Column(String(20), unique=True, nullable=False, index=True)  # e.g., CAND-2024-0001
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)
    nationality = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    postal_code = Column(String(10), nullable=True)
    country = Column(String(100), default="France", nullable=True)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=True)
    desired_entry_year = Column(Integer, nullable=True)
    previous_education = Column(Text, nullable=True)
    previous_institution = Column(String(200), nullable=True)
    gpa = Column(Float, nullable=True)
    motivation_letter = Column(Text, nullable=True)
    status = Column(String(30), default="submitted", nullable=False)
    # submitted, under_review, interview_scheduled, interview_completed, accepted, rejected, waitlisted, enrolled, withdrawn
    interview_date = Column(DateTime(timezone=True), nullable=True)
    interview_notes = Column(Text, nullable=True)
    interview_score = Column(Float, nullable=True)
    decision_date = Column(Date, nullable=True)
    decision_notes = Column(Text, nullable=True)
    reviewed_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    converted_student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True, unique=True)
    application_date = Column(Date, nullable=False)
    source = Column(String(100), nullable=True)  # website, referral, salon, etc.
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    program = relationship("Program", back_populates="candidates")
    documents = relationship("CandidateDocument", back_populates="candidate", cascade="all, delete-orphan")


class CandidateDocument(Base):
    __tablename__ = "candidate_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(50), nullable=False)  # cv, transcript, diploma, id_card, motivation_letter, other
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)  # bytes
    mime_type = Column(String(100), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    candidate = relationship("Candidate", back_populates="documents")
