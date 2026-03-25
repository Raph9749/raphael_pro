"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Clock, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getEvents, addEvent, deleteEvent, updateEvent,
  getTeacherNames, getClassNames, getCourseNames, ROOMS,
  type ScheduleEvent,
} from "@/lib/mock-data";
import { useRole, getStudentShortClass } from "@/hooks/use-role";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const hours = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`);

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

function getWeekDates(offset: number) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
  const start = dates[0];
  const end = dates[4];
  const label = start.getMonth() === end.getMonth()
    ? `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
    : `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
  return { dates, label };
}

const emptyForm = {
  subject: "",
  teacher: "",
  room: "",
  class: "",
  day: "0",
  startHour: "8",
  duration: "2",
  type: "cours" as ScheduleEvent["type"],
};

export default function SchedulePage() {
  const [view, setView] = React.useState<"week" | "day" | "month">("week");
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [selectedDay, setSelectedDay] = React.useState(0);
  const [events, setEvents] = React.useState<ScheduleEvent[]>([]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [showDetail, setShowDetail] = React.useState<ScheduleEvent | null>(null);
  const { canTeach, isStudent, isParent, isTeacher, user } = useRole();

  React.useEffect(() => {
    let allEvents = getEvents();
    // Students only see events for their class
    if (isStudent) {
      const studentClass = getStudentShortClass(user?.id);
      allEvents = allEvents.filter((e) =>
        e.class === studentClass || e.class.includes("Info") && studentClass.includes("Info")
      );
    }
    // Teachers only see their own events
    if (isTeacher && user) {
      const lastName = user.last_name;
      allEvents = allEvents.filter((e) =>
        e.teacher.includes(lastName) || e.teacher === `${user.first_name} ${user.last_name}`
      );
    }
    // Parents see their child's class events
    if (isParent) {
      allEvents = allEvents.filter((e) =>
        e.class.includes("Info") // child is in L2 Info A
      );
    }
    setEvents(allEvents);
  }, [isStudent, isTeacher, isParent, user]);

  const { dates, label } = getWeekDates(weekOffset);
  const teacherNames = getTeacherNames();
  const classNames = getClassNames();
  const courseNames = getCourseNames();

  const openAdd = (day?: number, hour?: number) => {
    if (!canTeach) return; // Students/parents can't add
    setForm({
      ...emptyForm,
      day: String(day ?? 0),
      startHour: String(hour ?? 8),
    });
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (event: ScheduleEvent) => {
    setForm({
      subject: event.subject,
      teacher: event.teacher,
      room: event.room,
      class: event.class,
      day: String(event.day),
      startHour: String(event.startHour),
      duration: String(event.duration),
      type: event.type,
    });
    setEditId(event.id);
    setShowDetail(null);
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!form.subject || !form.teacher || !form.room || !form.class) return;
    const data = {
      subject: form.subject,
      teacher: form.teacher,
      room: form.room,
      class: form.class,
      day: Number(form.day),
      startHour: Number(form.startHour),
      duration: Number(form.duration),
      type: form.type,
    };
    if (editId) {
      updateEvent(editId, data);
    } else {
      addEvent(data);
    }
    setEvents(getEvents());
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setEvents(getEvents());
    setShowDetail(null);
  };

  const filteredEvents = view === "day"
    ? events.filter((e) => e.day === selectedDay)
    : events;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStudent ? "Mon emploi du temps" : isParent ? "Emploi du temps de votre enfant" : "Emploi du temps"}
        description={isStudent || isParent ? "Consultation de vos cours" : "Planification hebdomadaire des cours"}
      >
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
        {canTeach && (
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAdd()}>
            Ajouter un cours
          </Button>
        )}
      </PageHeader>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)} className="ml-1">
            Aujourd&apos;hui
          </Button>
          <span className="text-sm font-semibold text-foreground ml-2">{label}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary-200 border border-primary-300" /> Cours</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success-200 border border-success-300" /> TD/TP</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-error-200 border border-error-300" /> Examen</span>
        </div>
      </div>

      {/* Day selector for day view */}
      {view === "day" && (
        <div className="flex gap-2">
          {days.map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border",
                selectedDay === i
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <p className="text-xs">{day}</p>
              <p className="text-lg font-bold">{dates[i].getDate()}</p>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                {view !== "day" && (
                  <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border">
                    <div className="p-3 border-r border-border" />
                    {days.map((day, i) => (
                      <div key={day} className="p-3 text-center border-r border-border last:border-r-0">
                        <p className="text-xs text-muted-foreground">{day}</p>
                        <p className="text-lg font-semibold text-foreground">{dates[i].getDate()}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Time slots */}
                <div className="relative">
                  {hours.map((hour, hourIdx) => (
                    <div
                      key={hour}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        view === "day" ? "grid grid-cols-[80px_1fr]" : "grid grid-cols-[80px_repeat(5,1fr)]"
                      )}
                      style={{ height: "60px" }}
                    >
                      <div className="p-2 border-r border-border flex items-start justify-end pr-3">
                        <span className="text-xs text-muted-foreground">{hour}</span>
                      </div>
                      {view === "day" ? (
                        <div
                          className={cn("relative transition-colors", canTeach && "cursor-pointer hover:bg-muted/30")}
                          onClick={() => canTeach && openAdd(selectedDay, 8 + hourIdx)}
                        />
                      ) : (
                        days.map((_, dayIdx) => (
                          <div
                            key={dayIdx}
                            className={cn("border-r border-border last:border-r-0 relative transition-colors", canTeach && "cursor-pointer hover:bg-muted/30")}
                            onClick={() => canTeach && openAdd(dayIdx, 8 + hourIdx)}
                          />
                        ))
                      )}
                    </div>
                  ))}

                  {/* Event overlays */}
                  {filteredEvents.map((event) => {
                    const top = (event.startHour - 8) * 60;
                    const height = event.duration * 60 - 4;
                    const left = view === "day"
                      ? "calc(80px + 4px)"
                      : `calc(80px + ${event.day} * ((100% - 80px) / 5) + 4px)`;
                    const width = view === "day"
                      ? "calc(100% - 80px - 8px)"
                      : `calc((100% - 80px) / 5 - 8px)`;
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute rounded-lg border p-2 cursor-pointer hover:shadow-md transition-shadow overflow-hidden",
                          typeColors[event.type]
                        )}
                        style={{ top: `${top}px`, height: `${height}px`, left, width }}
                        onClick={(e) => { e.stopPropagation(); setShowDetail(event); }}
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
              <CardTitle className="text-sm">
                {view === "day" ? `Cours du ${days[selectedDay]}` : "Cours du Lundi"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events
                .filter((e) => e.day === (view === "day" ? selectedDay : 0))
                .sort((a, b) => a.startHour - b.startHour)
                .map((e) => (
                  <div
                    key={e.id}
                    className="rounded-lg border border-border p-3 space-y-1 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setShowDetail(e)}
                  >
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
              {events.filter((e) => e.day === (view === "day" ? selectedDay : 0)).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">Aucun cours ce jour</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total cours</span>
                <span className="font-semibold">{events.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cours magistraux</span>
                <span className="font-semibold">{events.filter((e) => e.type === "cours").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">TD/TP</span>
                <span className="font-semibold">{events.filter((e) => e.type === "td").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Examens</span>
                <span className="font-semibold">{events.filter((e) => e.type === "examen").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier le cours" : "Ajouter un cours"}</DialogTitle>
            <DialogDescription>
              {editId ? "Modifiez les informations du cours" : "Remplissez les informations pour ajouter un cours a l'emploi du temps"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Matiere</label>
              <Input
                placeholder="Ex: Algorithmique Avancee"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                list="course-suggestions"
              />
              <datalist id="course-suggestions">
                {courseNames.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Enseignant</label>
                <Select value={form.teacher} onValueChange={(v) => setForm({ ...form, teacher: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {teacherNames.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Classe</label>
                <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Salle</label>
                <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ScheduleEvent["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cours">Cours</SelectItem>
                    <SelectItem value="td">TD/TP</SelectItem>
                    <SelectItem value="examen">Examen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Jour</label>
                <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {days.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Heure debut</label>
                <Select value={form.startHour} onValueChange={(v) => setForm({ ...form, startHour: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => (
                      <SelectItem key={i} value={String(i + 8)}>{i + 8}:00</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Duree (h)</label>
                <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}h</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.subject || !form.teacher || !form.room || !form.class}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent>
          {showDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{showDetail.subject}</DialogTitle>
                <DialogDescription>Details du cours</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <Badge className={cn(typeColors[showDetail.type])}>{typeLabels[showDetail.type]}</Badge>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Enseignant</p>
                    <p className="font-medium">{showDetail.teacher}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Classe</p>
                    <p className="font-medium">{showDetail.class}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Salle</p>
                    <p className="font-medium">{showDetail.room}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horaire</p>
                    <p className="font-medium">{days[showDetail.day]} {showDetail.startHour}:00 - {showDetail.startHour + showDetail.duration}:00</p>
                  </div>
                </div>
              </div>
              {canTeach && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="text-error-600 hover:bg-error-50"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleDelete(showDetail.id)}
                  >
                    Supprimer
                  </Button>
                  <Button leftIcon={<Edit className="h-4 w-4" />} onClick={() => openEdit(showDetail)}>
                    Modifier
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
