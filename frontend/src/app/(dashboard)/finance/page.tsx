"use client";

import { DollarSign, TrendingUp, Clock, AlertTriangle, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/common/stats-card";
import { ChartCard } from "@/components/common/chart-card";
import { StatusBadge } from "@/components/common/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Sep", montant: 520000 },
  { month: "Oct", montant: 410000 },
  { month: "Nov", montant: 380000 },
  { month: "Dec", montant: 290000 },
  { month: "Jan", montant: 350000 },
  { month: "Fev", montant: 310000 },
  { month: "Mar", montant: 340000 },
];

const recentPayments = [
  { ref: "PAY-2026-0451", student: "Paul Atangana", type: "Scolarite", amount: "350,000 FCFA", method: "Virement", date: "24/03/2026", status: "completed" as const },
  { ref: "PAY-2026-0450", student: "Marie Nguema", type: "Inscription", amount: "75,000 FCFA", method: "Mobile Money", date: "23/03/2026", status: "completed" as const },
  { ref: "PAY-2026-0449", student: "Florence Onana", type: "Scolarite", amount: "350,000 FCFA", method: "Cheque", date: "22/03/2026", status: "pending" as const },
  { ref: "PAY-2026-0448", student: "Andre Biya", type: "Examen", amount: "25,000 FCFA", method: "Especes", date: "22/03/2026", status: "completed" as const },
  { ref: "PAY-2026-0447", student: "Rose Ekotto", type: "Scolarite", amount: "350,000 FCFA", method: "Virement", date: "21/03/2026", status: "completed" as const },
];

const overdueAlerts = [
  { student: "Emmanuel Nkoulou", amount: "350,000 FCFA", dueDate: "15/02/2026", daysOverdue: 37, programme: "L2 Info A" },
  { student: "Jean-Claude Fouda", amount: "350,000 FCFA", dueDate: "01/03/2026", daysOverdue: 23, programme: "L1 Droit A" },
  { student: "Sandrine Essomba", amount: "175,000 FCFA", dueDate: "15/03/2026", daysOverdue: 9, programme: "L3 Info" },
  { student: "Andre Biya", amount: "350,000 FCFA", dueDate: "20/03/2026", daysOverdue: 4, programme: "L2 Gest A" },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Finance" description="Vue d'ensemble financiere de l'etablissement">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Rapport</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Revenus totaux"
          value="2.4M FCFA"
          icon={<DollarSign className="h-5 w-5 text-primary-600" />}
          iconBg="bg-primary-100"
          trend={{ value: "+18%", positive: true }}
        />
        <StatsCard
          label="Encaisse"
          value="1.8M FCFA"
          icon={<TrendingUp className="h-5 w-5 text-success-600" />}
          iconBg="bg-success-100"
          trend={{ value: "+12%", positive: true }}
        />
        <StatsCard
          label="En attente"
          value="420K FCFA"
          icon={<Clock className="h-5 w-5 text-warning-600" />}
          iconBg="bg-warning-100"
        />
        <StatsCard
          label="En retard"
          value="180K FCFA"
          icon={<AlertTriangle className="h-5 w-5 text-error-600" />}
          iconBg="bg-error-100"
          trend={{ value: "+5%", positive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Revenus mensuels" subtitle="FCFA" className="lg:col-span-2">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} formatter={(v: number) => `${(v / 1000).toFixed(0)}k FCFA`} />
                <Bar dataKey="montant" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Montant" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-error-500" />
              Paiements en retard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueAlerts.map((alert, i) => (
              <div key={i} className="rounded-lg border border-error-200 bg-error-50/50 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{alert.student}</p>
                  <span className="text-xs font-semibold text-error-600">{alert.amount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{alert.programme}</span>
                  <span className="text-error-500">{alert.daysOverdue}j de retard</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Paiements recents</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary-600">Tout voir</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Etudiant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Methode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.map((p) => (
                <TableRow key={p.ref}>
                  <TableCell className="font-medium text-xs">{p.ref}</TableCell>
                  <TableCell>{p.student}</TableCell>
                  <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                  <TableCell className="font-semibold">{p.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{p.method}</TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
