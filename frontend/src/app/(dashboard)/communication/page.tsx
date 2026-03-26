"use client";

import * as React from "react";
import { Plus, Search, Star, Archive, Trash2, Reply, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";
import { useAuthStore } from "@/stores/auth-store";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  starred: boolean;
  priority: "urgent" | "high" | "normal" | "low";
}

const adminMessages: Message[] = [
  { id: "1", sender: "Dr. Pierre Kamga", subject: "Notes du CC2 - Algorithmique L2", preview: "Bonjour, je vous transmets les notes du deuxieme controle continu pour la classe L2 Info A. Veuillez verifier et valider...", date: "14:30", unread: true, starred: false, priority: "normal" },
  { id: "2", sender: "Mme. Isabelle Ekotto", subject: "Demande de salle supplementaire", preview: "Cher collegue, suite a l'augmentation des effectifs en L3 Marketing, j'aurais besoin d'une salle supplementaire pour les TD...", date: "12:15", unread: true, starred: true, priority: "high" },
  { id: "3", sender: "Direction Academique", subject: "Calendrier des examens S2 2025-2026", preview: "Veuillez trouver ci-joint le calendrier previsionnel des examens du second semestre. Merci de verifier les creneaux...", date: "Hier", unread: false, starred: true, priority: "urgent" },
  { id: "4", sender: "Paul Atangana (Etudiant)", subject: "Justificatif d'absence", preview: "Monsieur, je me permets de vous ecrire pour justifier mon absence du 20 mars. J'ai ete hospitalise et je vous joins...", date: "Hier", unread: false, starred: false, priority: "normal" },
  { id: "5", sender: "Service Comptabilite", subject: "Rapport mensuel - Mars 2026", preview: "Ci-joint le rapport financier mensuel de mars 2026. Les recettes sont en hausse de 5% par rapport au mois precedent...", date: "21/03", unread: false, starred: false, priority: "normal" },
  { id: "6", sender: "Pr. Josephine Nkoulou", subject: "Proposition de projet de fin d'etudes", preview: "Bonjour, je souhaite proposer 3 sujets de projet de fin d'etudes pour les etudiants de L3 Informatique...", date: "20/03", unread: false, starred: false, priority: "normal" },
];

const studentMessages: Message[] = [
  { id: "1", sender: "Administration ISCE", subject: "Convocation aux examens S1", preview: "Bonjour, vous etes convoque(e) aux examens du semestre 1 du 28 mars au 10 avril 2026. Veuillez consulter le planning...", date: "14:30", unread: true, starred: true, priority: "urgent" },
  { id: "2", sender: "Dr. Kamga", subject: "Support de cours - Algorithmique Ch.6", preview: "Bonjour, veuillez trouver ci-joint le support du chapitre 6 sur les arbres binaires. A preparer pour le prochain cours...", date: "Hier", unread: true, starred: false, priority: "normal" },
  { id: "3", sender: "Scolarite", subject: "Attestation de scolarite disponible", preview: "Votre attestation de scolarite pour l'annee 2025-2026 est disponible au service scolarite. Vous pouvez la retirer...", date: "22/03", unread: false, starred: false, priority: "normal" },
  { id: "4", sender: "M. Tamba", subject: "TP Reseaux - Preparation", preview: "Pour le prochain TP, merci d'installer Wireshark sur vos machines et de preparer l'exercice 3 du polycopie...", date: "20/03", unread: false, starred: false, priority: "normal" },
  { id: "5", sender: "Bureau des stages", subject: "Rappel convention de stage", preview: "Nous vous rappelons que votre convention de stage doit etre deposee au plus tard le 15 avril 2026...", date: "18/03", unread: false, starred: true, priority: "high" },
];

