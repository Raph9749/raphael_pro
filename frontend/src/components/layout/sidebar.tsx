"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  School,
  Calendar,
  Award,
  ClipboardCheck,
  UserPlus,
  CreditCard,
  MessageSquare,
  FileText,
  Briefcase,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      { label: "Tableau de bord", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "ACADEMIQUE",
    items: [
      { label: "Etudiants", href: "/students", icon: GraduationCap },
      { label: "Enseignants", href: "/teachers", icon: Users },
      { label: "Programmes", href: "/programs", icon: BookOpen },
      { label: "Classes", href: "/classes", icon: School },
      { label: "Emploi du temps", href: "/schedule", icon: Calendar },
      { label: "Notes", href: "/grades", icon: Award },
      { label: "Presence", href: "/attendance", icon: ClipboardCheck },
    ],
  },
  {
    title: "GESTION",
    items: [
      { label: "Admissions", href: "/admissions", icon: UserPlus },
      { label: "Finance", href: "/finance", icon: CreditCard },
      { label: "Communication", href: "/communication", icon: MessageSquare },
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Stages", href: "/internships", icon: Briefcase },
      { label: "Evenements", href: "/events", icon: CalendarDays },
    ],
  },
  {
    title: "SYSTEME",
    items: [
      { label: "Analytique", href: "/analytics", icon: BarChart3 },
      { label: "Parametres", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-foreground tracking-tight">
            Scholar<span className="text-primary-600">Pro</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-primary-50 text-primary-700"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          active ? "text-primary-600" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                      {active && !collapsed && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-600" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border px-3 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Reduire</span>
            </>
          )}
        </button>
      </div>

      {/* User profile */}
      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <UserAvatar name="Jean-Pierre Mbarga" size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Jean-Pierre Mbarga</p>
              <p className="text-xs text-muted-foreground truncate">Administrateur</p>
            </div>
          )}
          {!collapsed && (
            <button className="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
