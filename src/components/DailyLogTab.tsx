import React, { useState } from "react";
import { DailyLog, MoodType } from "../types";
import { ListTodo, Check, AlertCircle, Dumbbell, Calendar, Heart, Flame, Ban, HelpCircle } from "lucide-react";

interface DailyLogTabProps {
  logs: DailyLog[];
  setLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
  currentDay: number;
}

export default function DailyLogTab({ logs, setLogs, currentDay }: DailyLogTabProps) {
  // Log Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mood, setMood] = useState<MoodType>("good");
  const [energyLevel, setEnergyLevel] = useState(8);
  const [salatCongregation, setSalatCongregation] = useState(true);
  const [nicotineFree, setNicotineFree] = useState(true);
  const [quranHifz, setQuranHifz] = useState(true);
  const [workoutCompleted, setWorkoutCompleted] = useState(true);
  const [focusHours, setFocusHours] = useState(6);
  const [pipelineLeads, setPipelineLeads] = useState(1);
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if log for this date already exists
    const existingIndex = logs.findIndex(l => l.date === date);

    const newLog: DailyLog = {
      id: "log-" + (existingIndex >= 0 ? logs[existingIndex].id.split("-")[1] : Date.now()),
      userId: "shomoy_roy",
      date,
      mood,
      energyLevel,
      salatCongregation,
      nicotineFree,
      quranHifz,
      workoutCompleted,
      focusHours: Number(focusHours) || 0,
      pipelineLeads: Number(pipelineLeads) || 0,
      notes: notes.trim(),
    };

    if (existingIndex >= 0) {
      // Overwrite/update existing log for this date
      setLogs(prev => {
        const copy = [...prev];
        copy[existingIndex] = newLog;
        return copy;
      });
      setSuccessMsg("Overwrote previous log entry for this date successfully!");
    } else {
      // Add new log to the top
      setLogs(prev => [newLog, ...prev]);
      setSuccessMsg("Logged your day's core metrics successfully!");
    }

    setNotes("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const getMoodEmoji = (m: MoodType) => {
    switch (m) {
      case "excellent": return "😃";
      case "good": return "🙂";
      case "average": return "😐";
      case "low": return "😔";
      case "crisis": return "🚨";
    }
  };

  return (
    <div className="space-y-6" id="dailylog-tab-container">
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-indigo-400" /> Daily Focus Log & History Stream
        </h1>
        <p className="text-xs text-slate-400">
          Capture day-to-day correction metrics • Review past historical records
        </p>
      </header>

      {/* FEEDBACK ANNOUNCEMENT PANEL */}
      {successMsg && (
        <div className="p-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SUBMISSION FORM LOG */}
        <div className="app-card p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> TRANSMIT TELEMETRY LOG FOR DAY {currentDay}
          </h3>

          <form onSubmit={handleSubmitLog} className="space-y-4 text-xs font-semibold">
            {/* DATE & MOOD */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Log Date Target</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Current Subjective Mood</label>
                <select
                  value={mood}
                  onChange={e => setMood(e.target.value as MoodType)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200"
                >
                  <option value="excellent">😃 Excellent (Clear & Driven)</option>
                  <option value="good">🙂 Good (Standard Stable)</option>
                  <option value="average">😐 Average (Stagnation/Lethargy)</option>
                  <option value="low">😔 Low Focus (ADHD Lockout)</option>
                  <option value="crisis">🚨 Craving Crisis / Relapse Warning</option>
                </select>
              </div>
            </div>

            {/* VOLTAGE RANGE SLIDER */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <span>Subjective Energy/Motivation Core</span>
                <span className="text-indigo-400 font-bold">{energyLevel} / 10 Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={e => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-full cursor-pointer"
              />
            </div>

            {/* SYSTEM TOGGLES CHECKBOXES */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-1 border-b border-white/5 pb-1">Primary Habit Overwrite Matrix:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={salatCongregation}
                    onChange={e => setSalatCongregation(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-slate-300">🕌 Salat in Mosque</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={nicotineFree}
                    onChange={e => setNicotineFree(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-slate-300">🚭 Nicotine-Free Sec</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={quranHifz}
                    onChange={e => setQuranHifz(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-slate-300">📖 Hifz Core block</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={workoutCompleted}
                    onChange={e => setWorkoutCompleted(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-slate-300">🏋️ Workout/Walking</span>
                </label>
              </div>
            </div>

            {/* NUMERICAL FEEDERS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Deep Focus Blocks (Hrs)</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  required
                  value={focusHours}
                  onChange={e => setFocusHours(Number(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Leads Acquired today</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={pipelineLeads}
                  onChange={e => setPipelineLeads(Number(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200"
                />
              </div>
            </div>

            {/* CUSTOM NOTES */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Day Summary & Mental Notes</label>
              <textarea
                placeholder="Briefly review blockers, high points, or ADHD cravings..."
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-200 font-sans leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer font-sans shadow-lg"
            >
              Update Core Registry Log
            </button>
          </form>
        </div>

        {/* HISTORICAL TIMELINE STREAM */}
        <div className="app-card p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Flame className="w-4 h-4 text-emerald-400 animate-pulse" /> HISTORICAL ACTION TIMELINE RECORDS
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[430px] pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-10">Your operational registry is empty. Log your first day above.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3.5 bg-black/20 border border-white/5 rounded-xl space-y-2 text-xs relative group hover:border-[var(--accent-primary)]/25 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="text-base select-none">{getMoodEmoji(log.mood)}</span>
                      {log.date}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                      ENERGY: {log.energyLevel}/10 Volts
                    </span>
                  </div>

                  <p className="text-slate-400 leading-relaxed font-sans">{log.notes || "No extra summary notes logged."}</p>

                  {/* Habit checks strip */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-500">
                    <span className={`px-2 py-0.5 rounded border ${log.salatCongregation ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/10" : "bg-red-950/10 text-red-400 border-red-500/5 line-through opacity-40"}`}>
                      🕌 Salat
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${log.nicotineFree ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/10" : "bg-red-950/10 text-red-400 border-red-500/5 line-through opacity-40"}`}>
                      🚭 Nicotine-Free
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${log.quranHifz ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/10" : "bg-red-950/10 text-red-400 border-red-500/5 line-through opacity-40"}`}>
                      📖 Hifz Block
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${log.workoutCompleted ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/10" : "bg-red-950/10 text-red-400 border-red-500/5 line-through opacity-40"}`}>
                      🏋️ Workout
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-950/20 text-indigo-400 rounded border border-indigo-500/10">
                      ⏱ {log.focusHours} Hrs Focus
                    </span>
                    <span className="px-2 py-0.5 bg-blue-950/20 text-blue-400 rounded border border-blue-500/10">
                      💰 {log.pipelineLeads} Leads
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
