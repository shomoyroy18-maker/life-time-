import React from "react";
import { GANTT_PHASES } from "../data";
import { Calendar, ShieldAlert, Sparkles, Pin, CheckCircle2 } from "lucide-react";

interface GanttTabProps {
  currentDay: number;
}

export default function GanttTab({ currentDay }: GanttTabProps) {
  // Determine current active phase based on currentDay (out of 60 days)
  const getPhaseStatus = (phaseIndex: number) => {
    if (phaseIndex === 0 && currentDay <= 10) return "current";
    if (phaseIndex === 0 && currentDay > 10) return "passed";
    
    if (phaseIndex === 1 && currentDay >= 11 && currentDay <= 25) return "current";
    if (phaseIndex === 1 && currentDay > 25) return "passed";
    if (phaseIndex === 1 && currentDay < 11) return "future";

    if (phaseIndex === 2 && currentDay >= 26 && currentDay <= 40) return "current";
    if (phaseIndex === 2 && currentDay > 40) return "passed";
    if (phaseIndex === 2 && currentDay < 26) return "future";

    if (phaseIndex === 3 && currentDay >= 41 && currentDay <= 50) return "current";
    if (phaseIndex === 3 && currentDay > 50) return "passed";
    if (phaseIndex === 3 && currentDay < 41) return "future";

    if (phaseIndex === 4 && currentDay >= 51) return "current";
    if (phaseIndex === 4 && currentDay < 51) return "future";

    return "future";
  };

  return (
    <div className="space-y-6" id="gantt-tab-container">
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" /> 5-Phase Compressed Project Map (15 June Start)
        </h1>
        <p className="text-xs text-slate-400">
          Chronological Track Horizon: 15 June – 13 August 2026 • 50 Active Work Days • 10 Failure Insurance Days • Currently on Day {currentDay}
        </p>
      </header>

      {/* HORIZONTAL TRACK PROGRESS BARER */}
      <div className="app-card p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center bg-indigo-950/25 border border-indigo-500/10 p-3 rounded-lg text-xs">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-wider">Start Date</span>
            <span className="font-mono text-slate-300 font-bold">June 15, 2026</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">Constant Target End Date</span>
            <span className="font-mono text-slate-300 font-bold">August 13, 2026</span>
          </div>
        </div>

        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Compressed 60-Day Phase Horizon</h3>
        
        <div className="grid grid-cols-5 gap-1 text-[9px] font-mono font-bold text-center uppercase tracking-wider text-slate-500">
          <span className={currentDay > 10 ? "text-orange-400" : currentDay <= 10 ? "text-white" : ""}>P1: Prep (1-10)</span>
          <span className={currentDay > 25 ? "text-purple-400" : currentDay >= 11 && currentDay <= 25 ? "text-white" : ""}>P2: Build (11-25)</span>
          <span className={currentDay > 40 ? "text-blue-400" : currentDay >= 26 && currentDay <= 40 ? "text-white" : ""}>P3: Deep (26-40)</span>
          <span className={currentDay > 50 ? "text-emerald-400" : currentDay >= 41 && currentDay <= 50 ? "text-white" : ""}>P4: Scale (41-50)</span>
          <span className={currentDay >= 51 ? "text-pink-400" : ""}>P5: Insurance (51-60)</span>
        </div>

        <div className="w-full bg-slate-900 h-4 rounded-full border border-white/5 overflow-hidden flex relative">
          {/* Day 1 - 10 (16.7%) */}
          <div className={`h-full transition-all duration-300 ${currentDay >= 10 ? "bg-orange-500/70" : "bg-orange-500"}`} style={{ width: "16.7%" }}></div>
          {/* Day 11 - 25 (25.0%) */}
          <div 
            className={`h-full transition-all duration-300 ${currentDay > 25 ? "bg-purple-500/70" : currentDay >= 11 ? "bg-purple-500 animate-pulse" : "bg-slate-800"}`} 
            style={{ width: "25%" }}
          ></div>
          {/* Day 26 - 40 (25.0%) */}
          <div 
            className={`h-full transition-all duration-300 ${currentDay > 40 ? "bg-blue-500/70" : currentDay >= 26 ? "bg-blue-500 animate-pulse" : "bg-slate-800"}`} 
            style={{ width: "25%" }}
          ></div>
          {/* Day 41 - 50 (16.7%) */}
          <div 
            className={`h-full transition-all duration-300 ${currentDay > 50 ? "bg-emerald-500/70" : currentDay >= 41 ? "bg-emerald-500 animate-pulse" : "bg-slate-800"}`} 
            style={{ width: "16.7%" }}
          ></div>
          {/* Day 51 - 60 (16.6%) */}
          <div 
            className={`h-full transition-all duration-300 ${currentDay >= 51 ? "bg-pink-500 animate-pulse" : "bg-slate-800/50"}`} 
            style={{ width: "16.6%" }}
          ></div>

          {/* Current Day Pointer Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg flex items-center justify-center border border-black z-10"
            style={{ left: `${(currentDay / 60) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <span className="absolute -top-5 bg-white text-black font-extrabold text-[9px] px-1.5 rounded uppercase font-mono tracking-tighter">DAY-{currentDay}</span>
          </div>
        </div>
      </div>

      {/* DETAILED PHASE CARDS VERTICAL MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GANTT_PHASES.map((p, index) => {
          const status = getPhaseStatus(index);
          const isPassed = status === "passed";
          const isCurrent = status === "current";
          const isFuture = status === "future";

          return (
            <div 
              key={p.phase} 
              className={`app-card p-5 rounded-xl transition-all duration-200 relative ${isCurrent ? 'ring-2 ring-indigo-500/50 bg-[#1e1b4b]/20 scale-[1.01]' : 'opacity-85'}`}
            >
              {isPassed && (
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/10">
                  <CheckCircle2 className="w-3 h-3" /> SECURED
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 border border-purple-500/10 animate-pulse">
                  <Sparkles className="w-3 h-3" /> IN EXECUTION
                </div>
              )}
              {isFuture && (
                <div className="absolute top-4 right-4 bg-slate-800/40 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/5">
                  LOCKED
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className={`text-base font-extrabold tracking-tight ${isCurrent ? p.color.includes('orange') ? 'text-orange-300' : p.color.includes('purple') ? 'text-purple-300' : p.color.includes('blue') ? 'text-blue-300' : p.color.includes('emerald') ? 'text-emerald-300' : 'text-pink-300' : isPassed ? "text-slate-300" : "text-slate-500"}`}>
                    {p.phase}
                  </h3>
                  <p className="text-[11px] font-mono opacity-50">{p.days} • timeline: {p.dates}</p>
                </div>

                <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-1.5">
                  <p className="text-[9px] uppercase tracking-widest font-black text-slate-400">Operational Target Focus Parameters:</p>
                  <ul className="space-y-1 text-xs">
                    {p.tasks.map((task, idx) => (
                      <li 
                        key={idx} 
                        className={`font-semibold flex items-center gap-2 ${isPassed ? "text-emerald-400 opacity-70" : isCurrent ? "text-slate-200" : "text-slate-500"}`}
                      >
                        <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full shrink-0"></span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrent && (
                  <div className="bg-indigo-950/20 border border-indigo-500/10 p-2.5 rounded text-[10.5px] text-indigo-300 flex items-start gap-2">
                    <Pin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
                    <span><b>Attention Shomoy:</b> Compressed Day {currentDay} of 60. Maximize your energy economy. Leverage your failure insurance slots under high exhaustion or distraction events to stay failure-resistant.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
