"use client";

import { Plus, Users, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/ui/avatar";

const classes = [
  { id: "1", name: "L1 Informatique A", code: "L1-INFO-A", program: "Informatique", level: 1, students: 45, capacity: 50, teacher: "Dr. Kamga", room: "Salle 101", status: "active" },
  { id: "2", name: "L1 Informatique B", code: "L1-INFO-B", program: "Informatique", level: 1, students: 42, capacity: 50, teacher: "Pr. Nkoulou", room: "Salle 102", status: "active" },
  { id: "3", name: "L2 Informatique A", code: "L2-INFO-A", program: "Informatique", level: 2, students: 35, capacity: 40, teacher: "Dr. Kamga", room: "Salle 201", status: "active" },
  { id: "4", name: "L2 Informatique B", code: "L2-INFO-B", program: "Informatique", level: 2, students: 32, capacity: 40, teacher: "M. Tamba", room: "Salle 202", status: "active" },
  { id: "5", name: "L3 Informatique", code: "L3-INFO", program: "Informatique", level: 3, students: 28, capacity: 35, teacher: "Pr. Nkoulou", room: "Salle 301", status: "active" },
  { id: "6", name: "L1 Gestion A", code: "L1-GEST-A", program: "Gestion", level: 1, students: 48, capacity: 50, teacher: "Dr. Mbarga", room: "Amphi B", status: "active" },
  { id: "7", name: "L1 Gestion B", code: "L1-GEST-B", program: "Gestion", level: 1, students: 46, capacity: 50, teacher: "M. Fouda", room: "Amphi C", status: "active" },
  { id: "8", name: "L2 Gestion", code: "L2-GEST", program: "Gestion", level: 2, students: 38, capacity: 45, teacher: "Dr. Mbarga", room: "Salle 203", status: "active" },
  { id: "9", name: "L3 Gestion", code: "L3-GEST", program: "Gestion", level: 3, students: 25, capacity: 35, teacher: "M. Fouda", room: "Salle 302", status: "active" },
  { id: "10", name: "L1 Marketing", code: "L1-MKT", program: "Marketing", level: 1, students: 40, capacity: 45, teacher: "Mme. Ekotto", room: "Salle 103", status: "active" },
  { id: "11", name: "L2 Marketing", code: "L2-MKT", program: "Marketing", level: 2, students: 32, capacity: 40, teacher: "Mme. Ekotto", room: "Salle 204", status: "active" },
  { id: "12", name: "M1 Finance", code: "M1-FIN", program: "Finance", level: 4, students: 22, capacity: 30, teacher: "Mme. Abena", room: "Salle 401", status: "active" },
];

const programColors: Record<string, string> = {
  Informatique: "bg-primary-100 text-primary-700",
  Gestion: "bg-secondary-100 text-secondary-700",
  Marketing: "bg-purple-100 text-purple-700",
  Finance: "bg-emerald-100 text-emerald-700",
  Droit: "bg-amber-100 text-amber-700",
};

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Gerez les classes et groupes de votre etablissement">
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Nouvelle classe
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const fillPercent = Math.round((cls.students / cls.capacity) * 100);
          return (
            <Card key={cls.id} className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{cls.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cls.code}</p>
                  </div>
                  <Badge className={programColors[cls.program] || "bg-muted text-muted-foreground"}>
                    {cls.program}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Remplissage</span>
                    <span className="font-medium text-foreground">{cls.students}/{cls.capacity}</span>
                  </div>
                  <Progress
                    value={cls.students}
                    max={cls.capacity}
                    variant={fillPercent > 90 ? "warning" : "default"}
                    size="sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {cls.students} etudiants
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {cls.room}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <UserAvatar name={cls.teacher} size="sm" className="h-6 w-6 text-[10px]" />
                  <span className="text-xs text-muted-foreground">{cls.teacher}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
