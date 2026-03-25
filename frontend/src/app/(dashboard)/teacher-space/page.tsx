"use client";

import * as React from "react";
import {
  Users,
  BookOpen,
  Award,
  ClipboardCheck,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getEvents, getCoursesByTeacherLastName, getTeacherByLastName, getGrades, getStudentsByClass,
  type ScheduleEvent, type Course, type StudentGrade,
} from "@/lib/mock-data";
import { useAuthStore } from "@/stores/auth-store";

export default function TeacherSpacePage() {
  const { user } = useAuthStore();
  const [todayEvents, setTodayEvents] = React.useState<ScheduleEvent[]>([]);
  const [myCourses, setMyCourses] = React.useState<Course[]>([]);
  const [classPerformance, setClassPerformance] = React.useState<{ classe: string; moyenne: number }[]>([]);
  const [totalStudents, setTotalStudents] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;

    const lastName = user.last_name;

    // Match teacher by last name to find their courses in data store
    const allCourses = getCoursesByTeacherLastName(lastName);
    setMyCourses(allCourses);

    // Today's events for this teacher
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const allEvents = getEvents();
    const myEvents = allEvents.filter((e) =>
      e.day === dayOfWeek && (
        e.teacher.includes(lastName) ||
        e.teacher === `${user.first_name} ${user.last_name}`
      )
    ).sort((a, b) => a.startHour - b.startHour);
    setTodayEvents(myEvents);

    // Calculate performance per class from grades
    const grades = getGrades();
    const perfMap: Record<string, { total: number; count: number }> = {};
    let studentCount = 0;

    for (const course of allCourses) {
      const key = `${course.id}-${course.code}`;
      const gradeList = grades[key] || [];
      if (gradeList.length > 0) {
        const className = course.class;
        if (!perfMap[className]) perfMap[className] = { total: 0, count: 0 };
        for (const g of gradeList) {
          const avg = g.cc1 * 0.2 + g.cc2 * 0.2 + g.tp * 0.2 + g.exam * 0.4;
          perfMap[className].total += avg;
          perfMap[className].count++;
        }
        studentCount += gradeList.length;
      }
    }

    setTotalStudents(studentCount);
    setClassPerformance(
      Object.entries(perfMap).map(([classe, data]) => ({
        classe,
        moyenne: Math.round((data.total / data.count) * 10) / 10,
      }))
    );
  }, [user]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Espace enseignant
          </h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<ClipboardCheck className="h-4 w-4" />}>
            Saisir presence
          </Button>
          <Button size="sm" leftIcon={<Award className="h-4 w-4" />}>
            Saisir notes
          </Button>
        </div>
      </div>

      {/* KPI Cards from real data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Mes etudiants"
          value={String(totalStudents)}
          icon={<Users className="h-6 w-6 text-secondary-600" />}
          iconBg="bg-secondary-100"
        />
        <StatsCard
          label="Cours aujourd'hui"
          value={String(todayEvents.length)}
          icon={<Calendar className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
        />
        <StatsCard
          label="Mes matieres"
          value={String(myCourses.length)}
          icon={<BookOpen className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          label="Classes"
          value={String(new Set(myCourses.map((c) => c.class)).size)}
          icon={<ClipboardCheck className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
        />
      </div>

      {/* Charts & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by class */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Performance par classe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              {classPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="classe" tick={{ fontSize: 11 }} stroke="#94A3B8" angle={-15} textAnchor="end" height={50} />
                    <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      formatter={(value: number) => [`${value}/20`, "Moyenne"]}
                    />
                    <Bar dataKey="moyenne" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Moyenne" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Aucune donnee de performance disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My courses list */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Mes matieres</CardTitle>
            <Badge variant="default">
              <BookOpen className="h-3 w-3 mr-1" />
              {myCourses.length} cours
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[260px] overflow-y-auto">
              {myCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun cours assigne</p>
              ) : (
                myCourses.map((course) => (
                  <div key={course.id} className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{course.name}</span>
                      <Badge variant="outline" className="text-[10px]">{course.code}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {course.class} &middot; {course.room} &middot; {course.hours}h/sem
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Mes cours du jour</CardTitle>
            <Badge variant="default">
              <Clock className="h-3 w-3 mr-1" />
              {todayEvents.length} cours
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun cours aujourd&apos;hui</p>
              ) : (
                todayEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-secondary-600">
                        {event.startHour}:00 - {event.startHour + event.duration}:00
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {event.type === "cours" ? "CM" : event.type === "td" ? "TD/TP" : "Examen"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{event.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.class} &middot; {event.room}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Class performance summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Resume par classe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classPerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucune donnee disponible</p>
              ) : (
                classPerformance.map((cp) => (
                  <div key={cp.classe} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm font-medium text-foreground">{cp.classe}</span>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        cp.moyenne >= 14 ? "text-emerald-600" :
                        cp.moyenne >= 10 ? "text-amber-600" :
                        "text-error-600"
                      }`}>
                        {cp.moyenne}/20
                      </span>
                      <div className={`mt-0.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ml-2 ${
                        cp.moyenne >= 14 ? "bg-emerald-100 text-emerald-700" :
                        cp.moyenne >= 10 ? "bg-amber-100 text-amber-700" :
                        "bg-error-100 text-error-700"
                      }`}>
                        {cp.moyenne >= 14 ? "Excellent" : cp.moyenne >= 10 ? "Correct" : "En difficulte"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
