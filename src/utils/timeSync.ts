import { TimeObject } from '@/src/types';

/**
 * Fetches the current system time
 * @returns TimeObject with current time and date
 */
export const fetchCurrentTime = (): TimeObject => {
  const now = new Date();
  
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    date: now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
};

/**
 * Formats a number to always be two digits
 * @param value - The number to format
 * @returns String representation with leading zero if needed
 */
export const formatTimeValue = (value: number): string => {
  return value.toString().padStart(2, '0');
};

/**
 * Calculates the next minute update timestamp
 * @returns Milliseconds until the next minute
 */
export const getMillisecondsUntilNextMinute = (): number => {
  const now = new Date();
  const nextMinute = new Date(now);
  nextMinute.setMinutes(now.getMinutes() + 1);
  nextMinute.setSeconds(0);
  nextMinute.setMilliseconds(0);
  
  return nextMinute.getTime() - now.getTime();
};
