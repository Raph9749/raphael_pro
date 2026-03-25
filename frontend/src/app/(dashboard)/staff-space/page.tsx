"use client";

import {
  Users,
  FileText,
  CreditCard,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  ClipboardList,
  Building,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const admissionsByMonth = [
  { mois: "Sep", candidatures: 45, acceptees: 38 },
  { mois: "Oct", candidatures: 32, acceptees: 28 },
  { mois: "Nov", candidatures: 18, acceptees: 15 },
  { mois: "Dec", candidatures: 8, acceptees: 6 },
  { mois: "Jan", candidatures: 12, acceptees: 10 },
  { mois: "Fev", candidatures: 6, acceptees: 5 },
  { mois: "Mar", candidatures: 3, acceptees: 2 },
];

const documentStatus = [
  { name: "Traites", value: 245, color: "#10B981" },
  { name: "En cours", value: 38, color: "#F59E0B" },
  { name: "En attente", value: 15, color: "#EF4444" },
];

const pendingRequests = [
  { type: "Attestation de scolarite", student: "Marie Nguema", date: "24 Mars", priority: "normal" },
  { type: "Releve de notes", student: "Paul Atangana", date: "24 Mars", priority: "urgent" },
  { type: "Certificat d'inscription", student: "Sarah Mbida", date: "23 Mars", priority: "normal" },
  { type: "Attestation de reussite", student: "David Nkoulou", date: "23 Mars", priority: "normal" },
  { type: "Duplicata carte etudiant", student: "Lisa Fouda", date: "22 Mars", priority: "low" },
];

const recentPayments = [
  { student: "Marie Nguema", type: "Scolarite S2", amount: "350,000 FCFA", method: "Mobile Money", time: "Il y a 1h" },
  { student: "Paul Atangana", type: "Frais examen", amount: "25,000 FCFA", method: "Especes", time: "Il y a 2h" },
  { student: "Sarah Mbida", type: "Scolarite S2", amount: "350,000 FCFA", method: "Virement", time: "Il y a 3h" },
  { student: "David Nkoulou", type: "Inscription", amount: "50,000 FCFA", method: "Mobile Money", time: "Hier" },
];

const todayTasks = [
  { task: "Distribuer emplois du temps mis a jour", done: true },
  { task: "Envoyer rappels paiements S2", done: true },
  { task: "Preparer dossiers conseil de classe L3", done: false },
  { task: "Archiver bulletins S1 classes L1", done: false },
  { task: "Mise a jour fichier etudiants L2", done: false },
];

const quickActions = [
  { icon: FileText, label: "Generer attestation", color: "bg-primary-100 text-primary-600" },
  { icon: CreditCard, label: "Enregistrer paiement", color: "bg-emerald-100 text-emerald-600" },
  { icon: UserPlus, label: "Nouvelle inscription", color: "bg-secondary-100 text-secondary-600" },
  { icon: Printer, label: "Imprimer releve", color: "bg-amber-100 text-amber-600" },
  { icon: Mail, label: "Envoyer message", color: "bg-purple-100 text-purple-600" },
  { icon: FolderOpen, label: "Archiver document", color: "bg-rose-100 text-rose-600" },
];

export default function StaffSpacePage() {
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
            Espace personnel
          </h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
            Nouveau document
          </Button>
          <Button size="sm" leftIcon={<CreditCard className="h-4 w-4" />}>
            Paiement
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Demandes en attente"
          value="15"
          icon={<ClipboardList className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
          trend={{ value: "-3", positive: true }}
        />
        <StatsCard
          label="Documents traites"
          value="245"
          icon={<FileText className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend={{ value: "+18", positive: true }}
        />
        <StatsCard
          label="Paiements du jour"
          value="4"
          icon={<CreditCard className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
        />
        <StatsCard
          label="Nouvelles candidatures"
          value="3"
          icon={<UserPlus className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Candidatures par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="candidatures" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Candidatures" />
                  <Bar dataKey="acceptees" fill="#10B981" radius={[6, 6, 0, 0]} name="Acceptees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Etat des documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {documentStatus.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {documentStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Demandes en cours</CardTitle>
            <Badge variant="default" className="bg-amber-100 text-amber-700 border-amber-200">
              {pendingRequests.length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((req, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                    req.priority === "urgent" ? "bg-error-500" :
                    req.priority === "normal" ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.type}</p>
                    <p className="text-xs text-muted-foreground">{req.student} &middot; {req.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Derniers paiements</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary-600 gap-1">
              Tout voir <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{payment.student}</p>
                    <p className="text-xs text-muted-foreground">{payment.type} &middot; {payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">{payment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Taches du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    task.done ? "bg-emerald-100" : "bg-muted"
                  }`}>
                    {task.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className={`text-sm ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {task.task}
                  </p>
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
