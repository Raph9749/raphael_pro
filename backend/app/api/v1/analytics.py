from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.analytics_service import (
    get_dashboard_stats,
    get_enrollment_trends,
    get_revenue_analytics,
    get_attendance_stats,
    get_academic_performance,
)

router = APIRouter()


@router.get("/dashboard")
async def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get main dashboard KPI statistics."""
    return get_dashboard_stats(db)


@router.get("/enrollment-trends")
async def enrollment_trends(
    months: int = Query(12, ge=1, le=36),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get enrollment trends by month."""
    return get_enrollment_trends(db, months)


@router.get("/revenue")
async def revenue(
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get revenue analytics for a given year."""
    return get_revenue_analytics(db, year)


@router.get("/attendance-stats")
async def attendance_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get attendance statistics."""
    return get_attendance_stats(db)


@router.get("/academic-performance")
async def academic_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get academic performance statistics and grade distributions."""
    return get_academic_performance(db)
