from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CandidateCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = "France"
    program_id: Optional[UUID] = None
    desired_entry_year: Optional[int] = None
    previous_education: Optional[str] = None
    previous_institution: Optional[str] = None
    gpa: Optional[float] = None
    motivation_letter: Optional[str] = None
    application_date: date
    source: Optional[str] = None


class CandidateUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    program_id: Optional[UUID] = None
    desired_entry_year: Optional[int] = None
    previous_education: Optional[str] = None
    previous_institution: Optional[str] = None
    gpa: Optional[float] = None
    motivation_letter: Optional[str] = None
    status: Optional[str] = None
    interview_date: Optional[datetime] = None
    interview_notes: Optional[str] = None
    interview_score: Optional[float] = None
    decision_date: Optional[date] = None
    decision_notes: Optional[str] = None
    source: Optional[str] = None


class CandidateResponse(BaseModel):
    id: UUID
    candidate_number: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    program_id: Optional[UUID] = None
    desired_entry_year: Optional[int] = None
    previous_education: Optional[str] = None
    previous_institution: Optional[str] = None
    gpa: Optional[float] = None
    motivation_letter: Optional[str] = None
    status: str
    interview_date: Optional[datetime] = None
    interview_notes: Optional[str] = None
    interview_score: Optional[float] = None
    decision_date: Optional[date] = None
    decision_notes: Optional[str] = None
    reviewed_by_id: Optional[UUID] = None
    converted_student_id: Optional[UUID] = None
    application_date: date
    source: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CandidateStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    interview_date: Optional[datetime] = None
    interview_score: Optional[float] = None
