"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Cpu, 
  Database, 
  Shield, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  HardDrive,
  Info
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "ai" | "database" | "security">("profile");
  
  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // AI Config state
  const [chunkSize, setChunkSize] = useState("800");
  const [overlap, setOverlap] = useState("150");
  const [topK, setTopK] = useState("4");
  
  // Status states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        if (update) update();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update settings." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="animate-fade-in text-white flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-white/60 bg-clip-text text-transparent mb-1">
          Settings & Configuration
        </h1>
        <p className="text-white/50 text-sm md:text-base">
          Manage your account profile, AI hyperparameters, and SQL database storage.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-60 shrink-0 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-xs transition-all text-left ${
              activeTab === "profile"
                ? "bg-white/10 text-white font-semibold shadow-sm"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-xs transition-all text-left ${
              activeTab === "ai"
                ? "bg-white/10 text-white font-semibold shadow-sm"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>RAG & AI Models</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("database")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-xs transition-all text-left ${
              activeTab === "database"
                ? "bg-white/10 text-white font-semibold shadow-sm"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>SQL Database</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-xs transition-all text-left ${
              activeTab === "security"
                ? "bg-white/10 text-white font-semibold shadow-sm"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Settings Content Card */}
        <div className="flex-1">
          <form
            onSubmit={handleSave}
            className="flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
          >
            {/* Tab 1: Profile */}
            {activeTab === "profile" && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Profile Details</h2>
                  <p className="text-xs text-white/50">Personalize your account information.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-black/40 border border-white/10 text-white/50 px-4 py-3 rounded-xl text-sm cursor-not-allowed opacity-60"
                  />
                  <span className="text-[11px] text-white/40">Email is linked to your authentication session.</span>
                </div>
              </div>
            )}

            {/* Tab 2: AI & RAG */}
            {activeTab === "ai" && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">RAG AI Configuration</h2>
                  <p className="text-xs text-white/50">Local inference models and semantic vector parameters.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <span className="text-xs text-white/40 font-semibold uppercase">Embedding Model</span>
                    <span className="text-sm font-mono text-emerald-400">Xenova/all-MiniLM-L6-v2</span>
                    <span className="text-[11px] text-white/50 mt-1">384-dimensional dense vector embeddings</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <span className="text-xs text-white/40 font-semibold uppercase">QA Synthesis Model</span>
                    <span className="text-sm font-mono text-cyan-400">distilbert-base-cased-distilled-squad</span>
                    <span className="text-[11px] text-white/50 mt-1">Extractive question answering pipeline</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/70">Chunk Size (chars)</label>
                    <input
                      type="number"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/70">Chunk Overlap (chars)</label>
                    <input
                      type="number"
                      value={overlap}
                      onChange={(e) => setOverlap(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/70">Top-K Context Chunks</label>
                    <input
                      type="number"
                      value={topK}
                      onChange={(e) => setTopK(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Database */}
            {activeTab === "database" && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">SQL Database Architecture</h2>
                  <p className="text-xs text-white/50">Storage engine and relational vector configuration.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-indigo-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Relational SQL Store</span>
                        <span className="text-xs text-white/40">Prisma ORM with SQLite / MySQL portability</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                      Connected
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HardDrive className="w-5 h-5 text-cyan-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Local Upload Storage</span>
                        <span className="text-xs text-white/40">Persistent files directory (/uploads)</span>
                      </div>
                    </div>
                    <span className="text-xs text-white/60 font-mono">Active</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3 text-xs text-emerald-300">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    Your documents and vector representations are processed and stored locally on your machine. No documents or sensitive embeddings are transmitted to external servers.
                  </span>
                </div>
              </div>
            )}

            {/* Tab 4: Security */}
            {activeTab === "security" && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Security & Password</h2>
                  <p className="text-xs text-white/50">Update your account credentials.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {/* Message alert */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-fade-in ${
                  message.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
