from enum import Enum
from functools import wraps
from typing import List, Optional

from fastapi import HTTPException, status


class ModulePermission(str, Enum):
    # Users
    USERS_VIEW = "users.view"
    USERS_CREATE = "users.create"
    USERS_EDIT = "users.edit"
    USERS_DELETE = "users.delete"

    # Students
    STUDENTS_VIEW = "students.view"
    STUDENTS_CREATE = "students.create"
    STUDENTS_EDIT = "students.edit"
    STUDENTS_DELETE = "students.delete"
    STUDENTS_EXPORT = "students.export"

    # Teachers
    TEACHERS_VIEW = "teachers.view"
    TEACHERS_CREATE = "teachers.create"
    TEACHERS_EDIT = "teachers.edit"
    TEACHERS_DELETE = "teachers.delete"

    # Programs
    PROGRAMS_VIEW = "programs.view"
    PROGRAMS_CREATE = "programs.create"
    PROGRAMS_EDIT = "programs.edit"
    PROGRAMS_DELETE = "programs.delete"

    # Classes
    CLASSES_VIEW = "classes.view"
    CLASSES_CREATE = "classes.create"
    CLASSES_EDIT = "classes.edit"
    CLASSES_DELETE = "classes.delete"

    # Schedule
    SCHEDULE_VIEW = "schedule.view"
    SCHEDULE_CREATE = "schedule.create"
    SCHEDULE_EDIT = "schedule.edit"
    SCHEDULE_DELETE = "schedule.delete"

    # Attendance
    ATTENDANCE_VIEW = "attendance.view"
    ATTENDANCE_CREATE = "attendance.create"
    ATTENDANCE_EDIT = "attendance.edit"

    # Grades
    GRADES_VIEW = "grades.view"
    GRADES_CREATE = "grades.create"
    GRADES_EDIT = "grades.edit"
    GRADES_DELETE = "grades.delete"

    # Finance
    FINANCE_VIEW = "finance.view"
    FINANCE_CREATE = "finance.create"
    FINANCE_EDIT = "finance.edit"
    FINANCE_DELETE = "finance.delete"

    # Admissions
    ADMISSIONS_VIEW = "admissions.view"
    ADMISSIONS_CREATE = "admissions.create"
    ADMISSIONS_EDIT = "admissions.edit"
    ADMISSIONS_DELETE = "admissions.delete"

    # Communication
    COMMUNICATION_VIEW = "communication.view"
    COMMUNICATION_CREATE = "communication.create"
    COMMUNICATION_EDIT = "communication.edit"
    COMMUNICATION_DELETE = "communication.delete"

    # Documents
    DOCUMENTS_VIEW = "documents.view"
    DOCUMENTS_CREATE = "documents.create"
    DOCUMENTS_EDIT = "documents.edit"
    DOCUMENTS_DELETE = "documents.delete"

    # Internships
    INTERNSHIPS_VIEW = "internships.view"
    INTERNSHIPS_CREATE = "internships.create"
    INTERNSHIPS_EDIT = "internships.edit"
    INTERNSHIPS_DELETE = "internships.delete"

    # Events
    EVENTS_VIEW = "events.view"
    EVENTS_CREATE = "events.create"
    EVENTS_EDIT = "events.edit"
    EVENTS_DELETE = "events.delete"

    # Analytics
    ANALYTICS_VIEW = "analytics.view"

    # Settings
    SETTINGS_VIEW = "settings.view"
    SETTINGS_EDIT = "settings.edit"

    # Audit
    AUDIT_VIEW = "audit.view"