const teacherMessages: Message[] = [
  { id: "1", sender: "Administration", subject: "Planning examens S2", preview: "Bonjour, veuillez trouver ci-joint le planning des examens du second semestre. Merci de confirmer vos disponibilites...", date: "14:30", unread: true, starred: true, priority: "urgent" },
  { id: "2", sender: "Marie Nguema (Etudiante)", subject: "Question sur le TP", preview: "Bonjour Monsieur, j'ai une question concernant l'exercice 4 du TP sur les arbres. Pourriez-vous m'eclairer...", date: "12:15", unread: true, starred: false, priority: "normal" },
  { id: "3", sender: "Scolarite", subject: "Rappel saisie des notes CC2", preview: "Les notes du CC2 doivent etre saisies avant le 30 mars. Merci de completer la saisie pour vos matieres...", date: "Hier", unread: false, starred: false, priority: "high" },
  { id: "4", sender: "Direction", subject: "Conseil pedagogique du 2 avril", preview: "Vous etes invite au conseil pedagogique qui se tiendra le 2 avril a 14h en salle de reunion...", date: "20/03", unread: false, starred: false, priority: "normal" },
];

const priorityBadge: Record<string, { label: string; variant: "default" | "warning" | "error" | "muted" }> = {
  urgent: { label: "Urgent", variant: "error" },
  high: { label: "Important", variant: "warning" },
  normal: { label: "", variant: "muted" },
  low: { label: "", variant: "muted" },
};

export default function CommunicationPage() {
  const { canManage, isStudent, isTeacher } = useRole();
  const { user } = useAuthStore();

  const messages = isStudent ? studentMessages : isTeacher ? teacherMessages : adminMessages;
  const [selectedId, setSelectedId] = React.useState<string>(messages[0]?.id || "1");
  const selected = messages.find((m) => m.id === selectedId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isStudent ? "Mes messages" : "Communication"}
        description={isStudent ? "Messages et notifications de l'ecole" : "Messagerie interne de l'etablissement"}
      >
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau message</Button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:h-[calc(100vh-220px)]">
        {/* Message List */}
        <Card className="w-full lg:w-[400px] lg:shrink-0 flex flex-col overflow-hidden max-h-[50vh] lg:max-h-none">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un message..."
                className="w-full h-9 rounded-lg border border-border bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors",
                  selectedId === msg.id && "bg-primary-50 border-l-2 border-l-primary-600",
                  msg.unread && "bg-muted/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <UserAvatar name={msg.sender} size="sm" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm truncate", msg.unread ? "font-semibold text-foreground" : "text-foreground")}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">{msg.date}</span>
                    </div>
                    <p className={cn("text-sm truncate", msg.unread ? "font-medium text-foreground" : "text-muted-foreground")}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.preview}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {priorityBadge[msg.priority].label && (
                        <Badge variant={priorityBadge[msg.priority].variant} className="text-[10px] px-1.5 py-0">
                          {priorityBadge[msg.priority].label}
                        </Badge>
                      )}
                      {msg.starred && <Star className="h-3 w-3 text-warning-400 fill-warning-400" />}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Message Detail */}
        {selected ? (
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selected.subject}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <UserAvatar name={selected.sender} size="sm" className="h-6 w-6 text-[10px]" />
                  <span className="text-sm text-muted-foreground">{selected.sender}</span>
                  <span className="text-xs text-muted-foreground">- {selected.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm"><Reply className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon-sm"><Star className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon-sm"><Archive className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon-sm"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <p>Bonjour{isStudent && user ? ` ${user.first_name}` : ""},</p>
                <p>{selected.preview}</p>
                <p>
                  Merci de bien vouloir prendre en compte cette information.
                  N&apos;hesitez pas a nous contacter si vous avez des questions.
                </p>
                <p>Cordialement,<br />{selected.sender}</p>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Repondre..."
                  className="flex-1 h-10 rounded-lg border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                />
                <Button variant="ghost" size="icon-sm"><Paperclip className="h-4 w-4" /></Button>
                <Button size="icon-sm"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Selectionnez un message</p>
          </Card>
        )}
      </div>
    </div>
  );
}
