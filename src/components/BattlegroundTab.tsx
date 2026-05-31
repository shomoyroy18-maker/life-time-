import React, { useState, useEffect } from "react";
import { RELAPSE_MITIGATION_PROTOCOLS } from "../data";
import { AlertTriangle, AlertCircle, Play, Pause, RotateCcw, Heart, ShieldAlert, Sparkles } from "lucide-react";

export default function BattlegroundTab() {
  // Box Breathing States (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [phase, setPhase] = useState<"Inhale" | "Hold (Full)" | "Exhale" | "Hold (Empty)">("Inhale");
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Shift phase
            if (phase === "Inhale") {
              setPhase("Hold (Full)");
              return 4;
            } else if (phase === "Hold (Full)") {
              setPhase("Exhale");
              return 4;
            } else if (phase === "Exhale") {
              setPhase("Hold (Empty)");
              return 4;
            } else {
              setPhase("Inhale");
              setCycles(c => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, phase]);

  const handleReset = () => {
    setTimerActive(false);
    setSecondsLeft(4);
    setPhase("Inhale");
    setCycles(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "Inhale": return "text-emerald-400 border-emerald-400 shadow-emerald-500/10";
      case "Hold (Full)": return "text-blue-400 border-blue-400 shadow-blue-500/10";
      case "Exhale": return "text-indigo-400 border-indigo-400 shadow-indigo-500/10";
      case "Hold (Empty)": return "text-purple-400 border-purple-400 shadow-purple-500/10";
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case "Inhale": return "Breath in slowly through your nose. Expand your belly fully.";
      case "Hold (Full)": return "Suspend air inside. Relax your shoulders, feel the storage.";
      case "Exhale": return "Discharge completely through your mouth. Clear your system.";
      case "Hold (Empty)": return "Maintain complete emptiness. Hold before the next wave.";
    }
  };

  const getCircleScaleClass = () => {
    if (!timerActive) return "scale-[0.8]";
    switch (phase) {
      case "Inhale": return "scale-[0.95] duration-[4000ms] ease-linear bg-emerald-500/10";
      case "Hold (Full)": return "scale-[1.0] duration-[4000ms] bg-blue-500/10";
      case "Exhale": return "scale-[0.75] duration-[4000ms] ease-linear bg-indigo-500/10";
      case "Hold (Empty)": return "scale-[0.7] duration-[4000ms] bg-purple-500/10";
    }
  };

  return (
    <div className="space-y-6" id="battleground-tab-container">
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" /> Active Battle Ground Triggers
        </h1>
        <p className="text-xs text-slate-400">
          Emergency mitigation centers & high-risk craving counter-measures
        </p>
      </header>

      {/* THREE CORE STREAK METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="app-card p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:scale-[1.01] transition-transform">
          <span className="block text-4xl font-black text-emerald-400 mb-1">87</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">MOSQUE SALAT STREAK</span>
        </div>
        <div className="app-card p-6 rounded-xl bg-orange-500/5 border border-orange-500/20 hover:scale-[1.01] transition-transform">
          <span className="block text-4xl font-black text-orange-400 mb-1">45</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">NICOTINE ABSTINENCE</span>
        </div>
        <div className="app-card p-6 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:scale-[1.01] transition-transform">
          <span className="block text-4xl font-black text-teal-400 mb-1">23</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">QURAN HIFZ STREAK</span>
        </div>
      </div>

      {/* CORE EMERGENCY PROTOCOLS & BOX BREATHING TIMER SPLIT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROTOCOLS LIST (LHS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="app-card p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <AlertTriangle className="w-4 h-4" /> EMERGENCY RECOVERY PROTOCOLS
            </h3>

            <div className="space-y-3">
              {RELAPSE_MITIGATION_PROTOCOLS.map((protocol, index) => (
                <div key={index} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> {protocol.trigger}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-red-500 bg-red-950/20 px-2 py-0.5 rounded border border-red-500/10 uppercase">
                      CRUCIAL RULES
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans italic">"{protocol.vibe}"</p>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    <b>Counteraction:</b> {protocol.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOX BREATHING TOOL (RHS) */}
        <div className="app-card p-6 rounded-xl flex flex-col justify-between items-center text-center space-y-4 shadow-lg border-rose-500/10">
          <div className="space-y-1.5 w-full">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-widest flex justify-center items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> ADHD Box Breathing Loop
            </h3>
            <p className="text-[10px] text-slate-400 italic leading-snug">
              Sync heart rhythms & dissolve task cravings in 16 seconds.
            </p>
          </div>

          {/* TIMER DISK */}
          <div 
            className={`w-40 h-40 rounded-full border-4 flex flex-col justify-center items-center transition-all duration-[1000ms] shadow-20xl ${getCircleScaleClass()} ${getPhaseColor()}`}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 font-black">PHASE</span>
            <span className="text-lg font-black tracking-tight whitespace-nowrap px-2">{phase}</span>
            <span className="text-4xl font-extrabold font-mono mt-1">{secondsLeft}s</span>
          </div>

          {/* ACTIVE DISPATCH CONTEXT */}
          <div className="w-full h-12 flex items-center justify-center bg-black/20 rounded-lg p-2 border border-white/5">
            <p className="text-[11px] text-slate-300 leading-snug font-mono">
              {getPhaseDescription()}
            </p>
          </div>

          {/* CONTROLS */}
          <div className="w-full space-y-3">
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setTimerActive(!timerActive)}
                className={`flex-1 font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-all ${timerActive ? "bg-red-900/40 border border-red-500/20 text-red-300 hover:bg-red-900/50" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"}`}
              >
                {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {timerActive ? "HALT CYCLE" : "IGNITE CYCLE"}
              </button>
              
              <button 
                onClick={handleReset}
                className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold p-2.5 rounded-lg cursor-pointer transition-all"
                title="Reset loop"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-2 px-1">
              <span>ESTABLISHED CYCLES: <b>{cycles}</b></span>
              <span className="text-indigo-400">STATUS: <b>{timerActive ? "COMPRESSING" : "STABLE"}</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
