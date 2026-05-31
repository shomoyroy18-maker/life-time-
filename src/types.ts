export type ThemeType = 'cyber' | 'light' | 'ocean' | 'sunset';

export interface UserProfile {
  userId: string;
  email: string;
  currentDay: number; // Day 1 - 90
  theme: ThemeType;
  displayName: string;
  targetBdtIncome: number; // e.g. 100000 BDT
  currentBdtIncome: number; 
  createdAt?: string;
}

export type MoodType = 'excellent' | 'good' | 'average' | 'low' | 'crisis';

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  energyLevel: number; // 1 to 10
  salatCongregation: boolean;
  nicotineFree: boolean;
  quranHifz: boolean;
  workoutCompleted: boolean;
  focusHours: number;
  pipelineLeads: number;
  notes: string;
  createdAt?: string;
}

export type PriorityType = 'critical' | 'high' | 'medium_low';

export interface TodoItem {
  id: string;
  userId: string;
  taskText: string;
  timeSlot: string; // e.g., "04:30"
  priority: PriorityType;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt?: string;
}

export interface AuthState {
  user: {
    uid: string;
    email: string;
    displayName: string;
  } | null;
  loading: boolean;
  isFallback: boolean; // True if using local simulation, otherwise Firebase
}

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface AISuggestion {
  insights: string;
  recommendedToday: string[];
  encouragement: string;
}
