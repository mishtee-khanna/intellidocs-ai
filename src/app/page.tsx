"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Silkscreen:wght@400;700&display=swap');
        
        .font-geist {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .font-silkscreen {
          font-family: 'Silkscreen', cursive;
        }

        /* Subtle animated grid background */
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
      `}} />

      <div className="font-geist h-screen bg-black text-white relative overflow-hidden flex flex-col selection:bg-white/20">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Navbar */}
        <nav className="fixed top-0 inset-x-0 z-50 h-20 border-b border-white/5 bg-black/50 backdrop-blur-md shrink-0">
          <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <svg width="24" height="24" viewBox="0 0 256 256" className="fill-white">
                <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
              </svg>
              <span className="font-semibold tracking-wide text-lg text-white">Intellidocs</span>
            </div>

            {/* Desktop Links (Centered) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 shrink-0">
              <Link href="/dashboard" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/chat" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                Chat
              </Link>
              <Link href="/chat" className="h-10 px-6 rounded-full bg-white font-bold text-sm flex items-center justify-center hover:bg-gray-200 transition-colors" style={{ color: "#000000" }}>
                Get started
              </Link>
            </div>

            {/* Empty div for flex-between balance if needed, or Mobile Toggle */}
            <div className="flex items-center justify-end">
              <button
                className="md:hidden p-2 text-white/70 hover:text-white transition-colors shrink-0"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden">
            <div className="flex flex-col gap-6 text-xl font-medium">
              <Link href="/dashboard" className="text-white/80 hover:text-white pb-4 border-b border-white/10" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/chat" className="text-white/80 hover:text-white pb-4 border-b border-white/10" onClick={() => setMenuOpen(false)}>
                Chat
              </Link>
              <Link href="/chat" className="h-14 mt-4 rounded-full bg-white font-bold flex items-center justify-center" style={{ color: "#000000" }} onClick={() => setMenuOpen(false)}>
                Get started
              </Link>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center gap-6 shrink-0 pt-16">
          
          {/* Top Text Group */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-white/90">Now supporting local AI models</span>
            </div>

            {/* Headline */}
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent shrink-0">
              Chat with your <br className="hidden sm:block" /> documents instantly
            </h1>
            
            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/50 leading-relaxed font-light shrink-0">
              Upload any PDF and instantly extract text and embeddings to ask questions in natural language. Completely private and runs entirely locally.
            </p>
          </div>

          {/* Email Capture & CTA */}
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center p-1.5 rounded-[2rem] sm:rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl shrink-0">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent px-6 py-4 text-white placeholder-white/40 outline-none text-center sm:text-left text-lg shrink-0"
            />
            <Link href="/chat" className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-white px-8 py-4 sm:py-3.5 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors" style={{ color: "#000000" }}>
              Start building
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Info Cards Grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 mx-auto">
            
            {/* Card 1: 100% Local */}
            <div className="flex flex-col items-center text-center bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.05] transition-colors duration-300">
              <div className="font-silkscreen text-5xl md:text-6xl text-white mb-4 tracking-tight">
                100%
              </div>
              <p className="text-base md:text-lg text-white/60 leading-relaxed font-light mt-auto">
                <strong className="text-white font-medium">Private & Local AI processing.</strong> Your highly sensitive documents never leave your local device. Fast, secure, and entirely offline.
              </p>
            </div>

            {/* Card 2: RAG Experience */}
            <div className="flex flex-col items-center text-center bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.05] transition-colors duration-300">
              <div className="h-12 w-12 mb-4 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5 shrink-0">
                <Zap className="w-6 h-6 text-white/90" />
              </div>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-light mt-auto">
                Upload PDFs and extract embeddings instantly. A seamless in-browser RAG experience powered by Next.js and Transformers.js.
              </p>
            </div>

          </div>

        </main>
      </div>
    </>
  );
}
