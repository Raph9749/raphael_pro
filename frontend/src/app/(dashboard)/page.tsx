"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getRoleDashboardPath } from "@/lib/mock-auth";
import {
  GraduationCap,
  Users,
  School,
  CreditCard,
  ClipboardCheck,
  UserPlus,
  Plus,
  Award,
  BookOpen,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const enrollmentData = [
  { month: "Sep", nouveaux: 180, total: 1050 },
  { month: "Oct", nouveaux: 95, total: 1145 },
  { month: "Nov", nouveaux: 42, total: 1187 },
  { month: "Dec", nouveaux: 15, total: 1202 },
  { month: "Jan", nouveaux: 28, total: 1230 },
  { month: "Fev", nouveaux: 12, total: 1242 },
  { month: "Mar", nouveaux: 5, total: 1247 },
];

const revenueData = [
  { month: "Sep", revenus: 520000, depenses: 380000 },
  { month: "Oct", revenus: 410000, depenses: 350000 },
  { month: "Nov", revenus: 380000, depenses: 340000 },
  { month: "Dec", revenus: 290000, depenses: 320000 },
  { month: "Jan", revenus: 350000, depenses: 330000 },
  { month: "Fev", revenus: 310000, depenses: 310000 },
  { month: "Mar", revenus: 340000, depenses: 300000 },
];

const attendanceData = [
  { semaine: "S1", taux: 96.2 },
  { semaine: "S2", taux: 95.8 },
  { semaine: "S3", taux: 94.5 },
  { semaine: "S4", taux: 93.1 },
  { semaine: "S5", taux: 95.0 },
  { semaine: "S6", taux: 94.8 },
  { semaine: "S7", taux: 93.9 },
  { semaine: "S8", taux: 94.2 },
];

const programData = [
  { name: "Informatique", value: 320, color: "#4F46E5" },
  { name: "Gestion", value: 280, color: "#06B6D4" },
  { name: "Marketing", value: 195, color: "#8B5CF6" },
  { name: "Finance", value: 210, color: "#10B981" },
  { name: "Droit", value: 142, color: "#F59E0B" },
  { name: "Autres", value: 100, color: "#94A3B8" },
];

const recentActivity = [
  { id: 1, icon: UserPlus, color: "text-primary-500", bg: "bg-primary-100", text: "Nouvel etudiant inscrit: Marie Nguema", time: "Il y a 5 min" },
  { id: 2, icon: CreditCard, color: "text-success-500", bg: "bg-success-100", text: "Paiement recu: 350,000 FCFA - Paul Atangana", time: "Il y a 15 min" },
  { id: 3, icon: Award, color: "text-warning-500", bg: "bg-warning-100", text: "Notes publiees: Mathematiques L2 Informatique", time: "Il y a 30 min" },
  { id: 4, icon: ClipboardCheck, color: "text-secondary-500", bg: "bg-secondary-100", text: "Presence enregistree: TD Algorithmique (35 etudiants)", time: "Il y a 1h" },
  { id: 5, icon: FileText, color: "text-purple-500", bg: "bg-purple-100", text: "Document ajoute: Bulletin S1 - Classe L1-A", time: "Il y a 2h" },
  { id: 6, icon: Users, color: "text-cyan-500", bg: "bg-cyan-100", text: "Reunion planifiee: Conseil de classe L3 Gestion", time: "Il y a 3h" },
];

const todaySchedule = [
  { time: "08:00 - 10:00", subject: "Algorithmique", class: "L2 Info A", room: "Salle 101", teacher: "Dr. Kamga" },
  { time: "10:15 - 12:15", subject: "Base de donnees", class: "L2 Info B", room: "Labo 3", teacher: "Pr. Nkoulou" },
  { time: "13:00 - 15:00", subject: "Marketing Digital", class: "L3 Marketing", room: "Amphi B", teacher: "Mme. Ekotto" },
  { time: "15:15 - 17:15", subject: "Comptabilite", class: "L1 Gestion", room: "Salle 204", teacher: "M. Fouda" },
  { time: "17:30 - 19:00", subject: "Anglais des affaires", class: "M1 Finance", room: "Salle 302", teacher: "Mme. Johnson" },
];

const quickActions = [
  { icon: UserPlus, label: "Ajouter un etudiant", color: "bg-primary-100 text-primary-600" },
  { icon: School, label: "Nouvelle classe", color: "bg-secondary-100 text-secondary-600" },
  { icon: ClipboardCheck, label: "Saisir presence", color: "bg-success-100 text-success-600" },
  { icon: Award, label: "Saisir notes", color: "bg-warning-100 text-warning-600" },
  { icon: CreditCard, label: "Enregistrer paiement", color: "bg-emerald-100 text-emerald-600" },
  { icon: Calendar, label: "Planifier evenement", color: "bg-purple-100 text-purple-600" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace(getRoleDashboardPath(user.role));
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
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
          <Button variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
            Exporter
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Action rapide
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          label="Etudiants"
          value="1,247"
          icon={<GraduationCap className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          label="Enseignants"
          value="86"
          icon={<Users className="h-6 w-6 text-secondary-600" />}
          iconBg="bg-secondary-100"
          trend={{ value: "+3%", positive: true }}
        />
        <StatsCard
          label="Classes"
          value="42"
          icon={<School className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatsCard
          label="Revenus"
          value="2.4M"
          icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend={{ value: "+18%", positive: true }}
        />
        <StatsCard
          label="Presence"
          value="94.2%"
          icon={<ClipboardCheck className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
          trend={{ value: "-1.2%", positive: false }}
        />
        <StatsCard
          label="Candidatures"
          value="23"
          icon={<UserPlus className="h-6 w-6 text-rose-600" />}
          iconBg="bg-rose-100"
          trend={{ value: "+8", positive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tendances des inscriptions" subtitle="Etudiants inscrits par mois">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: "#4F46E5", r: 4 }} name="Total" />
                <Line type="monotone" dataKey="nouveaux" stroke="#06B6D4" strokeWidth={2.5} dot={{ fill: "#06B6D4", r: 4 }} name="Nouveaux" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Apercu des revenus" subtitle="Revenus et depenses mensuels (FCFA)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number) => `${(value / 1000).toFixed(0)}k FCFA`}
                />
                <Legend />
                <Bar dataKey="revenus" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Revenus" />
                <Bar dataKey="depenses" fill="#E2E8F0" radius={[6, 6, 0, 0]} name="Depenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Taux de presence" subtitle="Evolution hebdomadaire (%)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="semaine" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="taux" stroke="#06B6D4" strokeWidth={2.5} fill="url(#attendanceGradient)" name="Taux" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Repartition par programme" subtitle="Nombre d'etudiants par filiere">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {programData.map((entry, index) => (
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
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Activite recente</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.bg}`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
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
                  className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="text-center shrink-0 w-24">
                    <p className="text-xs font-medium text-primary-600">{item.time}</p>
                  </div>
                  <div className="h-8 w-px bg-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.class} &middot; {item.room} &middot; {item.teacher}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
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
  );
}
