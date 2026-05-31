import React, { useState, useEffect } from "react";
import { UserProfile, DailyLog, TodoItem } from "./types";
import { DEFAULT_USER, INITIAL_TODOS, INITIAL_LOG_HISTORY } from "./data";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  auth, 
  getFirebaseUserProfile, 
  setFirebaseUserProfile, 
  getFirebaseDailyLogs, 
  saveFirebaseDailyLog, 
  deleteFirebaseDailyLog, 
  getFirebaseTodoItems, 
  saveFirebaseTodoItem, 
  deleteFirebaseTodoItem 
} from "./lib/firebase";

// Sub-components
import DashboardTab from "./components/DashboardTab";
import TodoTab from "./components/TodoTab";
import GanttTab from "./components/GanttTab";
import TaskGeneratorTab from "./components/TaskGeneratorTab";
import CalendarTab from "./components/CalendarTab";
import PerformanceTab from "./components/PerformanceTab";
import BattlegroundTab from "./components/BattlegroundTab";
import AiAgentTab from "./components/AiAgentTab";
import DailyLogTab from "./components/DailyLogTab";
import SettingsTab from "./components/SettingsTab";
import ExperienceTab from "./components/ExperienceTab";
import TreeViewTab from "./components/TreeViewTab";

// Icons
import { 
  BarChart, 
  CheckCircle2, 
  Calendar, 
  CalendarDays,
  Flame, 
  ShieldAlert, 
  Terminal, 
  ListTodo, 
  Settings, 
  Menu, 
  X,
  Target,
  Sparkles,
  User as UserIcon,
  CloudLightning,
  CloudOff,
  BookOpen,
  GitFork
} from "lucide-react";

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated State Nodes
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Core State Holders
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("90d_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem("90d_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOG_HISTORY;
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem("90d_todos");
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  // Safe State Mutation Interceptors (Seamless Firebase Syncing)
  const handleUpdateUser = async (newValOrUpdater: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    setUser(prev => {
      const nextUser = typeof newValOrUpdater === 'function' ? newValOrUpdater(prev) : newValOrUpdater;
      // Mirror to localstorage
      localStorage.setItem("90d_user", JSON.stringify(nextUser));
      // Mirror to Firebase
      if (currentUser) {
        setFirebaseUserProfile(nextUser).catch(err => {
          console.error("Failed to sync profile updates:", err);
          setSyncError(err.message || "Failed to sync profile");
        });
      }
      return nextUser;
    });
  };

  const handleUpdateLogs = async (newValOrUpdater: DailyLog[] | ((prev: DailyLog[]) => DailyLog[])) => {
    setLogs(prev => {
      const nextLogs = typeof newValOrUpdater === 'function' ? newValOrUpdater(prev) : newValOrUpdater;
      // Mirror to localstorage
      localStorage.setItem("90d_logs", JSON.stringify(nextLogs));
      // Sync delta updates to Firestore
      if (currentUser) {
        const prevMap = new Map(prev.map(l => [l.id, l]));
        const nextMap = new Map(nextLogs.map(l => [l.id, l]));

        // Save additions/modifications
        for (const log of nextLogs) {
          const prevLog = prevMap.get(log.id);
          if (!prevLog || JSON.stringify(prevLog) !== JSON.stringify(log)) {
            saveFirebaseDailyLog(currentUser.uid, { ...log, userId: currentUser.uid }).catch(err => {
              console.error("Failed to save log:", err);
              setSyncError(err.message || "Failed to sync log");
            });
          }
        }

        // Handle deletions
        for (const log of prev) {
          if (!nextMap.has(log.id)) {
            deleteFirebaseDailyLog(currentUser.uid, log.id).catch(err => {
              console.error("Failed to delete log:", err);
              setSyncError(err.message || "Failed to delete log");
            });
          }
        }
      }
      return nextLogs;
    });
  };

  const handleUpdateTodos = async (newValOrUpdater: TodoItem[] | ((prev: TodoItem[]) => TodoItem[])) => {
    setTodos(prev => {
      const nextTodos = typeof newValOrUpdater === 'function' ? newValOrUpdater(prev) : newValOrUpdater;
      // Mirror to localstorage
      localStorage.setItem("90d_todos", JSON.stringify(nextTodos));
      // Sync delta updates to Firestore
      if (currentUser) {
        const prevMap = new Map(prev.map(t => [t.id, t]));
        const nextMap = new Map(nextTodos.map(t => [t.id, t]));

        // Save additions/modifications
        for (const todo of nextTodos) {
          const prevTodo = prevMap.get(todo.id);
          if (!prevTodo || JSON.stringify(prevTodo) !== JSON.stringify(todo)) {
            saveFirebaseTodoItem(currentUser.uid, { ...todo, userId: currentUser.uid }).catch(err => {
              console.error("Failed to save todo:", err);
              setSyncError(err.message || "Failed to sync todo");
            });
          }
        }

        // Handle deletions
        for (const todo of prev) {
          if (!nextMap.has(todo.id)) {
            deleteFirebaseTodoItem(currentUser.uid, todo.id).catch(err => {
              console.error("Failed to delete todo:", err);
              setSyncError(err.message || "Failed to delete todo");
            });
          }
        }
      }
      return nextTodos;
    });
  };

  // Firebase Real-time Watcher (Phase 4 Coordination)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          // 1. Sync User Profile
          let profile = await getFirebaseUserProfile(fbUser.uid);
          if (!profile) {
            // First time cloud user - populate with current local states
            profile = {
              userId: fbUser.uid,
              email: fbUser.email || "anonymous@shomoy.engine",
              displayName: fbUser.displayName || user.displayName || "Shomoy Roy",
              currentDay: user.currentDay,
              theme: user.theme,
              targetBdtIncome: user.targetBdtIncome,
              currentBdtIncome: user.currentBdtIncome,
            };
            await setFirebaseUserProfile(profile);
          }
          // Set state raw to bypass cyclic write triggers
          setUser(profile);

          // 2. Sync Daily Logs
          let cloudLogs = await getFirebaseDailyLogs(fbUser.uid);
          if (cloudLogs.length === 0) {
            // Document database is empty - transition user's local metrics data to cloud
            for (const log of logs) {
              await saveFirebaseDailyLog(fbUser.uid, { ...log, userId: fbUser.uid });
            }
            cloudLogs = logs.map(l => ({ ...l, userId: fbUser.uid }));
          }
          setLogs(cloudLogs);

          // 3. Sync Todo items
          let cloudTodos = await getFirebaseTodoItems(fbUser.uid);
          if (cloudTodos.length === 0) {
            // Document database is empty - transition user's current checklist tasks to cloud
            for (const todo of todos) {
              await saveFirebaseTodoItem(fbUser.uid, { ...todo, userId: fbUser.uid });
            }
            cloudTodos = todos.map(t => ({ ...t, userId: fbUser.uid }));
          }
          setTodos(cloudTodos);

        } catch (error: any) {
          console.error("Error synchronizing with Firestore:", error);
          setSyncError(error.message || "Firebase Sync Error");
        } finally {
          setIsSyncing(false);
        }
      } else {
        // Safe disconnection: revert back to local persistence
        const savedUser = localStorage.getItem("90d_user");
        const savedLogs = localStorage.getItem("90d_logs");
        const savedTodos = localStorage.getItem("90d_todos");
        
        setUser(savedUser ? JSON.parse(savedUser) : DEFAULT_USER);
        setLogs(savedLogs ? JSON.parse(savedLogs) : INITIAL_LOG_HISTORY);
        setTodos(savedTodos ? JSON.parse(savedTodos) : INITIAL_TODOS);
      }
    });

    return () => unsubscribe();
  }, [currentUser === null]);

  // Adjust document body theme class
  useEffect(() => {
    const bodyClassList = document.body.className.split(" ");
    const filteredClassList = bodyClassList.filter(c => !c.startsWith("theme-"));
    filteredClassList.push(`theme-${user.theme}`);
    document.body.className = filteredClassList.join(" ").trim();
  }, [user.theme]);

  // Factory reset command
  const handleFactoryReset = async () => {
    if (currentUser) {
      try {
        setIsSyncing(true);
        // Wipe cloud items
        for (const log of logs) {
          await deleteFirebaseDailyLog(currentUser.uid, log.id);
        }
        for (const todo of todos) {
          await deleteFirebaseTodoItem(currentUser.uid, todo.id);
        }
        // Initialize profile again
        const freshProfile = {
          ...DEFAULT_USER,
          userId: currentUser.uid,
          email: currentUser.email || "anonymous@shomoy.engine"
        };
        await setFirebaseUserProfile(freshProfile);
      } catch (err: any) {
        console.error("Failed to delete records from Firestore:", err);
      } finally {
        setIsSyncing(false);
      }
    }
    
    // Clear local storage baseline
    setUser(DEFAULT_USER);
    setLogs(INITIAL_LOG_HISTORY);
    setTodos(INITIAL_TODOS);
    setActiveTab("dashboard");
    localStorage.removeItem("90d_user");
    localStorage.removeItem("90d_logs");
    localStorage.removeItem("90d_todos");
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative font-sans leading-relaxed text-slate-200">
      
      {/* MOBILE HEADER RESPONSIVE TOGGLER */}
      <div className="md:hidden flex justify-between items-center bg-black/40 border-b border-white/5 p-4 z-50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">90D ENGINE</h2>
          <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 bg-white/5 px-2 py-0.5 rounded">V1.5</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-white p-1 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* GLOBAL CONTROL SIDEBAR NAVIGATION */}
      <aside 
        className={`w-full md:w-64 bg-black/30 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 shrink-0 transition-transform duration-300 z-40 md:sticky md:top-0 md:h-screen ${mobileMenuOpen ? "absolute top-[57px] left-0 right-0 bg-[#0d0d11]/95 text-white shadow-2xl h-[calc(100vh-57px)]" : "hidden md:flex"}`}
      >
        <div>
          {/* LOGO TITLE */}
          <div className="mb-7 text-center md:text-left select-none">
            <h2 
              className="text-lg font-black tracking-widest uppercase transition-colors"
              style={{ color: "var(--accent-primary, #6366f1)" }}
            >
              90D ENGINE
            </h2>
            <div className="flex items-center gap-1.5 mt-1 justify-center md:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] tracking-wider uppercase opacity-40 font-semibold text-slate-300">Shomoy Roy Terminal</p>
            </div>
          </div>

          {/* NAV LINKS DESK */}
          <nav className="space-y-1 font-sans">
            <button 
              onClick={() => navigateTo("dashboard")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "dashboard" ? "active" : "text-slate-400"}`}
            >
              <BarChart className="w-4 h-4 shrink-0" />
              <span>📊 Dashboard Hub</span>
            </button>

            <button 
              onClick={() => navigateTo("todo")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "todo" ? "active" : "text-slate-400"}`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>☑ To-Do List</span>
            </button>

            <button 
              onClick={() => navigateTo("taskgenerator")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "taskgenerator" ? "active" : "text-slate-400"}`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>✨ Task Compiler</span>
            </button>

            <button 
              onClick={() => navigateTo("calendar")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "calendar" ? "active" : "text-slate-400"}`}
            >
              <CalendarDays className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>📅 Calendar View</span>
            </button>

            <button 
              onClick={() => navigateTo("tree")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "tree" ? "active" : "text-slate-400"}`}
            >
              <GitFork className="w-4 h-4 shrink-0 text-amber-400" />
              <span>🌳 Checkpoints Tree</span>
            </button>

            <button 
              onClick={() => navigateTo("experience")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "experience" ? "active" : "text-slate-400"}`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>📖 My Experience</span>
            </button>

            <button 
              onClick={() => navigateTo("gantt")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "gantt" ? "active" : "text-slate-400"}`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>📅 Gantt Calendar</span>
            </button>

            <button 
              onClick={() => navigateTo("performance")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "performance" ? "active" : "text-slate-400"}`}
            >
              <Target className="w-4 h-4 shrink-0" />
              <span>📈 Performance KPIs</span>
            </button>

            <button 
              onClick={() => navigateTo("battleground")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "battleground" ? "active" : "text-slate-400"}`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>🔥 Battle Ground</span>
            </button>

            <button 
              onClick={() => navigateTo("aiagent")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "aiagent" ? "active" : "text-slate-400"}`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>🤖 AI Control Agent</span>
            </button>

            <button 
              onClick={() => navigateTo("dailylog")} 
              className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-3 ${activeTab === "dailylog" ? "active" : "text-slate-400"}`}
            >
              <ListTodo className="w-4 h-4 shrink-0" />
              <span>📝 Daily Focus Log</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM UTILITY REGION */}
        <div className="mt-8 pt-4 border-t border-white/5 space-y-2.5">
          <button 
            onClick={() => navigateTo("settings")} 
            className={`sidebar-btn w-full text-left px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 ${activeTab === "settings" ? "active" : "text-slate-400 hover:text-white"}`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span>⚙ Operational Settings</span>
          </button>

          {/* FIREBASE AUTH / SYNC COMPONENT IN SIDEBAR */}
          <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 text-[10.5px]">
            <div className="flex items-center justify-between pb-1 text-slate-400 font-mono">
              <span className="flex items-center gap-1 font-bold">
                {currentUser ? (
                  <>
                    <CloudLightning className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-bold uppercase">Cloud Synced</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3 h-3 text-slate-500" />
                    <span className="font-bold uppercase text-slate-500">Local Sandbox</span>
                  </>
                )}
              </span>
              {isSyncing && <span className="text-[9px] text-indigo-400 animate-spin">⟳</span>}
            </div>
            
            {currentUser ? (
              <div className="mt-1 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center font-bold text-slate-200 uppercase font-mono">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold truncate text-slate-200 text-[10px]">{currentUser.displayName || "Shomoy Roy"}</p>
                  <p className="text-[9px] opacity-55 truncate font-mono">{currentUser.email}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigateTo("settings")}
                className="w-full mt-1.5 py-1 text-center bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 rounded font-bold hover:bg-indigo-900/10 transition-colors cursor-pointer block uppercase tracking-wider text-[9px] font-mono"
              >
                Connect Cloud Sync
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* CORE WORKSPACE IFRAME EMBED FRAME */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full min-h-[calc(100vh-57px)] md:min-h-screen">
        
        {/* CURRENT TAB SELECTION DISPATCH ROUTING */}
        <div className="animate-fade-in duration-300">
          {activeTab === "dashboard" && (
            <DashboardTab 
              user={user} 
              logs={logs} 
              todos={todos}
              navigate={navigateTo} 
            />
          )}

          {activeTab === "todo" && (
            <TodoTab 
              todos={todos} 
              setTodos={handleUpdateTodos} 
            />
          )}

          {activeTab === "taskgenerator" && (
            <TaskGeneratorTab 
              user={user}
              logs={logs}
              todos={todos}
              setTodos={handleUpdateTodos}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarTab 
              user={user}
              todos={todos}
              setTodos={handleUpdateTodos}
            />
          )}

          {activeTab === "tree" && (
            <TreeViewTab 
              user={user}
              todos={todos}
              setTodos={handleUpdateTodos}
            />
          )}

          {activeTab === "experience" && (
            <ExperienceTab 
              user={user}
            />
          )}

          {activeTab === "gantt" && (
            <GanttTab 
              currentDay={user.currentDay} 
            />
          )}

          {activeTab === "performance" && (
            <PerformanceTab 
              user={user} 
              logs={logs} 
            />
          )}

          {activeTab === "battleground" && (
            <BattlegroundTab />
          )}

          {activeTab === "aiagent" && (
            <AiAgentTab 
              currentDay={user.currentDay} 
            />
          )}

          {activeTab === "dailylog" && (
            <DailyLogTab 
              logs={logs} 
              setLogs={handleUpdateLogs} 
              currentDay={user.currentDay} 
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab 
              user={user} 
              setUser={handleUpdateUser} 
              onFactoryReset={handleFactoryReset} 
              currentUser={currentUser}
              authLoading={authLoading}
              isSyncing={isSyncing}
              syncError={syncError}
            />
          )}
        </div>
      </main>
    </div>
  );
}
