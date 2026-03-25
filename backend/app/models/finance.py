import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_number = Column(String(30), unique=True, nullable=False, index=True)  # e.g., FAC-2024-0001
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Float, nullable=False)  # EUR
    tax_amount = Column(Float, default=0.0, nullable=False)
    total_amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0.0, nullable=False)
    currency = Column(String(3), default="EUR", nullable=False)
    status = Column(String(20), default="pending", nullable=False)  # pending, partial, paid, overdue, cancelled
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date, nullable=True)
    academic_year = Column(String(20), nullable=True)
    semester = Column(String(20), nullable=True)
    invoice_type = Column(String(50), default="tuition", nullable=False)  # tuition, registration, other
    notes = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    payment_number = Column(String(30), unique=True, nullable=False, index=True)  # e.g., PAY-2024-0001
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="EUR", nullable=False)
    payment_method = Column(String(50), nullable=False)  # virement, carte, cheque, especes, prelevement
    payment_date = Column(Date, nullable=False)
    reference = Column(String(100), nullable=True)  # Bank reference or transaction ID
    notes = Column(Text, nullable=True)
    status = Column(String(20), default="completed", nullable=False)  # completed, pending, failed, refunded
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    invoice = relationship("Invoice", back_populates="payments")


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    name = Column(String(200), nullable=False)
    scholarship_type = Column(String(50), nullable=False)  # merit, need_based, sport, external
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="EUR", nullable=False)
    percentage = Column(Float, nullable=True)  # Percentage of tuition covered
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), default="active", nullable=False)  # active, expired, revoked
    conditions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="scholarships")
