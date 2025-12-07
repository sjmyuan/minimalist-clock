import { loadPreferences, savePreferences, resetPreferences, getDefaultPreferences } from '@/src/utils/storage';

describe('storage utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getDefaultPreferences', () => {
    it('should return default preferences', () => {
      const defaults = getDefaultPreferences();
      
      expect(defaults).toEqual({
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down',
      });
    });
  });

  describe('loadPreferences', () => {
    it('should return default preferences when nothing is stored', () => {
      const prefs = loadPreferences();
      
      expect(prefs).toEqual({
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down',
      });
    });

    it('should return stored preferences when available', () => {
      const customPrefs = {
        fontSize: 80,
        fontColor: '#FF0000',
        backgroundColor: '#0000FF',
      };
      
      localStorage.setItem('userPreferences', JSON.stringify(customPrefs));
      
      const prefs = loadPreferences();
      expect(prefs).toEqual(customPrefs);
    });
  });

  describe('savePreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefs = {
        fontSize: 100,
        fontColor: '#00FF00',
        backgroundColor: '#FFFFFF',
        showSeconds: true,
        flipStyle: 'classic-flip' as const,
      };
      
      savePreferences(prefs);
      
      const stored = localStorage.getItem('userPreferences');
      expect(stored).toBe(JSON.stringify(prefs));
    });
  });

  describe('resetPreferences', () => {
    it('should clear stored preferences and return defaults', () => {
      const customPrefs = {
        fontSize: 80,
        fontColor: '#FF0000',
        backgroundColor: '#0000FF',
        showSeconds: true,
        flipStyle: 'classic-flip' as const,
      };
      
      savePreferences(customPrefs);
      
      const reset = resetPreferences();
      
      expect(reset).toEqual({
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down',
      });
      expect(localStorage.getItem('userPreferences')).toBeNull();
    });
  });
});
