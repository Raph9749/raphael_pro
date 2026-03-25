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

export interface Student {
  id: string;
  name: string;
  matricule: string;
  email: string;
  phone: string;
  programme: string;
  classe: string;
  dateNaissance: string;
  status: "active" | "inactive" | "graduated" | "suspended";
}

export interface Program {
  id: string;
  name: string;
  code: string;
  degree: string;
  department: string;
  duration: number;
  capacity: number;
  description: string;
  levels: string[];
  status: "active" | "inactive";
}

// ============== KEYS ==============

const TEACHERS_KEY = "isce_teachers";
const CLASSES_KEY = "isce_classes";
const EVENTS_KEY = "isce_events";
const COURSES_KEY = "isce_courses";
const STUDENTS_KEY = "isce_students";
const PROGRAMS_KEY = "isce_programs";

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

const defaultStudents: Student[] = [
  { id: "1", name: "Marie Nguema", matricule: "STU-2024-001", email: "m.nguema@mail.fr", phone: "+33 6 10 00 01", programme: "Informatique", classe: "L2 Informatique A", dateNaissance: "2003-05-12", status: "active" },
  { id: "2", name: "Paul Atangana", matricule: "STU-2024-002", email: "p.atangana@mail.fr", phone: "+33 6 10 00 02", programme: "Gestion des Entreprises", classe: "L1 Gestion B", dateNaissance: "2004-02-20", status: "active" },
  { id: "3", name: "Aissatou Diallo", matricule: "STU-2024-003", email: "a.diallo@mail.fr", phone: "+33 6 10 00 03", programme: "Marketing et Communication", classe: "L2 Marketing", dateNaissance: "2003-09-15", status: "active" },
  { id: "4", name: "Emmanuel Nkoulou", matricule: "STU-2024-004", email: "e.nkoulou@mail.fr", phone: "+33 6 10 00 04", programme: "Finance et Comptabilite", classe: "M1 Finance", dateNaissance: "2001-11-08", status: "active" },
  { id: "5", name: "Sandrine Essomba", matricule: "STU-2024-005", email: "s.essomba@mail.fr", phone: "+33 6 10 00 05", programme: "Informatique", classe: "L3 Informatique", dateNaissance: "2002-07-25", status: "suspended" },
  { id: "6", name: "Jean-Claude Fouda", matricule: "STU-2024-006", email: "jc.fouda@mail.fr", phone: "+33 6 10 00 06", programme: "Droit des Affaires", classe: "L1 Gestion A", dateNaissance: "2004-01-30", status: "active" },
  { id: "7", name: "Celine Mvondo", matricule: "STU-2024-007", email: "c.mvondo@mail.fr", phone: "+33 6 10 00 07", programme: "Finance et Comptabilite", classe: "M1 Finance", dateNaissance: "2001-06-18", status: "active" },
  { id: "8", name: "Andre Biya", matricule: "STU-2024-008", email: "a.biya@mail.fr", phone: "+33 6 10 00 08", programme: "Gestion des Entreprises", classe: "L2 Gestion", dateNaissance: "2003-04-10", status: "inactive" },
  { id: "9", name: "Florence Onana", matricule: "STU-2024-009", email: "f.onana@mail.fr", phone: "+33 6 10 00 09", programme: "Marketing et Communication", classe: "L1 Marketing", dateNaissance: "2004-08-22", status: "active" },
  { id: "10", name: "Patrick Mbarga", matricule: "STU-2024-010", email: "p.mbarga@mail.fr", phone: "+33 6 10 00 10", programme: "Informatique", classe: "L1 Informatique B", dateNaissance: "2004-12-05", status: "active" },
  { id: "11", name: "Rose Ekotto", matricule: "STU-2024-011", email: "r.ekotto@mail.fr", phone: "+33 6 10 00 11", programme: "Droit des Affaires", classe: "L1 Gestion A", dateNaissance: "2002-03-14", status: "graduated" },
  { id: "12", name: "Samuel Tamba Jr", matricule: "STU-2024-012", email: "s.tamba.jr@mail.fr", phone: "+33 6 10 00 12", programme: "Finance et Comptabilite", classe: "M1 Finance", dateNaissance: "2000-10-28", status: "active" },
  { id: "13", name: "Beatrice Ngo", matricule: "STU-2024-013", email: "b.ngo@mail.fr", phone: "+33 6 10 00 13", programme: "Informatique", classe: "L2 Informatique B", dateNaissance: "2003-01-17", status: "active" },
  { id: "14", name: "Thierry Kamga", matricule: "STU-2024-014", email: "t.kamga@mail.fr", phone: "+33 6 10 00 14", programme: "Gestion des Entreprises", classe: "L3 Gestion", dateNaissance: "2002-06-09", status: "active" },
  { id: "15", name: "Nadine Owono", matricule: "STU-2024-015", email: "n.owono@mail.fr", phone: "+33 6 10 00 15", programme: "Marketing et Communication", classe: "L2 Marketing", dateNaissance: "2003-11-03", status: "active" },
];

