import { loadPreferences, savePreferences, getDefaultPreferences } from '@/src/utils/storage';

describe('Time Format Preference', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('use24HourFormat preference', () => {
    it('should have use24HourFormat in default preferences', () => {
      const defaults = getDefaultPreferences();
      expect(defaults).toHaveProperty('use24HourFormat');
      expect(typeof defaults.use24HourFormat).toBe('boolean');
    });

    it('should default to 24-hour format (true)', () => {
      const defaults = getDefaultPreferences();
      expect(defaults.use24HourFormat).toBe(true);
    });

    it('should load use24HourFormat from localStorage', () => {
      const testPreferences = {
        ...getDefaultPreferences(),
        use24HourFormat: false,
      };
      localStorage.setItem('userPreferences', JSON.stringify(testPreferences));

      const loaded = loadPreferences();
      expect(loaded.use24HourFormat).toBe(false);
    });

    it('should save use24HourFormat to localStorage', () => {
      const testPreferences = {
        ...getDefaultPreferences(),
        use24HourFormat: false,
      };
      
      savePreferences(testPreferences);
      
      const stored = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      expect(stored.use24HourFormat).toBe(false);
    });

    it('should toggle between 24H and 12H formats', () => {
      let preferences = getDefaultPreferences();
      expect(preferences.use24HourFormat).toBe(true);
      
      preferences = { ...preferences, use24HourFormat: false };
      savePreferences(preferences);
      
      const loaded = loadPreferences();
      expect(loaded.use24HourFormat).toBe(false);
      
      preferences = { ...preferences, use24HourFormat: true };
      savePreferences(preferences);
      
      const reloaded = loadPreferences();
      expect(reloaded.use24HourFormat).toBe(true);
    });
  });
});
