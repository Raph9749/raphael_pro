from fastapi import APIRouter

from app.api.v1 import (
    auth,
    users,
    students,
    teachers,
    programs,
    classes,
    schedule,
    attendance,
    grades,
    finance,
    admissions,
    communication,
    documents,
    internships,
    events,
    analytics,
    settings,
    audit_logs,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["Teachers"])
api_router.include_router(programs.router, prefix="/programs", tags=["Programs"])
api_router.include_router(classes.router, prefix="/classes", tags=["Classes"])
api_router.include_router(schedule.router, prefix="/schedule", tags=["Schedule"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
api_router.include_router(grades.router, prefix="/grades", tags=["Grades"])
api_router.include_router(finance.router, prefix="/finance", tags=["Finance"])
api_router.include_router(admissions.router, prefix="/admissions", tags=["Admissions"])
api_router.include_router(communication.router, prefix="/communication", tags=["Communication"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(internships.router, prefix="/internships", tags=["Internships"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(audit_logs.router, prefix="/audit-logs", tags=["Audit Logs"])
