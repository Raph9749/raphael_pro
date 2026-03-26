"use client";

import { Plus, Upload, Download, FileText, Image, File, FolderOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import { useAuthStore } from "@/stores/auth-store";
import { getStudentByLastName } from "@/lib/mock-data";

const adminFolders = [
  { name: "Bulletins", count: 245, icon: FileText, color: "text-primary-600 bg-primary-100" },
  { name: "Certificats", count: 89, icon: FileText, color: "text-success-600 bg-success-100" },
  { name: "Photos", count: 1200, icon: Image, color: "text-purple-600 bg-purple-100" },
  { name: "Rapports", count: 34, icon: FileText, color: "text-warning-600 bg-warning-100" },
  { name: "Administratif", count: 56, icon: FolderOpen, color: "text-secondary-600 bg-secondary-100" },
  { name: "Examens", count: 128, icon: File, color: "text-error-600 bg-error-100" },
];

const studentFolders = [
  { name: "Mes bulletins", count: 2, icon: FileText, color: "text-primary-600 bg-primary-100" },
  { name: "Certificats", count: 1, icon: FileText, color: "text-success-600 bg-success-100" },
  { name: "Sujets d'examen", count: 5, icon: File, color: "text-error-600 bg-error-100" },
  { name: "Supports de cours", count: 12, icon: FolderOpen, color: "text-secondary-600 bg-secondary-100" },
];

const fileIcons: Record<string, { icon: typeof FileText; color: string }> = {
  PDF: { icon: FileText, color: "text-error-500 bg-error-100" },
  DOCX: { icon: FileText, color: "text-primary-500 bg-primary-100" },
  XLSX: { icon: FileText, color: "text-success-500 bg-success-100" },
  ZIP: { icon: File, color: "text-warning-500 bg-warning-100" },
  JPG: { icon: Image, color: "text-purple-500 bg-purple-100" },
};

export default function DocumentsPage() {
  const { canManage, isStudent, isTeacher } = useRole();
  const { user } = useAuthStore();

  const studentInfo = (isStudent && user) ? getStudentByLastName(user.last_name) : null;
  const studentName = studentInfo?.name || (user ? `${user.first_name} ${user.last_name}` : "");
  const studentClass = studentInfo?.classe || "";

  const adminDocs = [
    { name: "Bulletin S1 - L2 Info A", type: "PDF", size: "2.4 MB", author: "Systeme", date: "24/03/2026", category: "Bulletins" },
    { name: `Certificat de scolarite - ${studentName || "Marie Nguema"}`, type: "PDF", size: "156 KB", author: "Admin", date: "23/03/2026", category: "Certificats" },
    { name: "Rapport financier Mars 2026", type: "XLSX", size: "890 KB", author: "Comptabilite", date: "22/03/2026", category: "Rapports" },
    { name: "PV Conseil de classe L3 Gestion", type: "DOCX", size: "340 KB", author: "Dir. Academique", date: "21/03/2026", category: "Administratif" },
    { name: "Sujet Examen Algorithmique S1", type: "PDF", size: "1.1 MB", author: "Dr. Kamga", date: "20/03/2026", category: "Examens" },
    { name: "Photos journee integration", type: "ZIP", size: "45 MB", author: "Com.", date: "19/03/2026", category: "Photos" },
    { name: "Planning examens S2", type: "PDF", size: "520 KB", author: "Dir. Academique", date: "18/03/2026", category: "Administratif" },
    { name: "Releve de notes L1 Droit A", type: "PDF", size: "1.8 MB", author: "Systeme", date: "17/03/2026", category: "Bulletins" },
  ];

  const studentDocs = [
    { name: `Bulletin S1 - ${studentName}`, type: "PDF", size: "180 KB", author: "Systeme", date: "15/02/2026", category: "Mes bulletins" },
    { name: `Certificat de scolarite - ${studentName}`, type: "PDF", size: "156 KB", author: "Admin", date: "10/01/2026", category: "Certificats" },
    { name: "Sujet Examen Algorithmique S1", type: "PDF", size: "1.1 MB", author: "Dr. Kamga", date: "15/12/2025", category: "Sujets d'examen" },
    { name: "Sujet Examen Base de donnees S1", type: "PDF", size: "850 KB", author: "Pr. Nkoulou", date: "16/12/2025", category: "Sujets d'examen" },
    { name: "Cours Algorithmique - Chap 1 a 5", type: "PDF", size: "3.2 MB", author: "Dr. Kamga", date: "01/10/2025", category: "Supports de cours" },
    { name: "TD Reseaux - Serie 1", type: "PDF", size: "420 KB", author: "M. Tamba", date: "15/10/2025", category: "Supports de cours" },
  ];

  const folders = isStudent ? studentFolders : adminFolders;
  const recentDocuments = isStudent ? studentDocs : adminDocs;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStudent ? "Mes documents" : "Documents"}
        description={isStudent ? "Vos documents scolaires et supports de cours" : "Bibliotheque de documents de l'etablissement"}
      >
        {canManage && (
          <>
            <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>Importer</Button>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau dossier</Button>
          </>
        )}
      </PageHeader>

      {/* Folders Grid */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Dossiers</h3>
        <div className={cn("grid gap-3", isStudent ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6")}>
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <Card key={folder.name} className="cursor-pointer hover:shadow-card-hover transition-all">
                <CardContent className="p-4 text-center space-y-2">
                  <div className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-xl", folder.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{folder.name}</p>
                  <p className="text-xs text-muted-foreground">{folder.count} fichiers</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">{isStudent ? "Mes documents recents" : "Documents recents"}</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full h-9 rounded-lg border border-border bg-white pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentDocuments.map((doc, index) => {
                const fileConfig = fileIcons[doc.type] || { icon: File, color: "text-muted-foreground bg-muted" };
                const FileIcon = fileConfig.icon;
                return (
                  <div key={index} className="flex items-center justify-between px-3 sm:px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn("flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg", fileConfig.color)}>
                        <FileIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} - {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">{doc.category}</Badge>
                      {!isStudent && <span className="text-xs text-muted-foreground w-20 hidden md:block">{doc.author}</span>}
                      <span className="text-xs text-muted-foreground hidden sm:block">{doc.date}</span>
                      <Button variant="ghost" size="icon-sm"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
