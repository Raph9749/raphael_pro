"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Download, Mail, Phone, MapPin, Calendar, BookOpen, Award, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/status-badge";
import { StatsCard } from "@/components/common/stats-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const student = {
  id: "1",
  name: "Marie Nguema",
  matricule: "STU-2024-001",
  email: "m.nguema@mail.cm",
  phone: "+237 6 90 12 34 56",
  dateOfBirth: "15/03/2002",
  gender: "Feminin",
  address: "Rue 1234, Bastos, Yaounde",
  city: "Yaounde",
  emergencyContact: "Paul Nguema (Pere)",
  emergencyPhone: "+237 6 77 88 99 00",
  programme: "Informatique",
  classe: "L2 Info A",
  level: "Licence 2",
  enrollmentDate: "10/09/2023",
  status: "active" as const,
  academicYear: "2025-2026",
};

const recentGrades = [
  { subject: "Algorithmique", type: "Examen", score: "16/20", date: "15/02/2026", teacher: "Dr. Kamga" },
  { subject: "Base de donnees", type: "TP", score: "14/20", date: "12/02/2026", teacher: "Pr. Nkoulou" },
  { subject: "Reseaux", type: "CC", score: "17/20", date: "08/02/2026", teacher: "M. Tamba" },
  { subject: "Mathematiques", type: "Examen", score: "13/20", date: "05/02/2026", teacher: "Dr. Onana" },
  { subject: "Anglais", type: "Oral", score: "15/20", date: "01/02/2026", teacher: "Mme. Johnson" },
];

const upcomingSchedule = [
  { day: "Lundi", time: "08:00 - 10:00", subject: "Algorithmique", room: "Salle 101" },
  { day: "Lundi", time: "10:15 - 12:15", subject: "Reseaux", room: "Labo 2" },
  { day: "Mardi", time: "08:00 - 10:00", subject: "Base de donnees", room: "Labo 3" },
  { day: "Mercredi", time: "13:00 - 15:00", subject: "Mathematiques", room: "Amphi A" },
  { day: "Jeudi", time: "08:00 - 10:00", subject: "Anglais", room: "Salle 205" },
];

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <UserAvatar name={student.name} size="xl" />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
                <StatusBadge status={student.status} />
                <Badge variant="outline">{student.matricule}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {student.programme} - {student.level}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {student.phone}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                Exporter PDF
              </Button>
              <Button size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                Modifier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Moyenne Generale"
          value="15.2/20"
          icon={<Award className="h-5 w-5 text-primary-600" />}
          iconBg="bg-primary-100"
          trend={{ value: "+0.8", positive: true }}
        />
        <StatsCard
          label="Taux de Presence"
          value="96%"
          icon={<Clock className="h-5 w-5 text-success-600" />}
          iconBg="bg-success-100"
          trend={{ value: "+2%", positive: true }}
        />
        <StatsCard
          label="Scolarite Payee"
          value="75%"
          icon={<CreditCard className="h-5 w-5 text-warning-600" />}
          iconBg="bg-warning-100"
        />
        <StatsCard
          label="Credits Valides"
          value="42/60"
          icon={<BookOpen className="h-5 w-5 text-secondary-600" />}
          iconBg="bg-secondary-100"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="academic">Academique</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="attendance">Presence</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activite</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Nom complet" value={student.name} />
                <InfoRow label="Date de naissance" value={student.dateOfBirth} />
                <InfoRow label="Genre" value={student.gender} />
                <InfoRow label="Adresse" value={student.address} />
                <InfoRow label="Ville" value={student.city} />
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact et urgence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Email" value={student.email} />
                <InfoRow label="Telephone" value={student.phone} />
                <InfoRow label="Contact d'urgence" value={student.emergencyContact} />
                <InfoRow label="Tel. urgence" value={student.emergencyPhone} />
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Notes recentes</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary-600">
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matiere</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Enseignant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentGrades.map((grade, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{grade.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{grade.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              parseFloat(grade.score) >= 14
                                ? "text-success-600 font-semibold"
                                : parseFloat(grade.score) >= 10
                                ? "text-warning-600 font-semibold"
                                : "text-error-600 font-semibold"
                            }
                          >
                            {grade.score}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{grade.date}</TableCell>
                        <TableCell className="text-muted-foreground">{grade.teacher}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations academiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Programme" value={student.programme} />
                <InfoRow label="Classe" value={student.classe} />
                <InfoRow label="Niveau" value={student.level} />
                <InfoRow label="Annee academique" value={student.academicYear} />
                <InfoRow label="Date d'inscription" value={student.enrollmentDate} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Emploi du temps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSchedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border border-border p-3">
                      <div className="text-center shrink-0 w-20">
                        <p className="text-xs font-semibold text-primary-600">{item.day}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <p className="text-sm font-medium">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">{item.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique des paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">PAY-2025-001</TableCell>
                    <TableCell>Scolarite S1</TableCell>
                    <TableCell>350,000 FCFA</TableCell>
                    <TableCell className="text-muted-foreground">15/09/2025</TableCell>
                    <TableCell><StatusBadge status="paid" customLabel="Paye" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PAY-2025-002</TableCell>
                    <TableCell>Inscription</TableCell>
                    <TableCell>75,000 FCFA</TableCell>
                    <TableCell className="text-muted-foreground">10/09/2025</TableCell>
                    <TableCell><StatusBadge status="paid" customLabel="Paye" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PAY-2026-001</TableCell>
                    <TableCell>Scolarite S2</TableCell>
                    <TableCell>350,000 FCFA</TableCell>
                    <TableCell className="text-muted-foreground">15/01/2026</TableCell>
                    <TableCell><StatusBadge status="pending" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique de presence</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Matiere</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "20/03/2026", subject: "Algorithmique", time: "08:00 - 10:00", status: "present" as const },
                    { date: "20/03/2026", subject: "Reseaux", time: "10:15 - 12:15", status: "present" as const },
                    { date: "19/03/2026", subject: "Base de donnees", time: "08:00 - 10:00", status: "late" as const },
                    { date: "18/03/2026", subject: "Mathematiques", time: "13:00 - 15:00", status: "present" as const },
                    { date: "17/03/2026", subject: "Anglais", time: "08:00 - 10:00", status: "absent" as const },
                    { date: "17/03/2026", subject: "Algorithmique", time: "10:15 - 12:15", status: "present" as const },
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{item.time}</TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Documents</CardTitle>
              <Button size="sm" variant="outline">Ajouter un document</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Bulletin S1 2025", type: "PDF", size: "1.2 MB", date: "20/01/2026" },
                  { name: "Certificat de scolarite", type: "PDF", size: "256 KB", date: "15/09/2025" },
                  { name: "Photo d'identite", type: "JPG", size: "850 KB", date: "10/09/2025" },
                  { name: "Releve de notes S1", type: "PDF", size: "980 KB", date: "20/01/2026" },
                ].map((doc, index) => (
                  <div key={index} className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                        <Download className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} - {doc.size} - {doc.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique d&apos;activite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Note ajoutee: Algorithmique 16/20", date: "15/02/2026 14:30", by: "Dr. Kamga" },
                  { action: "Presence enregistree: TD Base de donnees", date: "12/02/2026 10:15", by: "Systeme" },
                  { action: "Paiement recu: 350,000 FCFA", date: "15/01/2026 09:00", by: "Comptabilite" },
                  { action: "Inscription validee pour le S2 2025-2026", date: "10/01/2026 08:00", by: "Admin" },
                  { action: "Bulletin S1 genere", date: "20/12/2025 16:00", by: "Systeme" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary-400 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.date} - par {item.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
