import React, { useState } from "react";
import { 
  BookOpen, 
  Copy, 
  Download, 
  Check, 
  FileText, 
  Info, 
  ChevronRight,
  Lightbulb,
  Cpu,
  Trophy,
  Activity,
  UserCheck
} from "lucide-react";
import { UserProfile } from "../types";

interface ExperienceTabProps {
  user: UserProfile;
}

export default function ExperienceTab({ user }: ExperienceTabProps) {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"preview" | "raw">("preview");

  const markdownContent = `# Shomoy Roy's 60-Day Self-Mastery & Takeoff Campaign (2026)
> Compiled & Synthesized by AI Terminal Integration Agent
> Timeline: June 15, 2026 - August 13, 2026 (60 Days Hardline Horizon)

---

## 1. Executive Summary & Strategy Map
This campaign is a compressed, high-fidelity progression designed to transition Shomoy Roy from foundational routine building into heavy freelance monetization and spiritual solidification. By integrating deep cognitive automation (Gemini model feedback), we maintain constant trajectory tracking.

### Campaign Structure
*   **Total Span:** 60 calendar days
*   **Active Performance Blocks:** 50 days (Phase 1–4)
*   **Resiliency Insurance Pool:** 10 days (Phase 5)
*   **Constant Target Target date:** August 13, 2026
*   **Revenue Anchor:** 100,000 BDT/month (Solidified Freelance Income)

---

## 2. Dynamic 5-Phase Technical Pipeline
To prevent burnout and standard burnout failure queues, the campaign is divided into five rigorous, sequential chronological phases:

### Phase 1: Foundation Accelerated (Days 1–10)
*   **Dates:** June 15 - June 24, 2026
*   **Focus:** Core biology reset & habit anchoring.
*   **Key Controls:** Bedtime hardlocked at 22:00, Nicotine Replacement Therapy (NRT) deployment, daily walking progression, mosque salat streak consolidation.

### Phase 2: Build & Skill Velocity (Days 11–25)
*   **Dates:** June 25 - July 09, 2026
*   **Focus:** Hard physical strength circuits & core system coding.
*   **Key Controls:** 3x/week lifting sessions, sequential 90-minute focus blocks, creation of freelance portfolios and outbound client matrices.
*   *Milestone 1:* Day 25 "নতুন ভোর" (New Dawn) — Prep blocks clearance.

### Phase 3: Deep Market Execution (Days 26–40)
*   **Dates:** July 10 - July 24, 2026
*   **Focus:** Client pipeline expansion & high-volume work blocks.
*   **Key Controls:** Submit 3 key outbound pitches daily.
*   *Milestone 2:* Day 40 "নির্মাণ" (Construction) — Active leads running on Upwork & LinkedIn.

### Phase 4: Scale & Takeoff Boost (Days 41–50)
*   **Dates:** July 25 - August 03, 2026
*   **Focus:** Wealth integration & spiritual closure.
*   **Key Controls:** Transitioning pipeline leads into high BDT retention contracts, completing Quran Hifz milestone block.
*   *Milestone 3:* Day 50 "উড়ান" (Takeoff) — 1 Lakh BDT/month contract target secured.

### Phase 5: Resiliency & Failure Insurance Pool (Days 51–60)
*   **Dates:** August 04 - August 13, 2026
*   **Focus:** Timeline buffer and failure compensation.
*   **Key Controls:** 10 reserve slots to absorb system exhaustion, heavy distraction block mitigation, and project lock protection.

---

## 3. High-Value Action Items & Routines
The baseline engine expects a daily adherence standard:
1.  **Mosque Prayer Streak (Salat rate: >90%):** Start the day with Fajr salat in the congregation, capturing early cognitive morning momentum.
2.  **Quran Memorization (Hifz rate: >80%):** Post-Fajr memorization block of 3 ayahs with active tajweed validation.
3.  **Physical Recovery (Workout rate: >72%):** Evening strength circulation or yoga stretch blocks.
4.  **Habit Purity (Nicotine abstinence: 100%):** Multi-tiered relapse mitigation triggers replacing smoking cues.

---

## 4. Tactical Relapse Mitigation Protocols
To address acute failure triggers, specialized protocol scripts are pre-loaded:
*   **Task Paralysis:** Deploy the 2-minute physical initiation rule (close all browsers, write one functional sentence).
*   **Nicotine Cravings:** Engage the 5-minute deep box breathing sequence + cold water saturation.
*   **Spiritual Lethargy:** Auto-walk to the nearest mosque instantly without phone hardware.
*   **Financial Stagnation:** Force 5 high-value custom outbounds within 45 minutes of stagnation sensing.

---

## 5. Architectural Implementation Overview
This system is constructed with a modern full-stack TypeScript architecture:
*   **Frontend engine:** React 19 + Tailwind CSS for high-fidelity dark-mode user telemetry.
*   **State & Sync:** Redundant offline storage (LocalState) mapped beautifully to real-time client-side synchronization with Firestore.
*   **Cognitive Generator:** Implemented custom Gemini 3.5 Flash server routes to compile daily tasks dynamically based on user habit profiles.

---
*Document Authenticated under Master Encryption Protocols • Terminal Shomoy Roy 2026*`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([markdownContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = "shomoy_roy_60day_campaign.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6" id="experience-tab-container">
      {/* HEADER ROW */}
      <header className="border-b border-white/5 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2 text-indigo-300">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Operational Blueprint & Strategic Insights
          </h1>
          <p className="text-xs text-slate-400">
            A comprehensive, high-density reference overview of Shomoy Roy's 60-day self-mastery program.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "preview" ? "raw" : "preview")}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 hover:bg-black/60 transition-all text-xs font-mono font-bold text-slate-305 cursor-pointer"
          >
            {mode === "preview" ? "View Raw Markdown" : "View Readme Panel"}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-500 transition-all text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer font-sans"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Markdown
              </>
            )}
          </button>

          <button
            onClick={downloadMarkdown}
            className="px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-950/30 hover:bg-indigo-900/30 transition-all text-[11px] font-bold text-indigo-300 flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Download className="w-3.5 h-3.5" /> Download .md File
          </button>
        </div>
      </header>

      {/* THREE BENTO CARDS REGARDING COGNITIVE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="app-card p-4 rounded-xl flex items-center gap-3 border-l-2 border-indigo-500">
          <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500">Cognitive Orchestration</h4>
            <p className="text-xs font-bold text-slate-300">Gemini-Powered Directive Synthesis</p>
          </div>
        </div>

        <div className="app-card p-4 rounded-xl flex items-center gap-3 border-l-2 border-amber-500">
          <div className="p-2 rounded bg-amber-500/10 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500">Tactical Milestones</h4>
            <p className="text-xs font-bold text-slate-300">3 Key Progressive Horizon Thresholds</p>
          </div>
        </div>

        <div className="app-card p-4 rounded-xl flex items-center gap-3 border-l-2 border-emerald-500">
          <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
            <Activity className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500">Resiliency Level</h4>
            <p className="text-xs font-bold text-slate-300">10-Day Safe Fail-safe Insurance Vault</p>
          </div>
        </div>
      </div>

      {mode === "raw" ? (
        /* RAW MARKDOWN MODE */
        <div className="app-card p-6 rounded-xl font-mono text-xs text-slate-300 bg-slate-950 border border-white/5 space-y-4">
          <div className="flex justify-between items-center bg-black/40 p-2.5 rounded border border-white/5 text-[10px] select-none text-slate-400">
            <span>FILE: /workspace/shomoy_roy_60day_campaign.md</span>
            <span className="text-indigo-400 font-bold uppercase">Ready for save</span>
          </div>
          <textarea
            readOnly
            value={markdownContent}
            className="w-full h-96 bg-transparent border-0 focus:ring-0 text-slate-200 outline-none font-mono resize-none leading-relaxed"
          />
        </div>
      ) : (
        /* FORMATTED PREVIEW MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
          
          {/* SIDE SPECIFICATION CARD */}
          <div className="lg:col-span-4 space-y-4 font-sans">
            <div className="app-card p-5 rounded-xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Info className="w-4 h-4 text-indigo-400" /> Terminal Metadata
              </h3>
              
              <div className="space-y-3 font-mono text-[11px] text-slate-400">
                <div className="flex justify-between p-1.5 border-b border-white/2">
                  <span>Owner Node:</span>
                  <span className="text-slate-200 font-bold">Shomoy Roy</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-white/2">
                  <span>Email Coordinate:</span>
                  <span className="text-slate-200 truncate font-semibold">shomoyroy18@gmail.com</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-white/2">
                  <span>Campaign Length:</span>
                  <span className="text-slate-200 font-bold">60 Calendar Days</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-white/2">
                  <span>Active Block:</span>
                  <span className="text-slate-200 font-bold">50 Performance Days</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-white/2">
                  <span>Resiliency Pool:</span>
                  <span className="text-rose-400 font-bold">10 Buffer Days</span>
                </div>
                <div className="flex justify-between p-1.5 border-b border-white/2">
                  <span>Revenue Objective:</span>
                  <span className="text-emerald-400 font-black">1 Lakh BDT/Month</span>
                </div>
                <div className="flex justify-between p-1.5">
                  <span>Target Date End:</span>
                  <span className="text-indigo-300 font-bold">August 13, 2026</span>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/10 p-3 rounded text-xs text-indigo-300 space-y-1">
                <span className="font-bold flex items-center gap-1 uppercase tracking-wider text-[10px] text-indigo-400">
                  <UserCheck className="w-3.5 h-3.5" /> Compiler Insight
                </span>
                <p className="leading-snug">
                  This blueprint merges psychological habit resets with strict freelance lead metrics. Failing triggers do not slide the timeline; they draw from the Failsafe pool.
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="app-card p-5 rounded-xl space-y-3">
              <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Cognitive Lessons
              </h4>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 leading-normal">
                <li><b>Never skip Fajr in Mosque:</b> High-achievement momentum depends strictly on setting early mornings correctly.</li>
                <li><b>No Nicotine Bargains:</b> 100% abstinence is simpler to manage than controlled usage.</li>
                <li><b>Linear Income Trace:</b> Freelancing requires daily outreach consistency, not short intense bursts.</li>
              </ul>
            </div>
          </div>

          {/* MAIN BLUEPRINT VIEW */}
          <div className="lg:col-span-8 app-card p-6 md:p-8 rounded-xl space-y-6 font-sans">
            
            {/* INTRO */}
            <div className="border-b border-white/5 pb-4 space-y-2">
              <span className="text-[9.5px] uppercase font-mono font-black tracking-widest text-indigo-400 bg-indigo-950/30 p-1 px-3 rounded-full border border-indigo-500/20">
                ACTIVE BLUEPRINT REPLICANT
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-tight pt-1">
                60-DAY SELF-MASTERY & CRITICAL TAKEOFF PROGRAM
              </h2>
              <p className="text-xs text-slate-400">
                A strategic manual created dynamically to outline rules, milestones, parameters, and failure mitigation strategies.
              </p>
            </div>

            {/* SECTIONS */}
            <div className="space-y-6 text-xs text-slate-300">
              
              {/* SECTION 1 */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5 font-mono">
                  <ChevronRight className="w-4 h-4 text-indigo-405 shrink-0" /> [01] Strategic Milestones Horizon
                </h3>
                <p className="leading-relaxed text-slate-400 pl-5">
                  The program establishes 3 key transitional points during the 50-day active sprint to measure your actual baseline transformation:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pl-5 pt-1.5">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="font-mono text-[9px] font-bold text-indigo-400 block">MILESTONE 1 (DAY 25)</span>
                    <span className="text-xs font-extrabold text-slate-200 block">"নতুন ভোর" (New Dawn)</span>
                    <p className="text-[10px] text-slate-400 leading-snug">Foundation habit alignment and physical baseline validation complete.</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="font-mono text-[9px] font-bold text-cyan-400 block">MILESTONE 2 (DAY 40)</span>
                    <span className="text-xs font-extrabold text-slate-200 block">"নির্মাণ" (Construction)</span>
                    <p className="text-[10px] text-slate-400 leading-snug">Portfolio infrastructure is launched, leads collection system online.</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="font-mono text-[9px] font-bold text-emerald-400 block">MILESTONE 3 (DAY 50)</span>
                    <span className="text-xs font-extrabold text-slate-200 block">"উড়ান" (Takeoff)</span>
                    <p className="text-[10px] text-slate-400 leading-snug">1 Lakh BDT/month active freelance earnings target pipeline secured.</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5 font-mono">
                  <ChevronRight className="w-4 h-4 text-indigo-405 shrink-0" /> [02] Dynamic Micro Habits Matrix
                </h3>
                <p className="leading-relaxed text-slate-400 pl-5">
                  Your daily checklist enforces physical, routine, spiritual, and professional goals simultaneously to bypass stagnation queues:
                </p>
                <div className="pl-5 space-y-2 pt-1 font-mono text-[10.5px]">
                  <div className="flex items-start gap-2 bg-slate-905 p-2 rounded border-l-2 border-orange-500">
                    <span className="text-orange-400 font-bold">DEEN:</span>
                    <span className="text-slate-350">Mosque prayer streak (specifically congregational Fajr) + Post-prayer 3-vers Quran memorization.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-905 p-2 rounded border-l-2 border-purple-500">
                    <span className="text-purple-400 font-bold">HEALTH:</span>
                    <span className="text-slate-350">Nicotine-free maintenance combined with evening physical workout sessions 3 times a week.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-905 p-2 rounded border-l-2 border-emerald-500">
                    <span className="text-emerald-400 font-bold">WEALTH:</span>
                    <span className="text-slate-350">Maintaining consecutive 90-minute focus sessions to pitch lead proposals on LinkedIn & Upwork.</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3 */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5 font-mono">
                  <ChevronRight className="w-4 h-4 text-indigo-405 shrink-0" /> [03] Tactical Relapse Mitigation & Failsafe pool
                </h3>
                <p className="leading-relaxed text-slate-400 pl-5">
                  Traditional programs fail when a bad week causes absolute burnout. Our system bypasses this by introducing a **10-Day Safe Vault Failure Protection Pool**. Accessing this reserves scales down task targets to focus on restorative breathing and recovery rituals while maintaining the constant end date of **August 13, 2026**.
                </p>
              </div>

              {/* FOOTER */}
              <div className="bg-slate-900/30 p-3.5 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500">
                <span>Compiler Hash Key: MD5_SHOMOY60D_SECURED</span>
                <span>Document Version: V2.1 TS-COMPILED</span>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
