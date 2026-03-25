"use client";

import {
  BookOpen,
  Calendar,
  Award,
  ClipboardCheck,
  Clock,
  FileText,
  TrendingUp,
  Bell,
  Download,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const gradeData = [
  { matiere: "Algo", note: 16, max: 20 },
  { matiere: "BDD", note: 14, max: 20 },
  { matiere: "Maths", note: 12, max: 20 },
  { matiere: "Anglais", note: 15, max: 20 },
  { matiere: "Reseaux", note: 17, max: 20 },
  { matiere: "Projet", note: 18, max: 20 },
];

const averageEvolution = [
  { mois: "Oct", moyenne: 13.5 },
  { mois: "Nov", moyenne: 14.2 },
  { mois: "Dec", moyenne: 13.8 },
  { mois: "Jan", moyenne: 14.8 },
  { mois: "Fev", moyenne: 15.1 },
  { mois: "Mar", moyenne: 15.4 },
];

const todaySchedule = [
  { time: "08:00 - 10:00", subject: "Algorithmique", room: "Salle 101", teacher: "Dr. Kamga", type: "CM" },
  { time: "10:15 - 12:15", subject: "Base de donnees", room: "Labo 3", teacher: "Pr. Nkoulou", type: "TP" },
  { time: "14:00 - 16:00", subject: "Reseaux informatiques", room: "Salle 205", teacher: "M. Fouda", type: "TD" },
];

const recentGrades = [
  { subject: "Algorithmique", type: "Examen", score: "16/20", date: "15 Mars 2026", status: "excellent" },
  { subject: "Base de donnees", type: "TP Note", score: "14/20", date: "12 Mars 2026", status: "bien" },
  { subject: "Mathematiques", type: "Controle", score: "12/20", date: "10 Mars 2026", status: "moyen" },
  { subject: "Anglais", type: "Oral", score: "15/20", date: "8 Mars 2026", status: "bien" },
];

const notifications = [
  { text: "Nouvelles notes publiees: Algorithmique", time: "Il y a 2h", type: "grade" },
  { text: "Rappel: TP Base de donnees demain", time: "Il y a 5h", type: "schedule" },
  { text: "Document disponible: Bulletin S1", time: "Hier", type: "document" },
];

export default function StudentSpacePage() {
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
            L2 Informatique A
          </Badge>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Mon bulletin
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Moyenne generale"
          value="15.4/20"
          icon={<Award className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend={{ value: "+0.3", positive: true }}
        />
        <StatsCard
          label="Taux de presence"
          value="96.5%"
          icon={<ClipboardCheck className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
          trend={{ value: "+1.2%", positive: true }}
        />
        <StatsCard
          label="Cours aujourd'hui"
          value="3"
          icon={<Calendar className="h-6 w-6 text-secondary-600" />}
          iconBg="bg-secondary-100"
        />
        <StatsCard
          label="Matieres"
          value="8"
          icon={<BookOpen className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-100"
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="matiere" tick={{ fontSize: 12 }} stroke="#94A3B8" />
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
            </div>
          </CardContent>
        </Card>

        {/* Average evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Evolution de la moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={averageEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis domain={[10, 20]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => [`${value}/20`, "Moyenne"]}
                  />
                  <defs>
                    <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="moyenne"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#studentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Emploi du temps du jour</CardTitle>
            <Badge variant="default">
              <Clock className="h-3 w-3 mr-1" />
              {todaySchedule.length} cours
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-primary-600">{item.time}</p>
                    <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.room} &middot; {item.teacher}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent grades */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Dernieres notes</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
              Tout voir <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{grade.subject}</p>
                    <p className="text-xs text-muted-foreground">{grade.type} &middot; {grade.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${
                    grade.status === "excellent" ? "text-emerald-600" :
                    grade.status === "bien" ? "text-primary-600" :
                    "text-amber-600"
                  }`}>
                    {grade.score}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notif, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    notif.type === "grade" ? "bg-emerald-100" :
                    notif.type === "schedule" ? "bg-primary-100" :
                    "bg-amber-100"
                  }`}>
                    {notif.type === "grade" ? <Award className="h-4 w-4 text-emerald-600" /> :
                     notif.type === "schedule" ? <Calendar className="h-4 w-4 text-primary-600" /> :
                     <FileText className="h-4 w-4 text-amber-600" />}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{notif.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
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
