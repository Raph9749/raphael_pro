"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column, type RowAction } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentRow {
  id: string;
  name: string;
  matricule: string;
  email: string;
  programme: string;
  classe: string;
  status: "active" | "inactive" | "graduated" | "suspended";
  [key: string]: unknown;
}

const students: StudentRow[] = [
  { id: "1", name: "Marie Nguema", matricule: "STU-2024-001", email: "m.nguema@mail.cm", programme: "Informatique", classe: "L2 Info A", status: "active" },
  { id: "2", name: "Paul Atangana", matricule: "STU-2024-002", email: "p.atangana@mail.cm", programme: "Gestion", classe: "L1 Gest B", status: "active" },
  { id: "3", name: "Aissatou Diallo", matricule: "STU-2024-003", email: "a.diallo@mail.cm", programme: "Marketing", classe: "L3 Mkt", status: "active" },
  { id: "4", name: "Emmanuel Nkoulou", matricule: "STU-2024-004", email: "e.nkoulou@mail.cm", programme: "Finance", classe: "M1 Fin", status: "active" },
  { id: "5", name: "Sandrine Essomba", matricule: "STU-2024-005", email: "s.essomba@mail.cm", programme: "Informatique", classe: "L3 Info A", status: "suspended" },
  { id: "6", name: "Jean-Claude Fouda", matricule: "STU-2024-006", email: "jc.fouda@mail.cm", programme: "Droit", classe: "L1 Droit A", status: "active" },
  { id: "7", name: "Celine Mvondo", matricule: "STU-2024-007", email: "c.mvondo@mail.cm", programme: "Finance", classe: "L2 Fin", status: "active" },
  { id: "8", name: "Andre Biya", matricule: "STU-2024-008", email: "a.biya@mail.cm", programme: "Gestion", classe: "L2 Gest A", status: "inactive" },
  { id: "9", name: "Florence Onana", matricule: "STU-2024-009", email: "f.onana@mail.cm", programme: "Marketing", classe: "L1 Mkt", status: "active" },
  { id: "10", name: "Patrick Mbarga", matricule: "STU-2024-010", email: "p.mbarga@mail.cm", programme: "Informatique", classe: "L1 Info B", status: "active" },
  { id: "11", name: "Rose Ekotto", matricule: "STU-2024-011", email: "r.ekotto@mail.cm", programme: "Droit", classe: "L2 Droit", status: "graduated" },
  { id: "12", name: "Samuel Tamba", matricule: "STU-2024-012", email: "s.tamba@mail.cm", programme: "Finance", classe: "M2 Fin", status: "active" },
  { id: "13", name: "Beatrice Ngo", matricule: "STU-2024-013", email: "b.ngo@mail.cm", programme: "Informatique", classe: "L2 Info B", status: "active" },
  { id: "14", name: "Thierry Kamga", matricule: "STU-2024-014", email: "t.kamga@mail.cm", programme: "Gestion", classe: "L3 Gest", status: "active" },
  { id: "15", name: "Nadine Owono", matricule: "STU-2024-015", email: "n.owono@mail.cm", programme: "Marketing", classe: "L2 Mkt", status: "active" },
];

const columns: Column<StudentRow>[] = [
  {
    key: "name",
    label: "Etudiant",
    sortable: true,
    render: (row) => (
      <Link href={`/students/${row.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <UserAvatar name={row.name} size="sm" />
        <div>
          <p className="text-sm font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </Link>
    ),
  },
  { key: "matricule", label: "Matricule", sortable: true },
  { key: "programme", label: "Programme", sortable: true },
  { key: "classe", label: "Classe", sortable: true },
  {
    key: "status",
    label: "Statut",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const actions: RowAction<StudentRow>[] = [
  { label: "Voir le profil", icon: <Eye className="h-4 w-4" />, onClick: () => {} },
  { label: "Modifier", icon: <Edit className="h-4 w-4" />, onClick: () => {} },
  { label: "Supprimer", icon: <Trash2 className="h-4 w-4" />, onClick: () => {}, variant: "destructive" },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Etudiants" description="Gerez les etudiants inscrits dans votre etablissement">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Exporter
        </Button>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Ajouter un etudiant
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les programmes</SelectItem>
            <SelectItem value="informatique">Informatique</SelectItem>
            <SelectItem value="gestion">Gestion</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="droit">Droit</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            <SelectItem value="l1">Licence 1</SelectItem>
            <SelectItem value="l2">Licence 2</SelectItem>
            <SelectItem value="l3">Licence 3</SelectItem>
            <SelectItem value="m1">Master 1</SelectItem>
            <SelectItem value="m2">Master 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="graduated">Diplome</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={students}
        actions={actions}
        selectable
        pageSize={15}
        totalItems={1247}
        searchPlaceholder="Rechercher un etudiant..."
      />
    </div>
  );
}
