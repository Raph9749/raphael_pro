"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getRoleDashboardPath } from "@/lib/mock-auth";
import {
  GraduationCap,
  Users,
  School,
  ClipboardCheck,
  UserPlus,
  Plus,
  Award,
  BookOpen,
  Clock,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getSchoolStats,
  exportStudentsCSV,
  exportTeachersCSV,
  downloadCSV,
} from "@/lib/mock-data";

const pieColors = ["#4F46E5", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#94A3B8"];

const quickActions = [
  { icon: UserPlus, label: "Ajouter un etudiant", color: "bg-primary-100 text-primary-600", href: "/students" },
  { icon: School, label: "Nouvelle classe", color: "bg-secondary-100 text-secondary-600", href: "/classes" },
  { icon: ClipboardCheck, label: "Emploi du temps", color: "bg-success-100 text-success-600", href: "/schedule" },
  { icon: Award, label: "Saisir notes", color: "bg-warning-100 text-warning-600", href: "/grades" },
  { icon: BookOpen, label: "Programmes", color: "bg-emerald-100 text-emerald-600", href: "/programs" },
  { icon: Calendar, label: "Enseignants", color: "bg-purple-100 text-purple-600", href: "/teachers" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ReturnType<typeof getSchoolStats> | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace(getRoleDashboardPath(user.role));
    }
  }, [user, router]);

  useEffect(() => {
    setStats(getSchoolStats());
  }, []);

  if (!user || user.role !== "admin" || !stats) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Build class fill rate chart data from stats
  const programChartData = stats.studentsByProgram.map((p, i) => ({
    ...p,
    color: pieColors[i % pieColors.length],
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Bonjour, {user.first_name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="h-4 w-4" />}
            onClick={() => {
              downloadCSV(exportStudentsCSV(), "etudiants-isce.csv");
            }}
          >
            Export etudiants
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="h-4 w-4" />}
            onClick={() => {
              downloadCSV(exportTeachersCSV(), "enseignants-isce.csv");
            }}
          >
            Export enseignants
          </Button>
        </div>
      </div>

      {/* KPI Cards - Real Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          label="Etudiants"
          value={String(stats.totalStudents)}
          icon={<GraduationCap className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
          trend={{ value: `${stats.activeStudents} actifs`, positive: true }}
        />
        <StatsCard
          label="Enseignants"
          value={String(stats.totalTeachers)}
          icon={<Users className="h-6 w-6 text-secondary-600" />}
          iconBg="bg-secondary-100"
          trend={{ value: `${stats.activeTeachers} actifs`, positive: true }}
        />
        <StatsCard
          label="Classes"
          value={String(stats.totalClasses)}
          icon={<School className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatsCard
          label="Cours"
          value={String(stats.totalCourses)}
          icon={<BookOpen className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
        />
        <StatsCard
          label="Programmes"
          value={String(stats.totalPrograms)}
          icon={<Award className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          label="Evenements"
          value={String(stats.totalEvents)}
          icon={<Calendar className="h-6 w-6 text-rose-600" />}
          iconBg="bg-rose-100"
          trend={{ value: `${stats.todayEvents.length} aujourd'hui`, positive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Repartition par programme" subtitle="Nombre d'etudiants par filiere">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {programChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number, name: string) => [`${value} etudiants`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Etudiants par programme" subtitle="Repartition en barres">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number) => [`${value} etudiants`]}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Etudiants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's schedule from real data */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Emploi du temps du jour</CardTitle>
            <Badge variant="default">
              <Clock className="h-3 w-3 mr-1" />
              {stats.todayEvents.length} cours
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun cours programme aujourd&apos;hui</p>
              ) : (
                stats.todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="text-center shrink-0 w-28">
                      <p className="text-xs font-medium text-primary-600">
                        {event.startHour}:00 - {event.startHour + event.duration}:00
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.class} &middot; {event.room} &middot; {event.teacher}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {event.type === "cours" ? "CM" : event.type === "td" ? "TD/TP" : "Examen"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => router.push(action.href)}
                    className="flex flex-col items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/30 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