const defaultPrograms: Program[] = [
  { id: "1", name: "Informatique", code: "INFO", degree: "Licence & Master", department: "Sciences et Technologies", duration: 5, capacity: 350, description: "Formation en developpement logiciel, reseaux, bases de donnees, intelligence artificielle et cybersecurite.", levels: ["L1", "L2", "L3", "M1", "M2"], status: "active" },
  { id: "2", name: "Gestion des Entreprises", code: "GEST", degree: "Licence", department: "Sciences de Gestion", duration: 3, capacity: 300, description: "Formation en management, comptabilite, ressources humaines et strategie d'entreprise.", levels: ["L1", "L2", "L3"], status: "active" },
  { id: "3", name: "Marketing et Communication", code: "MKT", degree: "Licence", department: "Commerce", duration: 3, capacity: 220, description: "Formation en marketing digital, communication d'entreprise, etudes de marche et publicite.", levels: ["L1", "L2", "L3"], status: "active" },
  { id: "4", name: "Finance et Comptabilite", code: "FIN", degree: "Licence & Master", department: "Sciences de Gestion", duration: 5, capacity: 250, description: "Formation en finance d'entreprise, analyse financiere, audit et controle de gestion.", levels: ["L1", "L2", "L3", "M1", "M2"], status: "active" },
  { id: "5", name: "Droit des Affaires", code: "DROIT", degree: "Licence", department: "Sciences Juridiques", duration: 3, capacity: 180, description: "Formation en droit commercial, droit du travail, droit fiscal et procedures juridiques.", levels: ["L1", "L2", "L3"], status: "active" },
  { id: "6", name: "Tourisme et Hotellerie", code: "TOUR", degree: "BTS", department: "Services", duration: 2, capacity: 60, description: "Programme en preparation - ouverture prevue pour 2026-2027.", levels: [], status: "inactive" },
];

// ============== DATA VERSION (forces reset when schema changes) ==============

const DATA_VERSION = "3";
const VERSION_KEY = "isce_data_version";

function checkVersion(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(VERSION_KEY);
  if (stored !== DATA_VERSION) {
    // Clear all ISCE data to force reload from new defaults
    localStorage.removeItem(TEACHERS_KEY);
    localStorage.removeItem(CLASSES_KEY);
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(COURSES_KEY);
    localStorage.removeItem(STUDENTS_KEY);
    localStorage.removeItem(PROGRAMS_KEY);
    localStorage.removeItem("isce_grades");
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
  }
}

// Run version check on module load
checkVersion();

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

// ============== STUDENTS ==============

export function getStudents(): Student[] {
  return load(STUDENTS_KEY, defaultStudents);
}

export function getStudent(id: string): Student | undefined {
  return getStudents().find((s) => s.id === id);
}

export function addStudent(student: Omit<Student, "id" | "matricule">): Student {
  const students = getStudents();
  const num = students.length + 1;
  const newStudent: Student = {
    ...student,
    id: String(Date.now()),
    matricule: `STU-2024-${String(num).padStart(3, "0")}`,
  };
  students.push(newStudent);
  save(STUDENTS_KEY, students);
  return newStudent;
}

export function updateStudent(id: string, data: Partial<Student>): Student | null {
  const students = getStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...data };
  save(STUDENTS_KEY, students);
  return students[idx];
}

