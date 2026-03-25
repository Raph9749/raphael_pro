"use client";

import * as React from "react";
import { Plus, Search, Star, Archive, Trash2, Reply, MoreHorizontal, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const messages = [
  { id: "1", sender: "Dr. Pierre Kamga", subject: "Notes du CC2 - Algorithmique L2", preview: "Bonjour, je vous transmets les notes du deuxieme controle continu pour la classe L2 Info A. Veuillez verifier et valider...", date: "14:30", unread: true, starred: false, priority: "normal" as const },
  { id: "2", sender: "Mme. Isabelle Ekotto", subject: "Demande de salle supplementaire", preview: "Cher collegue, suite a l'augmentation des effectifs en L3 Marketing, j'aurais besoin d'une salle supplementaire pour les TD...", date: "12:15", unread: true, starred: true, priority: "high" as const },
  { id: "3", sender: "Direction Academique", subject: "Calendrier des examens S2 2025-2026", preview: "Veuillez trouver ci-joint le calendrier previsionnel des examens du second semestre. Merci de verifier les creneaux...", date: "Hier", unread: false, starred: true, priority: "urgent" as const },
  { id: "4", sender: "Paul Atangana (Etudiant)", subject: "Justificatif d'absence", preview: "Monsieur, je me permets de vous ecrire pour justifier mon absence du 20 mars. J'ai ete hospitalise et je vous joins...", date: "Hier", unread: false, starred: false, priority: "normal" as const },
  { id: "5", sender: "Service Comptabilite", subject: "Rapport mensuel - Mars 2026", preview: "Ci-joint le rapport financier mensuel de mars 2026. Les recettes sont en hausse de 5% par rapport au mois precedent...", date: "21/03", unread: false, starred: false, priority: "normal" as const },
  { id: "6", sender: "Pr. Josephine Nkoulou", subject: "Proposition de projet de fin d'etudes", preview: "Bonjour, je souhaite proposer 3 sujets de projet de fin d'etudes pour les etudiants de L3 Informatique...", date: "20/03", unread: false, starred: false, priority: "normal" as const },
  { id: "7", sender: "Association Etudiante", subject: "Organisation de la journee portes ouvertes", preview: "Nous organisons la journee portes ouvertes le 15 avril prochain et aimerions discuter de la logistique...", date: "19/03", unread: false, starred: false, priority: "low" as const },
  { id: "8", sender: "Mme. Helen Johnson", subject: "Resultats TOEFL - Promotion 2026", preview: "Les resultats du TOEFL de la session de mars sont arrives. 85% des candidats ont obtenu un score superieur a 550...", date: "18/03", unread: false, starred: false, priority: "normal" as const },
];

const priorityBadge: Record<string, { label: string; variant: "default" | "warning" | "error" | "muted" }> = {
  urgent: { label: "Urgent", variant: "error" },
  high: { label: "Important", variant: "warning" },
  normal: { label: "", variant: "muted" },
  low: { label: "", variant: "muted" },
};

export default function CommunicationPage() {
  const [selectedId, setSelectedId] = React.useState<string>("2");
  const selected = messages.find((m) => m.id === selectedId);

  return (
    <div className="space-y-6">
      <PageHeader title="Communication" description="Messagerie interne de l'etablissement">
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Nouveau message</Button>
      </PageHeader>

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Message List */}
        <Card className="w-[400px] shrink-0 flex flex-col overflow-hidden">
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
                <p>Bonjour Monsieur Mbarga,</p>
                <p>{selected.preview}</p>
                <p>
                  Merci de bien vouloir prendre en compte cette demande dans les meilleurs delais.
                  N&apos;hesitez pas a me contacter si vous avez des questions.
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
