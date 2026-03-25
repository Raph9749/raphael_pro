from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ExamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    course_module_id: UUID
    semester_id: Optional[UUID] = None
    exam_type: str  # partiel, final, controle_continu, projet, oral
    exam_date: Optional[date] = None
    duration_minutes: Optional[int] = None
    max_score: float = 20.0
    coefficient: float = 1.0
    description: Optional[str] = None


class ExamUpdate(BaseModel):
    name: Optional[str] = None
    course_module_id: Optional[UUID] = None
    semester_id: Optional[UUID] = None
    exam_type: Optional[str] = None
    exam_date: Optional[date] = None
    duration_minutes: Optional[int] = None
    max_score: Optional[float] = None
    coefficient: Optional[float] = None
    description: Optional[str] = None
    is_published: Optional[bool] = None


class ExamResponse(BaseModel):
    id: UUID
    name: str
    course_module_id: UUID
    semester_id: Optional[UUID] = None
    exam_type: str
    exam_date: Optional[date] = None
    duration_minutes: Optional[int] = None
    max_score: float
    coefficient: float
    description: Optional[str] = None
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GradeCreate(BaseModel):
    student_id: UUID
    exam_id: UUID
    course_module_id: UUID
    score: Optional[float] = None
    grade_letter: Optional[str] = None
    remarks: Optional[str] = None
    is_absent: bool = False


class GradeUpdate(BaseModel):
    score: Optional[float] = None
    grade_letter: Optional[str] = None
    remarks: Optional[str] = None
    is_absent: Optional[bool] = None
    is_published: Optional[bool] = None


class GradeResponse(BaseModel):
    id: UUID
    student_id: UUID
    exam_id: UUID
    course_module_id: UUID
    score: Optional[float] = None
    grade_letter: Optional[str] = None
    remarks: Optional[str] = None
    is_absent: bool
    is_published: bool
    graded_by_id: Optional[UUID] = None
    graded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BulkGradeEntry(BaseModel):
    student_id: UUID
    score: Optional[float] = None
    is_absent: bool = False
    remarks: Optional[str] = None


class BulkGradeCreate(BaseModel):
    exam_id: UUID
    course_module_id: UUID
    grades: List[BulkGradeEntry]


class GradeComponentCreate(BaseModel):
    course_module_id: UUID
    name: str
    weight: float
    description: Optional[str] = None


class GradeComponentResponse(BaseModel):
    id: UUID
    course_module_id: UUID
    name: str
    weight: float
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
