import React, { useState } from "react";
import { TodoItem, PriorityType } from "../types";
import { Plus, Trash2, Calendar, AlertTriangle, Zap, CheckCircle2, Circle } from "lucide-react";

interface TodoTabProps {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

export default function TodoTab({ todos, setTodos }: TodoTabProps) {
  const [taskText, setTaskText] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [priority, setPriority] = useState<PriorityType>("critical");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTodo: TodoItem = {
      id: "todo-" + Date.now(),
      userId: "shomoy_roy",
      taskText: taskText.trim(),
      timeSlot: timeSlot.trim() || "--:--",
      priority: priority,
      completed: false,
      date: new Date().toISOString().split("T")[0],
    };

    setTodos(prev => [newTodo, ...prev]);
    setTaskText("");
    setTimeSlot("");
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const criticalTasks = todos.filter(t => t.priority === "critical");
  const highTasks = todos.filter(t => t.priority === "high");
  const mediumLowTasks = todos.filter(t => t.priority === "medium_low");

  return (
    <div className="space-y-6" id="todo-tab-container">
      <header className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Task Execution Framework
          </h1>
          <p className="text-xs text-slate-400">
            Automated prioritizing metrics engine • Filtered by Node: [Today]
          </p>
        </div>
      </header>

      {/* QUICK INJECTION BAR */}
      <form onSubmit={handleAddTodo} className="app-card p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Task Description</label>
          <input
            type="text"
            required
            placeholder="e.g. Mosque Salat / Memorize Quran blocks..."
            value={taskText}
            onChange={e => setTaskText(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent-primary)] text-slate-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Time Slot (e.g. 05:00)</label>
          <input
            type="text"
            placeholder="05:00 or Fajr"
            value={timeSlot}
            onChange={e => setTimeSlot(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent-primary)] text-slate-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">System Priority</label>
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as PriorityType)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-[var(--accent-primary)] text-slate-200"
            >
              <option value="critical">🚨 Critical (Do First)</option>
              <option value="high">⚡ High (Important)</option>
              <option value="medium_low">💤 Medium / Low</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 font-bold px-4 rounded-lg flex items-center justify-center text-white cursor-pointer transition-all shrink-0 aspect-square"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* THREE PRIORITIZED LANES */}
      <div className="space-y-4">
        {/* CRITICAL */}
        <div className="app-card p-4 rounded-xl border-l-4 border-rose-500 space-y-3 shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> CRITICAL PRIORITIES (DO FIRST)
            </h3>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono font-bold">
              {criticalTasks.filter(c => c.completed).length} / {criticalTasks.length} Completed
            </span>
          </div>
          
          <div className="space-y-2">
            {criticalTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical tasks remaining. Excellent work.</p>
            ) : (
              criticalTasks.map(todo => (
                <div 
                  key={todo.id} 
                  className={`flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5 transition-all text-xs hover:bg-black/30 ${todo.completed ? 'opacity-50' : ''}`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 select-none pr-4">
                    <button 
                      type="button" 
                      onClick={() => toggleTodo(todo.id)} 
                      className="text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
                    >
                      {todo.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={todo.completed ? "line-through text-slate-550" : "text-slate-100"}>
                      <b className="text-rose-400/90 font-mono text-[11px] mr-2">[{todo.timeSlot}]</b>
                      {todo.taskText}
                    </span>
                  </label>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-500 hover:text-rose-500 cursor-pointer p-1 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HIGH */}
        <div className="app-card p-4 rounded-xl border-l-4 border-amber-500 space-y-3 shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> HIGH PRIORITIES (IMPORTANT)
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
              {highTasks.filter(c => c.completed).length} / {highTasks.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {highTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No tasks in this category.</p>
            ) : (
              highTasks.map(todo => (
                <div 
                  key={todo.id} 
                  className={`flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5 transition-all text-xs hover:bg-black/30 ${todo.completed ? 'opacity-50' : ''}`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 select-none pr-4">
                    <button 
                      type="button" 
                      onClick={() => toggleTodo(todo.id)} 
                      className="text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
                    >
                      {todo.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={todo.completed ? "line-through text-slate-550" : "text-slate-100"}>
                      <b className="text-amber-400 font-mono text-[11px] mr-2">[{todo.timeSlot}]</b>
                      {todo.taskText}
                    </span>
                  </label>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-500 hover:text-rose-500 cursor-pointer p-1 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MEDIUM / LOW */}
        <div className="app-card p-4 rounded-xl border-l-4 border-blue-500 space-y-3 shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> MEDIUM & LOW TASKS (ROUTINES)
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">
              {mediumLowTasks.filter(c => c.completed).length} / {mediumLowTasks.length} Completed
            </span>
          </div>

          <div className="space-y-2">
            {mediumLowTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No routine chores scheduled.</p>
            ) : (
              mediumLowTasks.map(todo => (
                <div 
                  key={todo.id} 
                  className={`flex items-center justify-between bg-black/20 p-2.5 rounded border border-white/5 transition-all text-xs hover:bg-black/30 ${todo.completed ? 'opacity-50' : ''}`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 select-none pr-4">
                    <button 
                      type="button" 
                      onClick={() => toggleTodo(todo.id)} 
                      className="text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
                    >
                      {todo.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={todo.completed ? "line-through text-slate-550" : "text-slate-100"}>
                      <b className="text-blue-400 font-mono text-[11px] mr-2">[{todo.timeSlot}]</b>
                      {todo.taskText}
                    </span>
                  </label>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-500 hover:text-rose-500 cursor-pointer p-1 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
