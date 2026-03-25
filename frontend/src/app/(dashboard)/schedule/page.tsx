"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const hours = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);

interface ScheduleEvent {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
  day: number;
  startHour: number;
  duration: number;
  type: "cours" | "td" | "examen";
}

const events: ScheduleEvent[] = [
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

const typeColors = {
  cours: "bg-primary-100 border-primary-300 text-primary-800",
  td: "bg-success-100 border-success-300 text-success-800",
  examen: "bg-error-100 border-error-300 text-error-800",
};

const typeLabels = {
  cours: "Cours",
  td: "TD/TP",
  examen: "Examen",
};

export default function SchedulePage() {
  const [view, setView] = React.useState<"week" | "day" | "month">("week");

  return (
    <div className="space-y-6">
      <PageHeader title="Emploi du temps" description="Planification hebdomadaire des cours">
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {(["day", "week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                view === v ? "bg-primary-600 text-white" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {v === "day" ? "Jour" : v === "week" ? "Semaine" : "Mois"}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon-sm"><ChevronRight className="h-4 w-4" /></Button>
          <span className="text-sm font-semibold text-foreground ml-2">24 - 28 Mars 2026</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary-200 border border-primary-300" /> Cours</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success-200 border border-success-300" /> TD/TP</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-error-200 border border-error-300" /> Examen</span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border">
                  <div className="p-3 border-r border-border" />
                  {days.map((day, i) => (
                    <div key={day} className="p-3 text-center border-r border-border last:border-r-0">
                      <p className="text-xs text-muted-foreground">{day}</p>
                      <p className="text-lg font-semibold text-foreground">{24 + i}</p>
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                <div className="relative">
                  {hours.map((hour, hourIdx) => (
                    <div key={hour} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border last:border-b-0" style={{ height: "60px" }}>
                      <div className="p-2 border-r border-border flex items-start justify-end pr-3">
                        <span className="text-xs text-muted-foreground">{hour}</span>
                      </div>
                      {days.map((_, dayIdx) => (
                        <div key={dayIdx} className="border-r border-border last:border-r-0 relative" />
                      ))}
                    </div>
                  ))}

                  {/* Event overlays */}
                  {events.map((event) => {
                    const top = (event.startHour - 8) * 60;
                    const height = event.duration * 60 - 4;
                    const left = `calc(80px + ${event.day} * ((100% - 80px) / 5) + 4px)`;
                    const width = `calc((100% - 80px) / 5 - 8px)`;
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute rounded-lg border p-2 cursor-pointer hover:shadow-sm transition-shadow overflow-hidden",
                          typeColors[event.type]
                        )}
                        style={{ top: `${top}px`, height: `${height}px`, left, width }}
                      >
                        <p className="text-xs font-semibold truncate">{event.subject}</p>
                        <p className="text-[10px] opacity-75 truncate">{event.teacher}</p>
                        <p className="text-[10px] opacity-75 truncate">{event.room} - {event.class}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar details */}
        <div className="hidden xl:block w-72 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cours du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events
                .filter((e) => e.day === 0)
                .sort((a, b) => a.startHour - b.startHour)
                .map((e) => (
                  <div key={e.id} className="rounded-lg border border-border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{e.subject}</span>
                      <Badge className={cn("text-[10px]", typeColors[e.type])}>{typeLabels[e.type]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {e.startHour}:00 - {e.startHour + e.duration}:00
                    </p>
                    <p className="text-xs text-muted-foreground">{e.teacher} - {e.room}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
