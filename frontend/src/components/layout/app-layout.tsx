"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastContainer } from "@/components/ui/toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[260px] transition-all duration-300">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
