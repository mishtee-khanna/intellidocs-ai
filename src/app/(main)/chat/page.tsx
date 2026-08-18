"use client";

import React, { useState } from "react";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! I am IntelliDocs AI. How can I help you extract information from your documents today?" }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setQuery("");
    setMessages(prev => [...prev, { role: "ai", content: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        let answerText = data.answer;
        if (data.sources && data.sources.length > 0) {
           const sourcesList = data.sources.map((s: any) => s.filename).join(", ");
           answerText += `\n\n(Sources: ${sourcesList})`;
        }
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: "ai", content: answerText };
          return newMessages;
        });
      } else {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: "ai", content: "Error: " + (data.error || "Failed to fetch response.") };
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: "ai", content: "An error occurred while connecting to the AI." };
        return newMessages;
      });
    }
  };

  return (
    <div className="animate-fade-in text-white w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)] mt-4">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
          Document Q&A
        </h1>
        <p className="text-white/50 text-lg">Chat with your embedded documents using AI.</p>
      </div>
      
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
        
        {/* Glow effect inside card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[80%] p-5 text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user" 
                  ? "self-end bg-white/10 border border-white/5 text-white rounded-3xl rounded-tr-md" 
                  : "self-start bg-emerald-500/10 border border-emerald-500/20 text-emerald-50 rounded-3xl rounded-tl-md"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        
        {/* Input Form */}
        <form onSubmit={handleSend} className="relative z-10 flex gap-3 mt-auto shrink-0 pt-4 border-t border-white/5">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 bg-black/40 border border-white/10 text-white placeholder-white/30 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!query.trim()}
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
