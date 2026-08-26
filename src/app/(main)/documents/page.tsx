"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Layers, 
  Trash2, 
  Sparkles, 
  MessageSquareText, 
  Search, 
  RefreshCw,
  Eye
} from "lucide-react";
import { DocumentModal } from "@/components/DocumentModal";

interface DocItem {
  id: string;
  title: string;
  filename: string;
  size: number;
  type: string;
  status: string;
  summary: string | null;
  category: string | null;
  chunkCount: number;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.documentId) {
        setFile(null);
        setMessage({ type: "success", text: "File uploaded! Running local RAG AI vector pipeline..." });
        
        // Auto-trigger processing
        setProcessingId(data.documentId);
        try {
          const processRes = await fetch("/api/documents/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: data.documentId }),
          });

          const processData = await processRes.json();
          if (processRes.ok) {
            setMessage({
              type: "success",
              text: `Indexed successfully! Generated ${processData.chunksProcessed || 0} vector chunks in SQL.`,
            });
          } else {
            setMessage({
              type: "error",
              text: `Upload succeeded, but AI processing failed: ${processData.error || "Unknown error"}`,
            });
          }
        } catch (err) {
          setMessage({ type: "error", text: "Error during document AI embedding generation." });
        } finally {
          setProcessingId(null);
          fetchDocuments();
        }
      } else {
        setMessage({ type: "error", text: data.error || "File upload failed." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred during upload." });
    } finally {
      setUploading(false);
    }
  };

  const handleReprocess = async (docId: string) => {
    setProcessingId(docId);
    try {
      const res = await fetch("/api/documents/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `Re-indexed successfully! Generated ${data.chunksProcessed || 0} vector chunks.`,
        });
      } else {
        setMessage({ type: "error", text: data.error || "Re-indexing failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to re-index document." });
    } finally {
      setProcessingId(null);
      fetchDocuments();
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" and all its vector embeddings?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
        setMessage({ type: "success", text: "Document and vector chunks deleted from database." });
      } else {
        setMessage({ type: "error", text: "Failed to delete document." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error deleting document." });
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.category && d.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in text-white flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-white/60 bg-clip-text text-transparent mb-1">
          Document Knowledge Base
        </h1>
        <p className="text-white/50 text-sm md:text-base">
          Upload, inspect semantic chunks, and manage embedded files in your SQL vector store.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <UploadCloud className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Upload New Document</h2>
        </div>
        <p className="text-xs text-white/50 mb-6">
          Supported formats: <strong className="text-white/80">PDF, DOCX, TXT, Markdown, CSV, JSON</strong>. Documents will be chunked and indexed locally with 384-dimensional vector embeddings.
        </p>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div className="relative group">
            <input
              type="file"
              id="file-upload-input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.docx,.txt,.md,.json,.csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                file
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/10 bg-white/[0.02] group-hover:border-white/20 group-hover:bg-white/[0.04]"
              }`}
            >
              <UploadCloud
                className={`w-10 h-10 mb-3 ${file ? "text-emerald-400" : "text-white/40"}`}
              />
              <p className="text-sm font-semibold text-white mb-1">
                {file ? file.name : "Click to select or drag and drop your document here"}
              </p>
              <p className="text-xs text-white/40">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Files up to 50MB"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              disabled={!file || uploading || !!processingId}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {uploading || processingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Upload & Index Document</span>
                </>
              )}
            </button>

            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-fade-in ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </div>

      {/* Document Library Table Section */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Indexed Documents ({documents.length})</h2>
            <p className="text-xs text-white/50">Manage documents stored in your SQL database.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-black/40 border border-white/10 text-white placeholder-white/30 pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-white/40 text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
              Loading document library...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-white/5 rounded-2xl text-white/40">
              <FileText className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-semibold text-white/70">No documents found</p>
              <p className="text-xs text-white/40 mt-1">
                {searchQuery ? "Try a different search keyword." : "Upload a document above to get started."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/50 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-3">Document</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Size</th>
                  <th className="pb-3 px-3">Vector Chunks</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDocs.map((doc) => {
                  const isProcessingThis = processingId === doc.id;
                  return (
                    <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-white text-sm truncate max-w-xs md:max-w-md">
                              {doc.title}
                            </span>
                            <span className="text-[10px] text-white/40">
                              Added {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-white/70">
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px]">
                          {doc.category || "General"}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-white/60">
                        {(doc.size / 1024).toFixed(1)} KB
                      </td>

                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                          <Layers className="w-3 h-3 text-cyan-400" />
                          {doc.chunkCount} chunks
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            doc.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : doc.status === "PROCESSING" || isProcessingThis
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isProcessingThis ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Indexing...</span>
                            </>
                          ) : (
                            doc.status
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Chunks Modal */}
                          <button
                            onClick={() => setSelectedDocId(doc.id)}
                            title="Inspect Vector Chunks & Text"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Chat with Document */}
                          <Link
                            href={`/chat?doc=${doc.id}`}
                            title="Ask Questions about this Document"
                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <MessageSquareText className="w-3.5 h-3.5" />
                          </Link>

                          {/* Re-process */}
                          <button
                            onClick={() => handleReprocess(doc.id)}
                            disabled={isProcessingThis}
                            title="Re-generate Embeddings"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isProcessingThis ? "animate-spin" : ""}`} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(doc.id, doc.title)}
                            title="Delete Document"
                            className="p-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Chunks & Vector Inspection Modal */}
      {selectedDocId && (
        <DocumentModal
          documentId={selectedDocId}
          onClose={() => setSelectedDocId(null)}
        />
      )}
    </div>
  );
}
