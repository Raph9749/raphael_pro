"use client";

import { Plus, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";

const allEvents = [
  { id: "1", title: "Examens du Semestre 1", type: "exam", date: "28 Mar - 10 Avr 2026", location: "Campus principal", time: "08:00 - 18:00", description: "Session d'examens de fin de semestre pour toutes les filieres", color: "border-l-error-400 bg-error-50/30", forStudents: true },
  { id: "2", title: "Journee portes ouvertes", type: "cultural", date: "15 Avril 2026", location: "Campus principal", time: "09:00 - 17:00", description: "Accueil des futurs etudiants et de leurs parents. Visite des locaux, presentations des programmes.", color: "border-l-primary-400 bg-primary-50/30", forStudents: true },
  { id: "3", title: "Conference IA et Education", type: "academic", date: "22 Avril 2026", location: "Amphitheatre A", time: "14:00 - 17:00", description: "Conference sur l'impact de l'intelligence artificielle dans l'education.", color: "border-l-secondary-400 bg-secondary-50/30", forStudents: true },
  { id: "4", title: "Tournoi inter-classes de football", type: "sports", date: "25 - 26 Avril 2026", location: "Terrain de sport", time: "13:00 - 18:00", description: "Competition sportive annuelle entre les differentes classes et filieres.", color: "border-l-success-400 bg-success-50/30", forStudents: true },
  { id: "5", title: "Conseil de classe L3", type: "meeting", date: "29 Avril 2026", location: "Salle de reunion", time: "10:00 - 12:00", description: "Conseil de classe de fin de semestre pour les etudiants de Licence 3.", color: "border-l-warning-400 bg-warning-50/30", forStudents: false },
  { id: "6", title: "Vacances de Paques", type: "holiday", date: "01 - 12 Mai 2026", location: "-", time: "Journee entiere", description: "Periode de conge pour les vacances de Paques.", color: "border-l-purple-400 bg-purple-50/30", forStudents: true },
  { id: "7", title: "Soutenance de stages L3", type: "academic", date: "20 - 24 Mai 2026", location: "Salles 301-305", time: "08:00 - 18:00", description: "Soutenances de rapports de stage pour les etudiants de Licence 3.", color: "border-l-secondary-400 bg-secondary-50/30", forStudents: true },
  { id: "8", title: "Ceremonie de remise de diplomes", type: "cultural", date: "15 Juin 2026", location: "Amphitheatre A", time: "15:00 - 19:00", description: "Ceremonie officielle de remise des diplomes pour la promotion 2025-2026.", color: "border-l-primary-400 bg-primary-50/30", forStudents: true },
];

const typeLabels: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "error" | "muted" }> = {
  academic: { label: "Academique", variant: "default" },
  cultural: { label: "Culturel", variant: "secondary" },
  sports: { label: "Sport", variant: "success" },
  meeting: { label: "Reunion", variant: "warning" },
  holiday: { label: "Conge", variant: "muted" },
  exam: { label: "Examen", variant: "error" },
};

export default function EventsPage() {
  const { canManage, isStudent, isParent } = useRole();

  // Students and parents only see events marked for them (not internal meetings)
  const events = (isStudent || isParent)
    ? allEvents.filter((e) => e.forStudents)
    : allEvents;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStudent ? "Evenements" : "Evenements"}
        description={isStudent ? "Evenements et activites a venir" : "Calendrier et evenements de l'etablissement"}
      >
        {canManage && (
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouvel evenement</Button>
        )}
      </PageHeader>

      {/* Upcoming events summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Ce mois</p>
          <p className="text-xl font-bold text-foreground mt-1">{events.filter((e) => e.date.includes("Mar")).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Mois prochain</p>
          <p className="text-xl font-bold text-foreground mt-1">{events.filter((e) => e.date.includes("Avr")).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Examens a venir</p>
          <p className="text-xl font-bold text-error-600 mt-1">{events.filter((e) => e.type === "exam").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total planifie</p>
          <p className="text-xl font-bold text-foreground mt-1">{events.length}</p>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => {
          const typeConfig = typeLabels[event.type] || { label: event.type, variant: "muted" as const };
          return (
            <Card key={event.id} className={cn("border-l-4 hover:shadow-card-hover transition-shadow cursor-pointer", event.color)}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-foreground">{event.title}</h3>
                      <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{event.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
