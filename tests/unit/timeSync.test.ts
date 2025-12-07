import { fetchCurrentTime, formatTimeValue, getMillisecondsUntilNextMinute } from '@/src/utils/timeSync';

describe('timeSync utils', () => {
  describe('fetchCurrentTime', () => {
    it('should return a valid TimeObject', () => {
      const time = fetchCurrentTime();
      
      expect(time).toHaveProperty('hours');
      expect(time).toHaveProperty('minutes');
      expect(time).toHaveProperty('date');
      expect(typeof time.hours).toBe('number');
      expect(typeof time.minutes).toBe('number');
      expect(typeof time.date).toBe('string');
      expect(time.hours).toBeGreaterThanOrEqual(0);
      expect(time.hours).toBeLessThan(24);
      expect(time.minutes).toBeGreaterThanOrEqual(0);
      expect(time.minutes).toBeLessThan(60);
    });
  });

  describe('formatTimeValue', () => {
    it('should format single digit numbers with leading zero', () => {
      expect(formatTimeValue(5)).toBe('05');
      expect(formatTimeValue(0)).toBe('00');
      expect(formatTimeValue(9)).toBe('09');
    });

    it('should not add leading zero to two digit numbers', () => {
      expect(formatTimeValue(10)).toBe('10');
      expect(formatTimeValue(23)).toBe('23');
      expect(formatTimeValue(59)).toBe('59');
    });
  });

  describe('getMillisecondsUntilNextMinute', () => {
    it('should return a positive number', () => {
      const ms = getMillisecondsUntilNextMinute();
      expect(ms).toBeGreaterThan(0);
    });

    it('should return a value less than 60000ms (1 minute)', () => {
      const ms = getMillisecondsUntilNextMinute();
      expect(ms).toBeLessThanOrEqual(60000);
    });
  });
});
