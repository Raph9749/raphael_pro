// Shared mock data store with localStorage persistence

// ============== TYPES ==============

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  contractType: string;
  status: "active" | "inactive" | "on_leave";
}

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  program: string;
  level: number;
  students: number;
  capacity: number;
  teacher: string;
  room: string;
  status: "active" | "inactive";
}

export interface ScheduleEvent {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
  day: number; // 0=Lundi ... 4=Vendredi
  startHour: number;
  duration: number;
  type: "cours" | "td" | "examen";
}

export interface Course {
  id: string;
  name: string;
  code: string;
  program: string;
  teacher: string;
  hours: number;
  class: string;
  room: string;
  semester: number;
}

// ============== KEYS ==============

const TEACHERS_KEY = "isce_teachers";
const CLASSES_KEY = "isce_classes";
const EVENTS_KEY = "isce_events";
const COURSES_KEY = "isce_courses";

// ============== DEFAULT DATA ==============

const defaultTeachers: Teacher[] = [
  { id: "1", name: "Dr. Pierre Kamga", employeeId: "ENS-001", email: "p.kamga@isce-alternance.fr", phone: "+33 1 42 00 01", department: "Informatique", specialization: "Algorithmique", contractType: "CDI", status: "active" },
  { id: "2", name: "Pr. Josephine Nkoulou", employeeId: "ENS-002", email: "j.nkoulou@isce-alternance.fr", phone: "+33 1 42 00 02", department: "Informatique", specialization: "Bases de donnees", contractType: "CDI", status: "active" },
  { id: "3", name: "Mme. Isabelle Ekotto", employeeId: "ENS-003", email: "i.ekotto@isce-alternance.fr", phone: "+33 1 42 00 03", department: "Marketing", specialization: "Marketing Digital", contractType: "CDI", status: "active" },
  { id: "4", name: "M. Albert Fouda", employeeId: "ENS-004", email: "a.fouda@isce-alternance.fr", phone: "+33 1 42 00 04", department: "Finance", specialization: "Comptabilite", contractType: "CDI", status: "active" },
  { id: "5", name: "Mme. Helen Johnson", employeeId: "ENS-005", email: "h.johnson@isce-alternance.fr", phone: "+33 1 42 00 05", department: "Langues", specialization: "Anglais des affaires", contractType: "CDD", status: "active" },
  { id: "6", name: "Dr. Francois Onana", employeeId: "ENS-006", email: "f.onana@isce-alternance.fr", phone: "+33 1 42 00 06", department: "Mathematiques", specialization: "Analyse", contractType: "CDI", status: "on_leave" },
  { id: "7", name: "M. Samuel Tamba", employeeId: "ENS-007", email: "s.tamba@isce-alternance.fr", phone: "+33 1 42 00 07", department: "Informatique", specialization: "Reseaux", contractType: "CDI", status: "active" },
  { id: "8", name: "Dr. Angele Mbarga", employeeId: "ENS-008", email: "a.mbarga@isce-alternance.fr", phone: "+33 1 42 00 08", department: "Gestion", specialization: "Management", contractType: "CDI", status: "active" },
  { id: "9", name: "M. Patrick Essono", employeeId: "ENS-009", email: "p.essono@isce-alternance.fr", phone: "+33 1 42 00 09", department: "Droit", specialization: "Droit des affaires", contractType: "Vacataire", status: "active" },
  { id: "10", name: "Mme. Christine Abena", employeeId: "ENS-010", email: "c.abena@isce-alternance.fr", phone: "+33 1 42 00 10", department: "Finance", specialization: "Finance d'entreprise", contractType: "CDI", status: "inactive" },
];