# Role-based default permissions
ROLE_PERMISSIONS: dict[str, List[str]] = {
    "super_admin": [p.value for p in ModulePermission],
    "admin": [p.value for p in ModulePermission],
    "academic_manager": [
        ModulePermission.STUDENTS_VIEW.value,
        ModulePermission.STUDENTS_EDIT.value,
        ModulePermission.STUDENTS_EXPORT.value,
        ModulePermission.TEACHERS_VIEW.value,
        ModulePermission.TEACHERS_EDIT.value,
        ModulePermission.PROGRAMS_VIEW.value,
        ModulePermission.PROGRAMS_CREATE.value,
        ModulePermission.PROGRAMS_EDIT.value,
        ModulePermission.CLASSES_VIEW.value,
        ModulePermission.CLASSES_CREATE.value,
        ModulePermission.CLASSES_EDIT.value,
        ModulePermission.SCHEDULE_VIEW.value,
        ModulePermission.SCHEDULE_CREATE.value,
        ModulePermission.SCHEDULE_EDIT.value,
        ModulePermission.ATTENDANCE_VIEW.value,
        ModulePermission.GRADES_VIEW.value,
        ModulePermission.GRADES_EDIT.value,
        ModulePermission.ANALYTICS_VIEW.value,
    ],
    "finance_manager": [
        ModulePermission.STUDENTS_VIEW.value,
        ModulePermission.FINANCE_VIEW.value,
        ModulePermission.FINANCE_CREATE.value,
        ModulePermission.FINANCE_EDIT.value,
        ModulePermission.FINANCE_DELETE.value,
        ModulePermission.ANALYTICS_VIEW.value,
    ],
    "teacher": [
        ModulePermission.STUDENTS_VIEW.value,
        ModulePermission.CLASSES_VIEW.value,
        ModulePermission.SCHEDULE_VIEW.value,
        ModulePermission.ATTENDANCE_VIEW.value,
        ModulePermission.ATTENDANCE_CREATE.value,
        ModulePermission.ATTENDANCE_EDIT.value,
        ModulePermission.GRADES_VIEW.value,
        ModulePermission.GRADES_CREATE.value,
        ModulePermission.GRADES_EDIT.value,
        ModulePermission.COMMUNICATION_VIEW.value,
        ModulePermission.COMMUNICATION_CREATE.value,
        ModulePermission.INTERNSHIPS_VIEW.value,
        ModulePermission.EVENTS_VIEW.value,
    ],
    "student": [
        ModulePermission.SCHEDULE_VIEW.value,
        ModulePermission.ATTENDANCE_VIEW.value,
        ModulePermission.GRADES_VIEW.value,
        ModulePermission.FINANCE_VIEW.value,
        ModulePermission.COMMUNICATION_VIEW.value,
        ModulePermission.DOCUMENTS_VIEW.value,
        ModulePermission.INTERNSHIPS_VIEW.value,
        ModulePermission.EVENTS_VIEW.value,
    ],
    "admissions_officer": [
        ModulePermission.ADMISSIONS_VIEW.value,
        ModulePermission.ADMISSIONS_CREATE.value,
        ModulePermission.ADMISSIONS_EDIT.value,
        ModulePermission.ADMISSIONS_DELETE.value,
        ModulePermission.STUDENTS_VIEW.value,
        ModulePermission.STUDENTS_CREATE.value,
        ModulePermission.PROGRAMS_VIEW.value,
        ModulePermission.COMMUNICATION_VIEW.value,
        ModulePermission.COMMUNICATION_CREATE.value,
        ModulePermission.DOCUMENTS_VIEW.value,
        ModulePermission.DOCUMENTS_CREATE.value,
    ],
    "internship_manager": [
        ModulePermission.INTERNSHIPS_VIEW.value,
        ModulePermission.INTERNSHIPS_CREATE.value,
        ModulePermission.INTERNSHIPS_EDIT.value,
        ModulePermission.INTERNSHIPS_DELETE.value,
        ModulePermission.STUDENTS_VIEW.value,
        ModulePermission.COMPANIES_VIEW.value if hasattr(ModulePermission, "COMPANIES_VIEW") else ModulePermission.INTERNSHIPS_VIEW.value,
    ],
}


def check_permissions(user_permissions: List[str], required_permissions: List[str]) -> bool:
    """Check if user has all required permissions."""
    return all(perm in user_permissions for perm in required_permissions)


def check_any_permission(user_permissions: List[str], required_permissions: List[str]) -> bool:
    """Check if user has any of the required permissions."""
    return any(perm in user_permissions for perm in required_permissions)


class PermissionChecker:
    """Dependency for checking permissions in route handlers."""

    def __init__(self, required_permissions: List[str], require_all: bool = True):
        self.required_permissions = required_permissions
        self.require_all = require_all

    def __call__(self, current_user) -> bool:
        user_permissions = current_user.get("permissions", [])
        user_role = current_user.get("role", "")

        # Super admin bypasses all checks
        if user_role == "super_admin":
            return True

        if self.require_all:
            has_permission = check_permissions(user_permissions, self.required_permissions)
        else:
            has_permission = check_any_permission(user_permissions, self.required_permissions)

        if not has_permission:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissions insuffisantes pour cette action.",
            )
        return True


def require_permissions(*permissions: str, require_all: bool = True):
    """Create a permission checker dependency."""
    return PermissionChecker(list(permissions), require_all)
