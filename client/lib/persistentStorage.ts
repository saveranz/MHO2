/**
 * Centralized localStorage management for the application
 * This file provides type-safe access to all localStorage keys
 */

// Define all localStorage keys in one place for consistency
export const STORAGE_KEYS = {
  // Authentication
  USER: 'user',
  
  // Dashboard
  DASHBOARD_TAB: 'dashboard-active-tab',
  SIDEBAR_OPEN: 'sidebar-open',
  
  // Staff Management
  STAFF_DIRECTORY: 'staff-directory',
  STAFF_FILTERS: 'staff-filters',
  
  // Appointments
  APPOINTMENTS: 'appointments',
  APPOINTMENT_FILTERS: 'appointment-filters',
  
  // Tasks
  TASKS: 'tasks',
  TASK_FILTERS: 'task-filters',
  
  // Settings
  USER_SETTINGS: 'user-settings',
  THEME: 'theme',
  NOTIFICATIONS: 'notifications-enabled',
  
  // Forms (drafts)
  PATIENT_FORM_DRAFT: 'patient-form-draft',
  APPOINTMENT_FORM_DRAFT: 'appointment-form-draft',
  
  // Recent Activity
  RECENT_PATIENTS: 'recent-patients',
  RECENT_SEARCHES: 'recent-searches',
} as const;

// Type definitions for stored data
export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  department?: string;
  shift?: string;
  status?: 'active' | 'inactive' | 'on-leave';
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId?: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
}

// Helper functions for common operations
export const storage = {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage with type safety
   */
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage data
   */
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Check if a key exists in localStorage
   */
  has(key: string): boolean {
    return window.localStorage.getItem(key) !== null;
  },

  /**
   * Get all keys in localStorage
   */
  keys(): string[] {
    return Object.keys(window.localStorage);
  },
};

// Specific helper functions for common data types
export const userSettingsStorage = {
  get(): UserSettings {
    return storage.get<UserSettings>(STORAGE_KEYS.USER_SETTINGS, {
      theme: 'light',
      notifications: true,
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    });
  },
  
  set(settings: Partial<UserSettings>): void {
    const current = this.get();
    storage.set(STORAGE_KEYS.USER_SETTINGS, { ...current, ...settings });
  },
};

export const staffStorage = {
  getAll(): StaffMember[] {
    return storage.get<StaffMember[]>(STORAGE_KEYS.STAFF_DIRECTORY, []);
  },
  
  add(member: StaffMember): void {
    const staff = this.getAll();
    storage.set(STORAGE_KEYS.STAFF_DIRECTORY, [...staff, member]);
  },
  
  update(id: string, updates: Partial<StaffMember>): void {
    const staff = this.getAll();
    const updated = staff.map(s => s.id === id ? { ...s, ...updates } : s);
    storage.set(STORAGE_KEYS.STAFF_DIRECTORY, updated);
  },
  
  remove(id: string): void {
    const staff = this.getAll();
    storage.set(STORAGE_KEYS.STAFF_DIRECTORY, staff.filter(s => s.id !== id));
  },
  
  getById(id: string): StaffMember | undefined {
    return this.getAll().find(s => s.id === id);
  },
};

export const appointmentStorage = {
  getAll(): Appointment[] {
    return storage.get<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  },
  
  add(appointment: Appointment): void {
    const appointments = this.getAll();
    storage.set(STORAGE_KEYS.APPOINTMENTS, [...appointments, appointment]);
  },
  
  update(id: string, updates: Partial<Appointment>): void {
    const appointments = this.getAll();
    const updated = appointments.map(a => a.id === id ? { ...a, ...updates } : a);
    storage.set(STORAGE_KEYS.APPOINTMENTS, updated);
  },
  
  remove(id: string): void {
    const appointments = this.getAll();
    storage.set(STORAGE_KEYS.APPOINTMENTS, appointments.filter(a => a.id !== id));
  },
  
  getByDate(date: string): Appointment[] {
    return this.getAll().filter(a => a.date === date);
  },
};

export const taskStorage = {
  getAll(): Task[] {
    return storage.get<Task[]>(STORAGE_KEYS.TASKS, []);
  },
  
  add(task: Task): void {
    const tasks = this.getAll();
    storage.set(STORAGE_KEYS.TASKS, [...tasks, task]);
  },
  
  update(id: string, updates: Partial<Task>): void {
    const tasks = this.getAll();
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    storage.set(STORAGE_KEYS.TASKS, updated);
  },
  
  remove(id: string): void {
    const tasks = this.getAll();
    storage.set(STORAGE_KEYS.TASKS, tasks.filter(t => t.id !== id));
  },
  
  getByStatus(status: Task['status']): Task[] {
    return this.getAll().filter(t => t.status === status);
  },
  
  getByPriority(priority: Task['priority']): Task[] {
    return this.getAll().filter(t => t.priority === priority);
  },
};

// Export everything for easy access
export default {
  STORAGE_KEYS,
  storage,
  userSettingsStorage,
  staffStorage,
  appointmentStorage,
  taskStorage,
};
