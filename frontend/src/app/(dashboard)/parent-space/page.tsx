"use client";

import {
  GraduationCap,
  Award,
  ClipboardCheck,
  Calendar,
  CreditCard,
  Bell,
  FileText,
  TrendingUp,
  Phone,
  Mail,
  ChevronRight,
  Download,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const childGradeEvolution = [
  { mois: "Oct", moyenne: 13.2 },
  { mois: "Nov", moyenne: 13.8 },
  { mois: "Dec", moyenne: 14.1 },
  { mois: "Jan", moyenne: 14.5 },
  { mois: "Fev", moyenne: 14.8 },
  { mois: "Mar", moyenne: 15.4 },
];

const childInfo = {
  name: "Marc Atangana",
  class: "L2 Informatique A",
  matricule: "ETU-2024-0142",
  average: "15.4/20",
  rank: "3eme / 28",
  attendance: "96.5%",
};

const recentGrades = [
  { subject: "Algorithmique", score: "16/20", coef: 4, date: "15 Mars", teacher: "Dr. Kamga" },
  { subject: "Base de donnees", score: "14/20", coef: 3, date: "12 Mars", teacher: "Pr. Nkoulou" },
  { subject: "Mathematiques", score: "12/20", coef: 3, date: "10 Mars", teacher: "M. Essono" },
  { subject: "Anglais", score: "15/20", coef: 2, date: "8 Mars", teacher: "Mme. Johnson" },
  { subject: "Reseaux", score: "17/20", coef: 3, date: "5 Mars", teacher: "M. Fouda" },
];

const payments = [
  { label: "Scolarite S2", amount: "350,000 EUR", status: "paid", date: "15 Jan 2026" },
  { label: "Frais d'examen", amount: "25,000 EUR", status: "pending", date: "30 Mars 2026" },
  { label: "Scolarite S1", amount: "350,000 EUR", status: "paid", date: "15 Sep 2025" },
  { label: "Inscription", amount: "50,000 EUR", status: "paid", date: "1 Sep 2025" },
];

const absences = [
  { date: "12 Mars 2026", subject: "TP Reseaux", reason: "Justifiee - Maladie" },
  { date: "25 Fev 2026", subject: "TD Maths", reason: "Non justifiee" },
];

const upcomingEvents = [
  { title: "Examen Algorithmique", date: "28 Mars 2026", type: "exam" },
  { title: "Reunion parents-enseignants", date: "2 Avril 2026", type: "meeting" },
  { title: "Fin du semestre 2", date: "15 Mai 2026", type: "academic" },
];

export default function ParentSpacePage() {
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
            Espace parent
          </h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
            Contacter un enseignant
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Bulletin
          </Button>
        </div>
      </div>

      {/* Child Profile Card */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <UserAvatar name={childInfo.name} size="lg" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{childInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{childInfo.class} &middot; Matricule: {childInfo.matricule}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-center">
              <div className="rounded-lg bg-white border border-amber-200 px-4 py-2">
                <p className="text-lg font-bold text-emerald-600">{childInfo.average}</p>
                <p className="text-xs text-muted-foreground">Moyenne</p>
              </div>
              <div className="rounded-lg bg-white border border-amber-200 px-4 py-2">
                <p className="text-lg font-bold text-primary-600">{childInfo.rank}</p>
                <p className="text-xs text-muted-foreground">Classement</p>
              </div>
              <div className="rounded-lg bg-white border border-amber-200 px-4 py-2">
                <p className="text-lg font-bold text-secondary-600">{childInfo.attendance}</p>
                <p className="text-xs text-muted-foreground">Presence</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Moyenne generale"
          value="15.4/20"
          icon={<Award className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend={{ value: "+0.6", positive: true }}
        />
        <StatsCard
          label="Presence"
          value="96.5%"
          icon={<ClipboardCheck className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
          trend={{ value: "+1.2%", positive: true }}
        />
        <StatsCard
          label="Absences ce mois"
          value="2"
          icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          label="Paiements en attente"
          value="25,000"
          icon={<CreditCard className="h-6 w-6 text-rose-600" />}
          iconBg="bg-rose-100"
        />
      </div>

      {/* Grade evolution chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Evolution de la moyenne de {childInfo.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={childGradeEvolution}>
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
                <Line
                  type="monotone"
                  dataKey="moyenne"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ fill: "#F59E0B", r: 5 }}
                  name="Moyenne"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent grades */}
        <Card>
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
                    <p className="text-xs text-muted-foreground">Coef {grade.coef} &middot; {grade.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{grade.score}</p>
                    <p className="text-xs text-muted-foreground">{grade.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Paiements</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{payment.label}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{payment.amount}</p>
                    <Badge variant={payment.status === "paid" ? "default" : "outline"}
                      className={payment.status === "paid"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                      }
                    >
                      {payment.status === "paid" ? "Paye" : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Events & Absences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Evenements a venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      event.type === "exam" ? "bg-error-100" :
                      event.type === "meeting" ? "bg-primary-100" :
                      "bg-emerald-100"
                    }`}>
                      <Calendar className={`h-4 w-4 ${
                        event.type === "exam" ? "text-error-600" :
                        event.type === "meeting" ? "text-primary-600" :
                        "text-emerald-600"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Absences recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {absences.map((absence, index) => (
                  <div key={index} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium text-foreground">{absence.subject}</p>
                    <p className="text-xs text-muted-foreground">{absence.date}</p>
                    <Badge variant="outline" className={`mt-1 text-[10px] ${
                      absence.reason.includes("Non") ? "bg-error-50 text-error-600 border-error-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                      {absence.reason}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
