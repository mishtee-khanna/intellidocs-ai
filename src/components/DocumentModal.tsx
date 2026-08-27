"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Layers, Hash, Copy, Check, Sparkles, Loader2 } from "lucide-react";

interface Chunk {
  id: string;
  content: string;
  pageNumber: number;
  hasEmbedding: boolean;
  embeddingPreview?: number[];
}

interface DocumentDetail {
  id: string;
  title: string;
  filename: string;
  size: number;
  type: string;
  status: string;
  extractedText: string | null;
  summary: string | null;
  category: string | null;
  createdAt: string;
  chunks: Chunk[];
}

interface DocumentModalProps {
  documentId: string | null;
  onClose: () => void;
}

export function DocumentModal({ documentId, onClose }: DocumentModalProps) {
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chunks" | "text">("chunks");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!documentId) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/documents/${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setDoc(data.document);
        }
      })
      .catch((err) => console.error("Error fetching doc details:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [documentId]);

  if (!documentId) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#12151b] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-bold truncate text-white">
                {doc?.title || "Document Details"}
              </h2>
              <p className="text-xs text-white/50">
                {doc ? `${(doc.size / 1024).toFixed(1)} KB • ${doc.chunks?.length || 0} Vector Chunks in SQL` : "Loading..."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5">
          <button
            onClick={() => setActiveTab("chunks")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "chunks"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semantic Chunks & Vectors ({doc?.chunks?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "text"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Extracted Plain Text</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-white/40">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <span className="text-sm">Loading document chunks and vectors...</span>
            </div>
          ) : !doc ? (
            <div className="h-64 flex items-center justify-center text-white/40">
              Document could not be loaded.
            </div>
          ) : activeTab === "chunks" ? (
            <div className="flex flex-col gap-4">
              {doc.chunks && doc.chunks.length > 0 ? (
                doc.chunks.map((chunk, idx) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          Chunk #{idx + 1}
                        </span>
                        <span className="text-xs text-white/40">
                          Page {chunk.pageNumber}
                        </span>
                      </div>
                      {chunk.hasEmbedding && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Vector Dim: 384</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed font-light whitespace-pre-wrap bg-black/20 p-3 rounded-xl border border-white/5">
                      {chunk.content}
                    </p>

                    {chunk.embeddingPreview && chunk.embeddingPreview.length > 0 && (
                      <div className="text-[10px] font-mono text-white/30 truncate">
                        Embedding sample: [{chunk.embeddingPreview.map(n => n.toFixed(4)).join(", ")}...]
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-white/40">
                  No chunks generated yet. Click "Process with AI" to generate embeddings.
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleCopy(doc.extractedText || "")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Text"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/70 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {doc.extractedText || "No text content available."}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
