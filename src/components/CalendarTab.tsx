import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  Gauge,
  Flame,
  Hourglass,
  Trash2,
  CalendarCheck
} from "lucide-react";
import { UserProfile, TodoItem } from "../types";

interface CalendarTabProps {
  user: UserProfile;
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
}

export default function CalendarTab({ user, todos, setTodos }: CalendarTabProps) {
  // Calendar dates representation: We focus on Shomoy's timeline (June, July, August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(5); // 0-indexed, so 5 = June
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-06-15"); // Default to Start Date of campaign
  
  // States for adding a task from the calendar
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newPriority, setNewPriority] = useState<"critical" | "high" | "medium_low">("high");
  const [newDuration, setNewDuration] = useState<string>("60m"); // e.g. "30m", "60m", "90m", "120m"

  const monthsList = [
    { name: "June 2026", index: 5 },
    { name: "July 2026", index: 6 },
    { name: "August 2026", index: 7 }
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Pad arrays to display visual month grids easily
  const blanks = Array(firstDayIndex).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const gridCells = [...blanks, ...days];

  // Helper: Format date values cleanly
  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const currentListIndex = monthsList.findIndex(m => m.index === currentMonth);
    if (direction === "prev" && currentListIndex > 0) {
      setCurrentMonth(monthsList[currentListIndex - 1].index);
    } else if (direction === "next" && currentListIndex < monthsList.length - 1) {
      setCurrentMonth(monthsList[currentListIndex + 1].index);
    }
  };

  const handleSelectDay = (day: number) => {
    const dateStr = formatDateString(currentYear, currentMonth, day);
    setSelectedDateStr(dateStr);
  };

  // Parse task duration from text if user typed it, or default based on metadata
  const estimateDuration = (taskText: string) => {
    const textLower = taskText.toLowerCase();
    if (textLower.includes("90-min") || textLower.includes("90min")) return "90 mins";
    if (textLower.includes("30 mins") || textLower.includes("30-min") || textLower.includes("30m")) return "30 mins";
    if (textLower.includes("120-min") || textLower.includes("2 hours") || textLower.includes("2 hrs")) return "2 hours";
    if (textLower.includes("fajr") || textLower.includes("salat")) return "20 mins";
    return "60 mins";
  };

  // Calculate day index within Shomoy's campaigns
  const getChallengeDayIndex = (dateStr: string) => {
    const start = new Date("2026-06-15");
    const current = new Date(dateStr);
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays >= 1 && diffDays <= 60) {
      return { day: diffDays, description: `Day ${diffDays} of 60 (Active Campaign)` };
    } else if (diffDays > 60) {
      return { day: diffDays, description: `Campaign completed (${diffDays - 60} days post)` };
    } else {
      return { day: diffDays, description: `${Math.abs(diffDays - 1)} Days before campaign takeoff` };
    }
  };

  const challengeInfo = getChallengeDayIndex(selectedDateStr);

  const selectedDayTasks = todos.filter(t => t.date === selectedDateStr)
    .sort((a,b) => a.timeSlot.localeCompare(b.timeSlot));

  const toggleTodo = (id: string) => {
    const updated = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodos(updated);
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const formattedText = newDuration ? `${newText} (${newDuration})` : newText;

    const newTodo: TodoItem = {
      id: `cal-task-${Date.now()}`,
      userId: user.userId || "shomoy",
      taskText: formattedText,
      timeSlot: newTime,
      priority: newPriority,
      completed: false,
      date: selectedDateStr,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, newTodo]);
    setNewText("");
    setShowAddForm(false);
  };

  // Helper for grid borders & highlights
  const isDateInCampaign = (dateStr: string) => {
    const d = new Date(dateStr);
    const start = new Date("2026-06-15");
    const end = new Date("2026-08-13");
    return d >= start && d <= end;
  };

  const todayStr = "2026-05-31"; // Local Mock Target is May 31, 2026.

  return (
    <div className="space-y-6" id="calendar-tab-container">
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-400 animate-pulse" /> Campaign Interactive Calendar Viewer
        </h1>
        <p className="text-xs text-slate-400">
          Visualizes micro-timelines, estimated task durations, and critical slots over Shomoy Roy's 60-day takeoff track.
        </p>
      </header>

      {/* DYNAMIC TIMELINE HIGHLIGHT */}
      <div className="bg-indigo-950/20 border border-indigo-500/10 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-indigo-300">Active Viewing Node Pointer</h3>
            <p className="text-sm font-bold text-slate-200 mt-0.5">
              {new Date(selectedDateStr).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-black/40 border border-white/5 text-slate-400 rounded-lg flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Today: May 31, 2026
          </span>
          <span className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/20 text-indigo-300 rounded-lg font-bold uppercase tracking-wider">
            ⚡ {challengeInfo.description}
          </span>
        </div>
      </div>

      {/* GRID LAYOUT: CALENDAR BLOCK LEFT, TIMELINE DETAILED VIEW RIGHT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: THE GRID PANEL */}
        <div className="xl:col-span-7 space-y-4">
          <div className="app-card p-5 rounded-xl space-y-4 shadow-lg">
            
            {/* MONTH SWITCHER ROW */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-400" /> Monthly Chronological Block
              </h3>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleMonthChange("prev")}
                  disabled={currentMonth === 5}
                  className="p-1 px-2.5 bg-black/40 hover:bg-white/5 rounded-md border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1 font-mono"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <span className="text-xs font-bold font-mono text-indigo-300 bg-indigo-950/40 p-1 px-3 rounded border border-indigo-500/10">
                  {monthsList.find(m => m.index === currentMonth)?.name}
                </span>
                <button 
                  onClick={() => handleMonthChange("next")}
                  disabled={currentMonth === 7}
                  className="p-1 px-2.5 bg-black/40 hover:bg-white/5 rounded-md border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1 font-mono"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* DAY HEADERS */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* GRID CELLS */}
            <div className="grid grid-cols-7 gap-1.5">
              {gridCells.map((dayNum, cellIdx) => {
                if (dayNum === null) {
                  return (
                    <div 
                      key={`blank-${cellIdx}`} 
                      className="aspect-square bg-slate-950/20 rounded-lg opacity-25 border border-transparent"
                    />
                  );
                }

                const cellDateStr = formatDateString(currentYear, currentMonth, dayNum);
                const isSelected = cellDateStr === selectedDateStr;
                const inCampaign = isDateInCampaign(cellDateStr);
                const isToday = cellDateStr === todayStr;

                // Query cell specific tasks
                const cellTasks = todos.filter(t => t.date === cellDateStr);
                const criticalCount = cellTasks.filter(t => t.priority === "critical").length;
                const highCount = cellTasks.filter(t => t.priority === "high").length;
                const otherCount = cellTasks.length - criticalCount - highCount;

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`aspect-square p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer relative ${
                      isSelected 
                        ? "bg-indigo-600/95 border-indigo-400 text-white shadow-md shadow-indigo-900/30 font-black" 
                        : isToday 
                          ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-300 font-bold" 
                          : inCampaign 
                            ? "bg-slate-900/60 border-white/5 text-slate-300 hover:border-indigo-500/30" 
                            : "bg-black/30 border-white/2 opacity-40 text-slate-600"
                    }`}
                  >
                    {/* Day number & campaign indicator */}
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[11px] font-mono">{dayNum}</span>
                      {inCampaign && !isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Active Campaign Day" />
                      )}
                    </div>

                    {/* Micro Task visualizers inside the cell */}
                    {cellTasks.length > 0 && (
                      <div className="space-y-0.5 mt-auto w-full">
                        {/* Dot indicator system */}
                        <div className="flex flex-wrap gap-0.5 max-w-full">
                          {Array.from({ length: criticalCount }).map((_, i) => (
                            <span key={`crit-${i}`} className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-rose-500"}`} title="Critical Task" />
                          ))}
                          {Array.from({ length: highCount }).map((_, i) => (
                            <span key={`hi-${i}`} className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/80" : "bg-indigo-400"}`} title="High Task" />
                          ))}
                          {Array.from({ length: otherCount }).map((_, i) => (
                            <span key={`oth-${i}`} className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/50" : "bg-emerald-400"}`} title="Medium/Low Task" />
                          ))}
                        </div>
                        
                        {/* Compact text summary for large cells */}
                        <div className="hidden sm:block text-[8px] opacity-70 truncate font-mono text-[9px]">
                          {cellTasks.length} task{cellTasks.length > 1 ? "s" : ""}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* COLOR LEGENDS */}
            <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-[9.5px] font-mono text-slate-500 flex flex-wrap gap-x-5 gap-y-1 justify-center">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical priority</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> High priority</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Medium/Low priority</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Campaign boundaries</span>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-CONTRAST TIMELINE AGENDA */}
        <div className="xl:col-span-5 space-y-4">
          <div className="app-card p-5 rounded-xl space-y-4 shadow-lg min-h-[480px] flex flex-col justify-between">
            
            <div className="space-y-4 flex-1">
              {/* TOP AGENDA TITLE */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-400" /> Chronology Agenda View
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{selectedDateStr}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule Block
                </button>
              </div>

              {/* QUICK INLINE ADD BLOCK FORM */}
              {showAddForm && (
                <form onSubmit={handleAddNewTask} className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3 animate-fade-in text-xs">
                  <h4 className="font-bold text-slate-300 uppercase tracking-widest text-[10px]">Add Direct Checkpoint Block</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Checkpoint Objective</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Lead Proposal Pitch Block"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-slate-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Start Time</label>
                        <input 
                          type="time" 
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Duration</label>
                        <select 
                          value={newDuration} 
                          onChange={(e) => setNewDuration(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-[11px] text-slate-200"
                        >
                          <option value="20m">20 Min</option>
                          <option value="30m">30 Min</option>
                          <option value="60m">60 Min</option>
                          <option value="90m">90 Min</option>
                          <option value="120m">120 Min</option>
                          <option value="">None</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Priority</label>
                        <select 
                          value={newPriority} 
                          onChange={(e: any) => setNewPriority(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-[11px] text-slate-200"
                        >
                          <option value="critical">🔴 Critical</option>
                          <option value="high">🟣 High</option>
                          <option value="medium_low">🟢 Medium/Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-1 px-3 rounded text-[10px] cursor-pointer"
                    >
                      Verify & Add Checkpoint
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="bg-transparent border border-white/10 text-slate-400 p-1 px-3 rounded text-[10px] cursor-pointer"
                    >
                      Omit
                    </button>
                  </div>
                </form>
              )}

              {/* TIMELINE LIST */}
              <div className="space-y-3.5">
                {selectedDayTasks.length === 0 ? (
                  <div className="py-20 text-center opacity-70">
                    <CalendarDays className="w-8 h-8 text-slate-650 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chronological Clearance</p>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-1">
                      No registered checkpoints for this date. Use the Task Compiler tab or add custom blocks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 relative border-l border-white/5 pl-4 ml-2">
                    {selectedDayTasks.map((todo) => {
                      const isCritical = todo.priority === "critical";
                      const isHigh = todo.priority === "high";
                      const durationStr = estimateDuration(todo.taskText);

                      return (
                        <div 
                          key={todo.id}
                          className={`group flex items-start justify-between p-3.5 bg-black/40 border rounded-xl relative transition-all hover:bg-black/60 ${
                            todo.completed 
                              ? "border-emerald-500/10 text-slate-500 opacity-60" 
                              : isCritical 
                                ? "border-red-500/25 text-slate-200 shadow-sm" 
                                : isHigh 
                                  ? "border-indigo-500/25 text-slate-200" 
                                  : "border-white/5 text-slate-350"
                          }`}
                        >
                          {/* Left bullet connecting indicator */}
                          <div className={`absolute -left-[21.5px] top-4.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                            todo.completed 
                              ? "bg-slate-500" 
                              : isCritical 
                                ? "bg-rose-500 animate-pulse" 
                                : isHigh 
                                  ? "bg-indigo-400" 
                                  : "bg-emerald-400"
                          }`} />

                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            {/* Checkbox Trigger */}
                            <button
                              type="button"
                              onClick={() => toggleTodo(todo.id)}
                              className="mt-0.5 cursor-pointer text-slate-450 hover:text-indigo-400 shrink-0 select-none transition-colors"
                            >
                              {todo.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                              )}
                            </button>

                            <div className="space-y-1 min-w-0">
                              <p className={`text-xs font-semibold leading-relaxed truncate-3-lines ${todo.completed ? "line-through text-slate-550 font-medium" : "text-slate-200 font-bold"}`}>
                                {todo.taskText}
                              </p>

                              {/* TASK METADATA METERS */}
                              <div className="flex flex-wrap gap-2 items-center text-[9px] font-mono select-none">
                                <span className="text-indigo-300 font-black tracking-widest bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-500/10 flex items-center gap-1 shrink-0">
                                  <Clock className="w-2.5 h-2.5" /> START {todo.timeSlot}
                                </span>
                                
                                <span className="text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-white/2 flex items-center gap-1 shrink-0">
                                  <Hourglass className="w-2.5 h-2.5 text-slate-500" /> {durationStr} DURATION
                                </span>

                                <span className={`uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded ${
                                  isCritical 
                                    ? "bg-red-500/10 text-rose-400 border border-red-500/10" 
                                    : isHigh 
                                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10" 
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                }`}>
                                  {todo.priority}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                            title="Omit checkpoint block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER TOTAL METRIC COUNTS */}
            {selectedDayTasks.length > 0 && (
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Completed: {selectedDayTasks.filter(t => t.completed).length} / {selectedDayTasks.length} Blocks</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> Focus Integrity: {
                    Math.round((selectedDayTasks.filter(t => t.completed).length / selectedDayTasks.length) * 100)
                  }% Finished
                </span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
