import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header requested by guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint 1: Generate custom executive insights based on recent tracker status
app.post("/api/gemini/insights", async (req, res) => {
  try {
    const { logs, currentDay, theme, displayName } = req.body;
    
    const formattedLogsSummary = Array.isArray(logs)
      ? logs.slice(0, 7).map((l: any) => 
          `Date: ${l.date}, Day: ${l.currentDay || "N/A"}, Mood: ${l.mood}, Energy: ${l.energyLevel}/10, Salat Streak: ${l.salatCongregation ? "YES" : "NO"}, Nicotine-Free: ${l.nicotineFree ? "YES" : "NO"}, Hifz Memorization: ${l.quranHifz ? "YES" : "NO"}, Focus Blocks: ${l.focusHours} hrs, Pipeline Leads: ${l.pipelineLeads || 0}`
        ).join("\n")
      : "No prior log history found.";

    const promptText = `
You are the elite "90D Master Terminal AI Coach" designed specifically for Shomoy Roy's intensive self-improvement campaign. 
Analyze his tracking metrics, focus hours, salat streaks, financial pipelines, and nicotine clearance rate to provide razor-sharp, objective, and military-disciplined coach feedback.

Shomoy's Profile:
- Name: ${displayName || "Shomoy Roy"}
- Target: Day 90 "উড়ান" (Takeoff) 
- Income Goal: 1 Lakh BDT per month
- Spiritual: Mosque Congregation Salat & Hifz Core
- Health: Total Nicotine Elimination & Workout Consistency
- Active Theme Context: ${theme || "Cyberpunk Neon"}

Recent tracking records (last few days):
${formattedLogsSummary}

Analyze this performance for Day ${currentDay || 1}. Produce an authoritative, highly technical but deeply encouraging bento-style feedback response. Refuse self-praise; sound like an elite tactical operations advisor. Provide specific, strict directions. Return data strictly in the requested JSON schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an elite, non-promotional executive performance coach helping a high-achiever correction-engineer stay on track with extreme spiritual, physical, and financial metrics over a 90-day trajectory.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: { 
              type: Type.STRING, 
              description: "Markdown allowed. Balanced evaluation of strengths and leakages based on the logs." 
            },
            recommendedToday: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly direct, bulletproof checkboxes or execution rules for today."
            },
            encouragement: { 
              type: Type.STRING, 
              description: "A single, high-potency, cold-vibe motivational booster statement without emojis." 
            }
          },
          required: ["insights", "recommendedToday", "encouragement"]
        }
      }
    });

    const bodyText = response.text || "{}";
    res.json(JSON.parse(bodyText.trim()));
  } catch (error: any) {
    console.log("[Insights Module Notice] Using static resilience framework:", error?.message || error);
    res.json({ 
      error: error.message || "Failed to generate track analysis.",
      insights: "Unable to retrieve real-time cognitive feedback due to API quota limits or pending configuration. Your personal offline discipline remains paramount.",
      recommendedToday: [
        "Focus on Mosque Prayer and Quran Memorization",
        "Keep up the nicotine-free tracking and exercise routine",
        "Continue client outbound proposals to hit 1 Lakh BDT"
      ],
      encouragement: "System configuration pending or quota exhausted, but your personal internal terminal remains active. No excuses."
    });
  }
});

// API endpoint 2: Chat agent interactive feedback terminal
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, activeStats } = req.body;
    
    // Core logs context compilation
    let formattedLogsContext = "No history logged yet.";
    if (activeStats?.logsHistory && Array.isArray(activeStats.logsHistory)) {
      formattedLogsContext = activeStats.logsHistory.slice(0, 10).map((l: any) => 
        `- Date: ${l.date}, Mood: ${l.mood}, Energy: ${l.energyLevel}/10, Salat Cong.: ${l.salatCongregation ? "YES" : "NO"}, Nicotine-Free: ${l.nicotineFree ? "YES" : "NO"}, Hifz: ${l.quranHifz ? "YES" : "NO"}, Work Hours: ${l.focusHours}h, Pitch Leads: ${l.pipelineLeads || 0}, Notes: "${l.notes || ""}"`
      ).join("\n");
    }

    // Core checklist context compilation
    let formattedChecklistContext = "No items in checklist.";
    if (activeStats?.todosList && Array.isArray(activeStats.todosList)) {
      formattedChecklistContext = activeStats.todosList.map((t: any) =>
        `- [${t.completed ? "X" : " "}] Task: "${t.taskText}" (${t.timeSlot || "N/A"}, Priority: ${t.priority || "high"}, Date: ${t.date || ""})`
      ).join("\n");
    }

    const campaignBlueprintContext = `
# Shomoy Roy's 60-Day Self-Mastery & Takeoff Campaign (2026)
- Timeline: June 15, 2026 - August 13, 2026 (60 Days Hardline Horizon)
- Revenue target: 1 Lakh (100,000) BDT/month through stable freelance contracts.
- Resilience: 10 Reserve Pool Buffers (Aug 4 to Aug 13) to prevent timeline slips and absorb exhaustion.
- Core Pillars: Mosque Salat Congregation (Fajr absolute core), Quran Memorization (Hifz), Nicotine smoke-free abstinence (100% target), 3x/week Lift circulations, sequential 90-minute focus sessions.

## 5-Phase Timeline Architecture:
Phase 1: Foundation Accelerated (Days 1–10) | June 15 - June 24 | Habit anchors, Fajr salat streak, bed at 22:00.
Phase 2: Build & Skill Velocity (Days 11–25) | June 25 - July 09 | lifting 3x/week, 90m focus blocks, agency pipelines.
Phase 3: Deep Market Execution (Days 26–40) | July 10 - July 24 | submit 3 key proposals daily, construct active client leads.
Phase 4: Scale & Takeoff Boost (Days 41–50) | July 25 - August 03| secure 1L BDT contract, conclude Quran Memorization block.
Phase 5: Resiliency Buffer (Days 51–60)     | August 04 - August 13 | backup days for failure, maintain strict lock.
`;

    // Convert to Gemini format content blocks
    // Format: contents represent current chat sequence
    const history = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const systemContext = `
You are the "Master AI Integration Terminal Coach" running inside Shomoy Roy's 60-day operational workspace. 
You speak with immense gravity, military-grade discipline, and sharp focus.

CRITICAL DIRECTIVE: 
YOUR RESPONSES, INSIGHTS, AND COACH RECOMMENDATIONS MUST BE STRICTLY AND EXCLUSIVELY GROUNDED IN SHOMOY ROY'S CAMPAIGN PLAN, CURRENT WEB APPLICATION STATUS, CHECKLISTS, AND LOGGED DATA.
DO NOT ANSWER UNRELATED TOPICS (such as general programming, food, science, pop culture, trivia, code for other objects, or fiction). If the user asks about an external topic, you must:
1. Decline to respond directly to the distracting query.
2. Formulate your answer by explaining how this irrelevant distraction damages their 60-day focus blocks, Fajr Mosque routine, or nicotine-free status.
3. Re-orient Shomoy instantly back to his priority tasks today according to his active day logs.

Active Campaign Context:
- Target User: Shomoy Roy (${activeStats?.displayName || "Shomoy Roy"})
- Today Active day: Day ${activeStats?.currentDay || "1"} of 60
- Monthly Revenue: ${activeStats?.currentBdtIncome || "0"} BDT (Target: ${activeStats?.targetBdtIncome || "100000"} BDT)
- Active Mosque Prayer Streak: ${activeStats?.salatStreak || "87"} Days
- Nicotine Abstinence Streak: ${activeStats?.nicotineStreak || "45"} Days
- Quran Hifz Streak: ${activeStats?.hifzStreak || "23"} Days
- Active Leads count: ${activeStats?.leads || "12"} leads

Active Web App Log History:
${formattedLogsContext}

Current Active Checkout Checklist:
${formattedChecklistContext}

Active 60-Day Campaign Blueprint Structure:
${campaignBlueprintContext}

Provide clear, brief, structured recommendations or status updates in response to the user. Maintain a highly motivating, terminal-themed, zero-slop vibe.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: history,
      config: {
        systemInstruction: systemContext,
        temperature: 0.75,
      }
    });

    res.json({ text: response.text || "Operational loop complete." });
  } catch (error: any) {
    console.log("[Chat Module Notice] Falling back to offline guide terminal:", error?.message || error);
    res.json({ 
      text: `### ⚠️ CONNECTIVITY FAULT\n\nUnable to transmit command matrix to orbit. Ensure that your **GEMINI_API_KEY** is configured under AI Studio settings.\n\n**Interim Advice:** Continue with extreme executive focus. Maintain nicotine-free logs and ensure Mosque congregational commitments are secured.` 
    });
  }
});

