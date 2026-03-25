"use client";

import { Plus, GripVertical, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  date: string;
  score?: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  dotColor: string;
  candidates: Candidate[];
}

const columns: KanbanColumn[] = [
  {
    id: "nouveau",
    title: "Nouveau",
    color: "border-t-slate-400",
    dotColor: "bg-slate-400",
    candidates: [
      { id: "1", name: "Alice Mbarga", email: "a.mbarga@mail.cm", phone: "+237 690 11 22", program: "Informatique", date: "22/03/2026" },
      { id: "2", name: "Bruno Essono", email: "b.essono@mail.cm", phone: "+237 691 22 33", program: "Marketing", date: "21/03/2026" },
      { id: "3", name: "Diane Fouda", email: "d.fouda@mail.cm", phone: "+237 692 33 44", program: "Gestion", date: "20/03/2026" },
      { id: "4", name: "Eric Tamba", email: "e.tamba@mail.cm", phone: "+237 693 44 55", program: "Finance", date: "19/03/2026" },
    ],
  },
  {
    id: "revue",
    title: "En revue",
    color: "border-t-warning-400",
    dotColor: "bg-warning-400",
    candidates: [
      { id: "5", name: "Fatima Ngo", email: "f.ngo@mail.cm", phone: "+237 694 55 66", program: "Informatique", date: "18/03/2026", score: 72 },
      { id: "6", name: "Georges Atanga", email: "g.atanga@mail.cm", phone: "+237 695 66 77", program: "Droit", date: "17/03/2026", score: 65 },
      { id: "7", name: "Helene Mvondo", email: "h.mvondo@mail.cm", phone: "+237 696 77 88", program: "Gestion", date: "16/03/2026", score: 81 },
    ],
  },
  {
    id: "entretien",
    title: "Entretien",
    color: "border-t-primary-400",
    dotColor: "bg-primary-400",
    candidates: [
      { id: "8", name: "Ibrahim Kamga", email: "i.kamga@mail.cm", phone: "+237 697 88 99", program: "Informatique", date: "15/03/2026", score: 85 },
      { id: "9", name: "Julie Ekotto", email: "j.ekotto@mail.cm", phone: "+237 698 99 00", program: "Finance", date: "14/03/2026", score: 78 },
    ],
  },
  {
    id: "admis",
    title: "Admis",
    color: "border-t-success-400",
    dotColor: "bg-success-400",
    candidates: [
      { id: "10", name: "Kevin Onana", email: "k.onana@mail.cm", phone: "+237 699 00 11", program: "Informatique", date: "10/03/2026", score: 92 },
      { id: "11", name: "Laura Biya", email: "l.biya@mail.cm", phone: "+237 690 12 23", program: "Marketing", date: "08/03/2026", score: 88 },
      { id: "12", name: "Marc Diallo", email: "m.diallo@mail.cm", phone: "+237 691 23 34", program: "Gestion", date: "05/03/2026", score: 90 },
    ],
  },
  {
    id: "refuse",
    title: "Refuse",
    color: "border-t-error-400",
    dotColor: "bg-error-400",
    candidates: [
      { id: "13", name: "Nathalie Owono", email: "n.owono@mail.cm", phone: "+237 692 34 45", program: "Finance", date: "12/03/2026", score: 35 },
    ],
  },
];

export default function AdmissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admissions" description="Gestion du processus d'admission des candidats">
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau candidat</Button>
      </PageHeader>

      {/* Summary */}
      <div className="flex items-center gap-6 text-sm">
        <span className="text-muted-foreground">Total: <strong className="text-foreground">23 candidats</strong></span>
        <span className="text-muted-foreground">Cette semaine: <strong className="text-foreground">+5</strong></span>
        <span className="text-muted-foreground">Taux d&apos;admission: <strong className="text-success-600">65%</strong></span>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-[280px]">
            <div className={cn("rounded-xl border border-border border-t-4 bg-muted/20", col.color)}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", col.dotColor)} />
                  <span className="text-sm font-semibold text-foreground">{col.title}</span>
                </div>
                <Badge variant="muted" className="text-xs">{col.candidates.length}</Badge>
              </div>

              <div className="px-3 pb-3 space-y-2">
                {col.candidates.map((candidate) => (
                  <Card key={candidate.id} className="cursor-grab hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-3 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={candidate.name} size="sm" className="h-7 w-7 text-[10px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.program}</p>
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {candidate.date}
                        </span>
                        {candidate.score !== undefined && (
                          <span className={cn(
                            "font-semibold",
                            candidate.score >= 70 ? "text-success-600" : candidate.score >= 50 ? "text-warning-600" : "text-error-600"
                          )}>
                            {candidate.score}%
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {col.candidates.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border py-8 text-center">
                    <p className="text-xs text-muted-foreground">Aucun candidat</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
