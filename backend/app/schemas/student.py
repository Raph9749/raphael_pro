from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.user import UserResponse


class GuardianCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    relationship_type: str  # Pere, Mere, Tuteur, Autre
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_primary: bool = False


class GuardianUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    relationship_type: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_primary: Optional[bool] = None


class GuardianResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    relationship_type: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_primary: bool

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    email: str
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: Optional[str] = None
    program_id: Optional[UUID] = None
    class_group_id: Optional[UUID] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = "Française"
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = "France"
    admission_date: Optional[date] = None
    year_of_study: int = 1
    scholarship_holder: bool = False
    notes: Optional[str] = None
    guardians: List[GuardianCreate] = []


class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    program_id: Optional[UUID] = None
    class_group_id: Optional[UUID] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    status: Optional[str] = None
    year_of_study: Optional[int] = None
    scholarship_holder: Optional[bool] = None
    notes: Optional[str] = None
    photo_url: Optional[str] = None


class ProgramBrief(BaseModel):
    id: UUID
    code: str
    name: str

    class Config:
        from_attributes = True


class ClassGroupBrief(BaseModel):
    id: UUID
    code: str
    name: str

    class Config:
        from_attributes = True


class StudentResponse(BaseModel):
    id: UUID
    student_id: str
    user_id: UUID
    user: Optional[UserResponse] = None
    program_id: Optional[UUID] = None
    program: Optional[ProgramBrief] = None
    class_group_id: Optional[UUID] = None
    class_group: Optional[ClassGroupBrief] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    admission_date: Optional[date] = None
    graduation_date: Optional[date] = None
    status: str
    year_of_study: int
    scholarship_holder: bool
    notes: Optional[str] = None
    photo_url: Optional[str] = None
    guardians: List[GuardianResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StudentListResponse(BaseModel):
    id: UUID
    student_id: str
    user: Optional[UserResponse] = None
    program: Optional[ProgramBrief] = None
    class_group: Optional[ClassGroupBrief] = None
    status: str
    year_of_study: int
    scholarship_holder: bool
    created_at: datetime

    class Config:
        from_attributes = True
