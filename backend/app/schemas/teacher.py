from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.user import UserResponse


class TeacherCreate(BaseModel):
    email: str
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: Optional[str] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    title: Optional[str] = None
    hire_date: Optional[date] = None
    contract_type: Optional[str] = None
    hourly_rate: Optional[float] = None
    bio: Optional[str] = None
    office_location: Optional[str] = None


class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    title: Optional[str] = None
    hire_date: Optional[date] = None
    contract_type: Optional[str] = None
    hourly_rate: Optional[float] = None
    bio: Optional[str] = None
    office_location: Optional[str] = None
    status: Optional[str] = None


class TeacherResponse(BaseModel):
    id: UUID
    teacher_id: str
    user_id: UUID
    user: Optional[UserResponse] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    title: Optional[str] = None
    hire_date: Optional[date] = None
    contract_type: Optional[str] = None
    hourly_rate: Optional[float] = None
    bio: Optional[str] = None
    office_location: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeacherListResponse(BaseModel):
    id: UUID
    teacher_id: str
    user: Optional[UserResponse] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    title: Optional[str] = None
    contract_type: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
