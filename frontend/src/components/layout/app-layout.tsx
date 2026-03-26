"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastContainer } from "@/components/ui/toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile via prop, shown on lg+ */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile sidebar */}
      <Sidebar
        className={`lg:hidden ${mobileOpen ? "flex" : "hidden"}`}
        onNavigate={() => setMobileOpen(false)}
        mobile
      />

      <div className="lg:pl-[260px] transition-all duration-300">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-3 sm:p-4 md:p-6">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
