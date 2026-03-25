"use client";

import * as React from "react";
import { Download, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface StudentGrade {
  name: string;
  matricule: string;
  cc1: number;
  cc2: number;
  tp: number;
  exam: number;
}

const initialGrades: Record<string, StudentGrade[]> = {
  "algo-l2a-s1": [
    { name: "Marie Nguema", matricule: "STU-001", cc1: 15, cc2: 14, tp: 16, exam: 16 },
    { name: "Paul Atangana", matricule: "STU-002", cc1: 12, cc2: 11, tp: 13, exam: 10 },
    { name: "Aissatou Diallo", matricule: "STU-003", cc1: 17, cc2: 18, tp: 16, exam: 17 },
    { name: "Emmanuel Nkoulou", matricule: "STU-004", cc1: 8, cc2: 9, tp: 11, exam: 7 },
    { name: "Sandrine Essomba", matricule: "STU-005", cc1: 14, cc2: 13, tp: 15, exam: 14 },
    { name: "Jean-Claude Fouda", matricule: "STU-006", cc1: 10, cc2: 12, tp: 11, exam: 9 },
    { name: "Celine Mvondo", matricule: "STU-007", cc1: 16, cc2: 15, tp: 17, exam: 15 },
    { name: "Andre Biya", matricule: "STU-008", cc1: 11, cc2: 10, tp: 12, exam: 11 },
    { name: "Florence Onana", matricule: "STU-009", cc1: 13, cc2: 14, tp: 13, exam: 12 },
    { name: "Patrick Mbarga", matricule: "STU-010", cc1: 18, cc2: 17, tp: 19, exam: 18 },
    { name: "Rose Ekotto", matricule: "STU-011", cc1: 9, cc2: 8, tp: 10, exam: 8 },
    { name: "Samuel Tamba", matricule: "STU-012", cc1: 14, cc2: 15, tp: 14, exam: 13 },
  ],
  "bdd-l2a-s1": [
    { name: "Marie Nguema", matricule: "STU-001", cc1: 14, cc2: 16, tp: 15, exam: 13 },
    { name: "Paul Atangana", matricule: "STU-002", cc1: 10, cc2: 9, tp: 11, exam: 12 },
    { name: "Aissatou Diallo", matricule: "STU-003", cc1: 16, cc2: 17, tp: 18, exam: 15 },
    { name: "Emmanuel Nkoulou", matricule: "STU-004", cc1: 7, cc2: 8, tp: 9, exam: 6 },
    { name: "Sandrine Essomba", matricule: "STU-005", cc1: 13, cc2: 14, tp: 12, exam: 15 },
    { name: "Jean-Claude Fouda", matricule: "STU-006", cc1: 11, cc2: 10, tp: 12, exam: 10 },
  ],
  "reseau-l2a-s1": [
    { name: "Marie Nguema", matricule: "STU-001", cc1: 16, cc2: 15, tp: 17, exam: 14 },
    { name: "Paul Atangana", matricule: "STU-002", cc1: 11, cc2: 12, tp: 10, exam: 11 },
    { name: "Aissatou Diallo", matricule: "STU-003", cc1: 15, cc2: 16, tp: 17, exam: 16 },
  ],
};

const GRADES_KEY = "isce_grades";

function loadGrades(): Record<string, StudentGrade[]> {
  if (typeof window === "undefined") return initialGrades;
  const stored = localStorage.getItem(GRADES_KEY);
  if (!stored) {
    localStorage.setItem(GRADES_KEY, JSON.stringify(initialGrades));
    return initialGrades;
  }
  return JSON.parse(stored);
}

function saveGrades(data: Record<string, StudentGrade[]>) {
  localStorage.setItem(GRADES_KEY, JSON.stringify(data));
}

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
  const [subject, setSubject] = React.useState("algo");
  const [classGroup, setClassGroup] = React.useState("l2a");
  const [semester, setSemester] = React.useState("s1");
  const [allGrades, setAllGrades] = React.useState<Record<string, StudentGrade[]>>({});
  const [saved, setSaved] = React.useState(false);
  const [editCell, setEditCell] = React.useState<{ idx: number; field: keyof StudentGrade } | null>(null);
  const [editValue, setEditValue] = React.useState("");

  React.useEffect(() => { setAllGrades(loadGrades()); }, []);

  const key = `${subject}-${classGroup}-${semester}`;
  const students = allGrades[key] || [];

  const startEdit = (idx: number, field: keyof StudentGrade, value: number) => {
    setEditCell({ idx, field });
    setEditValue(String(value));
  };

  const commitEdit = () => {
    if (!editCell) return;
    const val = Math.min(20, Math.max(0, Number(editValue) || 0));
    const updated = { ...allGrades };
    const list = [...(updated[key] || [])];
    list[editCell.idx] = { ...list[editCell.idx], [editCell.field]: val };
    updated[key] = list;
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

  // Stats
  const avgs = students.map(calcAvg);
  const classAvg = avgs.length > 0 ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0;
  const maxAvg = avgs.length > 0 ? Math.max(...avgs) : 0;
  const minAvg = avgs.length > 0 ? Math.min(...avgs) : 0;
  const passRate = avgs.length > 0 ? Math.round((avgs.filter((a) => a >= 10).length / avgs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Notes" description="Saisie et gestion des notes par matiere et classe">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
        <Button
          size="sm"
          leftIcon={saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          onClick={handleSave}
          className={saved ? "bg-success-600 hover:bg-success-700" : ""}
        >
          {saved ? "Enregistre!" : "Enregistrer"}
        </Button>
      </PageHeader>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Matiere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="algo">Algorithmique Avancee</SelectItem>
            <SelectItem value="bdd">Base de donnees</SelectItem>
            <SelectItem value="reseau">Reseaux</SelectItem>
            <SelectItem value="math">Mathematiques</SelectItem>
            <SelectItem value="anglais">Anglais</SelectItem>
          </SelectContent>
        </Select>

        <Select value={classGroup} onValueChange={setClassGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="l2a">L2 Info A</SelectItem>
            <SelectItem value="l2b">L2 Info B</SelectItem>
            <SelectItem value="l3">L3 Info</SelectItem>
          </SelectContent>
        </Select>

        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s1">Semestre 1</SelectItem>
            <SelectItem value="s2">Semestre 2</SelectItem>
          </SelectContent>
        </Select>
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
                <p className="text-muted-foreground">Aucune note pour cette selection</p>
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
                            className={cn("text-center cursor-pointer hover:bg-muted/50 transition-colors", gradeColor(student[field]))}
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

      <p className="text-xs text-muted-foreground text-center">
        Cliquez sur une note pour la modifier. Les moyennes et statistiques se mettent a jour automatiquement.
      </p>
    </div>
  );
}