const defaultClasses: ClassGroup[] = [
  { id: "1", name: "L1 Informatique A", code: "L1-INFO-A", program: "Informatique", level: 1, students: 45, capacity: 50, teacher: "Dr. Pierre Kamga", room: "Salle 101", status: "active" },
  { id: "2", name: "L1 Informatique B", code: "L1-INFO-B", program: "Informatique", level: 1, students: 42, capacity: 50, teacher: "Pr. Josephine Nkoulou", room: "Salle 102", status: "active" },
  { id: "3", name: "L2 Informatique A", code: "L2-INFO-A", program: "Informatique", level: 2, students: 35, capacity: 40, teacher: "Dr. Pierre Kamga", room: "Salle 201", status: "active" },
  { id: "4", name: "L2 Informatique B", code: "L2-INFO-B", program: "Informatique", level: 2, students: 32, capacity: 40, teacher: "M. Samuel Tamba", room: "Salle 202", status: "active" },
  { id: "5", name: "L3 Informatique", code: "L3-INFO", program: "Informatique", level: 3, students: 28, capacity: 35, teacher: "Pr. Josephine Nkoulou", room: "Salle 301", status: "active" },
  { id: "6", name: "L1 Gestion A", code: "L1-GEST-A", program: "Gestion", level: 1, students: 48, capacity: 50, teacher: "Dr. Angele Mbarga", room: "Amphi B", status: "active" },
  { id: "7", name: "L1 Gestion B", code: "L1-GEST-B", program: "Gestion", level: 1, students: 46, capacity: 50, teacher: "M. Albert Fouda", room: "Amphi C", status: "active" },
  { id: "8", name: "L2 Gestion", code: "L2-GEST", program: "Gestion", level: 2, students: 38, capacity: 45, teacher: "Dr. Angele Mbarga", room: "Salle 203", status: "active" },
  { id: "9", name: "L3 Gestion", code: "L3-GEST", program: "Gestion", level: 3, students: 25, capacity: 35, teacher: "M. Albert Fouda", room: "Salle 302", status: "active" },
  { id: "10", name: "L1 Marketing", code: "L1-MKT", program: "Marketing", level: 1, students: 40, capacity: 45, teacher: "Mme. Isabelle Ekotto", room: "Salle 103", status: "active" },
  { id: "11", name: "L2 Marketing", code: "L2-MKT", program: "Marketing", level: 2, students: 32, capacity: 40, teacher: "Mme. Isabelle Ekotto", room: "Salle 204", status: "active" },
  { id: "12", name: "M1 Finance", code: "M1-FIN", program: "Finance", level: 4, students: 22, capacity: 30, teacher: "Mme. Christine Abena", room: "Salle 401", status: "active" },
];

const defaultEvents: ScheduleEvent[] = [
  { id: "1", subject: "Algorithmique", teacher: "Dr. Kamga", room: "S.101", class: "L2 Info A", day: 0, startHour: 8, duration: 2, type: "cours" },
  { id: "2", subject: "Reseaux", teacher: "M. Tamba", room: "Labo 2", class: "L2 Info A", day: 0, startHour: 10, duration: 2, type: "td" },
  { id: "3", subject: "Base de donnees", teacher: "Pr. Nkoulou", room: "Labo 3", class: "L2 Info B", day: 1, startHour: 8, duration: 2, type: "cours" },
  { id: "4", subject: "Mathematiques", teacher: "Dr. Onana", room: "Amphi A", class: "L2 Info", day: 1, startHour: 14, duration: 2, type: "cours" },
  { id: "5", subject: "Marketing Digital", teacher: "Mme. Ekotto", room: "S.204", class: "L3 Mkt", day: 2, startHour: 8, duration: 3, type: "cours" },
  { id: "6", subject: "Anglais", teacher: "Mme. Johnson", room: "S.205", class: "L2 Info A", day: 2, startHour: 14, duration: 2, type: "td" },
  { id: "7", subject: "Comptabilite", teacher: "M. Fouda", room: "S.302", class: "L1 Gest", day: 3, startHour: 8, duration: 2, type: "cours" },
  { id: "8", subject: "Intelligence Artificielle", teacher: "Dr. Kamga", room: "Labo 1", class: "M1 Info", day: 3, startHour: 13, duration: 3, type: "cours" },
  { id: "9", subject: "Examen Algorithmique", teacher: "Dr. Kamga", room: "Amphi A", class: "L2 Info", day: 4, startHour: 8, duration: 3, type: "examen" },
  { id: "10", subject: "Structures de donnees", teacher: "Dr. Kamga", room: "S.101", class: "L1 Info A", day: 4, startHour: 14, duration: 2, type: "td" },
];

