import React from "react";

export default function Dashboard() {
  return (
    <div className="animate-fade-in text-white">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
          Dashboard Overview
        </h1>
        <p className="text-white/50 text-lg">Manage your documents and process embeddings.</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Total Documents */}
        <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors duration-300 shadow-2xl">
          <h2 className="text-lg font-medium text-white/80 mb-2">Total Documents</h2>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-5xl font-bold text-white tracking-tight">142</span>
            <span className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+12 this week</span>
          </div>
          <p className="text-sm text-white/40 mt-auto">Across all projects</p>
        </div>
        
        {/* Card 2: Processing Status */}
        <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors duration-300 shadow-2xl">
          <h2 className="text-lg font-medium text-white/80 mb-6">Processing Status</h2>
          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Completed</span>
              <span className="font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">138</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Processing</span>
              <span className="font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Failed</span>
              <span className="font-semibold text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full">1</span>
            </div>
          </div>
        </div>
        
        {/* Card 3: Storage Usage */}
        <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors duration-300 shadow-2xl">
          <h2 className="text-lg font-medium text-white/80 mb-2">Storage Usage</h2>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold text-white tracking-tight">4.2</span>
            <span className="text-xl text-white/60 font-medium">GB</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mt-4 mb-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '42%' }}></div>
          </div>
          
          <p className="text-sm text-white/40 mt-auto">42% of 10 GB limit used</p>
        </div>
        
      </div>
    </div>
  );
}