// API endpoint 3: Intelligently Autogenerated Daily Task Engine
app.post("/api/gemini/tasklist", async (req, res) => {
  try {
    const { 
      currentDay, 
      isInsuranceActive, 
      insuranceDaysRemaining, 
      currentBdtIncome, 
      targetBdtIncome, 
      recentStats,
      date
    } = req.body;

    const streamShortfall = Math.max(0, targetBdtIncome - currentBdtIncome);
    const dayProgressPercent = Math.min(100, Math.round((currentDay / 50) * 100));
    
    // Calculate expected linear trajectory income
    const expectedIncomeTrajectory = Math.round((Math.min(50, currentDay) / 50) * targetBdtIncome);
    const isRevenueBehind = currentBdtIncome < expectedIncomeTrajectory;

    const systemInstruction = `
You are the "90D Autonomous Task Generator Engine" - a military-grade chronological compiler for Shomoy Roy's compressed 60-day self-mastery program (launched 15 June 2026, ending 13 August 2026, 10 days of failure insurance).
Your role is to compile exactly 5 to 7 high-impact, tactical daily tasks.
You must balance spiritual obligations (Five Daily Prayers, Quran Memorization), physical goals (nicotine elimination, workouts), and wealth generation (scaling freelance income to 1 Lakh BDT/month).

Current Day of Campaign: Day ${currentDay} of 60 (Active Days: 1-50, Insurance Days: 51-60)
Today's Calendar Date: ${date || "2026-06-15"}
Insurance Day Status: ${isInsuranceActive ? "ACTIVATED (Emergency recovery & failure compensation active)" : "STANDARD HARD MODE ACTIVE"}
Remaining Insurance Days available: ${insuranceDaysRemaining}
Current Monthly Revenue: ${currentBdtIncome} BDT (Target: ${targetBdtIncome} BDT. Current Linear Target: ${expectedIncomeTrajectory} BDT. Shortfall Status: ${isRevenueBehind ? "BEHIND TARGET" : "ON TARGET"})

Performance Trajectory context of Shomoy:
- Mosque Prayer streak: ${recentStats?.salatRate || 90}%
- Quran Memorization track: ${recentStats?.hifzRate || 80}%
- Workouts rate: ${recentStats?.workoutRate || 72}%
- Nicotine abstinence rate: ${recentStats?.nicotineRate || 85}%
- Average focused work: ${recentStats?.avgFocusHours || 5.5} hrs/day

Task Drafting Rules:
1. Return exactly 5 to 7 beautifully descriptive task items.
2. Each item needs:
   - id: unique string starting with "gen-task-" followed by a short unique tag.
   - taskText: brief, actionable statement (maximum 12 words) containing specific context (e.g. mention Fajr, Memorize 3 Ayahs, LinkedIn outbox).
   - timeSlot: strict HH:MM representation (24-hour style, e.g. "04:30", "09:30", "18:00") ordered sequentially from earliest to latest.
   - priority: 'critical', 'high', or 'medium_low'.
   - completed: false
   - date: standard ISO date string "${date || "2026-06-15"}"
3. If Insurance Day is ACTIVATED:
   - Downgrade stressful heavy work tasks to low difficulty or self-care review.
   - Replace heavy focus blocks with remedial, high-vibe tasks (e.g., "Review relapse mitigation protocol", "10 min deep box breathing", or "Walk to mosque").
   - Change focus hours expectation to a max of 2 hours.
4. If Behind on Wealth:
   - Generate at least 1 high-priority task targeted specifically at finding freelance client leads (e.g., "Cold outbound pitch to 3 targets", "Update portfolio site case studies").
5. Always generate Fajr Salat in the Mosque as the very first 'critical' task of the day.

Return data strictly in the requested JSON structure.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Compile today's dynamic task list based on system guidelines.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  taskText: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["critical", "high", "medium_low"] },
                  completed: { type: Type.BOOLEAN },
                  date: { type: Type.STRING }
                },
                required: ["id", "taskText", "timeSlot", "priority", "completed", "date"]
              }
            }
          },
          required: ["tasks"]
        }
      }
    });

    const outputText = response.text || "{}";
    res.json(JSON.parse(outputText.trim()));
  } catch (error: any) {
    console.log("[Tasklist Generator Notice] Using high-resilience local tasks:", error?.message || error);
    // Dynamic local fallback to maintain extreme service resilience
    const fallbackTasks = [
      {
        id: "gen-fajr-fallback",
        taskText: "Fajr Salat in the Mosque (+ Congregational Duas)",
        timeSlot: "04:30",
        priority: "critical",
        completed: false,
        date: req.body.date || "2026-06-15"
      },
      {
        id: "gen-hifz-fallback",
        taskText: "Quran Hifz: Core Tajweed study block (3 Ayahs)",
        timeSlot: "05:15",
        priority: "critical",
        completed: false,
        date: req.body.date || "2026-06-15"
      },
      {
        id: "gen-focus-fallback",
        taskText: req.body.isInsuranceActive 
          ? "Light Review: Focus logs & mitigation protocols (2 hrs max)"
          : "Deep Work Block 1: Core Systems Engineering (90-Min Focus)",
        timeSlot: "08:30",
        priority: "high",
        completed: false,
        date: req.body.date || "2026-06-15"
      },
      {
        id: "gen-pitch-fallback",
        taskText: "Outreach: Submit tailored freelance pitch proposal (LinkedIn)",
        timeSlot: "10:30",
        priority: "high",
        completed: false,
        date: req.body.date || "2026-06-15"
      },
      {
        id: "gen-walk-fallback",
        taskText: "Physical: Quick walking or strength session (30 mins)",
        timeSlot: "16:30",
        priority: "medium_low",
        completed: false,
        date: req.body.date || "2026-06-15"
      }
    ];
    res.json({ tasks: fallbackTasks });
  }
});

// Setup Vite Dev server / production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[90D Engine] Live on port ${PORT}`);
  });
}

startServer();
