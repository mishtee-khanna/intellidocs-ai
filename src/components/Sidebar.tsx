"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Files, 
  MessageSquareText, 
  Settings, 
  Sparkles, 
  LogOut,
  LogIn,
  UserCheck
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Chat / Q&A", href: "/chat", icon: MessageSquareText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const userName = session?.user?.name || "Explorer";
  const userEmail = session?.user?.email || "demo@intellidocs.ai";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ID";

  return (
    <aside className="w-64 h-full border-r border-white/10 bg-[#0f1115]/90 backdrop-blur-2xl shrink-0 flex flex-col justify-between py-6 px-4 z-20">
      {/* Brand Header */}
      <div>
        <Link href="/" className="flex items-center gap-3 px-3 mb-8 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full bg-black/80 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg text-white group-hover:text-emerald-300 transition-colors">
              IntelliDocs
            </span>
            <span className="text-[11px] text-white/40 font-medium tracking-wide uppercase">
              RAG AI Platform
            </span>
          </div>
        </Link>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-white border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-white/50"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
        {session ? (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {userName}
                </span>
                <span className="text-[10px] text-white/40 truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign Out"
              className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sign In / Demo</span>
          </Link>
        )}

        <div className="flex items-center justify-between px-1 text-[11px] text-white/30">
          <span>SQL RAG • v1.0</span>
          <span className="inline-flex items-center gap-1 text-emerald-400/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
