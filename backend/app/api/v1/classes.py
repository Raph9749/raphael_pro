from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, func
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.academic import ClassGroup, Program, Enrollment, CourseModule
from app.schemas.academic import (
    ClassGroupCreate, ClassGroupUpdate, ClassGroupResponse,
    EnrollmentCreate, EnrollmentResponse,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[ClassGroupResponse])
async def list_classes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    program_id: Optional[UUID] = None,
    year_of_study: Optional[int] = None,
    is_active: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List class groups with filtering."""
    query = db.query(ClassGroup).filter(ClassGroup.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(ClassGroup.name.ilike(search_filter), ClassGroup.code.ilike(search_filter))
        )
    if program_id:
        query = query.filter(ClassGroup.program_id == program_id)
    if year_of_study:
        query = query.filter(ClassGroup.year_of_study == year_of_study)
    if is_active is not None:
        query = query.filter(ClassGroup.is_active == is_active)

    result = paginate(query, page, page_size, sort_by, sort_order, ClassGroup)

    # Add student counts
    for item in result["items"]:
        count = db.query(func.count(Student.id)).filter(
            Student.class_group_id == item.id, Student.is_deleted == False
        ).scalar() or 0
        item.student_count = count

    return result


@router.post("/", response_model=ClassGroupResponse, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_data: ClassGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new class group."""
    existing = db.query(ClassGroup).filter(ClassGroup.code == class_data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Une classe avec ce code existe déjà")

    program = db.query(Program).filter(Program.id == class_data.program_id).first()
    if not program:
        raise HTTPException(status_code=400, detail="Programme introuvable")

    class_group = ClassGroup(**class_data.model_dump())
    db.add(class_group)
    db.commit()
    db.refresh(class_group)

    class_group.student_count = 0
    return class_group


@router.get("/{class_id}", response_model=ClassGroupResponse)
async def get_class(
    class_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a class group by ID."""
    class_group = db.query(ClassGroup).options(
        joinedload(ClassGroup.program),
    ).filter(ClassGroup.id == class_id, ClassGroup.is_deleted == False).first()
    if not class_group:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    count = db.query(func.count(Student.id)).filter(
        Student.class_group_id == class_id, Student.is_deleted == False
    ).scalar() or 0
    class_group.student_count = count
    return class_group


@router.put("/{class_id}", response_model=ClassGroupResponse)
async def update_class(
    class_id: UUID,
    class_data: ClassGroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a class group."""
    class_group = db.query(ClassGroup).filter(
        ClassGroup.id == class_id, ClassGroup.is_deleted == False
    ).first()
    if not class_group:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    update_data = class_data.model_dump(exclude_unset=True)
    if "code" in update_data and update_data["code"] != class_group.code:
        existing = db.query(ClassGroup).filter(
            ClassGroup.code == update_data["code"], ClassGroup.id != class_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Ce code est déjà utilisé")

    for field, value in update_data.items():
        setattr(class_group, field, value)

    db.commit()
    db.refresh(class_group)

    count = db.query(func.count(Student.id)).filter(
        Student.class_group_id == class_id, Student.is_deleted == False
    ).scalar() or 0
    class_group.student_count = count
    return class_group


@router.delete("/{class_id}")
async def delete_class(
    class_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a class group."""
    class_group = db.query(ClassGroup).filter(
        ClassGroup.id == class_id, ClassGroup.is_deleted == False
    ).first()
    if not class_group:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    class_group.is_deleted = True
    class_group.deleted_at = datetime.now(timezone.utc)
    class_group.is_active = False
    db.commit()
    return {"message": "Classe supprimée avec succès", "success": True}


@router.get("/{class_id}/students")
async def get_class_students(
    class_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all students in a class group."""
    class_group = db.query(ClassGroup).filter(
        ClassGroup.id == class_id, ClassGroup.is_deleted == False
    ).first()
    if not class_group:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    students = db.query(Student).options(
        joinedload(Student.user),
    ).filter(
        Student.class_group_id == class_id, Student.is_deleted == False
    ).order_by(Student.student_id).all()

    result = []
    for s in students:
        result.append({
            "id": str(s.id),
            "student_id": s.student_id,
            "first_name": s.user.first_name if s.user else "",
            "last_name": s.user.last_name if s.user else "",
            "email": s.user.email if s.user else "",
            "status": s.status,
            "year_of_study": s.year_of_study,
        })
    return result


# Enrollment management
@router.post("/enrollments", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
async def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Enroll a student in a course module."""
    student = db.query(Student).filter(
        Student.id == enrollment_data.student_id, Student.is_deleted == False
    ).first()
    if not student:
        raise HTTPException(status_code=400, detail="Étudiant introuvable")

    module = db.query(CourseModule).filter(
        CourseModule.id == enrollment_data.course_module_id, CourseModule.is_deleted == False
    ).first()
    if not module:
        raise HTTPException(status_code=400, detail="Module introuvable")

    existing = db.query(Enrollment).filter(
        Enrollment.student_id == enrollment_data.student_id,
        Enrollment.course_module_id == enrollment_data.course_module_id,
        Enrollment.status == "enrolled",
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="L'étudiant est déjà inscrit à ce module")

    enrollment = Enrollment(**enrollment_data.model_dump())
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/enrollments/list")
async def list_enrollments(
    student_id: Optional[UUID] = None,
    course_module_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List enrollments with optional filters."""
    query = db.query(Enrollment)
    if student_id:
        query = query.filter(Enrollment.student_id == student_id)
    if course_module_id:
        query = query.filter(Enrollment.course_module_id == course_module_id)
    return query.all()
