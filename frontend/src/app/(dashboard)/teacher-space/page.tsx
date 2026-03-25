"use client";

import {
  Users,
  BookOpen,
  Award,
  ClipboardCheck,
  Clock,
  Calendar,
  FileText,
  TrendingUp,
  Plus,
  ChevronRight,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const classPerformance = [
  { classe: "L1-A", moyenne: 12.8, effectif: 35 },
  { classe: "L1-B", moyenne: 13.2, effectif: 32 },
  { classe: "L2-A", moyenne: 14.5, effectif: 28 },
  { classe: "L2-B", moyenne: 13.9, effectif: 30 },
  { classe: "L3", moyenne: 15.1, effectif: 25 },
];

const attendanceTrend = [
  { semaine: "S1", presence: 96, absence: 4 },
  { semaine: "S2", presence: 94, absence: 6 },
  { semaine: "S3", presence: 97, absence: 3 },
  { semaine: "S4", presence: 93, absence: 7 },
  { semaine: "S5", presence: 95, absence: 5 },
  { semaine: "S6", presence: 96, absence: 4 },
];

const todayCourses = [
  { time: "08:00 - 10:00", subject: "Algorithmique", class: "L2 Info A", room: "Salle 101", type: "CM", students: 28 },
  { time: "10:15 - 12:15", subject: "Algorithmique", class: "L2 Info B", room: "Salle 101", type: "TD", students: 30 },
  { time: "14:00 - 16:00", subject: "Projet tutore", class: "L3 Info", room: "Labo 2", type: "TP", students: 25 },
];

const pendingTasks = [
  { task: "Corriger copies examen Algo L2-A", deadline: "18 Mars", priority: "high", count: 28 },
  { task: "Saisir notes TP BDD L1-B", deadline: "20 Mars", priority: "medium", count: 32 },
  { task: "Preparer sujet examen L3", deadline: "25 Mars", priority: "high" },
  { task: "Valider presences semaine S10", deadline: "22 Mars", priority: "low" },
];

const recentStudents = [
  { name: "Marie Nguema", class: "L2-A", lastGrade: "16/20", attendance: "98%", status: "excellent" },
  { name: "Paul Atangana", class: "L2-A", lastGrade: "11/20", attendance: "85%", status: "attention" },
  { name: "Sarah Mbida", class: "L2-B", lastGrade: "14/20", attendance: "94%", status: "bien" },
  { name: "David Nkoulou", class: "L1-A", lastGrade: "08/20", attendance: "78%", status: "danger" },
];

export default function TeacherSpacePage() {
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Mes etudiants"
          value="150"
          icon={<Users className="h-6 w-6 text-secondary-600" />}
          iconBg="bg-secondary-100"
        />
        <StatsCard
          label="Cours aujourd'hui"
          value="3"
          icon={<Calendar className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
        />
        <StatsCard
          label="Copies a corriger"
          value="60"
          icon={<FileText className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
          trend={{ value: "-12", positive: true }}
        />
        <StatsCard
          label="Taux presence moyen"
          value="95.2%"
          icon={<ClipboardCheck className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend={{ value: "+0.8%", positive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Performance par classe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="classe" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number, name: string) =>
                      name === "moyenne" ? [`${value}/20`, "Moyenne"] : [value, "Effectif"]
                    }
                  />
                  <Bar dataKey="moyenne" fill="#06B6D4" radius={[6, 6, 0, 0]} name="moyenne" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tendance de presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="semaine" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => [`${value}%`]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="presence" stroke="#10B981" strokeWidth={2.5} name="Presence %" dot={{ fill: "#10B981", r: 4 }} />
                  <Line type="monotone" dataKey="absence" stroke="#EF4444" strokeWidth={2} name="Absence %" dot={{ fill: "#EF4444", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Mes cours du jour</CardTitle>
            <Badge variant="default">
              <Clock className="h-3 w-3 mr-1" />
              {todayCourses.length} cours
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayCourses.map((course, index) => (
                <div key={index} className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-secondary-600">{course.time}</p>
                    <Badge variant="outline" className="text-[10px]">{course.type}</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{course.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.class} &middot; {course.room} &middot; {course.students} etudiants
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Taches en attente</CardTitle>
            <Badge variant="default" className="bg-amber-100 text-amber-700 border-amber-200">
              {pendingTasks.length} taches
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                    task.priority === "high" ? "bg-error-500" :
                    task.priority === "medium" ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{task.task}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Echeance: {task.deadline}
                      {task.count && ` · ${task.count} copies`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students to watch */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Suivi etudiants</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
              Tout voir <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class} &middot; Presence: {student.attendance}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      student.status === "excellent" ? "text-emerald-600" :
                      student.status === "bien" ? "text-primary-600" :
                      student.status === "attention" ? "text-amber-600" :
                      "text-error-600"
                    }`}>
                      {student.lastGrade}
                    </span>
                    <div className={`mt-0.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      student.status === "excellent" ? "bg-emerald-100 text-emerald-700" :
                      student.status === "bien" ? "bg-primary-100 text-primary-700" :
                      student.status === "attention" ? "bg-amber-100 text-amber-700" :
                      "bg-error-100 text-error-700"
                    }`}>
                      {student.status === "excellent" ? "Excellent" :
                       student.status === "bien" ? "Bien" :
                       student.status === "attention" ? "Attention" :
                       "En difficulte"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
