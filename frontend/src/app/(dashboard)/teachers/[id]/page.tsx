"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, MapPin, BookOpen, Users, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/status-badge";
import { StatsCard } from "@/components/common/stats-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const teacher = {
  name: "Dr. Pierre Kamga",
  employeeId: "ENS-001",
  email: "p.kamga@scholarpro.cm",
  phone: "+237 6 91 00 01",
  department: "Informatique",
  specialization: "Algorithmique & Structures de donnees",
  qualification: "Doctorat en Informatique - Universite de Yaounde I",
  hireDate: "01/09/2018",
  contractType: "CDI",
  address: "Quartier Melen, Yaounde",
  dateOfBirth: "22/05/1980",
  status: "active" as const,
  bio: "Enseignant-chercheur specialise en algorithmique et intelligence artificielle. Plus de 15 ans d'experience dans l'enseignement superieur.",
};

const courses = [
  { subject: "Algorithmique Avancee", class: "L2 Info A", hours: 4, students: 35, room: "Salle 101" },
  { subject: "Algorithmique Avancee", class: "L2 Info B", hours: 4, students: 32, room: "Salle 102" },
  { subject: "Intelligence Artificielle", class: "M1 Info", hours: 3, students: 22, room: "Labo 1" },
  { subject: "Structures de donnees", class: "L1 Info A", hours: 4, students: 45, room: "Amphi A" },
];

const schedule = [
  { day: "Lundi", time: "08:00 - 10:00", subject: "Algorithmique", class: "L2 Info A", room: "Salle 101" },
  { day: "Lundi", time: "14:00 - 17:00", subject: "IA", class: "M1 Info", room: "Labo 1" },
  { day: "Mardi", time: "10:00 - 12:00", subject: "Algorithmique", class: "L2 Info B", room: "Salle 102" },
  { day: "Mercredi", time: "08:00 - 12:00", subject: "Structures de donnees", class: "L1 Info A", room: "Amphi A" },
  { day: "Vendredi", time: "08:00 - 10:00", subject: "Algorithmique TD", class: "L2 Info A", room: "Labo 2" },
];

export default function TeacherProfilePage() {
  return (
    <div className="space-y-6">
      <Link href="/teachers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <UserAvatar name={teacher.name} size="xl" />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{teacher.name}</h1>
                <StatusBadge status={teacher.status} />
                <Badge variant="outline">{teacher.employeeId}</Badge>
                <Badge variant="default">{teacher.contractType}</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg">{teacher.bio}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{teacher.department}</span>
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{teacher.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{teacher.phone}</span>
              </div>
            </div>
            <Button size="sm" leftIcon={<Edit className="h-4 w-4" />}>Modifier</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Cours dispenses" value="4" icon={<BookOpen className="h-5 w-5 text-primary-600" />} iconBg="bg-primary-100" />
        <StatsCard label="Etudiants" value="134" icon={<Users className="h-5 w-5 text-secondary-600" />} iconBg="bg-secondary-100" />
        <StatsCard label="Heures / semaine" value="15h" icon={<Clock className="h-5 w-5 text-warning-600" />} iconBg="bg-warning-100" />
        <StatsCard label="Note moyenne" value="14.8/20" icon={<Award className="h-5 w-5 text-success-600" />} iconBg="bg-success-100" />
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Cours</TabsTrigger>
          <TabsTrigger value="schedule">Emploi du temps</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Cours dispenses</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matiere</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Heures/sem</TableHead>
                    <TableHead>Etudiants</TableHead>
                    <TableHead>Salle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{c.subject}</TableCell>
                      <TableCell>{c.class}</TableCell>
                      <TableCell>{c.hours}h</TableCell>
                      <TableCell>{c.students}</TableCell>
                      <TableCell className="text-muted-foreground">{c.room}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Emploi du temps hebdomadaire</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                    <div className="text-center shrink-0 w-24">
                      <p className="text-xs font-semibold text-primary-600">{s.day}</p>
                      <p className="text-xs text-muted-foreground">{s.time}</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.subject}</p>
                      <p className="text-xs text-muted-foreground">{s.class} - {s.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Informations personnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Nom complet" value={teacher.name} />
                <InfoRow label="Date de naissance" value={teacher.dateOfBirth} />
                <InfoRow label="Adresse" value={teacher.address} />
                <InfoRow label="Email" value={teacher.email} />
                <InfoRow label="Telephone" value={teacher.phone} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Informations professionnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Departement" value={teacher.department} />
                <InfoRow label="Specialisation" value={teacher.specialization} />
                <InfoRow label="Qualification" value={teacher.qualification} />
                <InfoRow label="Date d'embauche" value={teacher.hireDate} />
                <InfoRow label="Type de contrat" value={teacher.contractType} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}