const defaultCourses: Course[] = [
  { id: "1", name: "Algorithmique Avancee", code: "INFO-201", program: "Informatique", teacher: "Dr. Pierre Kamga", hours: 4, class: "L2 Info A", room: "Salle 101", semester: 1 },
  { id: "2", name: "Algorithmique Avancee", code: "INFO-202", program: "Informatique", teacher: "Dr. Pierre Kamga", hours: 4, class: "L2 Info B", room: "Salle 102", semester: 1 },
  { id: "3", name: "Base de donnees", code: "INFO-203", program: "Informatique", teacher: "Pr. Josephine Nkoulou", hours: 3, class: "L2 Info A", room: "Labo 3", semester: 1 },
  { id: "4", name: "Reseaux", code: "INFO-204", program: "Informatique", teacher: "M. Samuel Tamba", hours: 3, class: "L2 Info A", room: "Labo 2", semester: 1 },
  { id: "5", name: "Intelligence Artificielle", code: "INFO-401", program: "Informatique", teacher: "Dr. Pierre Kamga", hours: 3, class: "M1 Info", room: "Labo 1", semester: 1 },
  { id: "6", name: "Structures de donnees", code: "INFO-101", program: "Informatique", teacher: "Dr. Pierre Kamga", hours: 4, class: "L1 Info A", room: "Amphi A", semester: 1 },
  { id: "7", name: "Marketing Digital", code: "MKT-301", program: "Marketing", teacher: "Mme. Isabelle Ekotto", hours: 3, class: "L3 Mkt", room: "S.204", semester: 1 },
  { id: "8", name: "Comptabilite Generale", code: "GEST-101", program: "Gestion", teacher: "M. Albert Fouda", hours: 2, class: "L1 Gest", room: "S.302", semester: 1 },
  { id: "9", name: "Anglais des Affaires", code: "LANG-201", program: "Langues", teacher: "Mme. Helen Johnson", hours: 2, class: "L2 Info A", room: "S.205", semester: 1 },
  { id: "10", name: "Mathematiques", code: "MATH-201", program: "Mathematiques", teacher: "Dr. Francois Onana", hours: 2, class: "L2 Info", room: "Amphi A", semester: 1 },
  { id: "11", name: "Management", code: "GEST-201", program: "Gestion", teacher: "Dr. Angele Mbarga", hours: 3, class: "L2 Gestion", room: "Salle 203", semester: 1 },
  { id: "12", name: "Droit des Affaires", code: "DROIT-301", program: "Droit", teacher: "M. Patrick Essono", hours: 2, class: "L3 Gestion", room: "Salle 302", semester: 1 },
];

// ============== CRUD HELPERS ==============

