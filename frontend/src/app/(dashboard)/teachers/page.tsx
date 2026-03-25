"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Download, Eye, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column, type RowAction } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeacherRow {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  contractType: string;
  status: "active" | "inactive" | "on_leave";
  [key: string]: unknown;
}

const teachers: TeacherRow[] = [
  { id: "1", name: "Dr. Pierre Kamga", employeeId: "ENS-001", email: "p.kamga@isce-alternance.fr", phone: "+33 1 42 00 01", department: "Informatique", specialization: "Algorithmique", contractType: "CDI", status: "active" },
  { id: "2", name: "Pr. Josephine Nkoulou", employeeId: "ENS-002", email: "j.nkoulou@isce-alternance.fr", phone: "+33 1 42 00 02", department: "Informatique", specialization: "Bases de donnees", contractType: "CDI", status: "active" },
  { id: "3", name: "Mme. Isabelle Ekotto", employeeId: "ENS-003", email: "i.ekotto@isce-alternance.fr", phone: "+33 1 42 00 03", department: "Marketing", specialization: "Marketing Digital", contractType: "CDI", status: "active" },
  { id: "4", name: "M. Albert Fouda", employeeId: "ENS-004", email: "a.fouda@isce-alternance.fr", phone: "+33 1 42 00 04", department: "Finance", specialization: "Comptabilite", contractType: "CDI", status: "active" },
  { id: "5", name: "Mme. Helen Johnson", employeeId: "ENS-005", email: "h.johnson@isce-alternance.fr", phone: "+33 1 42 00 05", department: "Langues", specialization: "Anglais des affaires", contractType: "CDD", status: "active" },
  { id: "6", name: "Dr. Francois Onana", employeeId: "ENS-006", email: "f.onana@isce-alternance.fr", phone: "+33 1 42 00 06", department: "Mathematiques", specialization: "Analyse", contractType: "CDI", status: "on_leave" },
  { id: "7", name: "M. Samuel Tamba", employeeId: "ENS-007", email: "s.tamba@isce-alternance.fr", phone: "+33 1 42 00 07", department: "Informatique", specialization: "Reseaux", contractType: "CDI", status: "active" },
  { id: "8", name: "Dr. Angele Mbarga", employeeId: "ENS-008", email: "a.mbarga@isce-alternance.fr", phone: "+33 1 42 00 08", department: "Gestion", specialization: "Management", contractType: "CDI", status: "active" },
  { id: "9", name: "M. Patrick Essono", employeeId: "ENS-009", email: "p.essono@isce-alternance.fr", phone: "+33 1 42 00 09", department: "Droit", specialization: "Droit des affaires", contractType: "Vacataire", status: "active" },
  { id: "10", name: "Mme. Christine Abena", employeeId: "ENS-010", email: "c.abena@isce-alternance.fr", phone: "+33 1 42 00 10", department: "Finance", specialization: "Finance d'entreprise", contractType: "CDI", status: "inactive" },
];

const columns: Column<TeacherRow>[] = [
  {
    key: "name",
    label: "Enseignant",
    sortable: true,
    render: (row) => (
      <Link href={`/teachers/${row.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <UserAvatar name={row.name} size="sm" />
        <div>
          <p className="text-sm font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.employeeId}</p>
        </div>
      </Link>
    ),
  },
  { key: "department", label: "Departement", sortable: true },
  { key: "specialization", label: "Specialisation" },
  {
    key: "contractType",
    label: "Contrat",
    render: (row) => <Badge variant="outline">{String(row.contractType)}</Badge>,
  },
  {
    key: "status",
    label: "Statut",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const actions: RowAction<TeacherRow>[] = [
  { label: "Voir le profil", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
  { label: "Modifier", icon: <Edit className="h-4 w-4" />, onClick: () => {} },
  { label: "Supprimer", icon: <Trash2 className="h-4 w-4" />, onClick: () => {}, variant: "destructive" },
];

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Enseignants" description="Gerez le personnel enseignant de votre etablissement">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Exporter
        </Button>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Ajouter un enseignant
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={teachers}
        actions={actions}
        selectable
        pageSize={10}
        totalItems={86}
        searchPlaceholder="Rechercher un enseignant..."
      />
    </div>
  );
}
