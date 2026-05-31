import React, { useState, useRef, useEffect } from "react";
import { AIMessage } from "../types";
import { Terminal, Send, ShieldAlert, Cpu, Sparkles, Loader2, ArrowRight } from "lucide-react";

interface AiAgentTabProps {
  currentDay: number;
}

export default function AiAgentTab({ currentDay }: AiAgentTabProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: "model",
      text: "### SYSTEM ONLINE • COGNITIVE RECOVERY CORE LIVE\n\nWelcome, Shomoy Roy. I am your 90D operational advisor. I monitor the Mosque streak, nicotine parameters, Hifz Quran, and client pipelines.\n\nType your query or transmit an executive update to adjust your focus blocks.",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [userMsg, setUserMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const currentMsg = userMsg;
    setUserMsg("");

    const timestamp = new Date().toLocaleTimeString();
    const newUserMessage: AIMessage = {
      role: "user",
      text: currentMsg,
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          activeStats: {
            currentDay,
            salatStreak: 87,
            nicotineStreak: 45,
            hifzStreak: 23,
            leads: 12
          }
        }),
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev, 
        {
          role: "model",
          text: data.text || "Diagnostic cycle executed perfectly.",
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "### ⚠️ TRANSMISSION FAULT\nUnable to reach executive AI core. Please check your **Secrets configuration** or retry inside the terminal node.",
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="aiagent-tab-container">
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" /> Operational Control AI Agent
        </h1>
        <p className="text-xs text-slate-400">
          Executive advice console • High-frequency context tuning
        </p>
      </header>

      {/* UNIX TERMINAL SCREEN CONTAINER */}
      <div className="app-card rounded-xl border border-white/10 overflow-hidden flex flex-col h-[550px] shadow-20xl">
        {/* Terminal Header */}
        <div className="bg-black/40 border-b border-white/5 px-4 py-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="font-mono text-slate-400 ml-2 select-none">shomoy_roy@master-terminal:~</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
            <Cpu className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>NODE ACTIVE</span>
          </div>
        </div>

        {/* Console logs output */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs bg-slate-950/20" ref={scrollRef}>
          {messages.map((m, idx) => {
            const isModel = m.role === "model";
            return (
              <div 
                key={idx} 
                className={`flex flex-col space-y-1 ${isModel ? "bg-indigo-950/10 border border-indigo-500/5 p-3 rounded-lg text-slate-300" : "text-white pl-2"}`}
              >
                <div className="flex justify-between items-center text-[10px] opacity-40 select-none border-b border-white/5 pb-1 mb-1">
                  <span className="font-bold">{isModel ? "🛰️ AI COACH CORE" : "👤 EXTREME CORRECTOR (SHOMOY)"}</span>
                  <span>{m.timestamp}</span>
                </div>
                {/* Text Block and formatting */}
                <div className="whitespace-pre-wrap leading-relaxed select-all">
                  {m.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-indigo-400 italic animate-pulse pl-2 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Model analyzing trajectory matrices...</span>
            </div>
          )}
        </div>

        {/* Input prompt entry line */}
        <form onSubmit={handleSubmit} className="p-3 bg-black/60 border-t border-white/5 flex gap-2">
          <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-lg px-3 focus-within:border-[var(--accent-primary)]">
            <span className="text-emerald-400 font-bold select-none font-mono text-xs mr-2">$</span>
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Ask for advice, input relapse reports, or command a habit check..."
              value={userMsg}
              onChange={e => setUserMsg(e.target.value)}
              className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none focus:ring-0 placeholder:text-slate-600 font-mono py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-40"
          >
            Transmit <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* QUICK SUGGESTION LINKS CONTROL DECK */}
      <div className="app-card p-4 rounded-xl space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Presets Terminal Commands
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <button 
            onClick={() => setUserMsg("Review my Salat and Quran consistency block today. What leaks do you notice?")}
            className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer text-left transition-all"
          >
            Review spiritual integrity
          </button>
          <button 
            onClick={() => setUserMsg("How do I stay absolutely tobacco/nicotine-free in high-intensity software launch cycles?")}
            className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer text-left transition-all"
          >
            Master tobacco abstinence
          </button>
          <button 
            onClick={() => setUserMsg("Analyze my pipeline numbers. I want to scale core income. Give me 3 Upwork/client outreach guidelines.")}
            className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer text-left transition-all"
          >
            Pillar 3: Growth strategy
          </button>
        </div>
      </div>
    </div>
  );
}
