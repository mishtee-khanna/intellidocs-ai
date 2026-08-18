"use client";

import React, { useState } from "react";
import { User, Key, Palette, Shield, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="animate-fade-in text-white w-full max-w-5xl mx-auto mt-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-white/50 text-lg">Manage your account and application preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Settings Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${activeTab === "profile" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}
          >
            <User className="w-5 h-5" />
            Profile Details
          </button>
          <button 
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab("keys")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${activeTab === "keys" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}
          >
            <Key className="w-5 h-5" />
            API Keys
          </button>
          <button 
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${activeTab === "appearance" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}
          >
            <Palette className="w-5 h-5" />
            Appearance
          </button>
          <button 
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${activeTab === "security" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}
          >
            <Shield className="w-5 h-5" />
            Security
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Glow effect inside card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none opacity-50" />
            
            {activeTab === "profile" && (
              <div className="relative z-10 flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Profile Details</h2>
                  <p className="text-white/50 text-sm">Update your personal information.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Display Name</label>
                  <input 
                    suppressHydrationWarning
                    type="text" 
                    defaultValue="John Doe"
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Email Address</label>
                  <input 
                    suppressHydrationWarning
                    type="email" 
                    defaultValue="john@example.com"
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all opacity-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-white/40 mt-1">To change your email, please contact support.</p>
                </div>
              </div>
            )}

            {activeTab === "keys" && (
              <div className="relative z-10 flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">API Keys</h2>
                  <p className="text-white/50 text-sm">Manage keys for external AI providers.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">OpenAI API Key</label>
                  <input 
                    suppressHydrationWarning
                    type="password" 
                    placeholder="sk-..."
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Pinecone API Key</label>
                  <input 
                    suppressHydrationWarning
                    type="password" 
                    placeholder="pc-..."
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="relative z-10 flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Appearance</h2>
                  <p className="text-white/50 text-sm">Customize how IntelliDocs looks.</p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <h3 className="font-medium text-white">Theme</h3>
                    <p className="text-sm text-white/50">Select your preferred color scheme.</p>
                  </div>
                  <select className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                    <option>Dark Mode</option>
                    <option>Light Mode</option>
                    <option>System Default</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="relative z-10 flex flex-col gap-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Security</h2>
                  <p className="text-white/50 text-sm">Manage your security preferences.</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">Current Password</label>
                  <input 
                    suppressHydrationWarning
                    type="password" 
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/70">New Password</label>
                  <input 
                    suppressHydrationWarning
                    type="password" 
                    className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
