"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, BookOpen, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/status-badge";
import { StatsCard } from "@/components/common/stats-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTeacher, getCourses, getEvents, type Teacher, type Course, type ScheduleEvent } from "@/lib/mock-data";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export default function TeacherProfileClient() {
  const [teacher, setTeacher] = React.useState<Teacher | null>(null);
  const [teacherCourses, setTeacherCourses] = React.useState<Course[]>([]);
  const [teacherSchedule, setTeacherSchedule] = React.useState<ScheduleEvent[]>([]);

  React.useEffect(() => {
    // Get teacher ID from URL
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    const t = getTeacher(id);
    if (t) {
      setTeacher(t);
      // Get courses for this teacher
      const allCourses = getCourses();
      setTeacherCourses(allCourses.filter((c) => c.teacher === t.name));
      // Get schedule events for this teacher
      const allEvents = getEvents();
      const shortName = t.name.split(" ").slice(-1)[0];
      setTeacherSchedule(
        allEvents
          .filter((e) => e.teacher.includes(shortName) || e.teacher === t.name)
          .sort((a, b) => a.day - b.day || a.startHour - b.startHour)
      );
    }
  }, []);

  if (!teacher) {
    return (
      <div className="space-y-6">
        <Link href="/teachers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour a la liste
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Enseignant non trouve</p>
            <Link href="/teachers">
              <Button className="mt-4">Retour aux enseignants</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalStudents = teacherCourses.reduce((sum, c) => sum + 30, 0); // estimate
  const totalHours = teacherSchedule.reduce((sum, e) => sum + e.duration, 0);

  return (
    <div className="space-y-6">
      <Link href="/teachers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <UserAvatar name={teacher.name} size="xl" />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{teacher.name}</h1>
                <StatusBadge status={teacher.status} />
                <Badge variant="outline">{teacher.employeeId}</Badge>
                <Badge variant="default">{teacher.contractType}</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg">
                Specialise(e) en {teacher.specialization}. Departement {teacher.department}.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{teacher.department}</span>
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{teacher.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{teacher.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Cours dispenses" value={String(teacherCourses.length)} icon={<BookOpen className="h-5 w-5 text-primary-600" />} iconBg="bg-primary-100" />
        <StatsCard label="Etudiants (est.)" value={String(totalStudents)} icon={<Users className="h-5 w-5 text-secondary-600" />} iconBg="bg-secondary-100" />
        <StatsCard label="Heures / semaine" value={`${totalHours}h`} icon={<Clock className="h-5 w-5 text-warning-600" />} iconBg="bg-warning-100" />
        <StatsCard label="Cours semaine" value={String(teacherSchedule.length)} icon={<Award className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" />
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Cours</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Cours dispenses</CardTitle></CardHeader>
            <CardContent>
              {teacherCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun cours attribue</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matiere</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Heures/sem</TableHead>
                      <TableHead>Salle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherCourses.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-muted-foreground">{c.code}</TableCell>
                        <TableCell>{c.class}</TableCell>
                        <TableCell>{c.hours}h</TableCell>
                        <TableCell className="text-muted-foreground">{c.room}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Emploi du temps hebdomadaire</CardTitle></CardHeader>
            <CardContent>
              {teacherSchedule.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun cours programme</p>
              ) : (
                <div className="space-y-3">
                  {teacherSchedule.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                      <div className="text-center shrink-0 w-24">
                        <p className="text-xs font-semibold text-primary-600">{days[s.day]}</p>
                        <p className="text-xs text-muted-foreground">{s.startHour}:00 - {s.startHour + s.duration}:00</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.subject}</p>
                        <p className="text-xs text-muted-foreground">{s.class} - {s.room}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{s.type === "cours" ? "Cours" : s.type === "td" ? "TD/TP" : "Examen"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Informations personnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Nom complet" value={teacher.name} />
                <InfoRow label="Email" value={teacher.email} />
                <InfoRow label="Telephone" value={teacher.phone} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Informations professionnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="ID Employe" value={teacher.employeeId} />
                <InfoRow label="Departement" value={teacher.department} />
                <InfoRow label="Specialisation" value={teacher.specialization} />
                <InfoRow label="Type de contrat" value={teacher.contractType} />
                <InfoRow label="Statut" value={teacher.status === "active" ? "Actif" : teacher.status === "on_leave" ? "En conge" : "Inactif"} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}