export function deleteStudent(id: string): boolean {
  const students = getStudents();
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length === students.length) return false;
  save(STUDENTS_KEY, filtered);
  return true;
}

// ============== PROGRAMS ==============

export function getPrograms(): Program[] {
  return load(PROGRAMS_KEY, defaultPrograms);
}

export function getProgram(id: string): Program | undefined {
  return getPrograms().find((p) => p.id === id);
}

export function addProgram(program: Omit<Program, "id">): Program {
  const programs = getPrograms();
  const newProgram: Program = { ...program, id: String(Date.now()) };
  programs.push(newProgram);
  save(PROGRAMS_KEY, programs);
  return newProgram;
}

export function updateProgram(id: string, data: Partial<Program>): Program | null {
  const programs = getPrograms();
  const idx = programs.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  programs[idx] = { ...programs[idx], ...data };
  save(PROGRAMS_KEY, programs);
  return programs[idx];
}

export function deleteProgram(id: string): boolean {
  const programs = getPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  if (filtered.length === programs.length) return false;
  save(PROGRAMS_KEY, filtered);
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

export function getProgramNames(): string[] {
  return getPrograms()
    .filter((p) => p.status === "active")
    .map((p) => p.name);
}

export function getStudentsByClass(className: string): Student[] {
  return getStudents().filter((s) => s.classe === className && s.status === "active");
}

export function getStudentsByProgram(programName: string): Student[] {
  const firstWord = programName.split(" ")[0].toLowerCase();
  return getStudents().filter((s) =>
    s.programme === programName ||
    s.programme.toLowerCase() === firstWord ||
    s.programme.split(" ")[0].toLowerCase() === firstWord
  );
}

export function getCoursesByTeacher(teacherName: string): Course[] {
  return getCourses().filter((c) => c.teacher === teacherName);
}

export function getCoursesByTeacherLastName(lastName: string): Course[] {
  const lowerLast = lastName.toLowerCase();
  return getCourses().filter((c) => c.teacher.toLowerCase().includes(lowerLast));
}

export function getTeacherByLastName(lastName: string): Teacher | undefined {
  const lowerLast = lastName.toLowerCase();
  return getTeachers().find((t) => t.name.toLowerCase().includes(lowerLast));
}

export function getStudentByLastName(lastName: string): Student | undefined {
  const lowerLast = lastName.toLowerCase();
  return getStudents().find((s) => s.name.toLowerCase().includes(lowerLast));
}

export function getCoursesByClass(className: string): Course[] {
  const lower = className.toLowerCase();
  return getCourses().filter((c) =>
    c.class.toLowerCase() === lower ||
    c.class.toLowerCase().includes(lower) ||
    lower.includes(c.class.toLowerCase())
  );
}

export function getEventsByClass(className: string): ScheduleEvent[] {
  const lower = className.toLowerCase();
  // Match short class names like "L2 Info A" against event class
  return getEvents().filter((e) => {
    const eClass = e.class.toLowerCase();
    return eClass === lower ||
      eClass.includes(lower) ||
      lower.includes(eClass);
  });
}

export const DEPARTMENTS = ["Informatique", "Gestion", "Marketing", "Finance", "Droit", "Langues", "Mathematiques", "Sciences et Technologies", "Commerce", "Sciences de Gestion", "Sciences Juridiques", "Services"];
export const ROOMS = ["Salle 101", "Salle 102", "Salle 103", "Salle 201", "Salle 202", "Salle 203", "Salle 204", "Salle 301", "Salle 302", "Salle 401", "Amphi A", "Amphi B", "Amphi C", "Labo 1", "Labo 2", "Labo 3", "S.101", "S.204", "S.205", "S.302"];
export const CONTRACT_TYPES = ["CDI", "CDD", "Vacataire"];
export const DEGREES = ["BTS", "Licence", "Licence & Master", "Master"];

// ============== GRADES ==============

export interface StudentGrade {
  name: string;
  matricule: string;
  cc1: number;
  cc2: number;
  tp: number;
  exam: number;
}

const GRADES_KEY = "isce_grades";

function buildDefaultGrades(): Record<string, StudentGrade[]> {
  // Build grade entries from students in each class + course combination
  const students = getStudents();
  const courses = getCourses();
  const grades: Record<string, StudentGrade[]> = {};

  for (const course of courses) {
    // Find students whose class matches (partial match for short names)
    const classStudents = students.filter((s) =>
      s.status === "active" && (
        s.classe === course.class ||
        s.classe.toLowerCase().includes(course.class.toLowerCase().replace(/\s+/g, " ")) ||
        course.class.toLowerCase().includes(s.classe.toLowerCase().split(" ").slice(0, 2).join(" "))
      )
    );
    if (classStudents.length === 0) continue;

    const key = `${course.id}-${course.code}`;
    grades[key] = classStudents.map((s) => ({
      name: s.name,
      matricule: s.matricule,
      cc1: Math.round(Math.random() * 8 + 8),  // 8-16
      cc2: Math.round(Math.random() * 8 + 8),
      tp: Math.round(Math.random() * 8 + 9),   // 9-17
      exam: Math.round(Math.random() * 10 + 6), // 6-16
    }));
  }
  return grades;
}

export function getGrades(): Record<string, StudentGrade[]> {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(GRADES_KEY);
  if (!stored) {
    const defaults = buildDefaultGrades();
    localStorage.setItem(GRADES_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(stored);
}

export function saveGrades(data: Record<string, StudentGrade[]>): void {
  localStorage.setItem(GRADES_KEY, JSON.stringify(data));
}

// ============== STATS HELPERS ==============

export function getSchoolStats() {
  const students = getStudents();
  const teachers = getTeachers();
  const classes = getClasses();
  const courses = getCourses();
  const programs = getPrograms();
  const events = getEvents();

  const activeStudents = students.filter((s) => s.status === "active").length;
  const activeTeachers = teachers.filter((t) => t.status === "active").length;
  const activeClasses = classes.filter((c) => c.status === "active").length;
  const activePrograms = programs.filter((p) => p.status === "active").length;

  // Students per program for pie chart
  const studentsByProgram = programs
    .filter((p) => p.status === "active")
    .map((p) => {
      const count = students.filter((s) => s.programme === p.name || s.programme === p.name.split(" ")[0]).length;
      return { name: p.name, value: count };
    })
    .filter((p) => p.value > 0);

  // Today's events (use day of week: 0=Mon)
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
  const todayEvents = events.filter((e) => e.day === dayOfWeek).sort((a, b) => a.startHour - b.startHour);

  return {
    totalStudents: students.length,
    activeStudents,
    totalTeachers: teachers.length,
    activeTeachers,
    totalClasses: activeClasses,
    totalCourses: courses.length,
    totalPrograms: activePrograms,
    totalEvents: events.length,
    studentsByProgram,
    todayEvents,
  };
}

// ============== CSV EXPORT ==============

export function exportStudentsCSV(): string {
  const students = getStudents();
  const header = "Matricule,Nom,Email,Telephone,Programme,Classe,Date de naissance,Statut";
  const rows = students.map((s) =>
    `${s.matricule},"${s.name}",${s.email},${s.phone},${s.programme},"${s.classe}",${s.dateNaissance},${s.status}`
  );
  return [header, ...rows].join("\n");
}

export function exportTeachersCSV(): string {
  const teachers = getTeachers();
  const header = "ID,Nom,Email,Telephone,Departement,Specialisation,Contrat,Statut";
  const rows = teachers.map((t) =>
    `${t.employeeId},"${t.name}",${t.email},${t.phone},${t.department},"${t.specialization}",${t.contractType},${t.status}`
  );
  return [header, ...rows].join("\n");
}

export function exportGradesCSV(courseKey: string, courseName: string): string {
  const grades = getGrades();
  const students = grades[courseKey] || [];
  const header = `Matricule,Nom,CC1,CC2,TP,Examen,Moyenne,Decision`;
  const rows = students.map((s) => {
    const avg = s.cc1 * 0.2 + s.cc2 * 0.2 + s.tp * 0.2 + s.exam * 0.4;
    return `${s.matricule},"${s.name}",${s.cc1},${s.cc2},${s.tp},${s.exam},${avg.toFixed(1)},${avg >= 10 ? "Valide" : "Non valide"}`;
  });
  return [header, ...rows].join("\n");
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
