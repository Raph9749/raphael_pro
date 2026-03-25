"use client";

import { Plus, BookOpen, Users, Clock, Award, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Progress } from "@/components/ui/progress";

const programs = [
  {
    id: "1",
    name: "Informatique",
    code: "INFO",
    degree: "Licence & Master",
    department: "Sciences et Technologies",
    duration: 5,
    students: 320,
    capacity: 350,
    teachers: 18,
    courses: 42,
    status: "active" as const,
    description: "Formation en developpement logiciel, reseaux, bases de donnees, intelligence artificielle et cybersecurite.",
    levels: ["L1", "L2", "L3", "M1", "M2"],
  },
  {
    id: "2",
    name: "Gestion des Entreprises",
    code: "GEST",
    degree: "Licence",
    department: "Sciences de Gestion",
    duration: 3,
    students: 280,
    capacity: 300,
    teachers: 15,
    courses: 36,
    status: "active" as const,
    description: "Formation en management, comptabilite, ressources humaines et strategie d'entreprise.",
    levels: ["L1", "L2", "L3"],
  },
  {
    id: "3",
    name: "Marketing et Communication",
    code: "MKT",
    degree: "Licence",
    department: "Commerce",
    duration: 3,
    students: 195,
    capacity: 220,
    teachers: 12,
    courses: 30,
    status: "active" as const,
    description: "Formation en marketing digital, communication d'entreprise, etudes de marche et publicite.",
    levels: ["L1", "L2", "L3"],
  },
  {
    id: "4",
    name: "Finance et Comptabilite",
    code: "FIN",
    degree: "Licence & Master",
    department: "Sciences de Gestion",
    duration: 5,
    students: 210,
    capacity: 250,
    teachers: 14,
    courses: 38,
    status: "active" as const,
    description: "Formation en finance d'entreprise, analyse financiere, audit et controle de gestion.",
    levels: ["L1", "L2", "L3", "M1", "M2"],
  },
  {
    id: "5",
    name: "Droit des Affaires",
    code: "DROIT",
    degree: "Licence",
    department: "Sciences Juridiques",
    duration: 3,
    students: 142,
    capacity: 180,
    teachers: 10,
    courses: 28,
    status: "active" as const,
    description: "Formation en droit commercial, droit du travail, droit fiscal et procedures juridiques.",
    levels: ["L1", "L2", "L3"],
  },
  {
    id: "6",
    name: "Tourisme et Hotellerie",
    code: "TOUR",
    degree: "BTS",
    department: "Services",
    duration: 2,
    students: 0,
    capacity: 60,
    teachers: 0,
    courses: 0,
    status: "inactive" as const,
    description: "Programme en preparation - ouverture prevue pour 2026-2027.",
    levels: [],
  },
];

const colorMap: Record<string, string> = {
  INFO: "border-l-primary-500",
  GEST: "border-l-secondary-500",
  MKT: "border-l-purple-500",
  FIN: "border-l-emerald-500",
  DROIT: "border-l-amber-500",
  TOUR: "border-l-slate-400",
};

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Programmes" description="Gestion des programmes et filieres de formation">
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau programme</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {programs.map((program) => (
          <Card key={program.id} className={`border-l-4 ${colorMap[program.code] || "border-l-slate-400"} hover:shadow-card-hover transition-shadow`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{program.name}</h3>
                    <StatusBadge status={program.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{program.code}</Badge>
                    <span className="text-xs text-muted-foreground">{program.degree} - {program.duration} ans</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon-sm"><Edit className="h-4 w-4" /></Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{program.description}</p>

              {program.status === "active" && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Remplissage</span>
                      <span className="font-medium">{program.students}/{program.capacity}</span>
                    </div>
                    <Progress value={program.students} max={program.capacity} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {program.students} etudiants</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {program.courses} cours</span>
                    <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> {program.teachers} enseignants</span>
                  </div>

                  {program.levels.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {program.levels.map((level) => (
                        <Badge key={level} variant="muted" className="text-[10px] px-1.5 py-0">{level}</Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
