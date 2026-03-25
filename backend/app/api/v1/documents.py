from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[DocumentResponse])
async def list_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    student_id: Optional[UUID] = None,
    document_type: Optional[str] = None,
    academic_year: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List documents with filtering."""
    query = db.query(Document).filter(Document.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(Document.title.ilike(search_filter), Document.file_name.ilike(search_filter))
        )
    if student_id:
        query = query.filter(Document.student_id == student_id)
    if document_type:
        query = query.filter(Document.document_type == document_type)
    if academic_year:
        query = query.filter(Document.academic_year == academic_year)

    result = paginate(query, page, page_size, sort_by, sort_order, Document)
    return result


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a document record (file upload handled separately)."""
    document = Document(
        uploaded_by_id=current_user.id,
        **document_data.model_dump(),
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a document by ID."""
    document = db.query(Document).filter(
        Document.id == document_id, Document.is_deleted == False
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document introuvable")
    return document


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: UUID,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a document."""
    document = db.query(Document).filter(
        Document.id == document_id, Document.is_deleted == False
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document introuvable")

    update_data = document_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)

    db.commit()
    db.refresh(document)
    return document


@router.delete("/{document_id}")
async def delete_document(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a document."""
    document = db.query(Document).filter(
        Document.id == document_id, Document.is_deleted == False
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document introuvable")

    document.is_deleted = True
    document.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Document supprimé avec succès", "success": True}
