import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex w-full h-screen bg-[#0f1115] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8 md:p-12">
        {children}
      </main>
    </div>
  );
}
