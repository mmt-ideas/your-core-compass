import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get stored value or return initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(valueToStore) }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Storage keys constants
export const STORAGE_KEYS = {
  CORE_VALUES: 'values-compass-core-values',
  VALUES_SORTING: 'values-compass-sorting',
  DECISION_REFLECTIONS: 'values-compass-decisions',
  MICRO_REFLECTIONS: 'values-compass-reflections',
  SETTINGS: 'values-compass-settings',
  ONBOARDING_COMPLETE: 'values-compass-onboarded',
  CUSTOM_VALUES: 'values-compass-custom-values',
  OPENAI_API_KEY: 'values-compass-openai-key',
} as const;

// Types for stored data
export interface StoredValue {
  id: string;
  name: string;
  description?: string;
  isCustom?: boolean;
}

export interface ValueSorting {
  veryImportant: string[];
  important: string[];
  notImportantNow: string[];
}

export interface DecisionReflection {
  id: string;
  decision: string;
  selectedValues: string[];
  responses: Record<string, string>;
  summary: string;
  timestamp: string;
}

export interface MicroReflection {
  id: string;
  prompt: string;
  response: string;
  taggedValue?: string;
  timestamp: string;
}

export interface AppSettings {
  lowStimulusMode: boolean;
  highContrastMode: boolean;
  textSize: 'normal' | 'large' | 'larger';
  reducedMotion: boolean;
  aiReflectionsEnabled: boolean;
}

export const defaultSettings: AppSettings = {
  lowStimulusMode: false,
  highContrastMode: false,
  textSize: 'normal',
  reducedMotion: false,
  aiReflectionsEnabled: true,
};
