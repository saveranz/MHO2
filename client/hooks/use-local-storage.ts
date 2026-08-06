import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage with automatic persistence
 * Data will persist even after page refresh
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [storedValue, setValue] - Similar to useState but persists to localStorage
 * 
 * @example
 * const [tasks, setTasks] = useLocalStorage('tasks', []);
 * const [settings, setSettings] = useLocalStorage('settings', { theme: 'light' });
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

/**
 * Remove an item from localStorage
 * @param key - The localStorage key to remove
 */
export function removeFromLocalStorage(key: string) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all localStorage data
 */
export function clearLocalStorage() {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
