import csv
import io
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import or_, func
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.core.security import hash_password
from app.models.user import User, Role
from app.models.student import Student, Guardian
from app.models.academic import Program, ClassGroup
from app.models.attendance import AttendanceRecord, AttendanceSession
from app.models.grade import Grade, Exam
from app.models.finance import Invoice
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse, StudentListResponse
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


def _generate_student_id(db: Session) -> str:
    """Generate a unique student ID like STU-2025-0001."""
    year = datetime.now().year
    last = db.query(Student).filter(
        Student.student_id.like(f"STU-{year}-%")
    ).order_by(Student.student_id.desc()).first()
    if last:
        num = int(last.student_id.split("-")[-1]) + 1
    else:
        num = 1
    return f"STU-{year}-{num:04d}"


@router.get("/", response_model=PaginatedResponse[StudentListResponse])
async def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    program_id: Optional[UUID] = None,
    class_id: Optional[UUID] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    year_of_study: Optional[int] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List students with pagination, search, and filters."""
    query = db.query(Student).options(
        joinedload(Student.user).joinedload(User.role),
        joinedload(Student.program),
        joinedload(Student.class_group),
    ).filter(Student.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.join(User, Student.user_id == User.id).filter(
            or_(
                User.first_name.ilike(search_filter),
                User.last_name.ilike(search_filter),
                User.email.ilike(search_filter),
                Student.student_id.ilike(search_filter),
            )
        )
    if program_id:
        query = query.filter(Student.program_id == program_id)
    if class_id:
        query = query.filter(Student.class_group_id == class_id)
    if status_filter:
        query = query.filter(Student.status == status_filter)
    if year_of_study:
        query = query.filter(Student.year_of_study == year_of_study)

    result = paginate(query, page, page_size, sort_by, sort_order, Student)
    return result


@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new student with user account."""
    existing = db.query(User).filter(User.email == student_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un utilisateur avec cet email existe déjà")

    # Get student role
    student_role = db.query(Role).filter(Role.name == "student").first()
    if not student_role:
        raise HTTPException(status_code=500, detail="Rôle étudiant introuvable")

    # Validate program and class
    if student_data.program_id:
        program = db.query(Program).filter(Program.id == student_data.program_id).first()
        if not program:
            raise HTTPException(status_code=400, detail="Programme introuvable")
    if student_data.class_group_id:
        class_group = db.query(ClassGroup).filter(ClassGroup.id == student_data.class_group_id).first()
        if not class_group:
            raise HTTPException(status_code=400, detail="Classe introuvable")

    # Create user
    user = User(
        email=student_data.email,
        hashed_password=hash_password(student_data.password),
        first_name=student_data.first_name,
        last_name=student_data.last_name,
        phone=student_data.phone,
        role_id=student_role.id,
    )
    db.add(user)
    db.flush()

    # Create student
    student = Student(
        student_id=_generate_student_id(db),
        user_id=user.id,
        program_id=student_data.program_id,
        class_group_id=student_data.class_group_id,
        date_of_birth=student_data.date_of_birth,
        gender=student_data.gender,
        nationality=student_data.nationality,
        address=student_data.address,
        city=student_data.city,
        postal_code=student_data.postal_code,
        country=student_data.country,
        admission_date=student_data.admission_date,
        year_of_study=student_data.year_of_study,
        scholarship_holder=student_data.scholarship_holder,
        notes=student_data.notes,
    )
    db.add(student)
    db.flush()

    # Create guardians
    for guardian_data in student_data.guardians:
        guardian = Guardian(
            student_id=student.id,
            first_name=guardian_data.first_name,
            last_name=guardian_data.last_name,
            relationship_type=guardian_data.relationship_type,
            email=guardian_data.email,
            phone=guardian_data.phone,
            address=guardian_data.address,
            is_primary=guardian_data.is_primary,
        )
        db.add(guardian)

    db.commit()
    db.refresh(student)
    return student


@router.get("/export/csv")
async def export_students_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Export all active students to CSV."""
    students = db.query(Student).options(
        joinedload(Student.user),
        joinedload(Student.program),
        joinedload(Student.class_group),
    ).filter(Student.is_deleted == False).all()

    output = io.StringIO()
    writer = csv.writer(output, delimiter=";")
    writer.writerow([
        "ID Étudiant", "Prénom", "Nom", "Email", "Téléphone",
        "Programme", "Classe", "Année d'étude", "Statut",
        "Date de naissance", "Nationalité", "Ville", "Boursier",
        "Date d'admission",
    ])
    for s in students:
        writer.writerow([
            s.student_id,
            s.user.first_name if s.user else "",
            s.user.last_name if s.user else "",
            s.user.email if s.user else "",
            s.user.phone if s.user else "",
            s.program.name if s.program else "",
            s.class_group.name if s.class_group else "",
            s.year_of_study,
            s.status,
            str(s.date_of_birth) if s.date_of_birth else "",
            s.nationality or "",
            s.city or "",
            "Oui" if s.scholarship_holder else "Non",
            str(s.admission_date) if s.admission_date else "",
        ])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8-sig")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=etudiants.csv"},
    )


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a student by ID with all relations."""
    student = db.query(Student).options(
        joinedload(Student.user).joinedload(User.role),
        joinedload(Student.program),
        joinedload(Student.class_group),
        joinedload(Student.guardians),
    ).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")
    return student


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: UUID,
    student_data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a student."""
    student = db.query(Student).options(
        joinedload(Student.user),
    ).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    update_data = student_data.model_dump(exclude_unset=True)

    # Handle user-level fields
    user_fields = {"first_name", "last_name", "email", "phone"}
    for field in user_fields:
        if field in update_data:
            value = update_data.pop(field)
            if field == "email" and value != student.user.email:
                existing = db.query(User).filter(User.email == value, User.id != student.user_id).first()
                if existing:
                    raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
            setattr(student.user, field, value)

    for field, value in update_data.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}")
async def delete_student(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a student."""
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    student.is_deleted = True
    student.deleted_at = datetime.now(timezone.utc)
    student.status = "withdrawn"
    db.commit()
    return {"message": "Étudiant supprimé avec succès", "success": True}


@router.get("/{student_id}/grades")
async def get_student_grades(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all grades for a student."""
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    grades = db.query(Grade).options(
        joinedload(Grade.exam),
        joinedload(Grade.course_module),
    ).filter(Grade.student_id == student_id).order_by(Grade.created_at.desc()).all()

    result = []
    for g in grades:
        result.append({
            "id": str(g.id),
            "exam_name": g.exam.name if g.exam else None,
            "exam_type": g.exam.exam_type if g.exam else None,
            "course_module": g.course_module.name if g.course_module else None,
            "course_code": g.course_module.code if g.course_module else None,
            "score": g.score,
            "max_score": g.exam.max_score if g.exam else 20.0,
            "grade_letter": g.grade_letter,
            "is_absent": g.is_absent,
            "is_published": g.is_published,
            "remarks": g.remarks,
            "graded_at": str(g.graded_at) if g.graded_at else None,
        })
    return result


@router.get("/{student_id}/attendance")
async def get_student_attendance(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get attendance records for a student."""
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    records = db.query(AttendanceRecord).options(
        joinedload(AttendanceRecord.session),
    ).filter(
        AttendanceRecord.student_id == student_id
    ).order_by(AttendanceRecord.created_at.desc()).all()

    total = len(records)
    present = sum(1 for r in records if r.status in ("present", "late"))
    rate = round(present / total * 100, 1) if total > 0 else 0.0

    result = []
    for r in records:
        result.append({
            "id": str(r.id),
            "session_date": str(r.session.session_date) if r.session else None,
            "status": r.status,
            "check_in_time": str(r.check_in_time) if r.check_in_time else None,
            "justification": r.justification,
            "justified": r.justified,
        })

    return {
        "total_sessions": total,
        "present_count": present,
        "attendance_rate": rate,
        "records": result,
    }


@router.get("/{student_id}/invoices")
async def get_student_invoices(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all invoices for a student."""
    student = db.query(Student).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    invoices = db.query(Invoice).filter(
        Invoice.student_id == student_id,
        Invoice.is_deleted == False,
    ).order_by(Invoice.issue_date.desc()).all()

    result = []
    for inv in invoices:
        result.append({
            "id": str(inv.id),
            "invoice_number": inv.invoice_number,
            "description": inv.description,
            "total_amount": inv.total_amount,
            "paid_amount": inv.paid_amount,
            "status": inv.status,
            "issue_date": str(inv.issue_date),
            "due_date": str(inv.due_date),
            "invoice_type": inv.invoice_type,
        })
    return result
