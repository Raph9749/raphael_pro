"use client";

import * as React from "react";
import {
  BookOpen,
  Calendar,
  Award,
  ClipboardCheck,
  Clock,
  FileText,
  Bell,
  Download,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getEvents, getCourses, getGrades, getStudents,
  downloadCSV, exportGradesCSV,
  type ScheduleEvent, type StudentGrade,
} from "@/lib/mock-data";
import { getStudentShortClass, getStudentClass } from "@/hooks/use-role";

export default function StudentSpacePage() {
  const [todayEvents, setTodayEvents] = React.useState<ScheduleEvent[]>([]);
  const [gradeData, setGradeData] = React.useState<{ matiere: string; note: number }[]>([]);
  const [totalCourses, setTotalCourses] = React.useState(0);
  const [moyenne, setMoyenne] = React.useState(0);

  React.useEffect(() => {
    const shortClass = getStudentShortClass();
    const fullClass = getStudentClass();

    // Today's events for student's class
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const allEvents = getEvents();
    const myEvents = allEvents.filter((e) =>
      e.day === dayOfWeek && (
        e.class === shortClass ||
        e.class.includes("Info") && shortClass.includes("Info")
      )
    ).sort((a, b) => a.startHour - b.startHour);
    setTodayEvents(myEvents);

    // Courses for this class
    const allCourses = getCourses();
    const myCourses = allCourses.filter((c) =>
      c.class === shortClass ||
      c.class.toLowerCase().includes("l2 info a") ||
      shortClass.toLowerCase().includes(c.class.toLowerCase().split(" ").slice(0, 2).join(" "))
    );
    setTotalCourses(myCourses.length);

    // Get grades for this student
    const allGrades = getGrades();
    const students = getStudents();
    const me = students.find((s) => s.classe === fullClass);
    const myName = me?.name || "Marie Nguema";

    const notesBySubject: { matiere: string; note: number }[] = [];
    let totalAvg = 0;
    let count = 0;

    for (const course of myCourses) {
      const key = `${course.id}-${course.code}`;
      const gradeList = allGrades[key] || [];
      const myGrade = gradeList.find((g) => g.name === myName);
      if (myGrade) {
        const avg = myGrade.cc1 * 0.2 + myGrade.cc2 * 0.2 + myGrade.tp * 0.2 + myGrade.exam * 0.4;
        notesBySubject.push({ matiere: course.name.substring(0, 12), note: Math.round(avg * 10) / 10 });
        totalAvg += avg;
        count++;
      }
    }
    setGradeData(notesBySubject);
    setMoyenne(count > 0 ? Math.round((totalAvg / count) * 10) / 10 : 0);
  }, []);

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
            Mon espace etudiant
          </h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200">
            {getStudentClass()}
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Moyenne generale"
          value={`${moyenne}/20`}
          icon={<Award className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
        />
        <StatsCard
          label="Cours aujourd'hui"
          value={String(todayEvents.length)}
          icon={<Calendar className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
        />
        <StatsCard
          label="Matieres"
          value={String(totalCourses)}
          icon={<BookOpen className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatsCard
          label="Notes saisies"
          value={String(gradeData.length)}
          icon={<ClipboardCheck className="h-6 w-6 text-secondary-600" />}
          iconBg="bg-secondary-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade by subject */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Notes par matiere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              {gradeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="matiere" tick={{ fontSize: 11 }} stroke="#94A3B8" angle={-15} textAnchor="end" height={50} />
                    <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      formatter={(value: number) => [`${value}/20`, "Note"]}
                    />
                    <Bar dataKey="note" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Aucune note disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Emploi du temps du jour</CardTitle>
            <Badge variant="default">
              <Clock className="h-3 w-3 mr-1" />
              {todayEvents.length} cours
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun cours aujourd&apos;hui</p>
              ) : (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-primary-600">
                        {event.startHour}:00 - {event.startHour + event.duration}:00
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {event.type === "cours" ? "CM" : event.type === "td" ? "TD/TP" : "Examen"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{event.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.room} &middot; {event.teacher}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent grades */}
      {gradeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recapitulatif des notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gradeData.map((g, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium text-foreground">{g.matiere}</span>
                  <span className={`text-sm font-bold ${
                    g.note >= 14 ? "text-emerald-600" :
                    g.note >= 10 ? "text-amber-600" :
                    "text-error-600"
                  }`}>
                    {g.note}/20
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
