import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-full h-screen bg-[#0f1115] overflow-hidden text-slate-100">
      {/* Background Subtle Mesh / Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute top-[-10%] left-1/3 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[500px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Persistent App Sidebar */}
      <Sidebar />

      {/* Main Content Area with Custom Scrollbar */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-white/10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
