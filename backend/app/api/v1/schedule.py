from datetime import datetime, date, time, timezone
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.schedule import ScheduleEvent, Room
from app.schemas.schedule import (
    ScheduleEventCreate, ScheduleEventUpdate, ScheduleEventResponse,
    RoomCreate, RoomUpdate, RoomResponse,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


def _check_conflicts(
    db: Session,
    event_date: date,
    start_time: time,
    end_time: time,
    room_id: Optional[UUID] = None,
    teacher_id: Optional[UUID] = None,
    class_group_id: Optional[UUID] = None,
    exclude_id: Optional[UUID] = None,
) -> List[dict]:
    """Detect scheduling conflicts for room, teacher, or class group."""
    conflicts = []

    base_query = db.query(ScheduleEvent).filter(
        ScheduleEvent.event_date == event_date,
        ScheduleEvent.is_deleted == False,
        ScheduleEvent.is_cancelled == False,
        ScheduleEvent.start_time < end_time,
        ScheduleEvent.end_time > start_time,
    )
    if exclude_id:
        base_query = base_query.filter(ScheduleEvent.id != exclude_id)

    if room_id:
        room_conflicts = base_query.filter(ScheduleEvent.room_id == room_id).all()
        for c in room_conflicts:
            conflicts.append({
                "type": "room",
                "event_id": str(c.id),
                "title": c.title,
                "time": f"{c.start_time}-{c.end_time}",
            })

    if teacher_id:
        teacher_conflicts = base_query.filter(ScheduleEvent.teacher_id == teacher_id).all()
        for c in teacher_conflicts:
            conflicts.append({
                "type": "teacher",
                "event_id": str(c.id),
                "title": c.title,
                "time": f"{c.start_time}-{c.end_time}",
            })

    if class_group_id:
        class_conflicts = base_query.filter(ScheduleEvent.class_group_id == class_group_id).all()
        for c in class_conflicts:
            conflicts.append({
                "type": "class_group",
                "event_id": str(c.id),
                "title": c.title,
                "time": f"{c.start_time}-{c.end_time}",
            })

    return conflicts


@router.get("/events", response_model=PaginatedResponse[ScheduleEventResponse])
async def list_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    teacher_id: Optional[UUID] = None,
    class_group_id: Optional[UUID] = None,
    room_id: Optional[UUID] = None,
    event_type: Optional[str] = None,
    sort_by: str = "event_date",
    sort_order: str = "asc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List schedule events with filtering."""
    query = db.query(ScheduleEvent).filter(ScheduleEvent.is_deleted == False)

    if start_date:
        query = query.filter(ScheduleEvent.event_date >= start_date)
    if end_date:
        query = query.filter(ScheduleEvent.event_date <= end_date)
    if teacher_id:
        query = query.filter(ScheduleEvent.teacher_id == teacher_id)
    if class_group_id:
        query = query.filter(ScheduleEvent.class_group_id == class_group_id)
    if room_id:
        query = query.filter(ScheduleEvent.room_id == room_id)
    if event_type:
        query = query.filter(ScheduleEvent.event_type == event_type)

    result = paginate(query, page, page_size, sort_by, sort_order, ScheduleEvent)
    return result


@router.post("/events", response_model=ScheduleEventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: ScheduleEventCreate,
    force: bool = Query(False, description="Force creation despite conflicts"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a schedule event with conflict detection."""
    if event_data.start_time >= event_data.end_time:
        raise HTTPException(status_code=400, detail="L'heure de fin doit être après l'heure de début")

    if not force:
        conflicts = _check_conflicts(
            db, event_data.event_date, event_data.start_time, event_data.end_time,
            event_data.room_id, event_data.teacher_id, event_data.class_group_id,
        )
        if conflicts:
            raise HTTPException(
                status_code=409,
                detail={"message": "Conflits d'emploi du temps détectés", "conflicts": conflicts},
            )

    event = ScheduleEvent(**event_data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/events/{event_id}", response_model=ScheduleEventResponse)
async def get_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a schedule event by ID."""
    event = db.query(ScheduleEvent).filter(
        ScheduleEvent.id == event_id, ScheduleEvent.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")
    return event


@router.put("/events/{event_id}", response_model=ScheduleEventResponse)
async def update_event(
    event_id: UUID,
    event_data: ScheduleEventUpdate,
    force: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a schedule event."""
    event = db.query(ScheduleEvent).filter(
        ScheduleEvent.id == event_id, ScheduleEvent.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    update_data = event_data.model_dump(exclude_unset=True)

    # Check conflicts if date/time changed
    new_date = update_data.get("event_date", event.event_date)
    new_start = update_data.get("start_time", event.start_time)
    new_end = update_data.get("end_time", event.end_time)
    new_room = update_data.get("room_id", event.room_id)
    new_teacher = update_data.get("teacher_id", event.teacher_id)
    new_class = update_data.get("class_group_id", event.class_group_id)

    if not force and any(k in update_data for k in ["event_date", "start_time", "end_time", "room_id", "teacher_id", "class_group_id"]):
        conflicts = _check_conflicts(
            db, new_date, new_start, new_end,
            new_room, new_teacher, new_class,
            exclude_id=event_id,
        )
        if conflicts:
            raise HTTPException(
                status_code=409,
                detail={"message": "Conflits d'emploi du temps détectés", "conflicts": conflicts},
            )

    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/events/{event_id}")
async def delete_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a schedule event."""
    event = db.query(ScheduleEvent).filter(
        ScheduleEvent.id == event_id, ScheduleEvent.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    event.is_deleted = True
    event.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Événement supprimé avec succès", "success": True}


@router.post("/events/{event_id}/check-conflicts")
async def check_event_conflicts(
    event_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Check for conflicts with an existing event."""
    event = db.query(ScheduleEvent).filter(
        ScheduleEvent.id == event_id, ScheduleEvent.is_deleted == False
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Événement introuvable")

    conflicts = _check_conflicts(
        db, event.event_date, event.start_time, event.end_time,
        event.room_id, event.teacher_id, event.class_group_id,
        exclude_id=event_id,
    )
    return {"has_conflicts": len(conflicts) > 0, "conflicts": conflicts}


# Room management
@router.get("/rooms", response_model=list[RoomResponse])
async def list_rooms(
    room_type: Optional[str] = None,
    is_available: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all rooms."""
    query = db.query(Room).filter(Room.is_deleted == False)
    if room_type:
        query = query.filter(Room.room_type == room_type)
    if is_available is not None:
        query = query.filter(Room.is_available == is_available)
    return query.order_by(Room.name).all()


@router.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_data: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new room."""
    existing = db.query(Room).filter(Room.code == room_data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Une salle avec ce code existe déjà")

    room = Room(**room_data.model_dump())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.put("/rooms/{room_id}", response_model=RoomResponse)
async def update_room(
    room_id: UUID,
    room_data: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a room."""
    room = db.query(Room).filter(Room.id == room_id, Room.is_deleted == False).first()
    if not room:
        raise HTTPException(status_code=404, detail="Salle introuvable")

    update_data = room_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(room, field, value)

    db.commit()
    db.refresh(room)
    return room


@router.delete("/rooms/{room_id}")
async def delete_room(
    room_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a room."""
    room = db.query(Room).filter(Room.id == room_id, Room.is_deleted == False).first()
    if not room:
        raise HTTPException(status_code=404, detail="Salle introuvable")

    room.is_deleted = True
    room.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Salle supprimée avec succès", "success": True}