function load<T>(key: string, defaults: T[]): T[] {
  if (typeof window === "undefined") return defaults;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============== TEACHERS ==============

export function getTeachers(): Teacher[] {
  return load(TEACHERS_KEY, defaultTeachers);
}

export function getTeacher(id: string): Teacher | undefined {
  return getTeachers().find((t) => t.id === id);
}

export function addTeacher(teacher: Omit<Teacher, "id">): Teacher {
  const teachers = getTeachers();
  const newId = String(Date.now());
  const empNum = teachers.length + 1;
  const newTeacher: Teacher = {
    ...teacher,
    id: newId,
    employeeId: `ENS-${String(empNum).padStart(3, "0")}`,
  };
  teachers.push(newTeacher);
  save(TEACHERS_KEY, teachers);
  return newTeacher;
}

export function updateTeacher(id: string, data: Partial<Teacher>): Teacher | null {
  const teachers = getTeachers();
  const idx = teachers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  teachers[idx] = { ...teachers[idx], ...data };
  save(TEACHERS_KEY, teachers);
  return teachers[idx];
}

export function deleteTeacher(id: string): boolean {
  const teachers = getTeachers();
  const filtered = teachers.filter((t) => t.id !== id);
  if (filtered.length === teachers.length) return false;
  save(TEACHERS_KEY, filtered);
  return true;
}

// ============== CLASSES ==============

export function getClasses(): ClassGroup[] {
  return load(CLASSES_KEY, defaultClasses);
}

export function addClass(cls: Omit<ClassGroup, "id">): ClassGroup {
  const classes = getClasses();
  const newClass: ClassGroup = { ...cls, id: String(Date.now()) };
  classes.push(newClass);
  save(CLASSES_KEY, classes);
  return newClass;
}

export function updateClass(id: string, data: Partial<ClassGroup>): ClassGroup | null {
  const classes = getClasses();
  const idx = classes.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  classes[idx] = { ...classes[idx], ...data };
  save(CLASSES_KEY, classes);
  return classes[idx];
}

export function deleteClass(id: string): boolean {
  const classes = getClasses();
  const filtered = classes.filter((c) => c.id !== id);
  if (filtered.length === classes.length) return false;
  save(CLASSES_KEY, filtered);
  return true;
}

// ============== SCHEDULE EVENTS ==============

export function getEvents(): ScheduleEvent[] {
  return load(EVENTS_KEY, defaultEvents);
}

export function addEvent(event: Omit<ScheduleEvent, "id">): ScheduleEvent {
  const events = getEvents();
  const newEvent: ScheduleEvent = { ...event, id: String(Date.now()) };
  events.push(newEvent);
  save(EVENTS_KEY, events);
  return newEvent;
}

export function updateEvent(id: string, data: Partial<ScheduleEvent>): ScheduleEvent | null {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...data };
  save(EVENTS_KEY, events);
  return events[idx];
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  save(EVENTS_KEY, filtered);
  return true;
}

// ============== COURSES ==============

export function getCourses(): Course[] {
  return load(COURSES_KEY, defaultCourses);
}

export function addCourse(course: Omit<Course, "id">): Course {
  const courses = getCourses();
  const newCourse: Course = { ...course, id: String(Date.now()) };
  courses.push(newCourse);
  save(COURSES_KEY, courses);
  return newCourse;
}

export function updateCourse(id: string, data: Partial<Course>): Course | null {
  const courses = getCourses();
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  courses[idx] = { ...courses[idx], ...data };
  save(COURSES_KEY, courses);
  return courses[idx];
}

export function deleteCourse(id: string): boolean {
  const courses = getCourses();
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) return false;
  save(COURSES_KEY, filtered);
  return true;
}

// ============== HELPERS ==============

export function getTeacherNames(): string[] {
  return getTeachers()
    .filter((t) => t.status === "active")
    .map((t) => t.name);
}

export function getClassNames(): string[] {
  return getClasses()
    .filter((c) => c.status === "active")
    .map((c) => c.name);
}

export function getCourseNames(): string[] {
  return getCourses().map((c) => c.name);
}

export const PROGRAMS = ["Informatique", "Gestion", "Marketing", "Finance", "Droit", "Langues", "Mathematiques"];
export const DEPARTMENTS = ["Informatique", "Gestion", "Marketing", "Finance", "Droit", "Langues", "Mathematiques", "Sciences et Technologies"];
export const ROOMS = ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202", "Salle 203", "Salle 204", "Salle 301", "Salle 302", "Salle 401", "Amphi A", "Amphi B", "Amphi C", "Labo 1", "Labo 2", "Labo 3", "S.101", "S.204", "S.205", "S.302"];
export const CONTRACT_TYPES = ["CDI", "CDD", "Vacataire"];
