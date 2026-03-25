from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.academic import Program, CourseModule
from app.schemas.academic import (
    ProgramCreate, ProgramUpdate, ProgramResponse,
    CourseModuleCreate, CourseModuleUpdate, CourseModuleResponse,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[ProgramResponse])
async def list_programs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    degree_level: Optional[str] = None,
    is_active: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List programs with filtering."""
    query = db.query(Program).filter(Program.is_deleted == False)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(Program.name.ilike(search_filter), Program.code.ilike(search_filter))
        )
    if degree_level:
        query = query.filter(Program.degree_level == degree_level)
    if is_active is not None:
        query = query.filter(Program.is_active == is_active)

    result = paginate(query, page, page_size, sort_by, sort_order, Program)
    return result


@router.post("/", response_model=ProgramResponse, status_code=status.HTTP_201_CREATED)
async def create_program(
    program_data: ProgramCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new program."""
    existing = db.query(Program).filter(Program.code == program_data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un programme avec ce code existe déjà")

    program = Program(**program_data.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(
    program_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a program by ID."""
    program = db.query(Program).filter(
        Program.id == program_id, Program.is_deleted == False
    ).first()
    if not program:
        raise HTTPException(status_code=404, detail="Programme introuvable")
    return program


@router.put("/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: UUID,
    program_data: ProgramUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a program."""
    program = db.query(Program).filter(
        Program.id == program_id, Program.is_deleted == False
    ).first()
    if not program:
        raise HTTPException(status_code=404, detail="Programme introuvable")

    update_data = program_data.model_dump(exclude_unset=True)
    if "code" in update_data and update_data["code"] != program.code:
        existing = db.query(Program).filter(
            Program.code == update_data["code"], Program.id != program_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Ce code est déjà utilisé")

    for field, value in update_data.items():
        setattr(program, field, value)

    db.commit()
    db.refresh(program)
    return program


@router.delete("/{program_id}")
async def delete_program(
    program_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a program."""
    program = db.query(Program).filter(
        Program.id == program_id, Program.is_deleted == False
    ).first()
    if not program:
        raise HTTPException(status_code=404, detail="Programme introuvable")

    program.is_deleted = True
    program.deleted_at = datetime.now(timezone.utc)
    program.is_active = False
    db.commit()
    return {"message": "Programme supprimé avec succès", "success": True}


@router.get("/{program_id}/modules", response_model=list[CourseModuleResponse])
async def get_program_modules(
    program_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all course modules for a program."""
    program = db.query(Program).filter(
        Program.id == program_id, Program.is_deleted == False
    ).first()
    if not program:
        raise HTTPException(status_code=404, detail="Programme introuvable")

    modules = db.query(CourseModule).filter(
        CourseModule.program_id == program_id,
        CourseModule.is_deleted == False,
    ).order_by(CourseModule.year_of_study, CourseModule.semester_number, CourseModule.name).all()
    return modules


# Course Module CRUD
@router.post("/modules", response_model=CourseModuleResponse, status_code=status.HTTP_201_CREATED)
async def create_module(
    module_data: CourseModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new course module."""
    existing = db.query(CourseModule).filter(CourseModule.code == module_data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un module avec ce code existe déjà")

    module = CourseModule(**module_data.model_dump())
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.get("/modules/{module_id}", response_model=CourseModuleResponse)
async def get_module(
    module_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a course module by ID."""
    module = db.query(CourseModule).filter(
        CourseModule.id == module_id, CourseModule.is_deleted == False
    ).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module introuvable")
    return module


@router.put("/modules/{module_id}", response_model=CourseModuleResponse)
async def update_module(
    module_id: UUID,
    module_data: CourseModuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a course module."""
    module = db.query(CourseModule).filter(
        CourseModule.id == module_id, CourseModule.is_deleted == False
    ).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module introuvable")

    update_data = module_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(module, field, value)

    db.commit()
    db.refresh(module)
    return module


@router.delete("/modules/{module_id}")
async def delete_module(
    module_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete a course module."""
    module = db.query(CourseModule).filter(
        CourseModule.id == module_id, CourseModule.is_deleted == False
    ).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module introuvable")

    module.is_deleted = True
    module.deleted_at = datetime.now(timezone.utc)
    module.is_active = False
    db.commit()
    return {"message": "Module supprimé avec succès", "success": True}
