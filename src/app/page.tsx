"use client";

import React, { useState } from "react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Database, 
  FileText, 
  MessageSquareText, 
  Zap,
  CheckCircle2,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b0e] text-white selection:bg-emerald-500/30 flex flex-col relative overflow-x-hidden">
      
      {/* Background Decorative Mesh & Glows */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-30" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 border-b border-white/5 bg-[#090b0e]/70 backdrop-blur-xl">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="h-full w-full bg-black/80 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="font-bold tracking-tight text-xl text-white">IntelliDocs AI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/documents" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Documents
            </Link>
            <Link href="/chat" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Chat Q&A
            </Link>
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="h-10 px-5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-white/70 hover:text-white"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#090b0e] pt-24 px-6 md:hidden flex flex-col gap-6 animate-fade-in">
          <Link href="/dashboard" className="text-lg font-semibold text-white/80 py-3 border-b border-white/10" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/documents" className="text-lg font-semibold text-white/80 py-3 border-b border-white/10" onClick={() => setMenuOpen(false)}>
            Documents
          </Link>
          <Link href="/chat" className="text-lg font-semibold text-white/80 py-3 border-b border-white/10" onClick={() => setMenuOpen(false)}>
            Chat Q&A
          </Link>
          <Link href="/login" className="text-lg font-semibold text-white/80 py-3 border-b border-white/10" onClick={() => setMenuOpen(false)}>
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-center mt-4"
            onClick={() => setMenuOpen(false)}
          >
            Launch App
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-36 pb-20 flex flex-col items-center text-center">
        
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-300">Local RAG AI • SQL Vector Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-6">
          Turn your static documents into <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">conversational intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10">
          Upload PDF, DOCX, Markdown, and TXT files. Extract semantic vector embeddings and converse with your documents in real-time with verified citations. Completely private & local.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link
            href="/chat"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-base hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-2xl hover:scale-105 duration-200"
          >
            <span>Start Chatting Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Open Dashboard</span>
          </Link>
        </div>

        {/* Interactive Architecture / Value Props Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: Multi-Format Ingestion */}
          <div className="flex flex-col p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Multi-Format Ingestion</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Automatic text extraction from PDF, Word (.docx), Markdown, and plain text files with structural paragraph parsing.
            </p>
          </div>

          {/* Card 2: SQL Vector Storage */}
          <div className="flex flex-col p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Relational SQL Vector Store</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Dense 384-dimensional embeddings stored relationally via Prisma ORM for lightning-fast cosine similarity retrieval.
            </p>
          </div>

          {/* Card 3: 100% Privacy & Local AI */}
          <div className="flex flex-col p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verified Citations & Privacy</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Every answer comes with transparent source citations, similarity match percentages, and page numbers.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white/70">IntelliDocs AI</span>
            <span>• Next.js + React + RAG AI + SQL</span>
          </div>
          <span>Built for instant document intelligence</span>
        </div>
      </footer>

    </div>
  );
}
