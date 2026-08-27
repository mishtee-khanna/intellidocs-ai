"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  Loader2, 
  Filter
} from "lucide-react";
import { SourceCitation } from "@/components/SourceCitation";

interface SourceItem {
  documentId: string;
  documentTitle: string;
  filename: string;
  pageNumber: number;
  similarity: number;
  snippet: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: SourceItem[];
  score?: number;
  timestamp: string;
}

interface DocOption {
  id: string;
  title: string;
  chunkCount: number;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialDocId = searchParams.get("doc") || "all";

  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocId);
  const [documents, setDocuments] = useState<DocOption[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "ai",
      content:
        "Hello! I am your **IntelliDocs RAG Assistant**. I can perform semantic vector searches across your uploaded documents and answer questions with exact citations.\n\nAsk me anything or choose a suggested question below!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const docParam = searchParams.get("doc");
    if (docParam) {
      setSelectedDocId(docParam);
    }
  }, [searchParams]);

  // Fetch available documents for the dropdown
  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDocuments(data.documents);
        }
      })
      .catch((err) => console.error("Failed to load documents for chat:", err));
  }, []);

  const handleSend = async (questionToSend?: string) => {
    const text = questionToSend || query;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text.trim(),
          documentId: selectedDocId !== "all" ? selectedDocId : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: data.answer || "I could not find an answer in the selected documents.",
          sources: data.sources || [],
          score: data.score,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: `ai-err-${Date.now()}`,
          role: "ai",
          content: `Error: ${data.error || "Failed to process question."}\n\nDetails: ${data.details || "None"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: `ai-err-${Date.now()}`,
        role: "ai",
        content: `Error: Failed to process chat query. Details: ${err.message || String(err)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "ai",
        content: "Conversation cleared. What else would you like to explore?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const starterPrompts = [
    "What are the main key points in this document?",
    "Summarize the key conclusions and next steps.",
    "What are the key definitions and concepts discussed?",
    "Give an executive summary of this content.",
  ];

  const selectedDocTitle =
    selectedDocId === "all"
      ? "All Indexed Documents"
      : documents.find((d) => d.id === selectedDocId)?.title || "Selected Document";

  return (
    <div className="animate-fade-in text-white flex flex-col h-[calc(100vh-6rem)]">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-white/60 bg-clip-text text-transparent">
            Document Q&A
          </h1>
          <p className="text-xs text-white/50">
            Semantic vector search and question answering powered by local embeddings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Document Scope Selector */}
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="all" className="bg-[#12151b] text-white">
                All Documents ({documents.length})
              </option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-[#12151b] text-white">
                  {doc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Chat Button */}
          <button
            onClick={handleClear}
            title="Clear Chat History"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-[90%] md:max-w-[80%] ${
              msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-bold text-xs shadow-md shadow-emerald-500/20"
                  : "bg-white/10 border border-white/10 text-emerald-400"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-5 rounded-3xl text-sm leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-white rounded-tr-md"
                  : "bg-white/[0.03] border border-white/10 text-slate-200 rounded-tl-md"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[11px] font-semibold text-white/40">
                  {msg.role === "user" ? "You" : "IntelliDocs AI"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30">{msg.timestamp}</span>
                  {msg.role === "ai" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-white/30 hover:text-white/80 transition-colors p-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-light text-slate-100">
                {msg.content}
              </div>

              {/* Source Citations for AI messages */}
              {msg.sources && msg.sources.length > 0 && (
                <SourceCitation sources={msg.sources} />
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3.5 self-start items-center">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 rounded-tl-md flex items-center gap-3 text-xs text-emerald-400">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Searching vector embeddings & generating answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Question Pills */}
      {messages.length <= 2 && (
        <div className="pb-3 flex flex-wrap gap-2 shrink-0">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-white/70 hover:text-emerald-300 transition-all text-left"
            >
              <Sparkles className="w-3 h-3 inline-block mr-1.5 text-emerald-400" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Query Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 shrink-0 relative"
      >
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all shadow-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask a question across ${selectedDocTitle}...`}
            className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-2.5 text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="h-10 px-5 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center text-white/40 text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
          Loading chat interface...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
