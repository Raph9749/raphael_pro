from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List

from sqlalchemy import func, extract, case, and_
from sqlalchemy.orm import Session

from app.models.student import Student
from app.models.teacher import Teacher
from app.models.academic import ClassGroup, Program, Enrollment, CourseModule
from app.models.attendance import AttendanceRecord, AttendanceSession
from app.models.grade import Grade, Exam
from app.models.finance import Invoice, Payment
from app.models.admission import Candidate


def get_dashboard_stats(db: Session) -> Dict[str, Any]:
    """Get main dashboard KPI statistics."""
    total_students = db.query(func.count(Student.id)).filter(
        Student.is_deleted == False, Student.status == "active"
    ).scalar() or 0

    total_teachers = db.query(func.count(Teacher.id)).filter(
        Teacher.is_deleted == False, Teacher.status == "active"
    ).scalar() or 0

    total_classes = db.query(func.count(ClassGroup.id)).filter(
        ClassGroup.is_deleted == False, ClassGroup.is_active == True
    ).scalar() or 0

    total_programs = db.query(func.count(Program.id)).filter(
        Program.is_deleted == False, Program.is_active == True
    ).scalar() or 0

    # Revenue stats
    total_revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.status == "completed"
    ).scalar() or 0

    total_outstanding = db.query(
        func.coalesce(func.sum(Invoice.total_amount - Invoice.paid_amount), 0)
    ).filter(
        Invoice.is_deleted == False,
        Invoice.status.in_(["pending", "partial", "overdue"]),
    ).scalar() or 0

    # Attendance rate for the last 30 days
    thirty_days_ago = date.today() - timedelta(days=30)
    total_records = db.query(func.count(AttendanceRecord.id)).join(
        AttendanceSession
    ).filter(
        AttendanceSession.session_date >= thirty_days_ago
    ).scalar() or 0

    present_records = db.query(func.count(AttendanceRecord.id)).join(
        AttendanceSession
    ).filter(
        AttendanceSession.session_date >= thirty_days_ago,
        AttendanceRecord.status.in_(["present", "late"]),
    ).scalar() or 0

    attendance_rate = round((present_records / total_records * 100), 1) if total_records > 0 else 0.0

    # Active candidates
    active_candidates = db.query(func.count(Candidate.id)).filter(
        Candidate.is_deleted == False,
        Candidate.status.in_(["submitted", "under_review", "interview_scheduled", "interview_completed"]),
    ).scalar() or 0

    # Average grade
    avg_grade = db.query(func.avg(Grade.score)).filter(
        Grade.score.isnot(None), Grade.is_absent == False
    ).scalar()
    avg_grade = round(float(avg_grade), 2) if avg_grade else 0.0

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_classes": total_classes,
        "total_programs": total_programs,
        "total_revenue": round(float(total_revenue), 2),
        "total_outstanding": round(float(total_outstanding), 2),
        "attendance_rate": attendance_rate,
        "active_candidates": active_candidates,
        "average_grade": avg_grade,
    }


def get_enrollment_trends(db: Session, months: int = 12) -> List[Dict[str, Any]]:
    """Get enrollment trends by month for the last N months."""
    results = []
    today = date.today()
    for i in range(months - 1, -1, -1):
        month_date = today.replace(day=1) - timedelta(days=i * 30)
        month_start = month_date.replace(day=1)
        if month_start.month == 12:
            month_end = month_start.replace(year=month_start.year + 1, month=1)
        else:
            month_end = month_start.replace(month=month_start.month + 1)

        count = db.query(func.count(Student.id)).filter(
            Student.is_deleted == False,
            Student.created_at >= month_start,
            Student.created_at < month_end,
        ).scalar() or 0

        results.append({
            "month": month_start.strftime("%Y-%m"),
            "label": month_start.strftime("%b %Y"),
            "new_students": count,
        })
    return results


