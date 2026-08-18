"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("File uploaded successfully. Processing Document...");
        setFile(null);
        
        // Trigger document processing
        try {
          if (data.documentId) {
             const processRes = await fetch("/api/documents/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentId: data.documentId })
             });
             
             if (processRes.ok) {
                setMessage("File processed and added to RAG database successfully!");
             } else {
                const errData = await processRes.json().catch(() => ({}));
                setMessage(`File uploaded, but AI processing failed: ${errData.details || errData.error || 'Unknown error'}`);
             }
          } else {
             setMessage("File uploaded successfully! (Processing skipped due to missing ID)");
          }
        } catch (err) {
           setMessage("File uploaded, but an error occurred during AI processing.");
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(`File upload failed: ${errData.details || errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in text-white w-full max-w-4xl mx-auto mt-8">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
          Document Management
        </h1>
        <p className="text-white/50 text-lg">Upload, view, and manage your embedded documents.</p>
      </div>
      
      {/* Upload Card */}
      <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        
        {/* Glow effect inside card */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Upload Document</h2>
        <p className="text-white/50 mb-8 relative z-10">
          Upload PDF, PNG, JPG, or DOCX files. Our local AI will extract text and generate high-dimensional embeddings.
        </p>
        
        <form onSubmit={handleUpload} className="flex flex-col gap-6 relative z-10">
          {/* File Input */}
          <div className="relative group/input">
            <input 
              type="file" 
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              accept=".pdf,.png,.jpg,.jpeg,.docx"
            />
            <div className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors duration-300 ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 group-hover/input:border-white/20'}`}>
              <div className="h-16 w-16 mb-4 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <UploadCloud className={`w-8 h-8 ${file ? 'text-emerald-400' : 'text-white/50'}`} />
              </div>
              <p className="text-lg font-medium text-white mb-1">
                {file ? file.name : "Click or drag file to upload"}
              </p>
              <p className="text-sm text-white/40">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, PNG, JPG up to 10MB"}
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!file || uploading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload and Process"
            )}
          </button>
          
          {/* Status Message */}
          {message && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${message.includes("failed") || message.includes("error") ? "bg-rose-500/10 border-rose-500/20 text-rose-200" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"}`}>
              {message.includes("failed") || message.includes("error") ? (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              )}
              <p className="font-medium text-sm">{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
