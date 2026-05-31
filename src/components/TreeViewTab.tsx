import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GitCommit, 
  GitFork, 
  GitMerge, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle, 
  Circle, 
  Search,
  Filter,
  Layers,
  Activity,
  Award,
  Hourglass,
  ListTodo,
  HelpCircle,
  HelpCircle as NodeConnector,
  Lock,
  Unlock,
  CornerDownRight,
  AlertTriangle,
  Link,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { UserProfile, TodoItem } from "../types";

interface TreeViewTabProps {
  user: UserProfile;
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
}

interface TreeNode {
  id: string;
  label: string;
  type: "root" | "phase" | "goal" | "task";
  startDate?: string;
  endDate?: string;
  duration?: string;
  priority?: "critical" | "high" | "medium_low";
  timeSlot?: string;
  associatedTodoId?: string;
  children?: TreeNode[];
  completed?: boolean;
  blockedBy?: string[];
}

export default function TreeViewTab({ user, todos, setTodos }: TreeViewTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "campaign-root": true,
    "phase-1": true,
    "phase-2": true,
    "phase-3": true,
    "phase-4": true,
    "phase-5": true,
  });

  // Toggle node expansion
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Expand all / Collapse all helper
  const setAllExpansion = (expand: boolean) => {
    const list = [
      "campaign-root", "phase-1", "phase-2", "phase-3", "phase-4", "phase-5",
      "p1-goal", "p2-goal", "p3-goal", "p4-goal", "p5-goal"
    ];
    const nextState: Record<string, boolean> = {};
    list.forEach(id => {
      nextState[id] = expand;
    });
    setExpandedNodes(nextState);
  };

  const handleToggleTask = (todoId: string) => {
    const updated = todos.map(t => {
      if (t.id === todoId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTodos(updated);
  };

  // We map Shomoy's phases, goals, milestones, and tasks into an immutable tree hierarchy
  // We resolve the "completed" state of task nodes dynamically by looking up corresponding todos
  const treeData: TreeNode = {
    id: "campaign-root",
    label: "Shomoy Roy's 60-Day Self-Mastery Takeoff Campaign",
    type: "root",
    startDate: "2026-06-15",
    endDate: "2026-08-13",
    duration: "60 Days Total",
    children: [
      {
        id: "phase-1",
        label: "Phase 1: Foundation Accelerated (Daily Habits Setup)",
        type: "phase",
        startDate: "2026-06-15",
        endDate: "2026-06-24",
        duration: "10 Days Block",
        children: [
          {
            id: "p1-goal",
            label: "Goal: Anchor core biological routines and clear primary nicotine hurdles",
            type: "goal",
            startDate: "2026-06-15",
            endDate: "2026-06-24",
            duration: "10 Days",
            children: [
              {
                id: "p1-t1",
                label: "Fajr Salat in the Mosque (+ Congregational Duas)",
                type: "task",
                startDate: "June 15",
                endDate: "June 24",
                duration: "20 mins",
                priority: "critical",
                timeSlot: "04:30",
                associatedTodoId: "todo-fajr"
              },
              {
                id: "p1-t2",
                label: "Quran Hifz: Memorize 3-5 ayahs with deep Tajweed validation",
                type: "task",
                startDate: "June 15",
                endDate: "June 24",
                duration: "45 mins",
                priority: "critical",
                timeSlot: "05:00",
                associatedTodoId: "todo-hifz",
                blockedBy: ["p1-t1"]
              },
              {
                id: "p1-t3",
                label: "Bedtime Hardlocked at 22:00 Routine Reset",
                type: "task",
                startDate: "June 15",
                endDate: "June 24",
                duration: "30 mins",
                priority: "critical",
                timeSlot: "22:00",
                associatedTodoId: "todo-sleep",
                blockedBy: ["p1-t4"]
              },
              {
                id: "p1-t4",
                label: "Daily Walking Progression (Mosque & Outside loops)",
                type: "task",
                startDate: "June 15",
                endDate: "June 24",
                duration: "45 mins",
                priority: "high",
                timeSlot: "17:30",
                associatedTodoId: "gen-local-exercise"
              },
              {
                id: "p1-t5",
                label: "Physical Inventory & Environment Clean Setup",
                type: "task",
                startDate: "June 15",
                endDate: "June 17",
                duration: "120 mins",
                priority: "medium_low",
                timeSlot: "09:00"
              }
            ]
          }
        ]
      },
      {
        id: "phase-2",
        label: "Phase 2: Build & Skill Velocity (Lifting & Portfolio Building)",
        type: "phase",
        startDate: "2026-06-25",
        endDate: "2026-07-09",
        duration: "15 Days Block",
        children: [
          {
            id: "p2-goal",
            label: "Goal: Conduct intense physical strength training & build professional tech portfolios",
            type: "goal",
            startDate: "2026-06-25",
            endDate: "2026-07-09",
            duration: "15 Days",
            children: [
              {
                id: "p2-t1",
                label: "Deep Work Block 1: Core Systems Engineering (Next-gen compiler setup)",
                type: "task",
                startDate: "June 25",
                endDate: "July 09",
                duration: "90 mins",
                priority: "critical",
                timeSlot: "07:00",
                associatedTodoId: "todo-work1"
              },
              {
                id: "p2-t2",
                label: "Deep Work Block 2: Freelance Agency & Client Pipeline Pitching",
                type: "task",
                startDate: "June 25",
                endDate: "July 09",
                duration: "90 mins",
                priority: "high",
                timeSlot: "09:30",
                associatedTodoId: "todo-work2",
                blockedBy: ["p2-t1"]
              },
              {
                id: "p2-t3",
                label: "Strength Training 3x/Week lifted circuits",
                type: "task",
                startDate: "June 25",
                endDate: "July 09",
                duration: "60 mins",
                priority: "high",
                timeSlot: "16:30"
              },
              {
                id: "p2-t4",
                label: "Portfolio Infrastructure Launch on GitHub & Web host",
                type: "task",
                startDate: "July 01",
                endDate: "July 05",
                duration: "5 Days",
                priority: "high",
                timeSlot: "11:30",
                blockedBy: ["p2-t2"]
              },
              {
                id: "p2-t5",
                label: "MILESTONE 1: Day 25 'নতুন ভোর' (New Dawn) System Check",
                type: "task",
                startDate: "July 09",
                endDate: "July 09",
                duration: "One-day",
                priority: "critical",
                timeSlot: "00:00",
                blockedBy: ["p2-t4"]
              }
            ]
          }
        ]
      },
      {
        id: "phase-3",
        label: "Phase 3: Deep Market Execution (High Outbounds & BDT Chase)",
        type: "phase",
        startDate: "2026-07-10",
        endDate: "2026-07-24",
        duration: "15 Days Block",
        children: [
          {
            id: "p3-goal",
            label: "Goal: Accelerate proposal outflow volumes & client interview blocks",
            type: "goal",
            startDate: "2026-07-10",
            endDate: "2026-07-24",
            duration: "15 Days",
            children: [
              {
                id: "p3-t1",
                label: "Submit 3 personalized high-value proposals (Upwork & LinkedIn)",
                type: "task",
                startDate: "July 10",
                endDate: "July 24",
                duration: "90 mins",
                priority: "critical",
                timeSlot: "10:00"
              },
              {
                id: "p3-t2",
                label: "High-Volume Strength Circulatory Workouts active",
                type: "task",
                startDate: "July 10",
                endDate: "July 24",
                duration: "60 mins",
                priority: "high",
                timeSlot: "17:00"
              },
              {
                id: "p3-t3",
                label: "MILESTONE 2: Day 40 'নির্মাণ' (Construction) Verification",
                type: "task",
                startDate: "July 24",
                endDate: "July 24",
                duration: "One-day",
                priority: "critical",
                timeSlot: "00:00",
                blockedBy: ["p2-t5", "p3-t1"]
              }
            ]
          }
        ]
      },
      {
        id: "phase-4",
        label: "Phase 4: Scale & Takeoff Boost (1 Lakh BDT Closing)",
        type: "phase",
        startDate: "2026-07-25",
        endDate: "2026-08-03",
        duration: "10 Days Block",
        children: [
          {
            id: "p4-goal",
            label: "Goal: Secure stable contracts with clients and conclude Quran milestones",
            type: "goal",
            startDate: "2026-07-25",
            endDate: "2026-08-03",
            duration: "10 Days",
            children: [
              {
                id: "p4-t1",
                label: "Streamlined Wealth scale: Finalize active client contract packages",
                type: "task",
                startDate: "July 25",
                endDate: "August 03",
                duration: "90 mins",
                priority: "critical",
                timeSlot: "11:00"
              },
              {
                id: "p4-t2",
                label: "Conclude Hifz Quran memorization module block",
                type: "task",
                startDate: "July 25",
                endDate: "August 03",
                duration: "40 mins",
                priority: "critical",
                timeSlot: "05:00"
              },
              {
                id: "p4-t3",
                label: "MILESTONE 3: Day 50 'উড়ান' (Takeoff) System Check",
                type: "task",
                startDate: "August 03",
                endDate: "August 03",
                duration: "One-day",
                priority: "critical",
                timeSlot: "00:00",
                blockedBy: ["p3-t3", "p4-t1"]
              }
            ]
          }
        ]
      },
      {
        id: "phase-5",
        label: "Phase 5: Resiliency & Buffer Shield (Safeguard Days)",
        type: "phase",
        startDate: "2026-08-04",
        endDate: "2026-08-13",
        duration: "10 Days Block",
        children: [
          {
            id: "p5-goal",
            label: "Goal: Fail-safe protection buffer to absorb setbacks without shifting target dates",
            type: "goal",
            startDate: "2026-08-04",
            endDate: "2026-08-13",
            duration: "10 Days",
            children: [
              {
                id: "p5-t1",
                label: "Emergency Buffer days allocation checks",
                type: "task",
                startDate: "August 04",
                endDate: "August 13",
                duration: "Daily",
                priority: "high",
                timeSlot: "00:00"
              },
              {
                id: "p5-t2",
                label: "Execute dynamic failure reduction loops to keep system on track",
                type: "task",
                startDate: "August 04",
                endDate: "August 13",
                duration: "30 mins",
                priority: "high",
                timeSlot: "18:00",
                blockedBy: ["p5-t1"]
              },
              {
                id: "p5-t3",
                label: "FINAL OUTCOME SECURITY LOCK: 1 Lakh BDT/mo Target Achieved",
                type: "task",
                startDate: "August 13",
                endDate: "August 13",
                duration: "One-day",
                priority: "critical",
                timeSlot: "00:00",
                blockedBy: ["p4-t3", "p5-t2"]
              }
            ]
          }
        ]
      }
    ]
  };

  // Helper inside tree building to verify task completion from the actual global todos list
  const isTaskCompleted = (node: TreeNode): boolean => {
    if (node.associatedTodoId) {
      const match = todos.find(t => t.id === node.associatedTodoId);
      if (match) return match.completed;
    }
    // Check localStorage fallback or mock default
    const saved = localStorage.getItem(`tree_node_comp_${node.id}`);
    return saved === "true";
  };

  // Find node by id recursively
  const findNodeById = (root: TreeNode, searchId: string): TreeNode | null => {
    if (root.id === searchId) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeById(child, searchId);
        if (found) return found;
      }
    }
    return null;
  };

  const getBlockerDetails = (node: TreeNode): { isBlocked: boolean; blockers: { id: string; label: string; completed: boolean }[] } => {
    if (!node.blockedBy || node.blockedBy.length === 0) {
      return { isBlocked: false, blockers: [] };
    }

    const blockersList: { id: string; label: string; completed: boolean }[] = [];
    node.blockedBy.forEach(blockerId => {
      const parentNode = findNodeById(treeData, blockerId);
      if (parentNode) {
        blockersList.push({
          id: blockerId,
          label: parentNode.label,
          completed: isTaskCompleted(parentNode)
        });
      }
    });

    const isBlocked = blockersList.some(b => !b.completed);
    return { isBlocked, blockers: blockersList };
  };

  const toggleLocalTaskNode = (node: TreeNode) => {
    if (node.associatedTodoId) {
      handleToggleTask(node.associatedTodoId);
    } else {
      const isCompletedNow = !isTaskCompleted(node);
      localStorage.setItem(`tree_node_comp_${node.id}`, isCompletedNow ? "true" : "false");
      // Trigger forces re-render
      setSearchQuery(prev => prev + "");
    }
  };

  // Deep recursive node rendering
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes[node.id] || false;
    const hasChildren = node.children && node.children.length > 0;
    
    // Filter logic: Check if node matches search query or priority filters
    const matchesQuery = searchQuery 
      ? node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (node.priority && node.priority.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesPriority = selectedPriority === "all" 
      ? true 
      : node.priority === selectedPriority;

    // Apply filters to tasks specifically, or let parents exist if they have showing children
    let sortedChildren = node.children;
    if (searchQuery || selectedPriority !== "all") {
      sortedChildren = node.children?.filter(c => {
        const cMatches = c.label.toLowerCase().includes(searchQuery.toLowerCase());
        const pMatches = selectedPriority === "all" ? true : c.priority === selectedPriority;
        return cMatches || pMatches || (c.children && c.children.length > 0);
      });
    }

    const showThisNode = matchesQuery && matchesPriority;

    if (!showThisNode && (!sortedChildren || sortedChildren.length === 0)) {
      return null;
    }

    const blockerInfo = getBlockerDetails(node);

    // Interactive focus chain diagnostics
    const isCurrentlyFocused = focusedNodeId === node.id;
    const isBlockerForFocused = focusedNodeId ? (findNodeById(treeData, focusedNodeId)?.blockedBy?.includes(node.id) || false) : false;
    const isDependentOnFocused = focusedNodeId ? (node.blockedBy?.includes(focusedNodeId) || false) : false;
    const isUnrelatedToFocus = focusedNodeId && !isCurrentlyFocused && !isBlockerForFocused && !isDependentOnFocused;

    // Styling logic
    let cardStyleClass = "";
    if (isCurrentlyFocused) {
      cardStyleClass = "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.012]";
    } else if (isBlockerForFocused) {
      cardStyleClass = "border-rose-500 bg-rose-500/10 shadow-md shadow-rose-500/5 animate-pulse scale-[1.008]";
    } else if (isDependentOnFocused) {
      cardStyleClass = "border-cyan-500 bg-cyan-500/5 shadow-md shadow-cyan-500/5 scale-[1.008]";
    } else {
      if (node.type === "root") {
        cardStyleClass = "bg-indigo-950/20 border-indigo-500 text-slate-100 hover:bg-indigo-900/10 shadow-md shadow-indigo-950/40";
      } else if (node.type === "phase") {
        cardStyleClass = "bg-slate-900/60 border-indigo-500/20 text-slate-200 hover:border-indigo-500/40";
      } else if (node.type === "goal") {
        cardStyleClass = "bg-black/20 border-white/5 text-slate-400 italic";
      } else if (isTaskCompleted(node)) {
        cardStyleClass = "bg-emerald-950/10 border-emerald-500/10 text-slate-500";
      } else if (blockerInfo.isBlocked) {
        cardStyleClass = "bg-rose-950/5 border-rose-955/20 text-slate-400 hover:border-rose-500/20";
      } else {
        cardStyleClass = "bg-slate-900/10 border-slate-800 text-slate-300 hover:border-indigo-500/20";
      }
    }

    return (
      <div 
        key={node.id} 
        id={`node-card-${node.id}`}
        style={{ marginLeft: depth > 0 ? `${Math.min(depth * 14, 28)}px` : "0px" }}
        className={`relative font-sans select-none transition-all duration-300 ${
          isUnrelatedToFocus ? "opacity-35 blur-[0.2px] hover:opacity-75" : "opacity-100"
        }`}
      >
        {/* VERTICAL AND HORIZONTAL CONNECTING TREE BRANCH LINES */}
        {depth > 0 && (
          <div className="absolute -left-[14px] top-5 w-[14px] h-[1px] border-b border-dashed border-indigo-500/25 pointer-events-none" />
        )}
        {depth > 0 && (
          <div className="absolute -left-[14px] -top-3 w-[1px] h-[calc(100%+12px)] border-l border-dashed border-indigo-500/25 pointer-events-none" />
        )}

        <div className="py-1.5">
          {/* CORE NODE ROW */}
          <div 
            onClick={() => setFocusedNodeId(isCurrentlyFocused ? null : node.id)}
            className={`group flex flex-col p-3 rounded-lg border transition-all cursor-pointer ${cardStyleClass}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              {/* Left side label container */}
              <div className="flex items-start gap-2.5 min-w-0 pr-4">
                {/* Expand / Collapse buttons for folders */}
                {hasChildren ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(node.id);
                    }}
                    type="button"
                    className="mt-0.5 p-0.5 bg-black/40 hover:bg-black/80 rounded border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <div className="mt-1 shrink-0 select-none">
                    {node.type === "task" ? (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLocalTaskNode(node);
                        }}
                        className="cursor-pointer text-slate-500 hover:text-emerald-400 transition-colors"
                      >
                        {isTaskCompleted(node) ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : blockerInfo.isBlocked ? (
                          <Lock className="w-4 h-4 text-rose-500 animate-pulse" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                    )}
                  </div>
                )}

                {/* Node Title & Type Labels */}
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs ${
                      node.type === "root" 
                        ? "font-black uppercase tracking-wider text-indigo-300 animate-pulse" 
                        : node.type === "phase"
                          ? "font-extrabold text-slate-200"
                          : "font-semibold"
                    } ${isTaskCompleted(node) && node.type === "task" ? "line-through opacity-60" : ""}`}>
                      {node.label}
                    </span>

                    {node.type === "root" && (
                      <span className="bg-indigo-500/10 text-indigo-400 text-[8.5px] font-mono uppercase tracking-widest font-black px-1.5 py-0.5 rounded border border-indigo-400/20">
                        MASTER NODE
                      </span>
                    )}
                    {node.type === "phase" && (
                      <span className="bg-slate-800 text-slate-300 text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded">
                        PHASE PIPELINE
                      </span>
                    )}
                    {node.type === "goal" && (
                      <span className="bg-indigo-950/40 text-indigo-300 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border border-indigo-550/10">
                        GOAL STRATEGY
                      </span>
                    )}

                    {/* Interactive trace labels */}
                    {isCurrentlyFocused && (
                      <span className="bg-amber-400 text-slate-950 text-[8.5px] font-mono uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Activity className="w-2.5 h-2.5" /> SELECTED TARGET
                      </span>
                    )}
                    {isBlockerForFocused && (
                      <span className="bg-rose-500 text-white text-[8.5px] font-mono uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> BLOCKS SELECTION (PREREQUISITE)
                      </span>
                    )}
                    {isDependentOnFocused && (
                      <span className="bg-cyan-500 text-slate-950 text-[8.5px] font-mono uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Unlock className="w-2.5 h-2.5" /> BLOCKED BY SELECTION (SUCCESSOR)
                      </span>
                    )}

                    {/* Blockage warnings */}
                    {!isTaskCompleted(node) && blockerInfo.isBlocked && (
                      <span className="bg-rose-500/10 text-rose-400 text-[8.5px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" /> ACTIVE BLOCKED
                      </span>
                    )}
                  </div>

                  {/* Subtitle properties like startDate, duration */}
                  {(node.startDate || node.duration || node.timeSlot) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-slate-500 font-mono">
                      {node.timeSlot && (
                        <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> START {node.timeSlot}
                        </span>
                      )}
                      {node.startDate && (
                        <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {node.startDate} {node.endDate ? `to ${node.endDate}` : ""}</span>
                      )}
                      {node.duration && (
                        <span className="flex items-center gap-0.5 text-slate-400"><Hourglass className="w-3 h-3" /> {node.duration} ESTIMATED</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side controls like priorities or actions */}
              <div className="flex items-center gap-3 shrink-0 select-none">
                {node.priority && (
                  <span className={`text-[8.5px] font-mono uppercase font-black tracking-widest px-1.5 py-0.5 rounded ${
                    node.priority === "critical" 
                      ? "bg-red-500/10 text-rose-400 border border-red-500/20" 
                      : node.priority === "high" 
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {node.priority}
                  </span>
                )}
              </div>
            </div>

            {/* CONNECTION LINES FOR BLOCKING DEPENDENCIES INSIDE CARD */}
            {node.type === "task" && blockerInfo.blockers.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1.5">
                {blockerInfo.blockers.map(b => (
                  <div key={b.id} className="flex items-center gap-1.5 ml-2">
                    <div className="w-3.5 h-3 border-l-2 border-b-2 border-dashed border-indigo-500/30 -mt-2" />
                    <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider font-mono">Blocked by:</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedNodeId(b.id);
                        document.getElementById(`node-card-${b.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`cursor-pointer px-2 py-0.5 rounded text-[9.5px] font-mono font-extrabold flex items-center gap-1 border transition-all ${
                        b.completed
                          ? "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/20 hover:bg-rose-550/20 text-rose-400 animate-pulse"
                      }`}
                    >
                      {b.completed ? <Unlock className="w-2.5 h-2.5 text-emerald-400" /> : <Lock className="w-2.5 h-2.5 text-rose-400" />}
                      <span>{b.label.split(":")[0] || b.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Children container list */}
          {hasChildren && isExpanded && sortedChildren && (
            <div className="mt-1 relative pl-3.5 border-l border-indigo-500/5 space-y-1">
              {sortedChildren.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="tree-view-tab-container">
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <GitFork className="w-5 h-5 text-indigo-400" /> Hierarchical Target & Checkpoints Tree View
        </h1>
        <p className="text-xs text-slate-400">
          A parent-to-child diagnostic tree mapping campaign goals to chronological focus routines, showing times, priorities, and duration estimates.
        </p>
      </header>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-xs">
        {/* Left Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search targets, priorities, duration, times..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500/40"
          />
        </div>

        {/* Priority Filter and expands */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-405">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg p-1.5 px-2 text-xs text-slate-300"
            >
              <option value="all">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟣 High</option>
              <option value="medium_low">🟢 Medium/Low</option>
            </select>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => setAllExpansion(true)}
              className="px-2.5 py-1 text-[10px] bg-slate-900 hover:bg-slate-850 rounded border border-white/5 hover:border-white/20 transition-all font-bold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={() => setAllExpansion(false)}
              className="px-2.5 py-1 text-[10px] bg-slate-900 hover:bg-slate-850 rounded border border-white/5 hover:border-white/20 transition-all font-bold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC TIMELINE GRAPHICS CARD AT GLANCE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-relaxed font-mono text-[11px] text-slate-400 select-none">
        <div className="app-card p-3 rounded-xl border border-indigo-500/5 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">PROGRAM START</span>
          <p className="text-xs font-bold text-indigo-300">Mon, June 15, 2026</p>
        </div>
        <div className="app-card p-3 rounded-xl border border-indigo-500/5 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">ACTIVE WORKDAYS SPRINT</span>
          <p className="text-xs font-bold text-slate-300">Days 1 - 50 (June 15 - Aug 3)</p>
        </div>
        <div className="app-card p-3 rounded-xl border border-indigo-500/5 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">RECOVERY & INSURANCE SHIELD</span>
          <p className="text-xs font-bold text-teal-400">Days 51 - 60 (Aug 4 - Aug 13)</p>
        </div>
        <div className="app-card p-3 rounded-xl border border-indigo-500/5 space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-500">PROGRAM COMPLETION LOCK</span>
          <p className="text-xs font-bold text-emerald-400">Thur, August 13, 2026</p>
        </div>
      </div>

      {/* STRATEGIC BLOCKERS & DEPENDENCY LINK MAP (FLOWCHART VIEW) */}
      <div className="app-card p-5 md:p-6 rounded-xl border border-indigo-550/10 space-y-5 bg-slate-950/20">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <GitMerge className="w-4.5 h-4.5 text-indigo-400 rotate-90" /> Strategic Blockers & Dependency Link-Map
            </h2>
            <p className="text-[11.5px] text-slate-400">
              Interactive structural tracks outlining critical prerequisites. Click any component to pinpoint, verify, and trace dependency pathways.
            </p>
          </div>
          {focusedNodeId && (
            <button
              onClick={() => setFocusedNodeId(null)}
              className="px-2.5 py-1 text-[10.5px] font-bold text-rose-400 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-550/20 rounded-md shrink-0 transition-colors cursor-pointer self-start"
            >
              Clear Focus Highlighting
            </button>
          )}
        </div>

        <div className="space-y-4">
          {[
            {
              title: "🕌 Salat & Spiritual Baseline Track (Morning Focus Anchor)",
              nodes: ["p1-t1", "p1-t2"]
            },
            {
              title: "💻 Professional Pipeline & Milestone Sprints (Ultimate 1 Lakh BDT/mo Outcome)",
              nodes: ["p2-t1", "p2-t2", "p2-t4", "p2-t5", "p3-t3", "p4-t3", "p5-t3"]
            },
            {
              title: "🏃 Physical Vitality and Sleep Routine Hardlock (Sleep / Walk synergy)",
              nodes: ["p1-t4", "p1-t3"]
            }
          ].map((chain, cIdx) => (
            <div key={cIdx} className="bg-slate-900/40 rounded-xl border border-white/[0.03] p-4 space-y-3">
              <div className="text-[10px] uppercase font-black tracking-widest text-[#a5b4fc] font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {chain.title}
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 font-sans overflow-x-auto pb-1">
                {chain.nodes.map((nodeId, nIdx) => {
                  const node = findNodeById(treeData, nodeId);
                  if (!node) return null;
                  const completed = isTaskCompleted(node);
                  
                  // Compute link block state
                  const prevNodeId = chain.nodes[nIdx - 1];
                  const prevNode = prevNodeId ? findNodeById(treeData, prevNodeId) : null;
                  const isPathBlocked = prevNode ? !isTaskCompleted(prevNode) : false;

                  const isSelected = focusedNodeId === nodeId;

                  return (
                    <React.Fragment key={nodeId}>
                      {nIdx > 0 && (
                        <div className="flex items-center justify-center shrink-0">
                          {/* Chevron arrow path indicating blocking or unlocked */}
                          <div className="hidden lg:flex items-center">
                            <svg className={`w-8 h-4 ${isPathBlocked ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} fill="none" viewBox="0 0 32 16">
                              <path 
                                d="M0,8 L24,8" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeDasharray={isPathBlocked ? "4,2" : "0"} 
                              />
                              <path d="M22,4 L30,8 L22,12" fill="currentColor" />
                            </svg>
                          </div>
                          <div className="flex lg:hidden items-center text-center justify-center py-1">
                            <span className={`text-[10px] font-mono leading-none ${isPathBlocked ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                              ▼ {isPathBlocked ? 'BLOCKED' : 'READY'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div 
                        onClick={() => {
                          setFocusedNodeId(focusedNodeId === nodeId ? null : nodeId);
                          document.getElementById(`node-card-${nodeId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`flex-1 min-w-[210px] cursor-pointer p-3 rounded-lg border transition-all duration-200 select-none ${
                          isSelected 
                            ? "border-amber-400 bg-amber-500/15 text-slate-100 shadow-md shadow-amber-500/10 scale-[1.01]"
                            : completed
                              ? "border-emerald-500/30 bg-emerald-500/[0.04] text-emerald-400 hover:border-emerald-400/50"
                              : isPathBlocked
                                ? "border-rose-950 bg-rose-950/[0.02] text-rose-450 hover:border-rose-400/40 animate-pulse"
                                : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-indigo-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <span className="text-[9px] font-mono font-black uppercase bg-black/40 px-1.5 py-0.5 rounded text-slate-400">
                            {node.id.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono">
                            {completed ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5">🔓 UNLOCKED</span>
                            ) : isPathBlocked ? (
                              <span className="text-rose-400 font-bold flex items-center gap-0.5">🔒 BLOCKED</span>
                            ) : (
                              <span className="text-indigo-400 font-bold flex items-center gap-0.5">🚀 READY</span>
                            )}
                          </span>
                        </div>

                        <p className={`text-[11.5px] font-bold leading-tight ${completed ? 'line-through opacity-60' : ''}`}>
                          {node.label.split(":")[0] || node.label}
                        </p>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TREE LIST RENDERING WRAPPER */}
      <div className="app-card p-5 md:p-6 rounded-xl space-y-4 shadow-xl border border-white/5 overflow-x-auto min-h-[400px]">
        <div className="flex justify-between items-center bg-black/30 p-2.5 rounded border border-white/5 text-[9.5px] font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1"><GitCommit className="w-3.5 h-3.5 text-indigo-400" /> ROOT: CAMPAIGN HORIZON TARGET (1 LAKH BDT/MO INBOUND DIRECTIVES)</span>
          <span className="text-indigo-400 font-extrabold uppercase animate-pulse">Live branch status verified</span>
        </div>

        {/* RECURSIVE START */}
        <div className="space-y-1 pl-1">
          {renderNode(treeData, 0)}
        </div>
      </div>
    </div>
  );
}
