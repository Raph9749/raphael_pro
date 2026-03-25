from datetime import date, datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, case
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.academic import ClassGroup
from app.models.attendance import AttendanceSession, AttendanceRecord
from app.schemas.attendance import (
    AttendanceSessionCreate, AttendanceSessionUpdate, AttendanceSessionResponse,
    AttendanceRecordCreate, AttendanceRecordUpdate, AttendanceRecordResponse,
    BulkAttendanceCreate,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/sessions", response_model=PaginatedResponse[AttendanceSessionResponse])
async def list_sessions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    class_group_id: Optional[UUID] = None,
    teacher_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    session_status: Optional[str] = Query(None, alias="status"),
    sort_by: str = "session_date",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List attendance sessions."""
    query = db.query(AttendanceSession)
    if class_group_id:
        query = query.filter(AttendanceSession.class_group_id == class_group_id)
    if teacher_id:
        query = query.filter(AttendanceSession.teacher_id == teacher_id)
    if start_date:
        query = query.filter(AttendanceSession.session_date >= start_date)
    if end_date:
        query = query.filter(AttendanceSession.session_date <= end_date)
    if session_status:
        query = query.filter(AttendanceSession.status == session_status)

    result = paginate(query, page, page_size, sort_by, sort_order, AttendanceSession)
    return result


@router.post("/sessions", response_model=AttendanceSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: AttendanceSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new attendance session."""
    class_group = db.query(ClassGroup).filter(
        ClassGroup.id == session_data.class_group_id, ClassGroup.is_deleted == False
    ).first()
    if not class_group:
        raise HTTPException(status_code=400, detail="Classe introuvable")

    session = AttendanceSession(**session_data.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{session_id}", response_model=AttendanceSessionResponse)
async def get_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an attendance session by ID."""
    session = db.query(AttendanceSession).filter(
        AttendanceSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")
    return session


@router.put("/sessions/{session_id}", response_model=AttendanceSessionResponse)
async def update_session(
    session_id: UUID,
    session_data: AttendanceSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an attendance session."""
    session = db.query(AttendanceSession).filter(
        AttendanceSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")

    update_data = session_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{session_id}/records")
async def get_session_records(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all attendance records for a session."""
    session = db.query(AttendanceSession).filter(
        AttendanceSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")

    records = db.query(AttendanceRecord).options(
        joinedload(AttendanceRecord.student).joinedload(Student.user),
    ).filter(
        AttendanceRecord.session_id == session_id
    ).all()

    result = []
    for r in records:
        result.append({
            "id": str(r.id),
            "student_id": str(r.student_id),
            "student_name": f"{r.student.user.first_name} {r.student.user.last_name}" if r.student and r.student.user else "",
            "student_number": r.student.student_id if r.student else "",
            "status": r.status,
            "check_in_time": str(r.check_in_time) if r.check_in_time else None,
            "justification": r.justification,
            "justified": r.justified,
        })
    return result


@router.post("/records", response_model=AttendanceRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_record(
    record_data: AttendanceRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a single attendance record."""
    session = db.query(AttendanceSession).filter(
        AttendanceSession.id == record_data.session_id
    ).first()
    if not session:
        raise HTTPException(status_code=400, detail="Session introuvable")

    student = db.query(Student).filter(
        Student.id == record_data.student_id, Student.is_deleted == False
    ).first()
    if not student:
        raise HTTPException(status_code=400, detail="Étudiant introuvable")

    # Check for existing record
    existing = db.query(AttendanceRecord).filter(
        AttendanceRecord.session_id == record_data.session_id,
        AttendanceRecord.student_id == record_data.student_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un enregistrement existe déjà pour cet étudiant dans cette session")

    record = AttendanceRecord(**record_data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.post("/records/bulk", status_code=status.HTTP_201_CREATED)
async def create_bulk_records(
    bulk_data: BulkAttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create multiple attendance records at once."""
    session = db.query(AttendanceSession).filter(
        AttendanceSession.id == bulk_data.session_id
    ).first()
    if not session:
        raise HTTPException(status_code=400, detail="Session introuvable")

    created = 0
    errors = []
    for record_data in bulk_data.records:
        existing = db.query(AttendanceRecord).filter(
            AttendanceRecord.session_id == bulk_data.session_id,
            AttendanceRecord.student_id == record_data.student_id,
        ).first()
        if existing:
            # Update existing
            existing.status = record_data.status
            existing.check_in_time = record_data.check_in_time
            existing.justification = record_data.justification
            existing.justified = record_data.justified
            created += 1
            continue

        record = AttendanceRecord(
            session_id=bulk_data.session_id,
            student_id=record_data.student_id,
            status=record_data.status,
            check_in_time=record_data.check_in_time,
            justification=record_data.justification,
            justified=record_data.justified,
        )
        db.add(record)
        created += 1

    db.commit()
    return {"message": f"{created} enregistrements créés/mis à jour", "count": created, "errors": errors}


@router.put("/records/{record_id}", response_model=AttendanceRecordResponse)
async def update_record(
    record_id: UUID,
    record_data: AttendanceRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an attendance record."""
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Enregistrement introuvable")

    update_data = record_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.get("/analytics")
async def get_attendance_analytics(
    class_group_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get attendance analytics."""
    query = db.query(AttendanceRecord).join(AttendanceSession)

    if class_group_id:
        query = query.filter(AttendanceSession.class_group_id == class_group_id)
    if start_date:
        query = query.filter(AttendanceSession.session_date >= start_date)
    if end_date:
        query = query.filter(AttendanceSession.session_date <= end_date)

    total = query.count()
    present = query.filter(AttendanceRecord.status == "present").count()
    absent = query.filter(AttendanceRecord.status == "absent").count()
    late = query.filter(AttendanceRecord.status == "late").count()
    excused = query.filter(AttendanceRecord.status == "excused").count()

    return {
        "total_records": total,
        "present": present,
        "absent": absent,
        "late": late,
        "excused": excused,
        "attendance_rate": round((present + late) / total * 100, 1) if total > 0 else 0.0,
        "absence_rate": round(absent / total * 100, 1) if total > 0 else 0.0,
    }
