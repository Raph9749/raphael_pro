export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "teacher" | "student" | "staff" | "parent";
  avatar?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Student {
  id: string;
  matricule: string;
  user: User;
  date_of_birth: string;
  gender: "M" | "F";
  address: string;
  city: string;
  phone: string;
  emergency_contact: string;
  emergency_phone: string;
  program: Program;
  current_class: ClassGroup;
  enrollment_date: string;
  status: "active" | "inactive" | "graduated" | "suspended" | "withdrawn";
  photo?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  employee_id: string;
  user: User;
  department: string;
  specialization: string;
  qualification: string;
  date_of_birth: string;
  gender: "M" | "F";
  address: string;
  phone: string;
  hire_date: string;
  contract_type: "full-time" | "part-time" | "contract";
  status: "active" | "inactive" | "on_leave";
  subjects: Subject[];
  photo?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string;
  duration_years: number;
  department: string;
  degree_type: string;
  status: "active" | "inactive";
  student_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  program: Program;
  academic_year: string;
  level: number;
  section?: string;
  capacity: number;
  student_count: number;
  class_teacher?: Teacher;
  room?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  coefficient: number;
  program: Program;
  level: number;
  semester: number;
  teacher?: Teacher;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  class_group: ClassGroup;
  subject: Subject;
  teacher: Teacher;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  recurrence: "weekly" | "biweekly" | "once";
  effective_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: string;
  student: Student;
  subject: Subject;
  academic_year: string;
  semester: number;
  assessment_type: "exam" | "quiz" | "assignment" | "project" | "midterm" | "final";
  score: number;
  max_score: number;
  weight: number;
  remarks?: string;
  graded_by: Teacher;
  graded_at: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student: Student;
  class_group: ClassGroup;
  subject?: Subject;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  check_in_time?: string;
  remarks?: string;
  recorded_by: User;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  student: Student;
  amount: number;
  currency: string;
  payment_type: "tuition" | "registration" | "exam" | "library" | "laboratory" | "other";
  payment_method: "cash" | "bank_transfer" | "mobile_money" | "check";
  reference: string;
  status: "pending" | "completed" | "failed" | "refunded";
  due_date: string;
  paid_date?: string;
  academic_year: string;
  semester?: number;
  description: string;
  received_by?: User;
  created_at: string;
  updated_at: string;
}

export interface Admission {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  date_of_birth: string;
  gender: "M" | "F";
  program: Program;
  academic_year: string;
  status: "pending" | "reviewing" | "interview" | "accepted" | "rejected" | "enrolled";
  documents: Document[];
  notes?: string;
  reviewed_by?: User;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: "transcript" | "certificate" | "id_card" | "photo" | "recommendation" | "other";
  uploaded_by: User;
  related_to_type?: string;
  related_to_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender: User;
  recipients: User[];
  subject: string;
  body: string;
  is_read: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  attachments: Document[];
  parent_message?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: "academic" | "cultural" | "sports" | "meeting" | "holiday" | "exam" | "other";
  start_date: string;
  end_date: string;
  location: string;
  organizer: User;
  is_all_day: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Internship {
  id: string;
  student: Student;
  company_name: string;
  company_address: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_phone: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "pending" | "active" | "completed" | "cancelled";
  academic_supervisor?: Teacher;
  evaluation_score?: number;
  report_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: "active" | "completed" | "upcoming";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  total_revenue: number;
  attendance_rate: number;
  pending_payments: number;
  new_admissions: number;
  upcoming_events: number;
}
