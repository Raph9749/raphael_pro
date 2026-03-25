from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.internship import Company, Internship, InternshipEvaluation
from app.schemas.internship import (
    CompanyCreate, CompanyUpdate, CompanyResponse,
    InternshipCreate, InternshipUpdate, InternshipResponse,
    InternshipEvaluationCreate, InternshipEvaluationResponse,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


# Companies
@router.get("/companies", response_model=PaginatedResponse[CompanyResponse])
async def list_companies(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    industry: Optional[str] = None,
    is_partner: Optional[bool] = None,
    sort_by: str = "name",
    sort_order: str = "asc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List companies."""
    query = db.query(Company).filter(Company.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(Company.name.ilike(search_filter), Company.city.ilike(search_filter))
        )
    if industry:
        query = query.filter(Company.industry == industry)
    if is_partner is not None:
        query = query.filter(Company.is_partner == is_partner)

    result = paginate(query, page, page_size, sort_by, sort_order, Company)
    return result


@router.post("/companies", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new company."""
    company = Company(**company_data.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


@router.get("/companies/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a company by ID."""
    company = db.query(Company).filter(
        Company.id == company_id, Company.is_deleted == False
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise introuvable")
    return company


@router.put("/companies/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: UUID,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a company."""
    company = db.query(Company).filter(
        Company.id == company_id, Company.is_deleted == False
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise introuvable")

    update_data = company_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)
    return company


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a company."""
    company = db.query(Company).filter(
        Company.id == company_id, Company.is_deleted == False
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise introuvable")

    company.is_deleted = True
    company.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Entreprise supprimée avec succès", "success": True}


# Internships
@router.get("/", response_model=PaginatedResponse[InternshipResponse])
async def list_internships(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    student_id: Optional[UUID] = None,
    company_id: Optional[UUID] = None,
    internship_status: Optional[str] = Query(None, alias="status"),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List internships."""
    query = db.query(Internship).filter(Internship.is_deleted == False)

    if student_id:
        query = query.filter(Internship.student_id == student_id)
    if company_id:
        query = query.filter(Internship.company_id == company_id)
    if internship_status:
        query = query.filter(Internship.status == internship_status)

    result = paginate(query, page, page_size, sort_by, sort_order, Internship)
    return result


@router.post("/", response_model=InternshipResponse, status_code=status.HTTP_201_CREATED)
async def create_internship(
    internship_data: InternshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new internship."""
    internship = Internship(**internship_data.model_dump())
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship


@router.get("/{internship_id}", response_model=InternshipResponse)
async def get_internship(
    internship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an internship by ID."""
    internship = db.query(Internship).filter(
        Internship.id == internship_id, Internship.is_deleted == False
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Stage introuvable")
    return internship


@router.put("/{internship_id}", response_model=InternshipResponse)
async def update_internship(
    internship_id: UUID,
    internship_data: InternshipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an internship."""
    internship = db.query(Internship).filter(
        Internship.id == internship_id, Internship.is_deleted == False
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Stage introuvable")

    update_data = internship_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)
    return internship


@router.delete("/{internship_id}")
async def delete_internship(
    internship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete an internship."""
    internship = db.query(Internship).filter(
        Internship.id == internship_id, Internship.is_deleted == False
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Stage introuvable")

    internship.is_deleted = True
    internship.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Stage supprimé avec succès", "success": True}


# Evaluations
@router.get("/{internship_id}/evaluations", response_model=list[InternshipEvaluationResponse])
async def list_evaluations(
    internship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List evaluations for an internship."""
    evaluations = db.query(InternshipEvaluation).filter(
        InternshipEvaluation.internship_id == internship_id
    ).order_by(InternshipEvaluation.evaluation_date).all()
    return evaluations


@router.post("/evaluations", response_model=InternshipEvaluationResponse, status_code=status.HTTP_201_CREATED)
async def create_evaluation(
    evaluation_data: InternshipEvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create an internship evaluation."""
    internship = db.query(Internship).filter(
        Internship.id == evaluation_data.internship_id, Internship.is_deleted == False
    ).first()
    if not internship:
        raise HTTPException(status_code=400, detail="Stage introuvable")

    evaluation = InternshipEvaluation(**evaluation_data.model_dump())
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation
