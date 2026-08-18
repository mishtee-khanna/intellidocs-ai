"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Documents", href: "/documents" },
    { name: "Chat / Q&A", href: "/chat" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <aside className="w-64 h-full border-r border-white/10 bg-white/[0.02] backdrop-blur-xl shrink-0 flex flex-col pt-8">
      {/* Logo */}
      <div className="flex items-center gap-3 px-8 mb-12">
        <svg width="24" height="24" viewBox="0 0 256 256" className="fill-white">
          <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
        </svg>
        <span className="font-bold tracking-wide text-lg text-white">IntelliDocs AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
                isActive 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Profile or Info could go here */}
      <div className="mt-auto p-8 text-white/30 text-xs">
        v1.0.0
      </div>
    </aside>
  );
};
