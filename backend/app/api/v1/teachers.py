from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.core.security import hash_password
from app.models.user import User, Role
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse, TeacherListResponse
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


def _generate_teacher_id(db: Session) -> str:
    year = datetime.now().year
    last = db.query(Teacher).filter(
        Teacher.teacher_id.like(f"TCH-{year}-%")
    ).order_by(Teacher.teacher_id.desc()).first()
    if last:
        num = int(last.teacher_id.split("-")[-1]) + 1
    else:
        num = 1
    return f"TCH-{year}-{num:03d}"


@router.get("/", response_model=PaginatedResponse[TeacherListResponse])
async def list_teachers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    department: Optional[str] = None,
    contract_type: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List teachers with pagination and filtering."""
    query = db.query(Teacher).options(
        joinedload(Teacher.user).joinedload(User.role),
    ).filter(Teacher.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.join(User, Teacher.user_id == User.id).filter(
            or_(
                User.first_name.ilike(search_filter),
                User.last_name.ilike(search_filter),
                User.email.ilike(search_filter),
                Teacher.teacher_id.ilike(search_filter),
                Teacher.specialization.ilike(search_filter),
            )
        )
    if department:
        query = query.filter(Teacher.department == department)
    if contract_type:
        query = query.filter(Teacher.contract_type == contract_type)
    if status_filter:
        query = query.filter(Teacher.status == status_filter)

    result = paginate(query, page, page_size, sort_by, sort_order, Teacher)
    return result


@router.post("/", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
async def create_teacher(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new teacher with user account."""
    existing = db.query(User).filter(User.email == teacher_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un utilisateur avec cet email existe déjà")

    teacher_role = db.query(Role).filter(Role.name == "teacher").first()
    if not teacher_role:
        raise HTTPException(status_code=500, detail="Rôle enseignant introuvable")

    user = User(
        email=teacher_data.email,
        hashed_password=hash_password(teacher_data.password),
        first_name=teacher_data.first_name,
        last_name=teacher_data.last_name,
        phone=teacher_data.phone,
        role_id=teacher_role.id,
    )
    db.add(user)
    db.flush()

    teacher = Teacher(
        teacher_id=_generate_teacher_id(db),
        user_id=user.id,
        department=teacher_data.department,
        specialization=teacher_data.specialization,
        title=teacher_data.title,
        hire_date=teacher_data.hire_date,
        contract_type=teacher_data.contract_type,
        hourly_rate=teacher_data.hourly_rate,
        bio=teacher_data.bio,
        office_location=teacher_data.office_location,
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


@router.get("/{teacher_id}", response_model=TeacherResponse)
async def get_teacher(
    teacher_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a teacher by ID."""
    teacher = db.query(Teacher).options(
        joinedload(Teacher.user).joinedload(User.role),
    ).filter(Teacher.id == teacher_id, Teacher.is_deleted == False).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Enseignant introuvable")
    return teacher


@router.put("/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(
    teacher_id: UUID,
    teacher_data: TeacherUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a teacher."""
    teacher = db.query(Teacher).options(
        joinedload(Teacher.user),
    ).filter(Teacher.id == teacher_id, Teacher.is_deleted == False).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Enseignant introuvable")

    update_data = teacher_data.model_dump(exclude_unset=True)
    user_fields = {"first_name", "last_name", "email", "phone"}
    for field in user_fields:
        if field in update_data:
            value = update_data.pop(field)
            if field == "email" and value != teacher.user.email:
                existing = db.query(User).filter(User.email == value, User.id != teacher.user_id).first()
                if existing:
                    raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
            setattr(teacher.user, field, value)

    for field, value in update_data.items():
        setattr(teacher, field, value)

    db.commit()
    db.refresh(teacher)
    return teacher


@router.delete("/{teacher_id}")
async def delete_teacher(
    teacher_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a teacher."""
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id, Teacher.is_deleted == False).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Enseignant introuvable")

    teacher.is_deleted = True
    teacher.deleted_at = datetime.now(timezone.utc)
    teacher.status = "inactive"
    db.commit()
    return {"message": "Enseignant supprimé avec succès", "success": True}
