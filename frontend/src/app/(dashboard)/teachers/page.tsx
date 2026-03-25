"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column, type RowAction } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getTeachers, addTeacher, updateTeacher, deleteTeacher,
  DEPARTMENTS, CONTRACT_TYPES,
  type Teacher,
} from "@/lib/mock-data";

interface TeacherRow extends Teacher {
  [key: string]: unknown;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  specialization: "",
  contractType: "CDI",
  status: "active" as Teacher["status"],
};

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = React.useState<TeacherRow[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  React.useEffect(() => { setTeachers(getTeachers() as TeacherRow[]); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (t: TeacherRow) => {
    setForm({
      name: t.name,
      email: t.email,
      phone: t.phone,
      department: t.department,
      specialization: t.specialization,
      contractType: t.contractType,
      status: t.status,
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.department) return;
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      department: form.department,
      specialization: form.specialization,
      contractType: form.contractType,
      status: form.status,
      employeeId: "",
    };
    if (editId) {
      updateTeacher(editId, data);
    } else {
      addTeacher(data);
    }
    setTeachers(getTeachers() as TeacherRow[]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteTeacher(id);
    setTeachers(getTeachers() as TeacherRow[]);
    setShowDelete(null);
  };

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
    { label: "Voir le profil", icon: <Eye className="h-4 w-4" />, onClick: (row) => router.push(`/teachers/${row.id}`) },
    { label: "Modifier", icon: <Edit className="h-4 w-4" />, onClick: (row) => openEdit(row) },
    { label: "Supprimer", icon: <Trash2 className="h-4 w-4" />, onClick: (row) => setShowDelete(row.id), variant: "destructive" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Enseignants" description="Gerez le personnel enseignant de votre etablissement">
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Exporter
        </Button>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          Ajouter un enseignant
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={teachers}
        actions={actions}
        selectable
        pageSize={10}
        totalItems={teachers.length}
        searchPlaceholder="Rechercher un enseignant..."
      />

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier l'enseignant" : "Ajouter un enseignant"}</DialogTitle>
            <DialogDescription>
              {editId ? "Modifiez les informations" : "Remplissez les informations du nouvel enseignant"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              label="Nom complet"
              placeholder="Ex: Dr. Marie Dupont"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Email"
                type="email"
                placeholder="email@isce-alternance.fr"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Telephone"
                type="tel"
                placeholder="+33 1 XX XX XX XX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Departement</label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Specialisation"
                placeholder="Ex: Intelligence Artificielle"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Type de contrat</label>
                <Select value={form.contractType} onValueChange={(v) => setForm({ ...form, contractType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Statut</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Teacher["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="on_leave">En conge</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.email || !form.department}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;enseignant</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer cet enseignant ? Cette action est irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => showDelete && handleDelete(showDelete)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
