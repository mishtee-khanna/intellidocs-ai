"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Sparkles, MapPin } from "lucide-react";

interface SourceCitationProps {
  sources: Array<{
    documentId: string;
    documentTitle: string;
    filename: string;
    pageNumber: number;
    similarity: number;
    snippet: string;
  }>;
}

export function SourceCitation({ sources }: SourceCitationProps) {
  const [expanded, setExpanded] = useState(true);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2.5">
      {/* Citation Pills Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {sources.slice(0, 3).map((src, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold"
            >
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[160px]">{src.documentTitle}</span>
              <span className="bg-emerald-400/20 text-emerald-200 px-1.5 py-0.2 rounded font-mono text-[10px]">
                p. {src.pageNumber}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-1 ml-auto shrink-0 pl-2"
        >
          <span>{expanded ? "Hide Chunks" : "View Details"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Chunk Details */}
      {expanded && (
        <div className="flex flex-col gap-2 mt-1 animate-fade-in">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold text-white/90 truncate">
                    {src.documentTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                    Page {src.pageNumber}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[10px] font-bold shrink-0 ml-2">
                  {Math.round(src.similarity * 100)}% Match
                </span>
              </div>
              <p className="text-white/70 font-light mt-1 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5 font-mono text-[11px] whitespace-pre-wrap">
                {src.snippet}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
