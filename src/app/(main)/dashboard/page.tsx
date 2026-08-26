"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Files, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HardDrive, 
  UploadCloud, 
  MessageSquareText, 
  ArrowRight, 
  Sparkles, 
  Loader2,
  FileText,
  Plus
} from "lucide-react";

interface DashboardStats {
  totalDocuments: number;
  completedCount: number;
  processingCount: number;
  failedCount: number;
  totalChunks: number;
  totalSizeBytes: number;
  storageFormatted: string;
  storagePercent: number;
  recentDocuments: Array<{
    id: string;
    title: string;
    size: number;
    status: string;
    category: string;
    chunkCount: number;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const loadStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus("Uploading document...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.documentId) {
        setUploadStatus("Extracting text & generating vector embeddings...");
        const processRes = await fetch("/api/documents/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId: uploadData.documentId }),
        });

        if (processRes.ok) {
          setUploadStatus("Indexed & Ready for Q&A!");
        } else {
          setUploadStatus("Uploaded, but AI processing encountered an issue.");
        }
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch (err) {
      setUploadStatus("Error uploading document.");
    } finally {
      setUploading(false);
      loadStats();
      setTimeout(() => setUploadStatus(""), 4000);
    }
  };

  return (
    <div className="animate-fade-in text-white flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-white/60 bg-clip-text text-transparent mb-1">
            Dashboard Overview
          </h1>
          <p className="text-white/50 text-sm md:text-base">
            Live metrics from your SQL-backed RAG AI vector knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors"
          >
            <Files className="w-3.5 h-3.5" />
            <span>Manage All Files</span>
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-xs hover:opacity-90 shadow-lg shadow-emerald-500/20 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Question</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Documents */}
        <div className="flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.04] transition-all shadow-xl">
          <div className="flex items-center justify-between text-white/60 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Documents</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Files className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tight mb-1">
              {loading ? "-" : stats?.totalDocuments || 0}
            </div>
            <p className="text-xs text-white/40">Indexed in database</p>
          </div>
        </div>

        {/* Metric 2: Vector Chunks */}
        <div className="flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.04] transition-all shadow-xl">
          <div className="flex items-center justify-between text-white/60 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">SQL Vector Chunks</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tight mb-1">
              {loading ? "-" : stats?.totalChunks || 0}
            </div>
            <p className="text-xs text-white/40">384-dim embeddings</p>
          </div>
        </div>

        {/* Metric 3: Processing Status */}
        <div className="flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.04] transition-all shadow-xl">
          <div className="flex items-center justify-between text-white/60 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Indexed Status</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-emerald-400">
                {loading ? "-" : stats?.completedCount || 0}
              </span>
              <span className="text-xs text-white/40">Ready for Q&A</span>
            </div>
            {stats && stats.processingCount > 0 && (
              <p className="text-xs text-amber-400">{stats.processingCount} currently processing</p>
            )}
          </div>
        </div>

        {/* Metric 4: Storage Used */}
        <div className="flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.04] transition-all shadow-xl">
          <div className="flex items-center justify-between text-white/60 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Usage</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white tracking-tight mb-2">
              {loading ? "-" : stats?.storageFormatted || "0 MB"}
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, stats?.storagePercent || 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Quick Upload & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Upload Widget (1 Column) */}
        <div className="flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Quick Ingestion</h2>
          </div>
          <p className="text-xs text-white/50 mb-6">
            Upload PDF, DOCX, TXT, or MD to automatically extract text and build vectors in SQL.
          </p>

          <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-emerald-500/50 bg-white/[0.02] hover:bg-emerald-500/5 rounded-2xl p-8 cursor-pointer transition-all group">
            <input
              type="file"
              onChange={handleQuickUpload}
              disabled={uploading}
              accept=".pdf,.docx,.txt,.md,.json,.csv"
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 text-center">
                  {uploadStatus || "Processing document..."}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-white/90">Drop file or Browse</span>
                <span className="text-[11px] text-white/40">PDF, DOCX, TXT, Markdown</span>
              </div>
            )}
          </label>

          {uploadStatus && !uploading && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadStatus}</span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link
              href="/chat"
              className="flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Jump into Document Q&A</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Documents Table (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Documents</h2>
              <p className="text-xs text-white/50">Latest files added to your vector knowledge base.</p>
            </div>
            <Link
              href="/documents"
              className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="h-48 flex items-center justify-center text-white/40 text-sm">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
                Loading recent files...
              </div>
            ) : !stats?.recentDocuments || stats.recentDocuments.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-white/5 rounded-2xl">
                <FileText className="w-10 h-10 text-white/20 mb-2" />
                <p className="text-sm font-semibold text-white/70">No documents yet</p>
                <p className="text-xs text-white/40 mt-1 max-w-sm">
                  Upload your first PDF, Word document, or text file to begin semantic searching and AI chatting.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {stats.recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/70 shrink-0">
                        <FileText className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate">
                          {doc.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                          <span>{(doc.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{doc.chunkCount} chunks</span>
                          <span>•</span>
                          <span>{doc.category || "General"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          doc.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : doc.status === "PROCESSING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {doc.status}
                      </span>
                      <Link
                        href={`/chat?doc=${doc.id}`}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        title="Chat with this document"
                      >
                        <MessageSquareText className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
