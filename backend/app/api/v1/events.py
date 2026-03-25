from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[EventResponse])
async def list_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    event_type: Optional[str] = None,
    target_audience: Optional[str] = None,
    is_published: Optional[bool] = None,
    sort_by: str = "start_date",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List events."""
    query = db.query(Event).filter(Event.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(Event.title.ilike(search_filter), Event.description.ilike(search_filter))
        )
    if event_type:
        query = query.filter(Event.event_type == event_type)
    if target_audience:
        query = query.filter(Event.target_audience == target_audience)
    if is_published is not None:
        query = query.filter(Event.is_published == is_published)

    result = paginate(query, page, page_size, sort_by, sort_order, Event)
    return result


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new event."""
    event = Event(
        organizer_id=current_user.id,
        **event_data.model_dump(),
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an event by ID."""
    event = db.query(Event).filter(
        Event.id == event_id, Event.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")
    return event


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: UUID,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an event."""
    event = db.query(Event).filter(
        Event.id == event_id, Event.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    update_data = event_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}")
async def delete_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete an event."""
    event = db.query(Event).filter(
        Event.id == event_id, Event.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    event.is_deleted = True
    event.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Événement supprimé avec succès", "success": True}


@router.post("/{event_id}/register")
async def register_for_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Register current user for an event."""
    event = db.query(Event).filter(
        Event.id == event_id, Event.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    if event.is_cancelled:
        raise HTTPException(status_code=400, detail="Cet événement est annulé")
    if not event.registration_required:
        raise HTTPException(status_code=400, detail="L'inscription n'est pas requise pour cet événement")
    if event.max_participants and event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Le nombre maximum de participants est atteint")

    event.current_participants += 1
    db.commit()
    return {"message": "Inscription réussie", "success": True}
