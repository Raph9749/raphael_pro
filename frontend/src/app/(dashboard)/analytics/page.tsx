"use client";

import { Download, TrendingUp, Users, Award, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { ChartCard } from "@/components/common/chart-card";
import { StatsCard } from "@/components/common/stats-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const enrollmentTrend = [
  { year: "2021", students: 780 },
  { year: "2022", students: 920 },
  { year: "2023", students: 1050 },
  { year: "2024", students: 1120 },
  { year: "2025", students: 1200 },
  { year: "2026", students: 1247 },
];

const gradeDistribution = [
  { range: "0-5", count: 15 },
  { range: "5-8", count: 42 },
  { range: "8-10", count: 89 },
  { range: "10-12", count: 245 },
  { range: "12-14", count: 312 },
  { range: "14-16", count: 285 },
  { range: "16-18", count: 178 },
  { range: "18-20", count: 81 },
];

const attendanceByProgram = [
  { program: "Info", taux: 94.2 },
  { program: "Gest", taux: 92.8 },
  { program: "Mkt", taux: 91.5 },
  { program: "Fin", taux: 95.1 },
  { program: "Droit", taux: 89.7 },
];

const revenueByType = [
  { name: "Scolarite", value: 1680000, color: "#4F46E5" },
  { name: "Inscription", value: 320000, color: "#06B6D4" },
  { name: "Examens", value: 180000, color: "#10B981" },
  { name: "Bibliotheque", value: 45000, color: "#F59E0B" },
  { name: "Autres", value: 175000, color: "#94A3B8" },
];

const monthlyAttendance = [
  { month: "Sep", taux: 96.5 },
  { month: "Oct", taux: 95.8 },
  { month: "Nov", taux: 94.2 },
  { month: "Dec", taux: 92.1 },
  { month: "Jan", taux: 93.8 },
  { month: "Fev", taux: 94.5 },
  { month: "Mar", taux: 94.2 },
];

const successRate = [
  { year: "2021", taux: 72 },
  { year: "2022", taux: 75 },
  { year: "2023", taux: 78 },
  { year: "2024", taux: 80 },
  { year: "2025", taux: 82 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytique" description="Tableaux de bord et indicateurs de performance">
        <Select defaultValue="2025-2026">
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025-2026">2025-2026</SelectItem>
            <SelectItem value="2024-2025">2024-2025</SelectItem>
            <SelectItem value="2023-2024">2023-2024</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Rapport complet</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Taux de reussite" value="82%" icon={<Award className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" trend={{ value: "+2%", positive: true }} />
        <StatsCard label="Moyenne generale" value="13.4/20" icon={<TrendingUp className="h-5 w-5 text-primary-600" />} iconBg="bg-primary-100" trend={{ value: "+0.3", positive: true }} />
        <StatsCard label="Presence moyenne" value="94.2%" icon={<Users className="h-5 w-5 text-secondary-600" />} iconBg="bg-secondary-100" trend={{ value: "-0.8%", positive: false }} />
        <StatsCard label="Recouvrement" value="76%" icon={<CreditCard className="h-5 w-5 text-warning-600" />} iconBg="bg-warning-100" trend={{ value: "+4%", positive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Evolution des inscriptions" subtitle="Nombre d'etudiants par annee">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={2.5} fill="url(#enrollGrad)" name="Etudiants" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Distribution des notes" subtitle="Repartition par tranche de note">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
                <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Etudiants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Presence par programme" subtitle="Taux de presence moyen (%)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceByProgram} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" domain={[85, 100]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis type="category" dataKey="program" tick={{ fontSize: 12 }} stroke="#94A3B8" width={50} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="taux" fill="#10B981" radius={[0, 6, 6, 0]} name="Taux" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Repartition des revenus" subtitle="Par type de paiement">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByType} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {revenueByType.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} formatter={(v: number) => `${(v / 1000).toFixed(0)}k FCFA`} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Evolution de la presence" subtitle="Taux mensuel (%)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis domain={[88, 100]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} formatter={(v: number) => `${v}%`} />
                <Line type="monotone" dataKey="taux" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: "#F59E0B", r: 4 }} name="Presence" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Taux de reussite" subtitle="Evolution sur 5 ans (%)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={successRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis domain={[65, 90]} tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} formatter={(v: number) => `${v}%`} />
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="taux" stroke="#10B981" strokeWidth={2.5} fill="url(#successGrad)" name="Taux" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
