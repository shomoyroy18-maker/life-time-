import React, { useState } from "react";
import { UserProfile, ThemeType } from "../types";
import { 
  Settings, 
  Palette, 
  User, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Smartphone,
  LogIn,
  LogOut,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { loginWithGoogle, loginAnonymously, logoutUser } from "../lib/firebase";

interface SettingsTabProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onFactoryReset: () => void;
  currentUser: any;
  authLoading: boolean;
  isSyncing: boolean;
  syncError: string | null;
}

export default function SettingsTab({ 
  user, 
  setUser, 
  onFactoryReset,
  currentUser,
  authLoading,
  isSyncing,
  syncError
}: SettingsTabProps) {
  
  const handleThemeChange = (t: ThemeType) => {
    setUser(prev => ({ ...prev, theme: t }));
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(60, Number(e.target.value) || 1));
    setUser(prev => ({ ...prev, currentDay: val }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, displayName: e.target.value }));
  };

  const handleBdtIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, targetBdtIncome: Number(e.target.value) || 100000 }));
  };

  const handleCurrentBdtIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, currentBdtIncome: Number(e.target.value) || 0 }));
  };

  return (
    <div className="space-y-6" id="settings-tab-container">
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Operational Engine Configuration
        </h1>
        <p className="text-xs text-slate-400">
          Tune campaign metrics thresholds, manage graphic profiles, or configure auth nodes
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PARAMS CONTROL */}
        <div className="app-card p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <User className="w-4 h-4 text-indigo-400" /> Campaign Parameter Tweaker
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Operator Display Name</label>
              <input
                type="text"
                value={user.displayName}
                onChange={handleNameChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Active Day Index (1-60)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={user.currentDay}
                  onChange={handleDayChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Days Residual</label>
                <input
                  type="text"
                  disabled
                  value={`${Math.max(0, 60 - user.currentDay)} Days Remaining`}
                  className="w-full bg-black/20 border border-white/5 opacity-50 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Target Revenue (BDT/Mo)</label>
                <input
                  type="number"
                  step="5000"
                  value={user.targetBdtIncome}
                  onChange={handleBdtIncomeChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Current Extrapolated BDT</label>
                <input
                  type="number"
                  step="5000"
                  value={user.currentBdtIncome}
                  onChange={handleCurrentBdtIncomeChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200 font-mono text-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* GRAPHICS PALETTE SELECTOR */}
        <div className="app-card p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <Palette className="w-4 h-4 text-purple-400" /> UI Graphic Profile Selection
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* CYBERPUNK */}
            <button
              onClick={() => handleThemeChange("cyber")}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${user.theme === "cyber" ? "border-purple-500 bg-purple-500/10 text-white font-bold" : "border-white/5 bg-black/30 text-slate-400 hover:text-white"}`}
            >
              <div className="flex justify-between items-center text-xs">
                <span>Cyberpunk Cyber</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              </div>
              <p className="text-[9px] opacity-50 mt-1 uppercase font-bold tracking-wider">Default Neon Sci-Fi</p>
            </button>

            {/* LIGHT SLATE */}
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${user.theme === "light" ? "border-sky-500 bg-sky-500/10 text-white font-bold" : "border-white/5 bg-black/30 text-slate-400 hover:text-white"}`}
            >
              <div className="flex justify-between items-center text-xs">
                <span>Light Slate</span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              </div>
              <p className="text-[9px] opacity-50 mt-1 uppercase font-bold tracking-wider">Minimal Crisp Light</p>
            </button>

            {/* OCEAN DEEP */}
            <button
              onClick={() => handleThemeChange("ocean")}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${user.theme === "ocean" ? "border-cyan-500 bg-cyan-500/10 text-white font-bold" : "border-white/5 bg-black/30 text-slate-400 hover:text-white"}`}
            >
              <div className="flex justify-between items-center text-xs">
                <span>Deep Ocean</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              </div>
              <p className="text-[9px] opacity-50 mt-1 uppercase font-bold tracking-wider">Deep Navy Calm Blue</p>
            </button>

            {/* SUNSET GOLD */}
            <button
              onClick={() => handleThemeChange("sunset")}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${user.theme === "sunset" ? "border-orange-500 bg-orange-500/10 text-white font-bold" : "border-white/5 bg-black/30 text-slate-400 hover:text-white"}`}
            >
              <div className="flex justify-between items-center text-xs">
                <span>Warm Sunset</span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              </div>
              <p className="text-[9px] opacity-50 mt-1 uppercase font-bold tracking-wider">Cozy Ember Gold</p>
            </button>
          </div>
        </div>
      </div>

      {/* CLOUD INTERRUPT DATA NODES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LOCAL SECURITY & REAL AUTH */}
        <div className="app-card p-5 rounded-xl md:col-span-2 space-y-3.5 text-xs">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Firebase Cloud Sync Authentication
            </h3>
            {currentUser && (
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest animate-pulse">
                🟢 Live Synced
              </span>
            )}
          </div>

          {authLoading ? (
            <div className="py-6 flex items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Authenticating connection node...</span>
            </div>
          ) : currentUser ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 p-3.5 rounded-xl border border-white/5">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">Operator ID</span>
                  <p className="font-mono text-[10.5px] text-indigo-300 truncate">{currentUser.uid}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">Identified Email</span>
                  <p className="font-mono text-[10.5px] text-slate-200 truncate">{currentUser.email || "Anonymous Terminal"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">Verified Operator</span>
                  <p className="font-bold text-slate-200 truncate">{currentUser.displayName || "Unknown Operator"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">Data Location</span>
                  <p className="font-bold text-emerald-400 font-mono text-[10px]">Cloud Firestore Secure</p>
                </div>
              </div>

              {syncError && (
                <div className="p-3 bg-red-950/20 text-red-400 border border-red-500/10 rounded-lg font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{syncError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={async () => {
                    try {
                      await logoutUser();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="bg-red-950/25 hover:bg-red-900/10 border border-red-500/20 text-red-400 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} /> Disconnect Session
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                Connect multi-device cloud synchronization. Your habits, logs, and checklists currently persist securely in the local browser cache. Bind your account to synchronize across devices.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                    } catch (e: any) {
                      alert("Popup auth was blocked. Try signing in anonymously for an instant cloud session!");
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 shadow-lg" /> Google Authentication
                </button>

                <button
                  onClick={async () => {
                    try {
                      await loginAnonymously();
                    } catch (e) {
                      console.error("Anonymous authentication failed", e);
                    }
                  }}
                  className="bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 hover:text-white font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Anonymous Sandbox Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FACTORY DATA RESET */}
        <div className="app-card p-5 rounded-xl flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-bold text-rose-500 uppercase tracking-wide flex items-center gap-1 text-xs">
              <Database className="w-4 h-4" /> Reset Factory Defaults
            </h3>
            <p className="text-slate-400 text-[11.5px] leading-snug mt-1 font-medium">
              Wipe all logs, custom tasks, and parameters. Return tracker memory to Day 16 starting baseline seeds.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm("WARNING: All custom days logs, streak matrices, and task checklists will be permanently cleared from LocalStorage. Proceed?")) {
                onFactoryReset();
              }
            }}
            className="w-full bg-red-950/20 hover:bg-red-900/10 border border-red-500/20 text-red-400 font-bold py-2 rounded text-[11px] uppercase tracking-wider cursor-pointer font-mono"
          >
            Execute Reset Command
          </button>
        </div>
      </div>
    </div>
  );
}
