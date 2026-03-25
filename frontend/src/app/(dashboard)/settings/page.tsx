"use client";

import * as React from "react";
import { Save, Upload, Plus, Trash2, Shield, Bell, Globe, Building } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

const users = [
  { name: "Jean-Pierre Mbarga", email: "jp.mbarga@isce-alternance.fr", role: "Administrateur", status: "active" as const, lastLogin: "24/03/2026" },
  { name: "Dr. Pierre Kamga", email: "p.kamga@isce-alternance.fr", role: "Enseignant", status: "active" as const, lastLogin: "24/03/2026" },
  { name: "Mme. Isabelle Ekotto", email: "i.ekotto@isce-alternance.fr", role: "Enseignant", status: "active" as const, lastLogin: "23/03/2026" },
  { name: "Sylvie Ngono", email: "s.ngono@isce-alternance.fr", role: "Comptable", status: "active" as const, lastLogin: "24/03/2026" },
  { name: "Marc Ateba", email: "m.ateba@isce-alternance.fr", role: "Secretaire", status: "inactive" as const, lastLogin: "15/03/2026" },
];

const roles = [
  { name: "Administrateur", users: 2, permissions: "Acces complet" },
  { name: "Directeur Academique", users: 1, permissions: "Academique, Etudiants, Enseignants" },
  { name: "Enseignant", users: 86, permissions: "Notes, Presence, Emploi du temps" },
  { name: "Comptable", users: 3, permissions: "Finance, Paiements, Rapports" },
  { name: "Secretaire", users: 4, permissions: "Etudiants, Documents, Communication" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Parametres" description="Configuration generale de l'etablissement" />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general" className="gap-1.5"><Building className="h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><Shield className="h-4 w-4" /> Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5"><Shield className="h-4 w-4" /> Roles</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
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
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue placeholder="Langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Francais</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="eur">
                  <SelectTrigger>
                    <SelectValue placeholder="Devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                    <SelectItem value="usd">Dollar (USD)</SelectItem>
                    <SelectItem value="gbp">Livre Sterling (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                  {users.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
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
                  {roles.map((role, i) => (
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

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences de notifications</CardTitle>
              <CardDescription>Configurez quand et comment recevoir des notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
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
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
