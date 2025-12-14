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
        fontSize: 90,
        fontColor: '#FFFFFF',
        backgroundColor: '#7f3d3d',
        showSeconds: true,
        flipStyle: 'card-fold',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 400,
        use24HourFormat: true,
      });
    });

    it('should include fontFamily in defaults', () => {
      const defaults = getDefaultPreferences();
      expect(defaults.fontFamily).toBe('Arial, sans-serif');
    });

    it('should include fontWeight in defaults', () => {
      const defaults = getDefaultPreferences();
      expect(defaults.fontWeight).toBe(400);
    });
  });

  describe('loadPreferences', () => {
    it('should return default preferences when nothing is stored', () => {
      const prefs = loadPreferences();
      
      expect(prefs).toEqual({
        fontSize: 90,
        fontColor: '#FFFFFF',
        backgroundColor: '#7f3d3d',
        showSeconds: true,
        flipStyle: 'card-fold',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 400,
        use24HourFormat: true,
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

    it('should load stored fontFamily preference', () => {
      const customPrefs = {
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down' as const,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 400,
      };
      
      localStorage.setItem('userPreferences', JSON.stringify(customPrefs));
      
      const prefs = loadPreferences();
      expect(prefs.fontFamily).toBe('Arial, sans-serif');
    });

    it('should load stored fontWeight preference', () => {
      const customPrefs = {
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down' as const,
        fontFamily: 'Courier New, monospace',
        fontWeight: 700,
      };
      
      localStorage.setItem('userPreferences', JSON.stringify(customPrefs));
      
      const prefs = loadPreferences();
      expect(prefs.fontWeight).toBe(700);
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
        fontFamily: 'Georgia, serif',
        fontWeight: 600,
      };
      
      savePreferences(prefs);
      
      const stored = localStorage.getItem('userPreferences');
      expect(stored).toBe(JSON.stringify(prefs));
    });

    it('should persist fontFamily to localStorage', () => {
      const prefs = {
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down' as const,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 300,
      };
      
      savePreferences(prefs);
      
      const stored = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      expect(stored.fontFamily).toBe('Times New Roman, serif');
    });

    it('should persist fontWeight to localStorage', () => {
      const prefs = {
        fontSize: 48,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down' as const,
        fontFamily: 'Courier New, monospace',
        fontWeight: 800,
      };
      
      savePreferences(prefs);
      
      const stored = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      expect(stored.fontWeight).toBe(800);
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
        fontFamily: 'Arial, sans-serif',
        fontWeight: 700,
      };
      
      savePreferences(customPrefs);
      
      const reset = resetPreferences();
      
      expect(reset).toEqual({
        fontSize: 90,
        fontColor: '#FFFFFF',
        backgroundColor: '#7f3d3d',
        showSeconds: true,
        flipStyle: 'card-fold',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 400,
        use24HourFormat: true,
      });
      expect(localStorage.getItem('userPreferences')).toBeNull();
    });
  });
});
