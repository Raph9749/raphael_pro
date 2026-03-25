"use client";

import * as React from "react";
import { Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const students = [
  { name: "Marie Nguema", matricule: "STU-001", cc1: 15, cc2: 14, tp: 16, exam: 16, avg: 15.5 },
  { name: "Paul Atangana", matricule: "STU-002", cc1: 12, cc2: 11, tp: 13, exam: 10, avg: 11.2 },
  { name: "Aissatou Diallo", matricule: "STU-003", cc1: 17, cc2: 18, tp: 16, exam: 17, avg: 17.1 },
  { name: "Emmanuel Nkoulou", matricule: "STU-004", cc1: 8, cc2: 9, tp: 11, exam: 7, avg: 8.6 },
  { name: "Sandrine Essomba", matricule: "STU-005", cc1: 14, cc2: 13, tp: 15, exam: 14, avg: 14.0 },
  { name: "Jean-Claude Fouda", matricule: "STU-006", cc1: 10, cc2: 12, tp: 11, exam: 9, avg: 10.3 },
  { name: "Celine Mvondo", matricule: "STU-007", cc1: 16, cc2: 15, tp: 17, exam: 15, avg: 15.7 },
  { name: "Andre Biya", matricule: "STU-008", cc1: 11, cc2: 10, tp: 12, exam: 11, avg: 11.0 },
  { name: "Florence Onana", matricule: "STU-009", cc1: 13, cc2: 14, tp: 13, exam: 12, avg: 12.8 },
  { name: "Patrick Mbarga", matricule: "STU-010", cc1: 18, cc2: 17, tp: 19, exam: 18, avg: 18.0 },
  { name: "Rose Ekotto", matricule: "STU-011", cc1: 9, cc2: 8, tp: 10, exam: 8, avg: 8.7 },
  { name: "Samuel Tamba", matricule: "STU-012", cc1: 14, cc2: 15, tp: 14, exam: 13, avg: 13.8 },
];

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
  return (
    <div className="space-y-6">
      <PageHeader title="Notes" description="Saisie et gestion des notes par matiere et classe">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
        <Button size="sm" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
      </PageHeader>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue="algo">
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

        <Select defaultValue="s1">
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
          <p className="text-xl font-bold text-foreground mt-1">13.1/20</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Note la plus haute</p>
          <p className="text-xl font-bold text-success-600 mt-1">18.0/20</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Note la plus basse</p>
          <p className="text-xl font-bold text-error-600 mt-1">8.6/20</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Taux de reussite</p>
          <p className="text-xl font-bold text-primary-600 mt-1">75%</p>
        </Card>
      </div>

      {/* Grade table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                {students.map((student, index) => (
                  <TableRow key={student.matricule}>
                    <TableCell className="text-center text-muted-foreground text-xs">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.matricule}</p>
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-center", gradeColor(student.cc1))}>{student.cc1}</TableCell>
                    <TableCell className={cn("text-center", gradeColor(student.cc2))}>{student.cc2}</TableCell>
                    <TableCell className={cn("text-center", gradeColor(student.tp))}>{student.tp}</TableCell>
                    <TableCell className={cn("text-center", gradeColor(student.exam))}>{student.exam}</TableCell>
                    <TableCell className={cn("text-center rounded", gradeBg(student.avg))}>
                      <span className={gradeColor(student.avg)}>{student.avg.toFixed(1)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        student.avg >= 10 ? "bg-success-100 text-success-700" : "bg-error-100 text-error-700"
                      )}>
                        {student.avg >= 10 ? "Valide" : "Non valide"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
