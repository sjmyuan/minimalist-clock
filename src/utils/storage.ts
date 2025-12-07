import { UserPreferences } from '@/src/types';

const STORAGE_KEY = 'userPreferences';

const defaultPreferences: UserPreferences = {
  fontSize: 48, // Default font size within the 12-100px range
  fontColor: '#FFFFFF',
  backgroundColor: '#000000',
  showSeconds: false,
  flipStyle: 'drop-down',
};

/**
 * Loads user preferences from local storage
 * @returns UserPreferences object or default preferences if not found
 */
export const loadPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') {
    return defaultPreferences;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }

  return defaultPreferences;
};

/**
 * Saves user preferences to local storage
 * @param preferences - The preferences to save
 */
export const savePreferences = (preferences: UserPreferences): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

/**
 * Resets preferences to default values
 */
export const resetPreferences = (): UserPreferences => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return defaultPreferences;
};

/**
 * Gets the default preferences
 */
export const getDefaultPreferences = (): UserPreferences => {
  return { ...defaultPreferences };
};
