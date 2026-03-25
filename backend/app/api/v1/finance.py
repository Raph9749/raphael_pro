from datetime import date, datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.finance import Invoice, Payment
from app.schemas.finance import (
    InvoiceCreate, InvoiceUpdate, InvoiceResponse,
    PaymentCreate, PaymentUpdate, PaymentResponse,
    FinanceDashboard,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


def _generate_invoice_number(db: Session) -> str:
    year = datetime.now().year
    last = db.query(Invoice).filter(
        Invoice.invoice_number.like(f"FAC-{year}-%")
    ).order_by(Invoice.invoice_number.desc()).first()
    if last:
        num = int(last.invoice_number.split("-")[-1]) + 1
    else:
        num = 1
    return f"FAC-{year}-{num:04d}"


def _generate_payment_number(db: Session) -> str:
    year = datetime.now().year
    last = db.query(Payment).filter(
        Payment.payment_number.like(f"PAY-{year}-%")
    ).order_by(Payment.payment_number.desc()).first()
    if last:
        num = int(last.payment_number.split("-")[-1]) + 1
    else:
        num = 1
    return f"PAY-{year}-{num:04d}"


# Invoices
@router.get("/invoices", response_model=PaginatedResponse[InvoiceResponse])
async def list_invoices(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    student_id: Optional[UUID] = None,
    invoice_status: Optional[str] = Query(None, alias="status"),
    invoice_type: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    sort_by: str = "issue_date",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List invoices with filtering."""
    query = db.query(Invoice).options(
        joinedload(Invoice.payments),
    ).filter(Invoice.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Invoice.invoice_number.ilike(search_filter),
                Invoice.description.ilike(search_filter),
            )
        )
    if student_id:
        query = query.filter(Invoice.student_id == student_id)
    if invoice_status:
        query = query.filter(Invoice.status == invoice_status)
    if invoice_type:
        query = query.filter(Invoice.invoice_type == invoice_type)
    if start_date:
        query = query.filter(Invoice.issue_date >= start_date)
    if end_date:
        query = query.filter(Invoice.issue_date <= end_date)

    result = paginate(query, page, page_size, sort_by, sort_order, Invoice)
    return result


@router.post("/invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new invoice."""
    student = db.query(Student).filter(
        Student.id == invoice_data.student_id, Student.is_deleted == False
    ).first()
    if not student:
        raise HTTPException(status_code=400, detail="Étudiant introuvable")

    invoice = Invoice(
        invoice_number=_generate_invoice_number(db),
        **invoice_data.model_dump(),
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an invoice by ID."""
    invoice = db.query(Invoice).options(
        joinedload(Invoice.payments),
    ).filter(Invoice.id == invoice_id, Invoice.is_deleted == False).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Facture introuvable")
    return invoice


@router.put("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: UUID,
    invoice_data: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an invoice."""
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id, Invoice.is_deleted == False
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Facture introuvable")

    update_data = invoice_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(invoice, field, value)

    db.commit()
    db.refresh(invoice)
    return invoice


@router.delete("/invoices/{invoice_id}")
async def delete_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete an invoice."""
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id, Invoice.is_deleted == False
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Facture introuvable")

    invoice.is_deleted = True
    invoice.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Facture supprimée avec succès", "success": True}


# Payments
@router.get("/payments", response_model=PaginatedResponse[PaymentResponse])
async def list_payments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    invoice_id: Optional[UUID] = None,
    payment_method: Optional[str] = None,
    payment_status: Optional[str] = Query(None, alias="status"),
    sort_by: str = "payment_date",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List payments with filtering."""
    query = db.query(Payment)
    if invoice_id:
        query = query.filter(Payment.invoice_id == invoice_id)
    if payment_method:
        query = query.filter(Payment.payment_method == payment_method)
    if payment_status:
        query = query.filter(Payment.status == payment_status)

    result = paginate(query, page, page_size, sort_by, sort_order, Payment)
    return result


@router.post("/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record a payment for an invoice."""
    invoice = db.query(Invoice).filter(
        Invoice.id == payment_data.invoice_id, Invoice.is_deleted == False
    ).first()
    if not invoice:
        raise HTTPException(status_code=400, detail="Facture introuvable")

    if invoice.status in ("paid", "cancelled"):
        raise HTTPException(status_code=400, detail="Cette facture ne peut plus accepter de paiements")

    payment = Payment(
        payment_number=_generate_payment_number(db),
        invoice_id=payment_data.invoice_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        payment_date=payment_data.payment_date,
        reference=payment_data.reference,
        notes=payment_data.notes,
    )
    db.add(payment)

    # Update invoice paid amount and status
    invoice.paid_amount = (invoice.paid_amount or 0) + payment_data.amount
    if invoice.paid_amount >= invoice.total_amount:
        invoice.status = "paid"
        invoice.paid_date = payment_data.payment_date
    else:
        invoice.status = "partial"

    db.commit()
    db.refresh(payment)
    return payment


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a payment by ID."""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Paiement introuvable")
    return payment


# Overdue tracking
@router.get("/overdue")
async def get_overdue_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all overdue invoices."""
    today = date.today()
    overdue = db.query(Invoice).options(
        joinedload(Invoice.student).joinedload(Student.user),
    ).filter(
        Invoice.is_deleted == False,
        Invoice.status.in_(["pending", "partial"]),
        Invoice.due_date < today,
    ).order_by(Invoice.due_date).all()

    # Also update status to overdue
    for inv in overdue:
        if inv.status != "overdue":
            inv.status = "overdue"
    db.commit()

    result = []
    for inv in overdue:
        student_name = ""
        if inv.student and inv.student.user:
            student_name = f"{inv.student.user.first_name} {inv.student.user.last_name}"
        result.append({
            "id": str(inv.id),
            "invoice_number": inv.invoice_number,
            "student_name": student_name,
            "student_id": str(inv.student_id),
            "total_amount": inv.total_amount,
            "paid_amount": inv.paid_amount,
            "outstanding": inv.total_amount - inv.paid_amount,
            "due_date": str(inv.due_date),
            "days_overdue": (today - inv.due_date).days,
        })
    return result


# Financial dashboard
@router.get("/dashboard", response_model=FinanceDashboard)
async def get_financial_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get financial dashboard statistics."""
    total_invoiced = db.query(
        func.coalesce(func.sum(Invoice.total_amount), 0)
    ).filter(Invoice.is_deleted == False).scalar() or 0

    total_paid = db.query(
        func.coalesce(func.sum(Invoice.paid_amount), 0)
    ).filter(Invoice.is_deleted == False).scalar() or 0

    total_outstanding = float(total_invoiced) - float(total_paid)

    today = date.today()
    total_overdue = db.query(
        func.coalesce(func.sum(Invoice.total_amount - Invoice.paid_amount), 0)
    ).filter(
        Invoice.is_deleted == False,
        Invoice.status.in_(["pending", "partial", "overdue"]),
        Invoice.due_date < today,
    ).scalar() or 0

    collection_rate = round(float(total_paid) / float(total_invoiced) * 100, 1) if float(total_invoiced) > 0 else 0.0

    # Invoices by status
    status_counts = db.query(
        Invoice.status, func.count(Invoice.id)
    ).filter(Invoice.is_deleted == False).group_by(Invoice.status).all()
    invoices_by_status = {s: c for s, c in status_counts}

    # Recent payments
    recent = db.query(Payment).filter(
        Payment.status == "completed"
    ).order_by(Payment.payment_date.desc()).limit(10).all()

    return FinanceDashboard(
        total_invoiced=round(float(total_invoiced), 2),
        total_paid=round(float(total_paid), 2),
        total_outstanding=round(total_outstanding, 2),
        total_overdue=round(float(total_overdue), 2),
        collection_rate=collection_rate,
        invoices_by_status=invoices_by_status,
        recent_payments=[PaymentResponse.model_validate(p) for p in recent],
    )
