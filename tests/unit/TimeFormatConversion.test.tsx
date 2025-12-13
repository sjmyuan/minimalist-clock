/// <reference types="jest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeRenderer } from '@/src/components/TimeRenderer';
import { TimeObject, UserPreferences } from '@/src/types';

describe('Time Format Conversion and AM/PM Display', () => {
  const basePreferences: UserPreferences = {
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
    flipStyle: 'drop-down',
    fontFamily: 'Courier New, monospace',
    fontWeight: 300,
    use24HourFormat: true,
  };

  const baseTime: TimeObject = {
    hours: 14,
    minutes: 30,
    seconds: 45,
    date: 'Monday, January 1, 2024',
  };

  describe('24-Hour Format', () => {
    it('should display hours 00-23 in 24-hour format', () => {
      const preferences = { ...basePreferences, use24HourFormat: true };
      const time = { ...baseTime, hours: 14 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('14');
    });

    it('should not display AM/PM indicator in 24-hour format', () => {
      const preferences = { ...basePreferences, use24HourFormat: true };
      const time = { ...baseTime, hours: 14 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();
    });

    it('should display midnight as 00:00 in 24-hour format', () => {
      const preferences = { ...basePreferences, use24HourFormat: true };
      const time = { ...baseTime, hours: 0, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('00');
    });
  });

  describe('12-Hour Format', () => {
    it('should convert 14:00 to 02:00 PM', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 14, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('02');
      expect(screen.getByText('PM')).toBeInTheDocument();
    });

    it('should convert 13:00 to 01:00 PM', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 13, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('01');
      expect(screen.getByText('PM')).toBeInTheDocument();
    });

    it('should display 00:00 as 12:00 AM (midnight)', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 0, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('12');
      expect(screen.getByText('AM')).toBeInTheDocument();
    });

    it('should display 12:00 as 12:00 PM (noon)', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 12, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('12');
      expect(screen.getByText('PM')).toBeInTheDocument();
    });

    it('should display morning hours (1-11) with AM', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 9, minutes: 30 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('09');
      expect(screen.getByText('AM')).toBeInTheDocument();
    });

    it('should display afternoon/evening hours (13-23) with PM', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 21, minutes: 45 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('09');
      expect(screen.getByText('PM')).toBeInTheDocument();
    });

    it('should always display AM/PM in 12-hour format', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 3, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const amPm = screen.getByTestId('am-pm-indicator');
      expect(amPm).toBeInTheDocument();
    });

    it('should render AM/PM with correct styling', () => {
      const preferences = { ...basePreferences, use24HourFormat: false };
      const time = { ...baseTime, hours: 15, minutes: 0 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const amPm = screen.getByTestId('am-pm-indicator');
      expect(amPm).toHaveStyle({ fontSize: expect.any(String) });
    });
  });

  describe('Edge Cases', () => {
    it('should handle switching from 24H to 12H format', () => {
      const time = { ...baseTime, hours: 23, minutes: 59 };
      
      const { rerender } = render(
        <TimeRenderer
          time={time}
          preferences={{ ...basePreferences, use24HourFormat: true }}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      let display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('23');
      expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();

      rerender(
        <TimeRenderer
          time={time}
          preferences={{ ...basePreferences, use24HourFormat: false }}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('11');
      expect(screen.getByText('PM')).toBeInTheDocument();
    });

    it('should preserve minutes and seconds during format conversion', () => {
      const preferences = { ...basePreferences, use24HourFormat: false, showSeconds: true };
      const time = { ...baseTime, hours: 15, minutes: 42, seconds: 18 };
      
      render(
        <TimeRenderer
          time={time}
          preferences={preferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toContain('42');
      expect(display.textContent).toContain('18');
    });
  });
});
