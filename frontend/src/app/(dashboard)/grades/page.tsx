"use client";

import * as React from "react";
import { Download, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import {
  getCourses, getGrades, saveGrades, exportGradesCSV, downloadCSV,
  getStudentByLastName,
  type StudentGrade, type Course,
} from "@/lib/mock-data";
import { useAuthStore } from "@/stores/auth-store";

function calcAvg(s: StudentGrade) {
  return s.cc1 * 0.2 + s.cc2 * 0.2 + s.tp * 0.2 + s.exam * 0.4;
}

function gradeColor(score: number) {
  if (score >= 14) return "text-success-600 font-semibold";
  if (score >= 10) return "text-warning-600 font-semibold";
  return "text-error-600 font-semibold";
}

function gradeBg(score: number) {
  if (score >= 14) return "bg-success-50";
  if (score >= 10) return "bg-warning-50";
  return "bg-error-50";
}

export default function GradesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [allGrades, setAllGrades] = React.useState<Record<string, StudentGrade[]>>({});
  const [saved, setSaved] = React.useState(false);
  const [editCell, setEditCell] = React.useState<{ idx: number; field: keyof StudentGrade } | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const { canTeach, isStudent, isParent, isTeacher } = useRole();
  const { user } = useAuthStore();

  React.useEffect(() => {
    let allCourses = getCourses();
    const grades = getGrades();

    // Students only see courses for their class
    if (isStudent && user) {
      const me = getStudentByLastName(user.last_name);
      if (me) {
        const parts = me.classe.split(" ");
        const level = parts[0] || "";
        const progShort = parts.length >= 2 ? parts[1].substring(0, 4) : "";
        const section = parts[2] || "";
        const shortWithSection = `${level} ${progShort} ${section}`.trim().toLowerCase();
        const shortNoSection = `${level} ${progShort}`.trim().toLowerCase();
        const fullLower = me.classe.toLowerCase();
        allCourses = allCourses.filter((c) => {
          const cl = c.class.toLowerCase().trim();
          return cl === shortWithSection || cl === shortNoSection || cl === fullLower;
        });
      }
    }

    // Teachers only see courses they teach
    if (isTeacher && user) {
      const lastName = user.last_name.toLowerCase();
      allCourses = allCourses.filter((c) => c.teacher.toLowerCase().includes(lastName));
    }

    setCourses(allCourses);
    setAllGrades(grades);
    if (allCourses.length > 0) {
      setSelectedCourse(`${allCourses[0].id}-${allCourses[0].code}`);
    }
  }, [isStudent, isTeacher, user]);

  const currentCourse = courses.find((c) => `${c.id}-${c.code}` === selectedCourse);
  const allStudentsForCourse = allGrades[selectedCourse] || [];
  // Students only see their own grades
  const students = (isStudent && user) ? (() => {
    const me = getStudentByLastName(user.last_name);
    const myName = me?.name || `${user.first_name} ${user.last_name}`;
    return allStudentsForCourse.filter((s) => s.name === myName);
  })() : allStudentsForCourse;

  const startEdit = (idx: number, field: keyof StudentGrade, value: number) => {
    if (!canTeach) return;
    setEditCell({ idx, field });
    setEditValue(String(value));
  };

  const commitEdit = () => {
    if (!editCell) return;
    const val = Math.min(20, Math.max(0, Number(editValue) || 0));
    const updated = { ...allGrades };
    const list = [...(updated[selectedCourse] || [])];
    list[editCell.idx] = { ...list[editCell.idx], [editCell.field]: val };
    updated[selectedCourse] = list;
    setAllGrades(updated);
    setEditCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditCell(null);
  };

  const handleSave = () => {
    saveGrades(allGrades);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const courseName = currentCourse ? currentCourse.name : "notes";
    downloadCSV(
      exportGradesCSV(selectedCourse, courseName),
      `notes-${courseName.replace(/\s+/g, "-").toLowerCase()}.csv`
    );
  };

  // Stats
  const avgs = students.map(calcAvg);
  const classAvg = avgs.length > 0 ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0;
  const maxAvg = avgs.length > 0 ? Math.max(...avgs) : 0;
  const minAvg = avgs.length > 0 ? Math.min(...avgs) : 0;
  const passRate = avgs.length > 0 ? Math.round((avgs.filter((a) => a >= 10).length / avgs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStudent ? "Mes notes" : isParent ? "Notes de votre enfant" : "Notes"}
        description={canTeach ? "Saisie et gestion des notes par cours" : "Consultez les notes"}
      >
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={handleExport}>
          Exporter CSV
        </Button>
        {canTeach && (
          <Button
            size="sm"
            leftIcon={saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            onClick={handleSave}
            className={saved ? "bg-success-600 hover:bg-success-700" : ""}
          >
            {saved ? "Enregistre!" : "Enregistrer"}
          </Button>
        )}
      </PageHeader>

      {/* Course selector */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[400px]">
            <SelectValue placeholder="Choisir un cours" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={`${c.id}-${c.code}`} value={`${c.id}-${c.code}`}>
                {c.name} - {c.class} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentCourse && (
          <div className="text-sm text-muted-foreground">
            Enseignant: <span className="font-medium text-foreground">{currentCourse.teacher}</span>
            {" | "}Semestre {currentCourse.semester}
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Moyenne de classe</p>
          <p className="text-xl font-bold text-foreground mt-1">{classAvg.toFixed(1)}/20</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Note la plus haute</p>
          <p className="text-xl font-bold text-success-600 mt-1">{maxAvg.toFixed(1)}/20</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Note la plus basse</p>
          <p className="text-xl font-bold text-error-600 mt-1">{minAvg.toFixed(1)}/20</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Taux de reussite</p>
          <p className="text-xl font-bold text-primary-600 mt-1">{passRate}%</p>
        </Card>
      </div>

      {/* Grade table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {students.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Aucune note pour ce cours. {canTeach && "Les notes seront generees quand des etudiants seront assignes a la classe."}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-8 text-center">#</TableHead>
                    <TableHead>Etudiant</TableHead>
                    <TableHead className="text-center">CC1 (20%)</TableHead>
                    <TableHead className="text-center">CC2 (20%)</TableHead>
                    <TableHead className="text-center">TP (20%)</TableHead>
                    <TableHead className="text-center">Examen (40%)</TableHead>
                    <TableHead className="text-center">Moyenne</TableHead>
                    <TableHead className="text-center">Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => {
                    const avg = calcAvg(student);
                    return (
                      <TableRow key={student.matricule}>
                        <TableCell className="text-center text-muted-foreground text-xs">{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.matricule}</p>
                          </div>
                        </TableCell>
                        {(["cc1", "cc2", "tp", "exam"] as const).map((field) => (
                          <TableCell
                            key={field}
                            className={cn("text-center transition-colors", gradeColor(student[field]), canTeach && "cursor-pointer hover:bg-muted/50")}
                            onClick={() => startEdit(index, field, student[field])}
                          >
                            {editCell?.idx === index && editCell.field === field ? (
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={handleKeyDown}
                                className="w-14 text-center bg-white border border-primary-300 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                autoFocus
                              />
                            ) : (
                              student[field]
                            )}
                          </TableCell>
                        ))}
                        <TableCell className={cn("text-center rounded", gradeBg(avg))}>
                          <span className={gradeColor(avg)}>{avg.toFixed(1)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            avg >= 10 ? "bg-success-100 text-success-700" : "bg-error-100 text-error-700"
                          )}>
                            {avg >= 10 ? "Valide" : "Non valide"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {canTeach ? (
        <p className="text-xs text-muted-foreground text-center">
          Cliquez sur une note pour la modifier. Les moyennes et statistiques se mettent a jour automatiquement.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          Consultation uniquement. Contactez un enseignant ou l&apos;administration pour toute question.
        </p>
      )}
    </div>
  );
}
