import React, { useState, useEffect, useRef } from "react";
import { DailyLog, UserProfile, TodoItem } from "../types";
import { 
  Flame, Brain, Dumbbell, Coins, Compass, Sparkles, Loader2, Play, 
  Clock, TrendingUp, Send, Terminal, Calendar, HelpCircle, Activity,
  ChevronRight, ArrowRight
} from "lucide-react";
import Markdown from "react-markdown";

interface DashboardTabProps {
  user: UserProfile;
  logs: DailyLog[];
  todos: TodoItem[];
  navigate: (page: string) => void;
}

export default function DashboardTab({ user, logs, todos, navigate }: DashboardTabProps) {
  // Real-time ticking Clock setup
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Executive insights states
  const [insights, setInsights] = useState<{
    insights: string;
    recommendedToday: string[];
    encouragement: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Grounded Plan Chat States
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; text: string; timestamp: string }>>([
    {
      role: "model",
      text: "### COMMAND STATION CORE ONLINE\n\nI am compiled of your **60-Day Campaign Blueprint** and **entire application tracking data**. All recommendations are strictly tailored to your specific milestones and constraints.\n\nAsk me anything regarding your active trackers, target pipeline, checklist completion, or phase strategies.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Tick the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatted date and time
  const formattedDateTime = currentTime.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const daysRemaining = Math.max(0, 60 - user.currentDay);

  const getPhaseInfo = () => {
    if (user.currentDay <= 10) return { name: "Phase 1: Foundation Accelerated", badge: "Prep Block", color: "text-orange-400" };
    if (user.currentDay <= 25) return { name: "Phase 2: Build & Skill Velocity", badge: "Build Block", color: "text-purple-400" };
    if (user.currentDay <= 40) return { name: "Phase 3: Deep Market Execution", badge: "Execution Block", color: "text-blue-400" };
    if (user.currentDay <= 50) return { name: "Phase 4: Scale & Takeoff Boost", badge: "Takeoff Block", color: "text-emerald-400" };
    return { name: "Phase 5: Resiliency & Failure Insurance Pool", badge: "Failure Protection", color: "text-pink-400" };
  };
  const phaseInfo = getPhaseInfo();

  // Dynamic calculations based on recent logs:
  const workoutRate = logs.length > 0 
    ? Math.round((logs.filter(l => l.workoutCompleted).length / logs.length) * 100)
    : 72;

  const nicotineFreeRate = logs.length > 0
    ? Math.round((logs.filter(l => l.nicotineFree).length / logs.length) * 100)
    : 85;

  const physicalProgress = Math.round((workoutRate + nicotineFreeRate) / 2);

  const salatRate = logs.length > 0
    ? Math.round((logs.filter(l => l.salatCongregation).length / logs.length) * 100)
    : 90;

  const hifzRate = logs.length > 0
    ? Math.round((logs.filter(l => l.quranHifz).length / logs.length) * 100)
    : 80;

  const deenProgress = Math.round((salatRate + hifzRate) / 2);

  const avgFocusHours = logs.length > 0
    ? logs.reduce((acc, curr) => acc + curr.focusHours, 0) / logs.length
    : 5.5;

  const focusTarget = 6; // 6 hours focus per day target
  const focusProgress = Math.min(100, Math.round((avgFocusHours / focusTarget) * 100));

  const financialProgress = Math.min(100, Math.round((user.currentBdtIncome / user.targetBdtIncome) * 100));

  // 1. Calculate overall performance rate as the average of the 4 pillar systems
  const performancePercent = Math.round(
    (physicalProgress + deenProgress + focusProgress + financialProgress) / 4
  );

  // 2. Map performance to a strict status severity badge as requested:
  // "status at good or medium as try hard or do it now as bad"
  let statusText = "GOOD";
  let statusColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  let statusIcon = "🟢";

  if (performancePercent < 60) {
    statusText = "DO IT NOW";
    statusColor = "text-rose-450 border-rose-500/30 bg-rose-500/50 animate-pulse";
    statusIcon = "🚨";
  } else if (performancePercent < 80) {
    statusText = "TRY HARD";
    statusColor = "text-amber-400 border-amber-500/30 bg-amber-500/20";
    statusIcon = "⚡";
  }

  // Auto-scroll within the chat box
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  // Load backend insights
  const fetchDiagnostics = async (forceSchemaSync = false) => {
    const cacheKey = `90d_insights_cache_${logs.length}_${user.currentDay}_${user.currentBdtIncome}`;
    
    if (!forceSchemaSync) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.insights) {
            setInsights(parsed);
            return;
          }
        } catch (e) {
          console.error("Stale cache evaluation matrix error:", e);
        }
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gemini/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logs,
          currentDay: user.currentDay,
          theme: user.theme,
          displayName: user.displayName,
        }),
      });
      const data = await res.json();
      setInsights(data);
      if (data && data.insights) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics(false);
  }, [logs, user.currentDay]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    
    const timestamp = currentTime.toLocaleTimeString();
    const newUserMessage = { role: "user" as const, text: userMsg, timestamp };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMessage],
          activeStats: {
            currentDay: user.currentDay,
            salatStreak: 87,
            nicotineStreak: 45,
            hifzStreak: 23,
            leads: 12,
            targetBdtIncome: user.targetBdtIncome,
            currentBdtIncome: user.currentBdtIncome,
            displayName: user.displayName,
            logsHistory: logs,
            todosList: todos,
          }
        })
      });
      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          role: "model" as const,
          text: data.text || "Directive analysis cycles completed.",
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          role: "model" as const,
          text: "### ⚠️ COMMAND FAULT\n\nConnectivity matrix failed. Verify your **GEMINI_API_KEY** under AI Studio secrets configurations.",
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-tab-container">
      
      {/* 1. REAL-TIME OPERATIONS TELEMETRY HUD STRIP */}
      <section className="app-card overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 p-4 font-mono shadow-md" id="dashboard-hud-panel">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Node identity & System Clock */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--accent-primary)] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> TARGET DYNAMIC HUD COORDINATES
            </span>
            <div className="flex flex-wrap items-center gap-x-3 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> {formattedDateTime}
              </span>
            </div>
          </div>

          {/* Stats HUD section */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            
            {/* Executed Days Indicator */}
            <div className="bg-black/30 border border-white/5 rounded-lg px-3.5 py-1.5 min-w-[120px]">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Executed Days</span>
              <span className="text-xs font-extrabold text-slate-200">
                {logs.length + 1} Days <span className="text-[10px] text-slate-400 font-normal">(inc. today)</span>
              </span>
            </div>

            {/* Performance Percent Score */}
            <div className="bg-black/30 border border-white/5 rounded-lg px-3.5 py-1.5 min-w-[100px]">
              <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Performance Rate</span>
              <span className="text-xs font-black text-indigo-300 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" /> {performancePercent}% Adherence
              </span>
            </div>

            {/* Performance Status Severity Badge */}
            <div className={`border rounded-lg px-4 py-1.5 min-w-[120px] text-center transition-all duration-300 ${statusColor}`}>
              <span className="block text-[8px] uppercase tracking-widest opacity-60 font-black">Track Status</span>
              <span className="text-xs font-black tracking-wider flex items-center justify-center gap-1">
                {statusIcon} {statusText}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* HEADER HERO ROW */}
      <header className="app-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300 shadow-lg border border-white/5">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">60 Days to Takeoff</h1>
          <p className="text-xs text-[var(--accent-primary)] font-semibold mt-1 uppercase tracking-wider">
            ⚡ Core Operational Workspace Block • Day {user.currentDay} of 60
          </p>
        </div>
        <div className="text-center bg-black/40 px-6 py-2.5 rounded-xl border border-white/5 flex items-center gap-4">
          <div>
            <span className="block text-3xl font-black text-emerald-400">{daysRemaining}</span>
            <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">Days Remaining</span>
          </div>
          <div className="w-[1px] h-10 bg-white/10 hidden sm:block"></div>
          <div className="hidden sm:block text-left">
            <span className="block text-md font-bold text-slate-300">{phaseInfo.badge} Active</span>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${phaseInfo.color}`}>{phaseInfo.name}</span>
          </div>
        </div>
      </header>

      {/* 4 CORE LOCK SYSTEM PILLAR GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PHYSICAL */}
        <div className="app-card p-5 rounded-xl border-l-4 border-rose-500 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-rose-500" /> Physical Fitness
            </span>
            <span className="text-xs bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded">{physicalProgress}%</span>
          </div>
          <p className="text-lg font-bold tracking-tight text-slate-100">Nicotine Escape</p>
          <div className="w-full bg-black/30 h-1.5 rounded-full mt-2.5 overflow-hidden border border-white/5">
            <div className="bg-rose-500 h-full" style={{ width: `${physicalProgress}%` }}></div>
          </div>
          <span className="text-[10px] opacity-40 mt-1 block">Workouts: {workoutRate}% • Smoke-Free: {nicotineFreeRate}%</span>
        </div>

        {/* ANALYTICAL */}
        <div className="app-card p-5 rounded-xl border-l-4 border-purple-500 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-500" /> Analytical Mind
            </span>
            <span className="text-xs bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded">{focusProgress}%</span>
          </div>
          <p className="text-lg font-bold tracking-tight text-slate-100">Deep Focus Track</p>
          <div className="w-full bg-black/30 h-1.5 rounded-full mt-2.5 overflow-hidden border border-white/5">
            <div className="bg-purple-500 h-full" style={{ width: `${focusProgress}%` }}></div>
          </div>
          <span className="text-[10px] opacity-40 mt-1 block">Avg Focused Work: {avgFocusHours.toFixed(1)} hrs / day</span>
        </div>

        {/* FINANCIAL */}
        <div className="app-card p-5 rounded-xl border-l-4 border-blue-500 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-blue-500" /> Income Stream
            </span>
            <span className="text-xs bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">{financialProgress}%</span>
          </div>
          <p className="text-lg font-bold tracking-tight text-slate-100">1L BDT / Month</p>
          <div className="w-full bg-black/30 h-1.5 rounded-full mt-2.5 overflow-hidden border border-white/5">
            <div className="bg-blue-500 h-full" style={{ width: `${financialProgress}%` }}></div>
          </div>
          <span className="text-[10px] opacity-40 mt-1 block">Income: {user.currentBdtIncome.toLocaleString()} BDT / 100k BDT</span>
        </div>

        {/* DEEN / SPIRITUAL */}
        <div className="app-card p-5 rounded-xl border-l-4 border-emerald-500 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500" /> Deen & Family
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">{deenProgress}%</span>
          </div>
          <p className="text-lg font-bold tracking-tight text-slate-100">Mosque + Hifz Core</p>
          <div className="w-full bg-black/30 h-1.5 rounded-full mt-2.5 overflow-hidden border border-white/5">
            <div className="bg-emerald-500 h-full" style={{ width: `${deenProgress}%` }}></div>
          </div>
          <span className="text-[10px] opacity-40 mt-1 block">Mosque Congregation: {salatRate}% • Quran: {hifzRate}%</span>
        </div>
      </div>

      {/* STREAK STRIP METRIC CONTAINER */}
      <div className="app-card p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-wrap gap-3 justify-between items-center text-xs">
        <span className="font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1">
          <Flame className="w-4 h-4" /> System Streaks Matrix:
        </span>
        <div className="flex flex-wrap gap-2">
          <span className="bg-black/30 px-3 py-1 rounded border border-white/5 text-slate-300">
            🕌 Salat: <b className="text-amber-400">87 Days</b>
          </span>
          <span className="bg-black/30 px-3 py-1 rounded border border-white/5 text-slate-300">
            🚭 Smoke-Free: <b className="text-amber-400">45 Days</b>
          </span>
          <span className="bg-black/30 px-3 py-1 rounded border border-white/5 text-slate-300">
            📖 Hifz: <b className="text-amber-400">23 Days</b>
          </span>
          <span className="bg-black/30 px-3 py-1 rounded border border-white/5 text-slate-300">
            ⏱ Focus: <b className="text-amber-400">34 Hours</b>
          </span>
          <span className="bg-black/30 px-3 py-1 rounded border border-white/5 text-slate-300">
            💰 Pipelines: <b className="text-amber-400">12 Leads</b>
          </span>
        </div>
      </div>

      {/* COGNITIVE ANALYSIS & ACTION BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: DIAGNOSTIC REPORT + COGNITIVE PLAN CHAT (STRETCHED STACK) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Diagnostic Advice Panel */}
          <div className="app-card p-6 rounded-xl space-y-4 relative overflow-hidden border border-white/5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> Terminal AI Executive Analysis
              </h3>
              <button 
                onClick={() => fetchDiagnostics(true)} 
                disabled={loading}
                className="text-[10px] uppercase font-bold tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1 rounded border border-white/10 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin text-purple-400" /> : <Play className="w-2.5 h-2.5 text-purple-400" />}
                Force Diagnostics
              </button>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col justify-center items-center text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
                <p className="text-xs text-slate-400 animate-pulse uppercase tracking-widest font-mono">
                  Running cognitive core diagnostics audit...
                </p>
              </div>
            ) : insights ? (
              <div className="space-y-4 leading-relaxed text-sm">
                <div className="bg-black/30 p-4 rounded border border-white/5 text-slate-300">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-purple-400 mb-2 border-b border-slate-800 pb-1 font-bold">📊 System Health Output</p>
                  <div className="markdown-body whitespace-pre-line text-xs font-semibold select-all leading-normal text-slate-300">{insights.insights}</div>
                </div>

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 mb-2 font-bold">🎯 Targeted Directives Today:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    {insights.recommendedToday?.map((item, index) => (
                      <li key={index} className="bg-emerald-500/5 p-2.5 rounded border border-emerald-500/10 text-slate-300 flex items-start gap-2 h-full">
                        <span className="text-emerald-400 font-extrabold font-mono">Day-{user.currentDay}.{index+1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[var(--accent-primary)]/10 border-l-4 border-[var(--accent-primary)] rounded-r text-slate-200 italic font-mono text-xs font-bold leading-relaxed">
                  "{insights.encouragement}"
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-xs">
                Diagnostics empty. Press 'Force Diagnostics' above to query the executive model.
              </div>
            )}
          </div>

          {/* New Grounded Companion Chat Console */}
          <div className="app-card rounded-xl border border-white/5 overflow-hidden flex flex-col h-[500px] shadow-20xl" id="grounded-plan-chat-widget">
            
            {/* Console Header */}
            <div className="bg-black/40 border-b border-white/5 px-4 py-3 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-slate-300 font-bold uppercase tracking-wider">🛰️ Plan Grounded Chat Core</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded">
                <span>GEMINI 3.5 FLASH</span>
              </div>
            </div>

            {/* Console Logs / Chat Message Bubble Scroller */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs bg-slate-950/20" ref={chatScrollRef}>
              {chatMessages.map((msg, idx) => {
                const isModel = msg.role === "model";
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col space-y-1 ${
                      isModel 
                        ? "bg-indigo-950/10 border border-indigo-500/5 p-3 rounded-lg text-slate-300" 
                        : "text-white pl-2 border-l border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] opacity-40 select-none border-b border-white/5 pb-1 mb-1 font-sans">
                      <span className="font-black text-indigo-450 tracking-wider">
                        {isModel ? "🛰️ MASTER PLAN PILOT AIR" : "👤 HIGH CONVEXITY OPERATOR"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    
                    {/* Rendered markdown body with strict classes */}
                    <div className="whitespace-pre-line leading-relaxed text-[11px] prose prose-invert max-w-none text-slate-200">
                      {isModel ? <Markdown>{msg.text}</Markdown> : msg.text}
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-2 text-indigo-400 italic animate-pulse pl-2 font-bold select-none">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cognitive core evaluating plan matrices...</span>
                </div>
              )}
            </div>

            {/* Interactive Query submission bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-black/60 border-t border-white/5 flex gap-2">
              <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-lg px-3 focus-within:border-[var(--accent-primary)] transition-all">
                <span className="text-emerald-400 font-bold select-none font-mono text-xs mr-2">$</span>
                <input
                  type="text"
                  required
                  disabled={chatLoading}
                  placeholder="Query your campaign parameters, daily logs compliance, or timeline advice..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none focus:ring-0 placeholder:text-slate-600 font-mono py-2"
                />
              </div>
              <button
                type="submit"
                disabled={chatLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-40"
              >
                Query <Send className="w-3 h-3" />
              </button>
            </form>

            {/* Disclaimer strip establishing strict data limit contexts */}
            <div className="bg-black/50 px-4 py-1.5 border-t border-white/5 text-[9px] text-slate-500 font-mono flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
              <span>Answers are strictly limited to Shomoy Roy's 60-day design plan and tracked metrics. Out-of-bounds topics will be rejected.</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: QUICK STATUS PANEL SUMMARY */}
        <div className="app-card p-6 rounded-xl space-y-4 flex flex-col justify-between border border-white/5">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-white/5 pb-2">
              Next Project Threshold
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are sailing through the compressed <span className="text-purple-400 font-bold">{phaseInfo.name}</span>. 
              The ultimate takeoff threshold is fixed on <span className="text-emerald-400 font-bold">August 13, 2026</span>.
            </p>

            <div className="bg-slate-900/40 p-3 rounded border border-white/5 space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-indigo-400">
                <span>Core Target Progress</span>
                <span>Active Track: Day {user.currentDay} / 60</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full" style={{ width: `${Math.min(100, Math.round((user.currentDay / 60) * 100))}%` }}></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p>🚩 <b>Milestone 1 (Day 25):</b> "নতুন ভোর" — Core prep clearance</p>
              <p>🚩 <b>Milestone 2 (Day 40):</b> "নির্মাণ" — Portfolio & leads online</p>
              <p>🚩 <b>Milestone 3 (Day 50):</b> "উড়ান" — 1 Lakh Revenue Takeoff</p>
              <p>🩹 <b>Insurance Buffer:</b> 10 Reserve Pool days active</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button 
              onClick={() => navigate("dailylog")} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded text-[11px] uppercase tracking-wider cursor-pointer font-sans shadow-md"
            >
              Start Today's Task Log
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
