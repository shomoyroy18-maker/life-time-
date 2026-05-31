import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { UserProfile, DailyLog, TodoItem } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the custom Database ID from AI Studio
export const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard Error Handler per Firebase Skill instructions
export function handleFirestoreError(error: unknown, context: string): never {
  console.error(`Firebase Error in ${context}:`, error);
  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      throw new Error(`Security validation failed: Insufficient permissions for ${context}`);
    } else if (error.code === 'resource-exhausted') {
      throw new Error(`Quota limit reached for Firestore database in ${context}`);
    }
    throw new Error(`Firebase Error: ${error.message} (${error.code}) in ${context}`);
  }
  throw new Error(`Unknown error in ${context}: ${String(error)}`);
}

// ==========================================
// AUTHHELPER METHODS
// ==========================================

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Popup block/Google auth error, trying safe simulation fallback", error);
    throw error;
  }
}

export async function loginAnonymously(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Anonymous sign in error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ==========================================
// FIRESTORE SYNC & DATA OPERATION HELPERS
// ==========================================

// 1. User Profile Sync
export async function getFirebaseUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    return handleFirestoreError(error, `Fetching User Profile (${userId})`);
  }
}

export async function setFirebaseUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', profile.userId);
    await setDoc(userDocRef, {
      ...profile,
      createdAt: profile.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, `Creating/Updating User Profile for ${profile.userId}`);
  }
}

// 2. Daily Logs Sync
export async function getFirebaseDailyLogs(userId: string): Promise<DailyLog[]> {
  try {
    const logsColRef = collection(db, 'users', userId, 'daily_logs');
    // Order by date descending to show historical track
    const logsQuery = query(logsColRef, orderBy('date', 'desc'));
    const logsSnapshot = await getDocs(logsQuery);
    return logsSnapshot.docs.map(d => d.data() as DailyLog);
  } catch (error) {
    return handleFirestoreError(error, `Fetching Daily Logs for ${userId}`);
  }
}

export async function saveFirebaseDailyLog(userId: string, log: DailyLog): Promise<void> {
  try {
    const logDocRef = doc(db, 'users', userId, 'daily_logs', log.id);
    await setDoc(logDocRef, {
      ...log,
      createdAt: log.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, `Saving Daily Log ${log.id} for ${userId}`);
  }
}

export async function deleteFirebaseDailyLog(userId: string, logId: string): Promise<void> {
  try {
    const logDocRef = doc(db, 'users', userId, 'daily_logs', logId);
    await deleteDoc(logDocRef);
  } catch (error) {
    handleFirestoreError(error, `Deleting Daily Log ${logId} for ${userId}`);
  }
}

// 3. Todo Items Sync
export async function getFirebaseTodoItems(userId: string): Promise<TodoItem[]> {
  try {
    const todoColRef = collection(db, 'users', userId, 'todo_items');
    // Order by time slot ascending
    const todoQuery = query(todoColRef, orderBy('timeSlot', 'asc'));
    const todoSnapshot = await getDocs(todoQuery);
    return todoSnapshot.docs.map(d => d.data() as TodoItem);
  } catch (error) {
    return handleFirestoreError(error, `Fetching Todo Items for ${userId}`);
  }
}

export async function saveFirebaseTodoItem(userId: string, item: TodoItem): Promise<void> {
  try {
    const todoDocRef = doc(db, 'users', userId, 'todo_items', item.id);
    await setDoc(todoDocRef, {
      ...item,
      createdAt: item.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, `Saving Todo Item ${item.id} for ${userId}`);
  }
}

export async function deleteFirebaseTodoItem(userId: string, todoId: string): Promise<void> {
  try {
    const todoDocRef = doc(db, 'users', userId, 'todo_items', todoId);
    await deleteDoc(todoDocRef);
  } catch (error) {
    handleFirestoreError(error, `Deleting Todo Item ${todoId} for ${userId}`);
  }
}
