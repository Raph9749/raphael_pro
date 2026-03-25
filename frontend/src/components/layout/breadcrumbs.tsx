"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const pathLabels: Record<string, string> = {
  "": "Tableau de bord",
  students: "Etudiants",
  teachers: "Enseignants",
  programs: "Programmes",
  classes: "Classes",
  schedule: "Emploi du temps",
  grades: "Notes",
  attendance: "Presence",
  admissions: "Admissions",
  finance: "Finance",
  communication: "Communication",
  documents: "Documents",
  internships: "Stages",
  events: "Evenements",
  analytics: "Analytique",
  settings: "Parametres",
};

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