def get_revenue_analytics(db: Session, year: int = None) -> Dict[str, Any]:
    """Get revenue analytics for a given year."""
    if year is None:
        year = date.today().year

    monthly_revenue = []
    for month in range(1, 13):
        revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
            Payment.status == "completed",
            extract("year", Payment.payment_date) == year,
            extract("month", Payment.payment_date) == month,
        ).scalar() or 0

        invoiced = db.query(func.coalesce(func.sum(Invoice.total_amount), 0)).filter(
            Invoice.is_deleted == False,
            extract("year", Invoice.issue_date) == year,
            extract("month", Invoice.issue_date) == month,
        ).scalar() or 0

        monthly_revenue.append({
            "month": month,
            "label": date(year, month, 1).strftime("%b"),
            "revenue": round(float(revenue), 2),
            "invoiced": round(float(invoiced), 2),
        })

    total_year_revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(
        Payment.status == "completed",
        extract("year", Payment.payment_date) == year,
    ).scalar() or 0

    total_year_invoiced = db.query(func.coalesce(func.sum(Invoice.total_amount), 0)).filter(
        Invoice.is_deleted == False,
        extract("year", Invoice.issue_date) == year,
    ).scalar() or 0

    collection_rate = round((float(total_year_revenue) / float(total_year_invoiced) * 100), 1) if float(total_year_invoiced) > 0 else 0.0

    return {
        "year": year,
        "total_revenue": round(float(total_year_revenue), 2),
        "total_invoiced": round(float(total_year_invoiced), 2),
        "collection_rate": collection_rate,
        "monthly": monthly_revenue,
    }


def get_attendance_stats(db: Session) -> Dict[str, Any]:
    """Get attendance statistics."""
    total = db.query(func.count(AttendanceRecord.id)).scalar() or 0
    present = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.status == "present"
    ).scalar() or 0
    absent = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.status == "absent"
    ).scalar() or 0
    late = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.status == "late"
    ).scalar() or 0
    excused = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.status == "excused"
    ).scalar() or 0

    # By class group
    by_class = []
    class_stats = db.query(
        ClassGroup.name,
        func.count(AttendanceRecord.id).label("total"),
        func.sum(case((AttendanceRecord.status.in_(["present", "late"]), 1), else_=0)).label("present_count"),
    ).join(
        AttendanceSession, AttendanceSession.class_group_id == ClassGroup.id
    ).join(
        AttendanceRecord, AttendanceRecord.session_id == AttendanceSession.id
    ).filter(
        ClassGroup.is_deleted == False
    ).group_by(ClassGroup.name).all()

    for stat in class_stats:
        rate = round((int(stat.present_count) / int(stat.total) * 100), 1) if int(stat.total) > 0 else 0.0
        by_class.append({
            "class_name": stat.name,
            "total_records": int(stat.total),
            "attendance_rate": rate,
        })

    return {
        "total_records": total,
        "present": present,
        "absent": absent,
        "late": late,
        "excused": excused,
        "overall_rate": round((present + late) / total * 100, 1) if total > 0 else 0.0,
        "by_class": by_class,
    }


def get_academic_performance(db: Session) -> Dict[str, Any]:
    """Get academic performance statistics."""
    avg_score = db.query(func.avg(Grade.score)).filter(
        Grade.score.isnot(None), Grade.is_absent == False
    ).scalar()
    avg_score = round(float(avg_score), 2) if avg_score else 0.0

    # Grade distribution
    distribution = {
        "excellent": 0,  # 16-20
        "bien": 0,       # 14-16
        "assez_bien": 0, # 12-14
        "passable": 0,   # 10-12
        "insuffisant": 0, # <10
    }

    grades = db.query(Grade.score).filter(
        Grade.score.isnot(None), Grade.is_absent == False
    ).all()

    for (score,) in grades:
        if score >= 16:
            distribution["excellent"] += 1
        elif score >= 14:
            distribution["bien"] += 1
        elif score >= 12:
            distribution["assez_bien"] += 1
        elif score >= 10:
            distribution["passable"] += 1
        else:
            distribution["insuffisant"] += 1

    # By program
    by_program = []
    program_stats = db.query(
        Program.name,
        func.avg(Grade.score).label("avg_score"),
        func.count(Grade.id).label("grade_count"),
    ).join(
        CourseModule, CourseModule.program_id == Program.id
    ).join(
        Grade, Grade.course_module_id == CourseModule.id
    ).filter(
        Grade.score.isnot(None),
        Grade.is_absent == False,
        Program.is_deleted == False,
    ).group_by(Program.name).all()

    for stat in program_stats:
        by_program.append({
            "program": stat.name,
            "average": round(float(stat.avg_score), 2),
            "total_grades": int(stat.grade_count),
        })

    # Success rate (>= 10/20)
    total_graded = len(grades)
    passed = sum(1 for (score,) in grades if score >= 10)
    success_rate = round(passed / total_graded * 100, 1) if total_graded > 0 else 0.0

    return {
        "average_score": avg_score,
        "success_rate": success_rate,
        "total_grades": total_graded,
        "distribution": distribution,
        "by_program": by_program,
    }
