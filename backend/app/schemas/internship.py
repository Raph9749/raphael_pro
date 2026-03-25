from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CompanyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    industry: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = "France"
    website: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    is_partner: bool = False
    partnership_start_date: Optional[date] = None


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    is_partner: Optional[bool] = None
    partnership_start_date: Optional[date] = None
    is_active: Optional[bool] = None


class CompanyResponse(BaseModel):
    id: UUID
    name: str
    industry: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    is_partner: bool
    partnership_start_date: Optional[date] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InternshipCreate(BaseModel):
    student_id: UUID
    company_id: UUID
    title: str = Field(min_length=1, max_length=300)
    description: Optional[str] = None
    department: Optional[str] = None
    supervisor_name: Optional[str] = None
    supervisor_email: Optional[str] = None
    supervisor_phone: Optional[str] = None
    start_date: date
    end_date: date
    duration_weeks: Optional[int] = None
    compensation: Optional[float] = None
    status: str = "pending"


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    department: Optional[str] = None
    supervisor_name: Optional[str] = None
    supervisor_email: Optional[str] = None
    supervisor_phone: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_weeks: Optional[int] = None
    compensation: Optional[float] = None
    status: Optional[str] = None
    convention_signed: Optional[bool] = None
    convention_url: Optional[str] = None
    report_url: Optional[str] = None
    final_grade: Optional[float] = None
    notes: Optional[str] = None


class InternshipResponse(BaseModel):
    id: UUID
    student_id: UUID
    company_id: UUID
    title: str
    description: Optional[str] = None
    department: Optional[str] = None
    supervisor_name: Optional[str] = None
    supervisor_email: Optional[str] = None
    supervisor_phone: Optional[str] = None
    start_date: date
    end_date: date
    duration_weeks: Optional[int] = None
    compensation: Optional[float] = None
    currency: str
    status: str
    convention_signed: bool
    convention_url: Optional[str] = None
    report_url: Optional[str] = None
    final_grade: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InternshipEvaluationCreate(BaseModel):
    internship_id: UUID
    evaluator_id: Optional[UUID] = None
    evaluation_type: str  # mid_term, final, company
    score: Optional[float] = None
    comments: Optional[str] = None
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    evaluation_date: date


class InternshipEvaluationResponse(BaseModel):
    id: UUID
    internship_id: UUID
    evaluator_id: Optional[UUID] = None
    evaluation_type: str
    score: Optional[float] = None
    comments: Optional[str] = None
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    evaluation_date: date
    created_at: datetime

    class Config:
        from_attributes = True
