"use client";

import * as React from "react";
import { Plus, BookOpen, Users, Award, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getPrograms, addProgram, updateProgram, deleteProgram,
  getStudentsByProgram, getCourses, getTeachers,
  DEPARTMENTS, DEGREES,
  type Program,
} from "@/lib/mock-data";
import { useRole } from "@/hooks/use-role";

const colorMap: Record<string, string> = {
  INFO: "border-l-primary-500",
  GEST: "border-l-secondary-500",
  MKT: "border-l-purple-500",
  FIN: "border-l-emerald-500",
  DROIT: "border-l-amber-500",
  TOUR: "border-l-slate-400",
};

const emptyForm = {
  name: "",
  code: "",
  degree: "Licence",
  department: "",
  duration: "3",
  capacity: "100",
  description: "",
  levels: "L1,L2,L3",
  status: "active" as Program["status"],
};

export default function ProgramsPage() {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);
  const [showDetail, setShowDetail] = React.useState<string | null>(null);
  const { canManage } = useRole();

  React.useEffect(() => { setPrograms(getPrograms()); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (p: Program) => {
    setForm({
      name: p.name,
      code: p.code,
      degree: p.degree,
      department: p.department,
      duration: String(p.duration),
      capacity: String(p.capacity),
      description: p.description,
      levels: p.levels.join(","),
      status: p.status,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code || !form.department) return;
    const data: Omit<Program, "id"> = {
      name: form.name,
      code: form.code,
      degree: form.degree,
      department: form.department,
      duration: Number(form.duration),
      capacity: Number(form.capacity),
      description: form.description,
      levels: form.levels.split(",").map((l) => l.trim()).filter(Boolean),
      status: form.status,
    };
    if (editId) {
      updateProgram(editId, data);
    } else {
      addProgram(data);
    }
    setPrograms(getPrograms());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteProgram(id);
    setPrograms(getPrograms());
    setShowDelete(null);
  };

  const getStats = (programName: string) => {
    const students = getStudentsByProgram(programName);
    const courses = getCourses().filter((c) => c.program === programName || c.program === programName.split(" ")[0]);
    const teacherSet = new Set(courses.map((c) => c.teacher));
    return { students: students.length, courses: courses.length, teachers: teacherSet.size };
  };

  const detailProgram = programs.find((p) => p.id === showDetail);
  const detailStats = detailProgram ? getStats(detailProgram.name) : null;
  const detailStudents = detailProgram ? getStudentsByProgram(detailProgram.name) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Programmes" description={canManage ? "Gestion des programmes et filieres de formation" : "Consultez les programmes de formation"}>
        {canManage && (
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
            Nouveau programme
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {programs.map((program) => {
          const stats = getStats(program.name);
          return (
            <Card key={program.id} className={`border-l-4 ${colorMap[program.code] || "border-l-slate-400"} hover:shadow-card-hover transition-shadow group`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{program.name}</h3>
                      <StatusBadge status={program.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{program.code}</Badge>
                      <span className="text-xs text-muted-foreground">{program.degree} - {program.duration} ans</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setShowDetail(program.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canManage && (
                      <>
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setShowDelete(program.id)}>
                          <Trash2 className="h-4 w-4 text-error-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{program.description}</p>

                {program.status === "active" && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Remplissage</span>
                        <span className="font-medium">{stats.students}/{program.capacity}</span>
                      </div>
                      <Progress value={stats.students} max={program.capacity} size="sm" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {stats.students} etudiants</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {stats.courses} cours</span>
                      <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> {stats.teachers} enseignants</span>
                    </div>

                    {program.levels.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {program.levels.map((level) => (
                          <Badge key={level} variant="muted" className="text-[10px] px-1.5 py-0">{level}</Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Modifier le programme" : "Nouveau programme"}</DialogTitle>
            <DialogDescription>
              {editId ? "Modifiez les informations du programme" : "Configurez le nouveau programme de formation"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nom du programme"
                placeholder="Ex: Informatique"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Code"
                placeholder="Ex: INFO"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Diplome</label>
                <Select value={form.degree} onValueChange={(v) => setForm({ ...form, degree: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEGREES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Departement</label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Duree (annees)"
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
              <Input
                label="Capacite"
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Statut</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Program["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input
              label="Niveaux (separes par des virgules)"
              placeholder="Ex: L1,L2,L3,M1,M2"
              value={form.levels}
              onChange={(e) => setForm({ ...form, levels: e.target.value })}
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows={3}
                placeholder="Description du programme..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.code || !form.department}>
              {editId ? "Modifier" : "Creer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-lg">
          {detailProgram && detailStats && (
            <>
              <DialogHeader>
                <DialogTitle>{detailProgram.name}</DialogTitle>
                <DialogDescription>{detailProgram.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border p-3">
                    <p className="text-2xl font-bold text-foreground">{detailStats.students}</p>
                    <p className="text-xs text-muted-foreground">Etudiants</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-2xl font-bold text-foreground">{detailStats.courses}</p>
                    <p className="text-xs text-muted-foreground">Cours</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-2xl font-bold text-foreground">{detailStats.teachers}</p>
                    <p className="text-xs text-muted-foreground">Enseignants</p>
                  </div>
                </div>

                {detailStudents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Etudiants inscrits</h4>
                    <div className="max-h-48 overflow-y-auto space-y-1.5">
                      {detailStudents.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm px-2 py-1.5 rounded bg-muted/50">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.name}</span>
                            <span className="text-xs text-muted-foreground">{s.matricule}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{s.classe}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{detailProgram.code}</Badge>
                  <span>{detailProgram.degree}</span>
                  <span>-</span>
                  <span>{detailProgram.duration} ans</span>
                  <span>-</span>
                  <span>{detailProgram.department}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le programme</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer ce programme ? Cette action est irreversible.
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
