"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column, type RowAction } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getStudents, addStudent, updateStudent, deleteStudent,
  getClassNames, getProgramNames,
  exportStudentsCSV, downloadCSV,
  type Student,
} from "@/lib/mock-data";
import { useRole } from "@/hooks/use-role";

interface StudentRow extends Student {
  [key: string]: unknown;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  programme: "",
  classe: "",
  dateNaissance: "",
  status: "active" as Student["status"],
};

export default function StudentsPage() {
  const [students, setStudents] = React.useState<StudentRow[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);
  const [filterProg, setFilterProg] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const { canManage } = useRole();

  React.useEffect(() => { setStudents(getStudents() as StudentRow[]); }, []);

  const programNames = getProgramNames();
  const classNames = getClassNames();

  const filteredStudents = React.useMemo(() => {
    let list = students;
    if (filterProg !== "all") list = list.filter((s) => s.programme === filterProg);
    if (filterStatus !== "all") list = list.filter((s) => s.status === filterStatus);
    return list;
  }, [students, filterProg, filterStatus]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (s: StudentRow) => {
    setForm({
      name: s.name,
      email: s.email,
      phone: s.phone,
      programme: s.programme,
      classe: s.classe,
      dateNaissance: s.dateNaissance,
      status: s.status,
    });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.programme || !form.classe) return;
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      programme: form.programme,
      classe: form.classe,
      dateNaissance: form.dateNaissance,
      status: form.status,
    };
    if (editId) {
      updateStudent(editId, data);
    } else {
      addStudent(data);
    }
    setStudents(getStudents() as StudentRow[]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setStudents(getStudents() as StudentRow[]);
    setShowDelete(null);
  };

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
    ...(canManage ? [
      { label: "Modifier", icon: <Edit className="h-4 w-4" />, onClick: (row: StudentRow) => openEdit(row) },
      { label: "Supprimer", icon: <Trash2 className="h-4 w-4" />, onClick: (row: StudentRow) => setShowDelete(row.id), variant: "destructive" as const },
    ] : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Etudiants" description={canManage ? "Gerez les etudiants inscrits dans votre etablissement" : "Consultez les etudiants de votre etablissement"}>
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={() => downloadCSV(exportStudentsCSV(), "etudiants-isce.csv")}>
          Exporter CSV
        </Button>
        {canManage && (
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
            Ajouter un etudiant
          </Button>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterProg} onValueChange={setFilterProg}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les programmes</SelectItem>
            {programNames.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
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
        data={filteredStudents}
        actions={actions}
        selectable
        pageSize={15}
        totalItems={filteredStudents.length}
        searchPlaceholder="Rechercher un etudiant..."
      />

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier l'etudiant" : "Ajouter un etudiant"}</DialogTitle>
            <DialogDescription>
              {editId ? "Modifiez les informations de l'etudiant" : "Remplissez les informations du nouvel etudiant"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              label="Nom complet"
              placeholder="Ex: Marie Dupont"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Email"
                type="email"
                placeholder="email@mail.fr"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Telephone"
                type="tel"
                placeholder="+33 6 XX XX XX XX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date de naissance"
                type="date"
                value={form.dateNaissance}
                onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Statut</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Student["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                    <SelectItem value="graduated">Diplome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Programme</label>
                <Select value={form.programme} onValueChange={(v) => setForm({ ...form, programme: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {programNames.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Classe</label>
                <Select value={form.classe} onValueChange={(v) => setForm({ ...form, classe: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.email || !form.programme || !form.classe}>
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;etudiant</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer cet etudiant ? Cette action est irreversible.
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
