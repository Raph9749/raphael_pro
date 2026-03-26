"use client";

import * as React from "react";
import { Save, Calendar, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/common/stats-card";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import { useAuthStore } from "@/stores/auth-store";
import { getStudentByLastName } from "@/lib/mock-data";

type AttendanceStatus = "present" | "absent" | "late" | null;

interface StudentAttendance {
  id: string;
  name: string;
  matricule: string;
  status: AttendanceStatus;
}

const initialStudents: StudentAttendance[] = [
  { id: "1", name: "Marie Nguema", matricule: "STU-001", status: "present" },
  { id: "2", name: "Paul Atangana", matricule: "STU-002", status: "present" },
  { id: "3", name: "Aissatou Diallo", matricule: "STU-003", status: "present" },
  { id: "4", name: "Emmanuel Nkoulou", matricule: "STU-004", status: "absent" },
  { id: "5", name: "Sandrine Essomba", matricule: "STU-005", status: "present" },
  { id: "6", name: "Jean-Claude Fouda", matricule: "STU-006", status: "late" },
  { id: "7", name: "Celine Mvondo", matricule: "STU-007", status: "present" },
  { id: "8", name: "Andre Biya", matricule: "STU-008", status: "present" },
  { id: "9", name: "Florence Onana", matricule: "STU-009", status: "absent" },
  { id: "10", name: "Patrick Mbarga", matricule: "STU-010", status: "present" },
  { id: "11", name: "Rose Ekotto", matricule: "STU-011", status: "present" },
  { id: "12", name: "Samuel Tamba", matricule: "STU-012", status: "present" },
  { id: "13", name: "Beatrice Ngo", matricule: "STU-013", status: "present" },
  { id: "14", name: "Thierry Kamga", matricule: "STU-014", status: "late" },
  { id: "15", name: "Nadine Owono", matricule: "STU-015", status: "present" },
];

const statusOptions: { value: AttendanceStatus; label: string; color: string; activeColor: string }[] = [
  { value: "present", label: "Present", color: "border-border text-muted-foreground hover:border-success-300", activeColor: "border-success-500 bg-success-50 text-success-700" },
  { value: "absent", label: "Absent", color: "border-border text-muted-foreground hover:border-error-300", activeColor: "border-error-500 bg-error-50 text-error-700" },
  { value: "late", label: "Retard", color: "border-border text-muted-foreground hover:border-warning-300", activeColor: "border-warning-500 bg-warning-50 text-warning-700" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  present: { label: "Present(e)", color: "bg-success-100 text-success-700" },
  absent: { label: "Absent(e)", color: "bg-error-100 text-error-700" },
  late: { label: "En retard", color: "bg-warning-100 text-warning-700" },
};

// Student's personal attendance history
const studentAttendanceHistory = [
  { date: "24/03/2026", matiere: "Algorithmique", horaire: "08:00-10:00", status: "present" },
  { date: "24/03/2026", matiere: "Reseaux", horaire: "10:00-12:00", status: "present" },
  { date: "22/03/2026", matiere: "Anglais", horaire: "14:00-16:00", status: "present" },
  { date: "21/03/2026", matiere: "Algorithmique", horaire: "08:00-10:00", status: "late" },
  { date: "20/03/2026", matiere: "Base de donnees", horaire: "10:00-12:00", status: "present" },
  { date: "19/03/2026", matiere: "Reseaux", horaire: "10:00-12:00", status: "absent" },
  { date: "18/03/2026", matiere: "Mathematiques", horaire: "14:00-16:00", status: "present" },
  { date: "17/03/2026", matiere: "Algorithmique", horaire: "08:00-10:00", status: "present" },
  { date: "15/03/2026", matiere: "Anglais", horaire: "14:00-16:00", status: "present" },
  { date: "14/03/2026", matiere: "Base de donnees", horaire: "10:00-12:00", status: "present" },
];

export default function AttendancePage() {
  const [students, setStudents] = React.useState(initialStudents);
  const { canManage, canTeach, isStudent } = useRole();
  const { user } = useAuthStore();

  const updateStatus = (id: string, status: AttendanceStatus) => {
    if (!canTeach) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  // Student view - their own attendance record
  if (isStudent) {
    const presentCount = studentAttendanceHistory.filter((a) => a.status === "present").length;
    const absentCount = studentAttendanceHistory.filter((a) => a.status === "absent").length;
    const lateCount = studentAttendanceHistory.filter((a) => a.status === "late").length;
    const total = studentAttendanceHistory.length;
    const tauxPresence = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

    return (
      <div className="space-y-6">
        <PageHeader title="Ma presence" description="Historique de votre presence en cours" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatsCard label="Taux de presence" value={`${tauxPresence}%`} icon={<CheckCircle2 className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" />
          <StatsCard label="Present" value={presentCount} icon={<CheckCircle2 className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" />
          <StatsCard label="Absent" value={absentCount} icon={<XCircle className="h-5 w-5 text-error-600" />} iconBg="bg-error-100" />
          <StatsCard label="En retard" value={lateCount} icon={<Clock className="h-5 w-5 text-warning-600" />} iconBg="bg-warning-100" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historique recent</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {studentAttendanceHistory.map((entry, i) => {
                const st = statusLabels[entry.status] || { label: entry.status, color: "bg-muted text-muted-foreground" };
                return (
                  <div key={i} className="flex items-center justify-between px-3 sm:px-6 py-3 hover:bg-muted/30 transition-colors gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className="text-center w-16 shrink-0">
                        <p className="text-xs font-medium text-foreground">{entry.date}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{entry.matiere}</p>
                        <p className="text-xs text-muted-foreground">{entry.horaire}</p>
                      </div>
                    </div>
                    <Badge className={cn("text-xs shrink-0", st.color)}>{st.label}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/teacher view - attendance management
  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const lateCount = students.filter((s) => s.status === "late").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Presence" description="Enregistrement et suivi de la presence des etudiants">
        {canTeach && <Button size="sm" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>}
      </PageHeader>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Select defaultValue="l2a">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="l2a">L2 Info A</SelectItem>
            <SelectItem value="l2b">L2 Info B</SelectItem>
            <SelectItem value="l3">L3 Info</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="algo">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Matiere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="algo">Algorithmique</SelectItem>
            <SelectItem value="bdd">Base de donnees</SelectItem>
            <SelectItem value="reseau">Reseaux</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>25 Mars 2026</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>08:00 - 10:00</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard label="Total" value={students.length} icon={<Users className="h-5 w-5 text-primary-600" />} iconBg="bg-primary-100" />
        <StatsCard label="Presents" value={presentCount} icon={<CheckCircle2 className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" />
        <StatsCard label="Absents" value={absentCount} icon={<XCircle className="h-5 w-5 text-error-600" />} iconBg="bg-error-100" />
        <StatsCard label="En retard" value={lateCount} icon={<Clock className="h-5 w-5 text-warning-600" />} iconBg="bg-warning-100" />
      </div>

      {/* Student list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {students.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-3.5 hover:bg-muted/30 transition-colors gap-2">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <span className="text-xs text-muted-foreground w-4 sm:w-6 text-right shrink-0">{index + 1}</span>
                  <UserAvatar name={student.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.matricule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canTeach ? statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateStatus(student.id, opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                        student.status === opt.value ? opt.activeColor : opt.color
                      )}
                    >
                      {opt.label}
                    </button>
                  )) : (
                    <Badge className={cn("text-xs", statusLabels[student.status || "present"]?.color)}>
                      {statusLabels[student.status || "present"]?.label}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
