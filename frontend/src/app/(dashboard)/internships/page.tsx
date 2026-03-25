"use client";

import { Plus, Download, Eye, Edit, Briefcase, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column, type RowAction } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/ui/avatar";
import { StatsCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";

interface InternshipRow {
  id: string;
  student: string;
  company: string;
  position: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "pending";
  [key: string]: unknown;
}

const internships: InternshipRow[] = [
  { id: "1", student: "Marie Nguema", company: "Capgemini", position: "Dev. Web Stagiaire", supervisor: "M. Dupont", startDate: "01/02/2026", endDate: "30/04/2026", status: "active" },
  { id: "2", student: "Patrick Mbarga", company: "Orange France", position: "Data Analyst Jr", supervisor: "Mme. Martin", startDate: "15/01/2026", endDate: "15/04/2026", status: "active" },
  { id: "3", student: "Celine Mvondo", company: "Societe Generale", position: "Assistante Comptable", supervisor: "M. Bernard", startDate: "01/03/2026", endDate: "31/05/2026", status: "active" },
  { id: "4", student: "Thierry Kamga", company: "TotalEnergies", position: "Logisticien Stagiaire", supervisor: "Mme. Petit", startDate: "01/01/2026", endDate: "31/03/2026", status: "completed" },
  { id: "5", student: "Aissatou Diallo", company: "Cdiscount", position: "Marketing Digital", supervisor: "M. Leroy", startDate: "15/03/2026", endDate: "15/06/2026", status: "active" },
  { id: "6", student: "Samuel Tamba", company: "Bollore Logistics", position: "Assistant RH", supervisor: "Mme. Moreau", startDate: "01/04/2026", endDate: "30/06/2026", status: "pending" },
  { id: "7", student: "Rose Ekotto", company: "BNP Paribas", position: "Chargee d'accueil", supervisor: "M. Robert", startDate: "01/12/2025", endDate: "28/02/2026", status: "completed" },
  { id: "8", student: "Beatrice Ngo", company: "SFR", position: "Tech. Reseau Stagiaire", supervisor: "M. Richard", startDate: "15/02/2026", endDate: "15/05/2026", status: "active" },
];

const columns: Column<InternshipRow>[] = [
  {
    key: "student",
    label: "Etudiant",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <UserAvatar name={row.student} size="sm" />
        <span className="text-sm font-medium">{row.student}</span>
      </div>
    ),
  },
  {
    key: "company",
    label: "Entreprise",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        <Building className="h-4 w-4 text-muted-foreground" />
        <span>{String(row.company)}</span>
      </div>
    ),
  },
  { key: "position", label: "Poste" },
  { key: "startDate", label: "Debut", sortable: true },
  { key: "endDate", label: "Fin" },
  {
    key: "status",
    label: "Statut",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const actions: RowAction<InternshipRow>[] = [
  { label: "Voir", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
  { label: "Modifier", icon: <Edit className="h-4 w-4" />, onClick: () => {} },
];

export default function InternshipsPage() {
  const activeCount = internships.filter((i) => i.status === "active").length;
  const completedCount = internships.filter((i) => i.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Stages" description="Suivi des stages et placements en entreprise">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Exporter</Button>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau stage</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Stages en cours" value={activeCount} icon={<Briefcase className="h-5 w-5 text-primary-600" />} iconBg="bg-primary-100" />
        <StatsCard label="Stages termines" value={completedCount} icon={<Briefcase className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" />
        <StatsCard label="En attente" value={internships.filter((i) => i.status === "pending").length} icon={<Briefcase className="h-5 w-5 text-warning-600" />} iconBg="bg-warning-100" />
      </div>

      <DataTable
        columns={columns}
        data={internships}
        actions={actions}
        searchPlaceholder="Rechercher un stage..."
      />
    </div>
  );
}
