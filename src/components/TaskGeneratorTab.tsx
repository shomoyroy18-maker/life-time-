import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  TrendingDown, 
  Heading2, 
  Play, 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  AlertOctagon, 
  RefreshCw, 
  Battery, 
  Compass, 
  ArrowRightCircle,
  TrendingUp,
  Flame,
  CheckCircle2
} from "lucide-react";
import { UserProfile, TodoItem, DailyLog } from "../types";

interface TaskGeneratorTabProps {
  user: UserProfile;
  logs: DailyLog[];
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
}

interface GeneratedTask {
  id: string;
  taskText: string;
  timeSlot: string;
  priority: "critical" | "high" | "medium_low";
  completed: boolean;
  date: string;
}

export default function TaskGeneratorTab({ user, logs, todos, setTodos }: TaskGeneratorTabProps) {
  const [engine, setEngine] = useState<"gemini" | "local">("gemini");
  const [isInsuranceActive, setIsInsuranceActive] = useState<boolean>(() => {
    const saved = localStorage.getItem(`insurance_active_${user.currentDay}`);
    return saved === "true";
  });
  const [insuranceDaysRemaining, setInsuranceDaysRemaining] = useState<number>(() => {
    const saved = localStorage.getItem("insurance_days_pool");
    return saved ? parseInt(saved, 10) : 10;
  });
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success">("idle");

  const todayStr = new Date().toISOString().split("T")[0];

  // Helper stats for custom prompt calculations
  const totalLogs = logs.length;
  const recentStats = {
    salatRate: totalLogs > 0 ? Math.round((logs.filter(l => l.salatCongregation).length / totalLogs) * 100) : 90,
    hifzRate: totalLogs > 0 ? Math.round((logs.filter(l => l.quranHifz).length / totalLogs) * 100) : 80,
    workoutRate: totalLogs > 0 ? Math.round((logs.filter(l => l.workoutCompleted).length / totalLogs) * 100) : 72,
    nicotineRate: totalLogs > 0 ? Math.round((logs.filter(l => l.nicotineFree).length / totalLogs) * 100) : 85,
    avgFocusHours: totalLogs > 0 ? parseFloat((logs.reduce((acc, curr) => acc + curr.focusHours, 0) / totalLogs).toFixed(1)) : 5.5,
  };

  const expectedRevenueTrajectory = Math.round((Math.min(50, user.currentDay) / 50) * user.targetBdtIncome);
  const revenueShortfall = expectedRevenueTrajectory - user.currentBdtIncome;
  const isRevenueBehind = revenueShortfall > 0;

  // Track dynamic trajectory performance score
  const trajectoryFactorText = isRevenueBehind 
    ? `Revenue is behind expected linear trajectory of ${expectedRevenueTrajectory} BDT. High Priority Lead outbounds forced.`
    : "Revenue is on or ahead of track! Focus is on sustaining scale velocity.";

  // Generate Deterministic Tasks locally
  const generateLocalDeterministicTasks = () => {
    setLoading(true);
    setImportStatus("idle");
    setTimeout(() => {
      const tasks: GeneratedTask[] = [];
      const baseDate = todayStr;

      // Rule 1: Always Fajr Salat as critical baseline
      tasks.push({
        id: "gen-local-fajr",
        taskText: "Fajr Salat in the Mosque (+ Congregational Duas & Dhikr)",
        timeSlot: "04:30",
        priority: "critical",
        completed: false,
        date: baseDate
      });

      // Rule 2: Hifz study right after Fajr
      tasks.push({
        id: "gen-local-hifz",
        taskText: `Quran Memorize: Focus core tajweed review (${isInsuranceActive ? "1 Verse" : "3 Verses"})`,
        timeSlot: "05:15",
        priority: "critical",
        completed: false,
        date: baseDate
      });

      // Rule 3: High priority work block OR Light review depending on insurance
      if (isInsuranceActive) {
        tasks.push({
          id: "gen-local-recovery",
          taskText: "Emergency Recovery: Walk outside to Mosque + 10m breathing loops",
          timeSlot: "08:30",
          priority: "high",
          completed: false,
          date: baseDate
        });
        tasks.push({
          id: "gen-local-focus-light",
          taskText: "Light Review: Focus logs review + check open tickets (2h max)",
          timeSlot: "10:00",
          priority: "medium_low",
          completed: false,
          date: baseDate
        });
      } else {
        tasks.push({
          id: "gen-local-focus-deep",
          taskText: "Deep Work Block 1: Core Business Code Systems Integration (90-Min block)",
          timeSlot: "09:00",
          priority: "high",
          completed: false,
          date: baseDate
        });

        // Rule 4: Wealth generation task under pressure if revenue is behind
        if (isRevenueBehind) {
          tasks.push({
            id: "gen-local-outbound",
            taskText: "Wealth: Outbound pitch matrix to 3 potential client slots on Upwork/LinkedIn",
            timeSlot: "11:30",
            priority: "critical",
            completed: false,
            date: baseDate
          });
        } else {
          tasks.push({
            id: "gen-local-outbound-standard",
            taskText: "Wealth: Sift prospective bids & update portfolio media widgets",
            timeSlot: "11:30",
            priority: "high",
            completed: false,
            date: baseDate
          });
        }
      }

      // Rule 5: Evening physical activity
      tasks.push({
        id: "gen-local-exercise",
        taskText: isInsuranceActive 
          ? "Restorative: Light yoga stretching or quick brisk walk (20-Min)"
          : "Physical: Full Strength circuit + Nicotine elimination NRT deployment",
        timeSlot: "17:00",
        priority: "medium_low",
        completed: false,
        date: baseDate
      });

      // Rule 6: Maghrib/Isha focus
      tasks.push({
        id: "gen-local-spiritual-end",
        taskText: "Deen Check: Mosque congregational Maghrib/Isha + brief Tafsir reading",
        timeSlot: "19:00",
        priority: "high",
        completed: false,
        date: baseDate
      });

      // Rule 7: Strict Sleep lock
      tasks.push({
        id: "gen-local-sleep",
        taskText: "Bedtime hardlock bedtime routine. Disconnect screens completely.",
        timeSlot: "21:45",
        priority: "critical",
        completed: false,
        date: baseDate
      });

      setGeneratedTasks(tasks);
      setLoading(false);
    }, 450);
  };

  // Generate cognitive tasks with Gemini
  const generateGeminiTasks = async (forceSchemaSync = false) => {
    const cacheKey = `90d_tasks_cache_${user.currentDay}_${isInsuranceActive ? "ins" : "std"}`;
    if (!forceSchemaSync) {
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            setGeneratedTasks(parsed);
            return;
          }
        } catch (e) {
          console.error("Task list schema parse failure fallback status:", e);
        }
      }
    }

    setLoading(true);
    setImportStatus("idle");
    try {
      const response = await fetch("/api/gemini/tasklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentDay: user.currentDay,
          isInsuranceActive,
          insuranceDaysRemaining,
          currentBdtIncome: user.currentBdtIncome,
          targetBdtIncome: user.targetBdtIncome,
          recentStats,
          date: todayStr
        })
      });

      const data = await response.json();
      if (data && data.tasks) {
        setGeneratedTasks(data.tasks);
        localStorage.setItem(cacheKey, JSON.stringify(data.tasks));
      } else {
        generateLocalDeterministicTasks();
      }
    } catch (err) {
      console.error("Gemini compiler failed, using local engine fallback.", err);
      generateLocalDeterministicTasks();
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (forceSchemaSync = false) => {
    if (engine === "gemini") {
      generateGeminiTasks(forceSchemaSync);
    } else {
      generateLocalDeterministicTasks();
    }
  };

  useEffect(() => {
    handleGenerate(false);
  }, [engine, isInsuranceActive]);

  // Activate Failsafe insurance mode for today
  const toggleInsuranceMode = () => {
    if (!isInsuranceActive) {
      if (insuranceDaysRemaining > 0) {
        setIsInsuranceActive(true);
        const nextPool = insuranceDaysRemaining - 1;
        setInsuranceDaysRemaining(nextPool);
        localStorage.setItem("insurance_days_pool", nextPool.toString());
        localStorage.setItem(`insurance_active_${user.currentDay}`, "true");
      } else {
        alert("CRITICAL ERROR: Failure safety pool exhausted! No insurance remains. Maintain maximum discipline!");
      }
    } else {
      // Revert back
      setIsInsuranceActive(false);
      const nextPool = insuranceDaysRemaining + 1;
      setInsuranceDaysRemaining(nextPool);
      localStorage.setItem("insurance_days_pool", nextPool.toString());
      localStorage.setItem(`insurance_active_${user.currentDay}`, "false");
    }
  };

  const handleResetInsurancePool = () => {
    setInsuranceDaysRemaining(10);
    localStorage.setItem("insurance_days_pool", "10");
  };

  // Add individual directives directly to the master checklist
  const handleImportToMainChecklist = () => {
    if (generatedTasks.length === 0) return;

    // Convert Generated tasks into standard TodoItems
    const mapped: TodoItem[] = generatedTasks.map((t) => ({
      id: `gen-todo-${Date.now()}-${t.id}`,
      userId: user.userId || "shomoy",
      taskText: `[COMPILE-DAY ${user.currentDay}] ${t.taskText}`,
      timeSlot: t.timeSlot,
      priority: t.priority,
      completed: false,
      date: todayStr,
      createdAt: new Date().toISOString()
    }));

    // Avoid duplicates
    const currentTexts = new Set(todos.map((todo) => todo.taskText));
    const uniqueToInsert = mapped.filter((todo) => !currentTexts.has(todo.taskText));

    setTodos([...todos, ...uniqueToInsert]);
    setImportStatus("success");
    setTimeout(() => {
      setImportStatus("idle");
    }, 2000);
  };

  const handleRemoveTask = (id: string) => {
    setGeneratedTasks(generatedTasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6" id="task-generator-tab-container">
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Intelligent Daily Directive Compiler
        </h1>
        <p className="text-xs text-slate-400">
          Synthesizes hourly milestones tailored to Day {user.currentDay} velocity targets, habit deficits, and current wealth deficits.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: CONFIGURATION & RESILIENCY BUFFER */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* COMPILER ENGINE CONTROL CARD */}
          <div className="app-card p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 border-b border-white/5 pb-2">
              <Compass className="w-4 h-4 text-indigo-400" /> Compiler Core Configuration
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Compilation Engine</label>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setEngine("gemini")}
                    className={`py-1.5 px-3 rounded text-[10.5px] font-bold cursor-pointer font-sans transition-all flex items-center justify-center gap-1.5 ${engine === "gemini" ? "bg-indigo-600/90 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Gemini Cognitive
                  </button>
                  <button
                    onClick={() => setEngine("local")}
                    className={`py-1.5 px-3 rounded text-[10.5px] font-bold cursor-pointer font-sans transition-all flex items-center justify-center gap-1.5 ${engine === "local" ? "bg-indigo-600/90 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-300" /> Fast Local
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/45 p-3 rounded-lg border border-white/5 text-[11px] text-slate-400 leading-relaxed font-mono">
                <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">ENGINE DIAGNOSTICS:</span>
                {engine === "gemini" 
                  ? "Loads real-time metrics (mood ratios, prayer logs, nicotine-free streaks, budget shortfall) directly into Gemini and generates highly responsive timetables."
                  : "Generates high-resiliency schedules locally using optimized state-matching constraints."
                }
              </div>
            </div>
          </div>

          {/* BUILT-IN FAILURE INSURANCE RESILIENCY POOL */}
          <div className="app-card p-5 rounded-xl space-y-4 border border-rose-500/10 bg-rose-950/5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-rose-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" /> Failsafe Failure Insurance Pool
              </h3>
              <span className="bg-rose-500/10 text-rose-400 text-[9px] font-mono uppercase tracking-widest font-black px-2 py-0.5 rounded border border-rose-500/20 animate-pulse">
                10-Day Safe Vault
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-[11.5px] text-slate-400 leading-relaxed">
                Shomoy's reschedule features are equipped with a 10-day fail-safe pool. Triggering an insurance day scales back demanding outbounds to keep you from relapsing while protecting the constant outcome date.
              </p>

              {/* BATTERY VISUAL */}
              <div className="bg-slate-900/60 p-3.5 rounded-lg border border-white/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5"><Battery className="w-4 h-4 text-emerald-400" /> Reserve Buffers</span>
                  <span className="font-mono font-bold text-slate-300">{insuranceDaysRemaining} / 10 Days Remain</span>
                </div>
                
                {/* Visual Battery indicators */}
                <div className="flex gap-1.5 h-6">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded h-full border transition-all ${
                        i < insuranceDaysRemaining 
                          ? isInsuranceActive 
                            ? "bg-rose-500/60 border-rose-500 animate-pulse" 
                            : "bg-emerald-500 border-emerald-400" 
                          : "bg-slate-800/40 border-slate-750/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* TOGGLE TRIGGERS */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={toggleInsuranceMode}
                  className={`flex-1 py-2 rounded-lg font-extrabold text-[10.5px] uppercase tracking-wider cursor-pointer font-sans transition-all flex items-center justify-center gap-2 ${
                    isInsuranceActive 
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20 border border-rose-500" 
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 inline-block text-rose-300" />
                  {isInsuranceActive ? "Deactivate Failsafe Mode" : "Activate Failsafe Mode"}
                </button>
                
                <button
                  type="button"
                  onClick={handleResetInsurancePool}
                  className="px-3.5 py-2 rounded-lg border border-white/5 bg-black/3c text-[10px] text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all font-mono"
                  title="Refill Insurance Pool to 10"
                >
                  Reset Pool
                </button>
              </div>

              {isInsuranceActive && (
                <div className="bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-lg text-[11px] text-rose-300 flex items-start gap-2 animate-fade-in">
                  <AlertOctagon className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                  <span>
                    <b>FAILSAFE TRIGGERED TODAY:</b> Task profiles will compile with reduced pressure, lowered cognitive complexity, and enhanced physical recovery objectives. Stay calm and rest on-plan today!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PROJECT TRAJECTORY HORIZON STATUS */}
          <div className="app-card p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-2 border-b border-white/5 pb-2">
              <Coins className="w-4 h-4 text-emerald-400" /> Wealth Horizon Auditor (1 Lakh BDT/Mo)
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="grid grid-cols-2 gap-3 text-center bg-black/20 p-2.5 rounded-lg border border-white/5">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Linear Current Target</span>
                  <span className="font-mono font-black text-slate-200">{expectedRevenueTrajectory} BDT</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase tracking-wider">Your Recorded Revenue</span>
                  <span className={`font-mono font-black ${isRevenueBehind ? "text-rose-400" : "text-emerald-400"}`}>{user.currentBdtIncome} BDT</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-900/40 p-3 rounded-lg border border-white/5">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Shortfall Audit:</span>
                  <span className={`font-bold uppercase tracking-wider ${isRevenueBehind ? "text-rose-400" : "text-emerald-400"}`}>
                    {isRevenueBehind ? `${revenueShortfall} BDT Behind Target` : "Target Met or Ahead!"}
                  </span>
                </div>
                <p className="text-[10.5px] leading-relaxed text-slate-400 font-mono mt-1">
                  💡 {trajectoryFactorText}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: COMPILED TODAY'S DIRECTIVE CHECKS */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="app-card p-6 rounded-xl space-y-4 shadow-lg flex flex-col justify-between min-h-[500px]">
            
            {/* HEADER COMPILER ROW */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-400" /> Compiled Schedule directives for Today
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">Date: {todayStr} • Engine: {engine.toUpperCase()}</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleGenerate(true)}
                  className="flex-1 sm:flex-initial bg-indigo-950 hover:bg-indigo-900 text-indigo-300 font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider cursor-pointer border border-indigo-500/20 active:scale-95 transition-all"
                >
                  Re-Compile
                </button>
                <button
                  onClick={handleImportToMainChecklist}
                  disabled={generatedTasks.length === 0}
                  className={`flex-1 sm:flex-initial text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    importStatus === "success" 
                      ? "bg-emerald-600 border border-emerald-500" 
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {importStatus === "success" ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Synthesized!
                    </>
                  ) : (
                    <>
                      <ArrowRightCircle className="w-3.5 h-3.5" /> Import to Main
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* COMPILED MATRIX CHECKS */}
            <div className="flex-1 py-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                  <div className="w-8 h-8 rounded-full border-4 border-t-indigo-500 border-indigo-100/10 animate-spin" />
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Refining chronological checkpoints...</p>
                </div>
              ) : generatedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                  <AlertOctagon className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Compiler Empty</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mt-1">Tap Re-Compile to draft daily directive loops.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {generatedTasks.map((task) => {
                    const isCritical = task.priority === "critical";
                    const isHigh = task.priority === "high";

                    return (
                      <div 
                        key={task.id}
                        className={`flex items-start justify-between p-3.5 rounded-lg border transition-all ${
                          isCritical 
                            ? "bg-red-950/15 border-red-900/30 text-rose-200" 
                            : isHigh 
                              ? "bg-indigo-950/10 border-indigo-900/20 text-slate-200" 
                              : "bg-black/20 border-white/5 text-slate-400"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-slate-900/80 px-2 py-1 rounded text-[10px] font-mono font-black tracking-tighter shrink-0 border border-white/5 flex items-center gap-1 select-none">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.timeSlot}
                          </div>
                          
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-bold leading-relaxed pr-2">
                              {task.taskText}
                            </p>
                            <div className="flex gap-1.5 items-center">
                              <span className={`text-[8.5px] uppercase font-bold tracking-widest font-mono ${
                                isCritical 
                                  ? "text-red-400" 
                                  : isHigh 
                                    ? "text-indigo-400" 
                                    : "text-slate-500"
                              }`}>
                                {task.priority}
                              </span>
                              {task.id.includes("local") ? (
                                <span className="text-[8.5px] font-mono text-slate-650 opacity-40">Dynamic Local</span>
                              ) : (
                                <span className="text-[8.5px] font-mono text-amber-500/80 uppercase font-black tracking-widest">Cognitive AI</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTask(task.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer transition-colors shrink-0"
                          title="Omit this task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* COMPILED SYNC INFORMATION FOOTER */}
            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex flex-col md:flex-row justify-between items-center gap-2">
              <span>Timeline: Day {user.currentDay} of 60 • 50 Active Work Block Days Limit</span>
              <span className="flex items-center gap-1 text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sync ready - updates main checkout task blocks.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
