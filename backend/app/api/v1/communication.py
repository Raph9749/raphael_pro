from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.communication import Announcement, Message, Notification
from app.schemas.communication import (
    AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse,
    MessageCreate, MessageResponse,
    NotificationResponse,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


# Announcements
@router.get("/announcements", response_model=PaginatedResponse[AnnouncementResponse])
async def list_announcements(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    target_audience: Optional[str] = None,
    priority: Optional[str] = None,
    is_published: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List announcements."""
    query = db.query(Announcement).filter(Announcement.is_deleted == False)

    if target_audience:
        query = query.filter(Announcement.target_audience == target_audience)
    if priority:
        query = query.filter(Announcement.priority == priority)
    if is_published is not None:
        query = query.filter(Announcement.is_published == is_published)

    result = paginate(query, page, page_size, sort_by, sort_order, Announcement)
    return result


@router.post("/announcements", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
async def create_announcement(
    announcement_data: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new announcement."""
    announcement = Announcement(
        author_id=current_user.id,
        published_at=datetime.now(timezone.utc) if announcement_data.is_published else None,
        **announcement_data.model_dump(),
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


@router.get("/announcements/{announcement_id}", response_model=AnnouncementResponse)
async def get_announcement(
    announcement_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an announcement by ID."""
    announcement = db.query(Announcement).filter(
        Announcement.id == announcement_id, Announcement.is_deleted == False
    ).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    return announcement


@router.put("/announcements/{announcement_id}", response_model=AnnouncementResponse)
async def update_announcement(
    announcement_id: UUID,
    announcement_data: AnnouncementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an announcement."""
    announcement = db.query(Announcement).filter(
        Announcement.id == announcement_id, Announcement.is_deleted == False
    ).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Annonce introuvable")

    update_data = announcement_data.model_dump(exclude_unset=True)
    if "is_published" in update_data and update_data["is_published"] and not announcement.published_at:
        announcement.published_at = datetime.now(timezone.utc)

    for field, value in update_data.items():
        setattr(announcement, field, value)

    db.commit()
    db.refresh(announcement)
    return announcement


@router.delete("/announcements/{announcement_id}")
async def delete_announcement(
    announcement_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete an announcement."""
    announcement = db.query(Announcement).filter(
        Announcement.id == announcement_id, Announcement.is_deleted == False
    ).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Annonce introuvable")

    announcement.is_deleted = True
    announcement.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Annonce supprimée avec succès", "success": True}


# Messages
@router.get("/messages", response_model=PaginatedResponse[MessageResponse])
async def list_messages(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    folder: str = Query("inbox", pattern="^(inbox|sent)$"),
    is_read: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List messages for current user (inbox or sent)."""
    query = db.query(Message).filter(Message.is_deleted == False)

    if folder == "inbox":
        query = query.filter(Message.recipient_id == current_user.id)
    else:
        query = query.filter(Message.sender_id == current_user.id)

    if is_read is not None:
        query = query.filter(Message.is_read == is_read)

    result = paginate(query, page, page_size, sort_by, sort_order, Message)
    return result


@router.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send a new message."""
    recipient = db.query(User).filter(
        User.id == message_data.recipient_id, User.is_active == True
    ).first()
    if not recipient:
        raise HTTPException(status_code=400, detail="Destinataire introuvable")

    message = Message(
        sender_id=current_user.id,
        **message_data.model_dump(),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/messages/{message_id}", response_model=MessageResponse)
async def get_message(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a message by ID and mark as read if recipient."""
    message = db.query(Message).filter(
        Message.id == message_id, Message.is_deleted == False
    ).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message introuvable")

    if message.sender_id != current_user.id and message.recipient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")

    # Mark as read if recipient
    if message.recipient_id == current_user.id and not message.is_read:
        message.is_read = True
        message.read_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(message)

    return message


@router.put("/messages/{message_id}/read")
async def mark_message_read(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a message as read."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.recipient_id == current_user.id,
    ).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message introuvable")

    message.is_read = True
    message.read_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Message marqué comme lu", "success": True}


# Notifications
@router.get("/notifications", response_model=PaginatedResponse[NotificationResponse])
async def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_read: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List notifications for current user."""
    query = db.query(Notification).filter(Notification.user_id == current_user.id)

    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)

    result = paginate(query, page, page_size, "created_at", "desc", Notification)
    return result


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a notification as read."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification introuvable")

    notification.is_read = True
    notification.read_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Notification marquée comme lue", "success": True}


@router.put("/notifications/read-all")
async def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all notifications as read for current user."""
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True, "read_at": datetime.now(timezone.utc)})
    db.commit()
    return {"message": "Toutes les notifications marquées comme lues", "success": True}
