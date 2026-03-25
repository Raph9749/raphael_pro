from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.admission import Candidate
from app.schemas.admission import (
    CandidateCreate, CandidateUpdate, CandidateResponse, CandidateStatusUpdate,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


def _generate_candidate_number(db: Session) -> str:
    year = datetime.now().year
    last = db.query(Candidate).filter(
        Candidate.candidate_number.like(f"CAND-{year}-%")
    ).order_by(Candidate.candidate_number.desc()).first()
    if last:
        num = int(last.candidate_number.split("-")[-1]) + 1
    else:
        num = 1
    return f"CAND-{year}-{num:04d}"


VALID_STATUS_TRANSITIONS = {
    "submitted": ["under_review", "withdrawn"],
    "under_review": ["interview_scheduled", "rejected", "withdrawn"],
    "interview_scheduled": ["interview_completed", "withdrawn"],
    "interview_completed": ["accepted", "rejected", "waitlisted"],
    "accepted": ["enrolled", "withdrawn"],
    "waitlisted": ["accepted", "rejected", "withdrawn"],
    "rejected": [],
    "enrolled": [],
    "withdrawn": [],
}


@router.get("/", response_model=PaginatedResponse[CandidateResponse])
async def list_candidates(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    candidate_status: Optional[str] = Query(None, alias="status"),
    program_id: Optional[UUID] = None,
    source: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List candidates with filtering."""
    query = db.query(Candidate).filter(Candidate.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Candidate.first_name.ilike(search_filter),
                Candidate.last_name.ilike(search_filter),
                Candidate.email.ilike(search_filter),
                Candidate.candidate_number.ilike(search_filter),
            )
        )
    if candidate_status:
        query = query.filter(Candidate.status == candidate_status)
    if program_id:
        query = query.filter(Candidate.program_id == program_id)
    if source:
        query = query.filter(Candidate.source == source)

    result = paginate(query, page, page_size, sort_by, sort_order, Candidate)
    return result


@router.post("/", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def create_candidate(
    candidate_data: CandidateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new candidate."""
    candidate = Candidate(
        candidate_number=_generate_candidate_number(db),
        **candidate_data.model_dump(),
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/kanban")
async def get_kanban_view(
    program_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get candidates organized by status for kanban board."""
    query = db.query(Candidate).filter(Candidate.is_deleted == False)
    if program_id:
        query = query.filter(Candidate.program_id == program_id)

    candidates = query.order_by(Candidate.created_at.desc()).all()

    kanban = {
        "submitted": [],
        "under_review": [],
        "interview_scheduled": [],
        "interview_completed": [],
        "accepted": [],
        "waitlisted": [],
        "rejected": [],
        "enrolled": [],
        "withdrawn": [],
    }

    for c in candidates:
        entry = {
            "id": str(c.id),
            "candidate_number": c.candidate_number,
            "first_name": c.first_name,
            "last_name": c.last_name,
            "email": c.email,
            "program_id": str(c.program_id) if c.program_id else None,
            "application_date": str(c.application_date),
            "source": c.source,
            "gpa": c.gpa,
            "interview_score": c.interview_score,
        }
        if c.status in kanban:
            kanban[c.status].append(entry)

    return kanban


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a candidate by ID."""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id, Candidate.is_deleted == False
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat introuvable")
    return candidate


@router.put("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: UUID,
    candidate_data: CandidateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a candidate."""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id, Candidate.is_deleted == False
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat introuvable")

    update_data = candidate_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(candidate, field, value)

    db.commit()
    db.refresh(candidate)
    return candidate


@router.put("/{candidate_id}/status", response_model=CandidateResponse)
async def update_candidate_status(
    candidate_id: UUID,
    status_data: CandidateStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update candidate status with transition validation."""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id, Candidate.is_deleted == False
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat introuvable")

    allowed = VALID_STATUS_TRANSITIONS.get(candidate.status, [])
    if status_data.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Transition de '{candidate.status}' vers '{status_data.status}' non autorisée. Transitions possibles: {allowed}",
        )

    candidate.status = status_data.status
    candidate.reviewed_by_id = current_user.id

    if status_data.notes:
        candidate.decision_notes = status_data.notes
    if status_data.interview_date:
        candidate.interview_date = status_data.interview_date
    if status_data.interview_score is not None:
        candidate.interview_score = status_data.interview_score

    if status_data.status in ("accepted", "rejected", "waitlisted"):
        from datetime import date
        candidate.decision_date = date.today()

    db.commit()
    db.refresh(candidate)
    return candidate


@router.delete("/{candidate_id}")
async def delete_candidate(
    candidate_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a candidate."""
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id, Candidate.is_deleted == False
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidat introuvable")

    candidate.is_deleted = True
    candidate.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Candidat supprimé avec succès", "success": True}
