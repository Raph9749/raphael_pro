"use client";

import * as React from "react";
import { Save, Plus, Trash2, Shield, Bell, Building, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { useRole } from "@/hooks/use-role";
import { useAuthStore } from "@/stores/auth-store";
import { getStudentByLastName, getTeacherByLastName } from "@/lib/mock-data";
import { getRoleLabel } from "@/lib/mock-auth";

const systemUsers = [
  { name: "Jean-Pierre Mbarga", email: "jp.mbarga@isce-alternance.fr", role: "Administrateur", status: "active" as const, lastLogin: "24/03/2026" },
  { name: "Dr. Pierre Kamga", email: "p.kamga@isce-alternance.fr", role: "Enseignant", status: "active" as const, lastLogin: "24/03/2026" },
  { name: "Mme. Isabelle Ekotto", email: "i.ekotto@isce-alternance.fr", role: "Enseignant", status: "active" as const, lastLogin: "23/03/2026" },
  { name: "Sylvie Ngono", email: "s.ngono@isce-alternance.fr", role: "Comptable", status: "active" as const, lastLogin: "24/03/2026" },
  { name: "Marc Ateba", email: "m.ateba@isce-alternance.fr", role: "Secretaire", status: "inactive" as const, lastLogin: "15/03/2026" },
];

const systemRoles = [
  { name: "Administrateur", users: 2, permissions: "Acces complet" },
  { name: "Directeur Academique", users: 1, permissions: "Academique, Etudiants, Enseignants" },
  { name: "Enseignant", users: 86, permissions: "Notes, Presence, Emploi du temps" },
  { name: "Comptable", users: 3, permissions: "Finance, Paiements, Rapports" },
  { name: "Secretaire", users: 4, permissions: "Etudiants, Documents, Communication" },
];

export default function SettingsPage() {
  const { isAdmin, isTeacher, isStudent, isParent, isStaff, canManage } = useRole();
  const { user } = useAuthStore();

  // Get extra info depending on role
  const studentInfo = (isStudent && user) ? getStudentByLastName(user.last_name) : null;
  const teacherInfo = (isTeacher && user) ? getTeacherByLastName(user.last_name) : null;

  const roleLabel = user ? getRoleLabel(user.role) : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parametres"
        description={canManage ? "Configuration de l'etablissement et de votre compte" : "Gestion de votre compte"}
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5"><User className="h-4 w-4" /> Mon profil</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Lock className="h-4 w-4" /> Securite</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="institution" className="gap-1.5"><Building className="h-4 w-4" /> Etablissement</TabsTrigger>
              <TabsTrigger value="users" className="gap-1.5"><Shield className="h-4 w-4" /> Utilisateurs</TabsTrigger>
              <TabsTrigger value="roles" className="gap-1.5"><Shield className="h-4 w-4" /> Roles</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Tab - all roles */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations personnelles</CardTitle>
              <CardDescription>Consultez et modifiez vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <UserAvatar name={user ? `${user.first_name} ${user.last_name}` : ""} size="lg" />
                <div>
                  <p className="text-lg font-semibold text-foreground">{user?.first_name} {user?.last_name}</p>
                  <Badge variant="outline">{roleLabel}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Prenom" defaultValue={user?.first_name || ""} />
                <Input label="Nom" defaultValue={user?.last_name || ""} />
                <Input label="Email" type="email" defaultValue={user?.email || ""} />
                <Input label="Telephone" type="tel" defaultValue={user?.phone || ""} />
              </div>

              {/* Student-specific info */}
              {isStudent && studentInfo && (
                <>
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Informations academiques</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Matricule" defaultValue={studentInfo.matricule} disabled />
                      <Input label="Programme" defaultValue={studentInfo.programme} disabled />
                      <Input label="Classe" defaultValue={studentInfo.classe} disabled />
                      <Input label="Date de naissance" defaultValue={studentInfo.dateNaissance} disabled />
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Statut</label>
                        <StatusBadge status={studentInfo.status} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Teacher-specific info */}
              {isTeacher && teacherInfo && (
                <>
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Informations professionnelles</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Identifiant employe" defaultValue={teacherInfo.employeeId} disabled />
                      <Input label="Departement" defaultValue={teacherInfo.department} disabled />
                      <Input label="Specialisation" defaultValue={teacherInfo.specialization} disabled />
                      <Input label="Type de contrat" defaultValue={teacherInfo.contractType} disabled />
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Statut</label>
                        <StatusBadge status={teacherInfo.status} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Parent info */}
              {isParent && (
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Enfant rattache</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nom de l'enfant" defaultValue="Paul Atangana" disabled />
                    <Input label="Classe" defaultValue="L1 Gestion B" disabled />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab - all roles */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Changer le mot de passe</CardTitle>
              <CardDescription>Mettez a jour votre mot de passe pour securiser votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Mot de passe actuel" type="password" placeholder="••••••••" />
              <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" />
              <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" />
              <div className="flex justify-end">
                <Button leftIcon={<Save className="h-4 w-4" />}>Modifier le mot de passe</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Compte cree le</span>
                <span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Derniere mise a jour</span>
                <span className="font-medium">{user?.updated_at ? new Date(user.updated_at).toLocaleDateString("fr-FR") : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Statut du compte</span>
                <StatusBadge status={user?.is_active ? "active" : "inactive"} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab - all roles */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences de notifications</CardTitle>
              <CardDescription>Configurez quand et comment recevoir des notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isAdmin || isStaff ? (
                // Admin/Staff notifications
                [
                  { title: "Nouveaux etudiants inscrits", desc: "Recevoir une notification quand un nouvel etudiant s'inscrit", enabled: true },
                  { title: "Paiements recus", desc: "Notification a chaque paiement enregistre", enabled: true },
                  { title: "Paiements en retard", desc: "Alerte pour les paiements depassant la date d'echeance", enabled: true },
                  { title: "Notes publiees", desc: "Notification quand des notes sont publiees par un enseignant", enabled: false },
                  { title: "Demandes d'admission", desc: "Alerte pour chaque nouvelle candidature", enabled: true },
                  { title: "Rapports hebdomadaires", desc: "Recevoir un resume hebdomadaire par email", enabled: false },
                  { title: "Alertes de presence", desc: "Notification si le taux de presence descend sous 90%", enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))
              ) : isTeacher ? (
                // Teacher notifications
                [
                  { title: "Rappel de cours", desc: "Notification avant chaque cours programme", enabled: true },
                  { title: "Notes a saisir", desc: "Rappel pour la saisie des notes en attente", enabled: true },
                  { title: "Messages des etudiants", desc: "Notification des messages recus", enabled: true },
                  { title: "Changement d'emploi du temps", desc: "Alerte en cas de modification de votre planning", enabled: true },
                  { title: "Rapports hebdomadaires", desc: "Resume hebdomadaire de vos cours et presences", enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))
              ) : isStudent ? (
                // Student notifications
                [
                  { title: "Nouvelles notes", desc: "Notification quand une note est publiee", enabled: true },
                  { title: "Changement d'emploi du temps", desc: "Alerte en cas de modification de votre planning", enabled: true },
                  { title: "Rappel de cours", desc: "Notification avant chaque cours programme", enabled: false },
                  { title: "Absences signalees", desc: "Notification en cas d'absence enregistree", enabled: true },
                  { title: "Messages de l'administration", desc: "Notifications des annonces de l'ecole", enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))
              ) : (
                // Parent notifications
                [
                  { title: "Notes de l'enfant", desc: "Notification quand une note est publiee pour votre enfant", enabled: true },
                  { title: "Absences signalees", desc: "Alerte en cas d'absence de votre enfant", enabled: true },
                  { title: "Messages de l'administration", desc: "Notifications des annonces de l'ecole", enabled: true },
                  { title: "Rapports de progression", desc: "Resume periodique de la progression de votre enfant", enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institution Tab - admin only */}
        {isAdmin && (
          <TabsContent value="institution" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations de l&apos;etablissement</CardTitle>
                <CardDescription>Configurez les informations generales de votre etablissement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Nom de l'etablissement" defaultValue="ISCE Alternance" />
                  <Input label="Code etablissement" defaultValue="ISCE-PAR-001" />
                  <Input label="Email" defaultValue="contact@isce-alternance.fr" />
                  <Input label="Telephone" defaultValue="+33 1 42 00 00 00" />
                  <Input label="Adresse" defaultValue="12 Rue de la Formation, 75010 Paris" />
                  <Input label="Ville" defaultValue="Paris, France" />
                </div>
                <Textarea label="Description" defaultValue="Ecole superieure en alternance specialisee dans les formations en informatique, gestion, marketing et finance." />
                <div className="flex justify-end">
                  <Button leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Annee academique</CardTitle>
                <CardDescription>Configuration de l&apos;annee academique en cours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Annee academique" defaultValue="2025-2026" />
                  <Input label="Date de debut" type="date" defaultValue="2025-09-15" />
                  <Input label="Date de fin" type="date" defaultValue="2026-07-15" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Langue</label>
                    <Select defaultValue="fr">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Francais</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Devise</label>
                    <Select defaultValue="eur">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                        <SelectItem value="usd">Dollar (USD)</SelectItem>
                        <SelectItem value="gbp">Livre Sterling (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Users Tab - admin only */}
        {isAdmin && (
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Utilisateurs du systeme</CardTitle>
                  <CardDescription>Gerez les comptes d&apos;acces au systeme</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Ajouter</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Derniere connexion</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemUsers.map((u, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar name={u.name} size="sm" />
                            <div>
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                        <TableCell><StatusBadge status={u.status} /></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.lastLogin}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon-sm"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Roles Tab - admin only */}
        {isAdmin && (
          <TabsContent value="roles" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Roles et permissions</CardTitle>
                  <CardDescription>Definissez les roles et leurs permissions</CardDescription>
                </div>
                <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau role</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Utilisateurs</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemRoles.map((role, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell><Badge variant="muted">{role.users}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{role.permissions}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Modifier</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
