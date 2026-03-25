from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ProgramCreate(BaseModel):
    code: str = Field(min_length=2, max_length=20)
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    degree_level: str
    duration_years: int = 3
    total_credits: Optional[int] = None
    tuition_fee: Optional[float] = None


class ProgramUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    degree_level: Optional[str] = None
    duration_years: Optional[int] = None
    total_credits: Optional[int] = None
    tuition_fee: Optional[float] = None
    is_active: Optional[bool] = None


class ProgramResponse(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str] = None
    degree_level: str
    duration_years: int
    total_credits: Optional[int] = None
    tuition_fee: Optional[float] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AcademicYearCreate(BaseModel):
    name: str
    start_date: date
    end_date: date
    is_current: bool = False


class AcademicYearUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None


class AcademicYearResponse(BaseModel):
    id: UUID
    name: str
    start_date: date
    end_date: date
    is_current: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SemesterCreate(BaseModel):
    academic_year_id: UUID
    name: str
    start_date: date
    end_date: date
    is_current: bool = False


class SemesterResponse(BaseModel):
    id: UUID
    academic_year_id: UUID
    name: str
    start_date: date
    end_date: date
    is_current: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CourseModuleCreate(BaseModel):
    code: str = Field(min_length=2, max_length=20)
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    program_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    credits: int = 3
    hours_total: Optional[int] = None
    hours_lecture: Optional[int] = None
    hours_tutorial: Optional[int] = None
    semester_number: Optional[int] = None
    year_of_study: Optional[int] = None
    coefficient: float = 1.0
    is_mandatory: bool = True


class CourseModuleUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    program_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    credits: Optional[int] = None
    hours_total: Optional[int] = None
    hours_lecture: Optional[int] = None
    hours_tutorial: Optional[int] = None
    semester_number: Optional[int] = None
    year_of_study: Optional[int] = None
    coefficient: Optional[float] = None
    is_mandatory: Optional[bool] = None
    is_active: Optional[bool] = None


class CourseModuleResponse(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str] = None
    program_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    credits: int
    hours_total: Optional[int] = None
    hours_lecture: Optional[int] = None
    hours_tutorial: Optional[int] = None
    semester_number: Optional[int] = None
    year_of_study: Optional[int] = None
    coefficient: float
    is_mandatory: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClassGroupCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    code: str = Field(min_length=1, max_length=20)
    program_id: UUID
    year_of_study: int = 1
    max_students: int = 35
    academic_year: Optional[str] = None


class ClassGroupUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    program_id: Optional[UUID] = None
    year_of_study: Optional[int] = None
    max_students: Optional[int] = None
    academic_year: Optional[str] = None
    is_active: Optional[bool] = None


class ClassGroupResponse(BaseModel):
    id: UUID
    name: str
    code: str
    program_id: UUID
    year_of_study: int
    max_students: int
    academic_year: Optional[str] = None
    is_active: bool
    student_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EnrollmentCreate(BaseModel):
    student_id: UUID
    course_module_id: UUID
    academic_year: Optional[str] = None


class EnrollmentResponse(BaseModel):
    id: UUID
    student_id: UUID
    course_module_id: UUID
    academic_year: Optional[str] = None
    status: str
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    final_grade: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
