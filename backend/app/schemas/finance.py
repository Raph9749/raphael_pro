from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class InvoiceCreate(BaseModel):
    student_id: UUID
    description: str
    amount: float
    tax_amount: float = 0.0
    total_amount: float
    currency: str = "EUR"
    issue_date: date
    due_date: date
    academic_year: Optional[str] = None
    semester: Optional[str] = None
    invoice_type: str = "tuition"
    notes: Optional[str] = None


class InvoiceUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    tax_amount: Optional[float] = None
    total_amount: Optional[float] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: UUID
    invoice_number: str
    student_id: UUID
    description: str
    amount: float
    tax_amount: float
    total_amount: float
    paid_amount: float
    currency: str
    status: str
    issue_date: date
    due_date: date
    paid_date: Optional[date] = None
    academic_year: Optional[str] = None
    semester: Optional[str] = None
    invoice_type: str
    notes: Optional[str] = None
    payments: List["PaymentResponse"] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaymentCreate(BaseModel):
    invoice_id: UUID
    amount: float
    payment_method: str  # virement, carte, cheque, especes, prelevement
    payment_date: date
    reference: Optional[str] = None
    notes: Optional[str] = None


class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    payment_date: Optional[date] = None
    reference: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class PaymentResponse(BaseModel):
    id: UUID
    payment_number: str
    invoice_id: UUID
    amount: float
    currency: str
    payment_method: str
    payment_date: date
    reference: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class FinanceDashboard(BaseModel):
    total_invoiced: float
    total_paid: float
    total_outstanding: float
    total_overdue: float
    collection_rate: float
    invoices_by_status: dict
    recent_payments: List[PaymentResponse]


InvoiceResponse.model_rebuild()
