from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.academic import CourseModule
from app.models.grade import Exam, Grade, GradeComponent
from app.schemas.grade import (
    ExamCreate, ExamUpdate, ExamResponse,
    GradeCreate, GradeUpdate, GradeResponse,
    BulkGradeCreate,
    GradeComponentCreate, GradeComponentResponse,
)
from app.schemas.common import PaginatedResponse
from app.utils.pagination import paginate

router = APIRouter()


# Exam CRUD
@router.get("/exams", response_model=PaginatedResponse[ExamResponse])
async def list_exams(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    course_module_id: Optional[UUID] = None,
    semester_id: Optional[UUID] = None,
    exam_type: Optional[str] = None,
    is_published: Optional[bool] = None,
    sort_by: str = "exam_date",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List exams with filtering."""
    query = db.query(Exam).filter(Exam.is_deleted == False)

    if course_module_id:
        query = query.filter(Exam.course_module_id == course_module_id)
    if semester_id:
        query = query.filter(Exam.semester_id == semester_id)
    if exam_type:
        query = query.filter(Exam.exam_type == exam_type)
    if is_published is not None:
        query = query.filter(Exam.is_published == is_published)

    result = paginate(query, page, page_size, sort_by, sort_order, Exam)
    return result


@router.post("/exams", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
async def create_exam(
    exam_data: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new exam."""
    module = db.query(CourseModule).filter(
        CourseModule.id == exam_data.course_module_id, CourseModule.is_deleted == False
    ).first()
    if not module:
        raise HTTPException(status_code=400, detail="Module introuvable")

    exam = Exam(**exam_data.model_dump())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam


@router.get("/exams/{exam_id}", response_model=ExamResponse)
async def get_exam(
    exam_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get an exam by ID."""
    exam = db.query(Exam).filter(Exam.id == exam_id, Exam.is_deleted == False).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examen introuvable")
    return exam


@router.put("/exams/{exam_id}", response_model=ExamResponse)
async def update_exam(
    exam_id: UUID,
    exam_data: ExamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an exam."""
    exam = db.query(Exam).filter(Exam.id == exam_id, Exam.is_deleted == False).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examen introuvable")

    update_data = exam_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exam, field, value)

    db.commit()
    db.refresh(exam)
    return exam


@router.delete("/exams/{exam_id}")
async def delete_exam(
    exam_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft delete an exam."""
    exam = db.query(Exam).filter(Exam.id == exam_id, Exam.is_deleted == False).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examen introuvable")

    exam.is_deleted = True
    exam.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Examen supprimé avec succès", "success": True}


# Grade CRUD
@router.get("/", response_model=PaginatedResponse[GradeResponse])
async def list_grades(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    student_id: Optional[UUID] = None,
    exam_id: Optional[UUID] = None,
    course_module_id: Optional[UUID] = None,
    is_published: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List grades with filtering."""
    query = db.query(Grade)

    if student_id:
        query = query.filter(Grade.student_id == student_id)
    if exam_id:
        query = query.filter(Grade.exam_id == exam_id)
    if course_module_id:
        query = query.filter(Grade.course_module_id == course_module_id)
    if is_published is not None:
        query = query.filter(Grade.is_published == is_published)

    result = paginate(query, page, page_size, sort_by, sort_order, Grade)
    return result


@router.post("/", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
async def create_grade(
    grade_data: GradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new grade entry."""
    # Validate references
    student = db.query(Student).filter(Student.id == grade_data.student_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Étudiant introuvable")

    exam = db.query(Exam).filter(Exam.id == grade_data.exam_id).first()
    if not exam:
        raise HTTPException(status_code=400, detail="Examen introuvable")

    # Check for existing grade
    existing = db.query(Grade).filter(
        Grade.student_id == grade_data.student_id,
        Grade.exam_id == grade_data.exam_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Une note existe déjà pour cet étudiant et cet examen")

    # Auto-assign grade letter
    grade_letter = None
    if grade_data.score is not None:
        if grade_data.score >= 16:
            grade_letter = "A"
        elif grade_data.score >= 14:
            grade_letter = "B"
        elif grade_data.score >= 12:
            grade_letter = "C"
        elif grade_data.score >= 10:
            grade_letter = "D"
        else:
            grade_letter = "F"

    grade = Grade(
        **grade_data.model_dump(),
        grade_letter=grade_data.grade_letter or grade_letter,
        graded_by_id=current_user.id,
        graded_at=datetime.now(timezone.utc),
    )
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
async def create_bulk_grades(
    bulk_data: BulkGradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create multiple grade entries at once."""
    exam = db.query(Exam).filter(Exam.id == bulk_data.exam_id).first()
    if not exam:
        raise HTTPException(status_code=400, detail="Examen introuvable")

    created = 0
    updated = 0
    errors = []

    for entry in bulk_data.grades:
        # Check for existing
        existing = db.query(Grade).filter(
            Grade.student_id == entry.student_id,
            Grade.exam_id == bulk_data.exam_id,
        ).first()

        grade_letter = None
        if entry.score is not None:
            if entry.score >= 16:
                grade_letter = "A"
            elif entry.score >= 14:
                grade_letter = "B"
            elif entry.score >= 12:
                grade_letter = "C"
            elif entry.score >= 10:
                grade_letter = "D"
            else:
                grade_letter = "F"

        if existing:
            existing.score = entry.score
            existing.is_absent = entry.is_absent
            existing.remarks = entry.remarks
            existing.grade_letter = grade_letter
            existing.graded_by_id = current_user.id
            existing.graded_at = datetime.now(timezone.utc)
            updated += 1
        else:
            grade = Grade(
                student_id=entry.student_id,
                exam_id=bulk_data.exam_id,
                course_module_id=bulk_data.course_module_id,
                score=entry.score,
                is_absent=entry.is_absent,
                remarks=entry.remarks,
                grade_letter=grade_letter,
                graded_by_id=current_user.id,
                graded_at=datetime.now(timezone.utc),
            )
            db.add(grade)
            created += 1

    db.commit()
    return {
        "message": f"{created} notes créées, {updated} mises à jour",
        "created": created,
        "updated": updated,
        "errors": errors,
    }


@router.put("/{grade_id}", response_model=GradeResponse)
async def update_grade(
    grade_id: UUID,
    grade_data: GradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a grade."""
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Note introuvable")

    update_data = grade_data.model_dump(exclude_unset=True)

    if "score" in update_data and update_data["score"] is not None:
        score = update_data["score"]
        if score >= 16:
            update_data["grade_letter"] = "A"
        elif score >= 14:
            update_data["grade_letter"] = "B"
        elif score >= 12:
            update_data["grade_letter"] = "C"
        elif score >= 10:
            update_data["grade_letter"] = "D"
        else:
            update_data["grade_letter"] = "F"

    for field, value in update_data.items():
        setattr(grade, field, value)

    grade.graded_by_id = current_user.id
    grade.graded_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(grade)
    return grade


@router.delete("/{grade_id}")
async def delete_grade(
    grade_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a grade."""
    grade = db.query(Grade).filter(Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(status_code=404, detail="Note introuvable")

    db.delete(grade)
    db.commit()
    return {"message": "Note supprimée avec succès", "success": True}


# Gradebook view
@router.get("/gradebook/{course_module_id}")
async def get_gradebook(
    course_module_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a gradebook view for a course module showing all students and their grades."""
    module = db.query(CourseModule).filter(
        CourseModule.id == course_module_id, CourseModule.is_deleted == False
    ).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module introuvable")

    exams = db.query(Exam).filter(
        Exam.course_module_id == course_module_id, Exam.is_deleted == False
    ).order_by(Exam.exam_date).all()

    # Get all grades for this module
    grades = db.query(Grade).filter(
        Grade.course_module_id == course_module_id
    ).all()

    # Build grade lookup: student_id -> exam_id -> grade
    grade_lookup = {}
    for g in grades:
        if str(g.student_id) not in grade_lookup:
            grade_lookup[str(g.student_id)] = {}
        grade_lookup[str(g.student_id)][str(g.exam_id)] = {
            "score": g.score,
            "grade_letter": g.grade_letter,
            "is_absent": g.is_absent,
        }

    # Get students enrolled in this module's program or with grades
    student_ids = set(str(g.student_id) for g in grades)
    from app.models.academic import Enrollment
    enrollments = db.query(Enrollment).filter(
        Enrollment.course_module_id == course_module_id
    ).all()
    for e in enrollments:
        student_ids.add(str(e.student_id))

    students = db.query(Student).options(
        joinedload(Student.user),
    ).filter(Student.id.in_(list(student_ids))).all() if student_ids else []

    student_rows = []
    for s in students:
        student_grades = grade_lookup.get(str(s.id), {})
        scores = [v["score"] for v in student_grades.values() if v["score"] is not None]
        average = round(sum(scores) / len(scores), 2) if scores else None

        student_rows.append({
            "student_id": str(s.id),
            "student_number": s.student_id,
            "name": f"{s.user.last_name} {s.user.first_name}" if s.user else "",
            "grades": student_grades,
            "average": average,
        })

    student_rows.sort(key=lambda x: x["name"])

    return {
        "module": {
            "id": str(module.id),
            "code": module.code,
            "name": module.name,
            "coefficient": module.coefficient,
        },
        "exams": [
            {
                "id": str(e.id),
                "name": e.name,
                "type": e.exam_type,
                "max_score": e.max_score,
                "coefficient": e.coefficient,
                "date": str(e.exam_date) if e.exam_date else None,
            }
            for e in exams
        ],
        "students": student_rows,
    }


# Student report card
@router.get("/report-card/{student_id}")
async def get_report_card(
    student_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a report card for a student."""
    student = db.query(Student).options(
        joinedload(Student.user),
        joinedload(Student.program),
        joinedload(Student.class_group),
    ).filter(Student.id == student_id, Student.is_deleted == False).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    grades = db.query(Grade).options(
        joinedload(Grade.exam),
        joinedload(Grade.course_module),
    ).filter(Grade.student_id == student_id).all()

    # Group by course module
    modules = {}
    for g in grades:
        mod_id = str(g.course_module_id)
        if mod_id not in modules:
            modules[mod_id] = {
                "module_code": g.course_module.code if g.course_module else "",
                "module_name": g.course_module.name if g.course_module else "",
                "coefficient": g.course_module.coefficient if g.course_module else 1.0,
                "credits": g.course_module.credits if g.course_module else 0,
                "grades": [],
                "scores": [],
            }
        modules[mod_id]["grades"].append({
            "exam_name": g.exam.name if g.exam else "",
            "exam_type": g.exam.exam_type if g.exam else "",
            "score": g.score,
            "max_score": g.exam.max_score if g.exam else 20.0,
            "coefficient": g.exam.coefficient if g.exam else 1.0,
            "is_absent": g.is_absent,
        })
        if g.score is not None and not g.is_absent:
            modules[mod_id]["scores"].append(g.score)

    # Calculate averages
    module_results = []
    total_weighted_score = 0.0
    total_coefficient = 0.0

    for mod_id, data in modules.items():
        avg = round(sum(data["scores"]) / len(data["scores"]), 2) if data["scores"] else None
        module_results.append({
            "module_code": data["module_code"],
            "module_name": data["module_name"],
            "coefficient": data["coefficient"],
            "credits": data["credits"],
            "grades": data["grades"],
            "average": avg,
        })
        if avg is not None:
            total_weighted_score += avg * data["coefficient"]
            total_coefficient += data["coefficient"]

    overall_average = round(total_weighted_score / total_coefficient, 2) if total_coefficient > 0 else None

    return {
        "student": {
            "id": str(student.id),
            "student_id": student.student_id,
            "name": f"{student.user.first_name} {student.user.last_name}" if student.user else "",
            "program": student.program.name if student.program else "",
            "class": student.class_group.name if student.class_group else "",
            "year_of_study": student.year_of_study,
        },
        "modules": module_results,
        "overall_average": overall_average,
        "mention": (
            "Très Bien" if overall_average and overall_average >= 16
            else "Bien" if overall_average and overall_average >= 14
            else "Assez Bien" if overall_average and overall_average >= 12
            else "Passable" if overall_average and overall_average >= 10
            else "Insuffisant" if overall_average is not None
            else None
        ),
    }


# Grade components
@router.post("/components", response_model=GradeComponentResponse, status_code=status.HTTP_201_CREATED)
async def create_grade_component(
    component_data: GradeComponentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a grade component for a course module."""
    component = GradeComponent(**component_data.model_dump())
    db.add(component)
    db.commit()
    db.refresh(component)
    return component


@router.get("/components/{course_module_id}", response_model=list[GradeComponentResponse])
async def get_grade_components(
    course_module_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get grade components for a course module."""
    components = db.query(GradeComponent).filter(
        GradeComponent.course_module_id == course_module_id
    ).all()
    return components
