from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/")
async def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    user_id: Optional[UUID] = None,
    action: Optional[str] = None,
    entity_type: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List audit logs with filtering."""
    query = db.query(AuditLog)

    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    if action:
        query = query.filter(AuditLog.action == action)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
    if start_date:
        query = query.filter(AuditLog.created_at >= start_date)
    if end_date:
        from datetime import datetime, time
        end_dt = datetime.combine(end_date, time.max)
        query = query.filter(AuditLog.created_at <= end_dt)

    result = paginate(query, page, page_size, sort_by, sort_order, AuditLog)

    # Transform items
    items = []
    for log in result["items"]:
        items.append({
            "id": str(log.id),
            "user_id": str(log.user_id) if log.user_id else None,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "details": log.details,
            "ip_address": log.ip_address,
            "user_agent": log.user_agent,
            "created_at": str(log.created_at),
        })

    return {
        "items": items,
        "total": result["total"],
        "page": result["page"],
        "page_size": result["page_size"],
        "total_pages": result["total_pages"],
        "has_next": result["has_next"],
        "has_previous": result["has_previous"],
    }


@router.get("/actions")
async def list_audit_actions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List distinct audit actions."""
    actions = db.query(AuditLog.action).distinct().all()
    return [a[0] for a in actions]


@router.get("/entity-types")
async def list_entity_types(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List distinct entity types."""
    types = db.query(AuditLog.entity_type).distinct().all()
    return [t[0] for t in types]
