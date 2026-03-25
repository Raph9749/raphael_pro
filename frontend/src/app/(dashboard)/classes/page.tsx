"use client";

import * as React from "react";
import { Plus, Users, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getClasses, addClass, updateClass, deleteClass,
  getTeacherNames, getProgramNames, ROOMS,
  type ClassGroup,
} from "@/lib/mock-data";
import { useRole } from "@/hooks/use-role";

const programColors: Record<string, string> = {
  Informatique: "bg-primary-100 text-primary-700",
  Gestion: "bg-secondary-100 text-secondary-700",
  Marketing: "bg-purple-100 text-purple-700",
  Finance: "bg-emerald-100 text-emerald-700",
  Droit: "bg-amber-100 text-amber-700",
};

const emptyForm = {
  name: "",
  code: "",
  program: "",
  level: "1",
  students: "0",
  capacity: "40",
  teacher: "",
  room: "",
};

export default function ClassesPage() {
  const [classes, setClasses] = React.useState<ClassGroup[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);
  const { canManage } = useRole();

  React.useEffect(() => { setClasses(getClasses()); }, []);

  const teacherNames = getTeacherNames();
  const programNames = getProgramNames();

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (cls: ClassGroup) => {
    setForm({
      name: cls.name,
      code: cls.code,
      program: cls.program,
      level: String(cls.level),
      students: String(cls.students),
      capacity: String(cls.capacity),
      teacher: cls.teacher,
      room: cls.room,
    });
    setEditId(cls.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code || !form.program || !form.teacher || !form.room) return;
    const data = {
      name: form.name,
      code: form.code,
      program: form.program,
      level: Number(form.level),
      students: Number(form.students),
      capacity: Number(form.capacity),
      teacher: form.teacher,
      room: form.room,
      status: "active" as const,
    };
    if (editId) {
      updateClass(editId, data);
    } else {
      addClass(data);
    }
    setClasses(getClasses());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteClass(id);
    setClasses(getClasses());
    setShowDelete(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description={canManage ? "Gerez les classes et groupes de votre etablissement" : "Consultez les classes de votre etablissement"}>
        {canManage && (
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
            Nouvelle classe
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const fillPercent = Math.round((cls.students / cls.capacity) * 100);
          return (
            <Card key={cls.id} className="hover:shadow-card-hover transition-shadow group">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{cls.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cls.code}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={programColors[cls.program] || "bg-muted text-muted-foreground"}>
                      {cls.program}
                    </Badge>
                    {canManage && (
                      <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cls)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setShowDelete(cls.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-error-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Remplissage</span>
                    <span className="font-medium text-foreground">{cls.students}/{cls.capacity}</span>
                  </div>
                  <Progress
                    value={cls.students}
                    max={cls.capacity}
                    variant={fillPercent > 90 ? "warning" : "default"}
                    size="sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {cls.students} etudiants
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {cls.room}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <UserAvatar name={cls.teacher} size="sm" className="h-6 w-6 text-[10px]" />
                  <span className="text-xs text-muted-foreground">{cls.teacher}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier la classe" : "Nouvelle classe"}</DialogTitle>
            <DialogDescription>
              {editId ? "Modifiez les informations de la classe" : "Remplissez les informations pour creer une nouvelle classe"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nom de la classe"
                placeholder="Ex: L2 Informatique A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Code"
                placeholder="Ex: L2-INFO-A"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Programme</label>
                <Select value={form.program} onValueChange={(v) => setForm({ ...form, program: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {programNames.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Niveau</label>
                <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Licence 1</SelectItem>
                    <SelectItem value="2">Licence 2</SelectItem>
                    <SelectItem value="3">Licence 3</SelectItem>
                    <SelectItem value="4">Master 1</SelectItem>
                    <SelectItem value="5">Master 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre d'etudiants"
                type="number"
                value={form.students}
                onChange={(e) => setForm({ ...form, students: e.target.value })}
              />
              <Input
                label="Capacite"
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Enseignant responsable</label>
                <Select value={form.teacher} onValueChange={(v) => setForm({ ...form, teacher: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {teacherNames.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Salle</label>
                <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.code || !form.program || !form.teacher || !form.room}>
              {editId ? "Modifier" : "Creer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la classe</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer cette classe ? Cette action est irreversible.
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
