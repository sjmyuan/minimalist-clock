import React from 'react';
import { render } from '@testing-library/react';
import { TimeRenderer } from '@/src/components/TimeRenderer';
import { UserPreferences } from '@/src/types';

describe('TimeRenderer - Font Family and Font Weight Styling', () => {
  const defaultTime = {
    hours: 12,
    minutes: 34,
    seconds: 56,
    date: 'Monday, January 1, 2024',
  };

  const defaultPreferences: UserPreferences = {
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
    flipStyle: 'drop-down',
    fontFamily: 'Courier New, monospace',
    fontWeight: 300,
  };

  describe('Font Family Styling', () => {
    it('should apply default fontFamily to TimeContainer', () => {
      const { container } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(timeContainer);
      expect(styles.fontFamily).toContain('Courier New');
    });

    it('should apply custom fontFamily when specified', () => {
      const customPreferences: UserPreferences = {
        ...defaultPreferences,
        fontFamily: 'Arial, sans-serif',
      };

      const { container } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={customPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(timeContainer);
      expect(styles.fontFamily).toContain('Arial');
    });

    it('should update fontFamily when preferences change', () => {
      const { container, rerender } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      let styles = window.getComputedStyle(timeContainer);
      expect(styles.fontFamily).toContain('Courier New');

      const newPreferences: UserPreferences = {
        ...defaultPreferences,
        fontFamily: 'Georgia, serif',
      };

      rerender(
        <TimeRenderer
          time={defaultTime}
          preferences={newPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      styles = window.getComputedStyle(timeContainer);
      expect(styles.fontFamily).toContain('Georgia');
    });
  });

  describe('Font Weight Styling', () => {
    it('should apply default fontWeight to TimeContainer', () => {
      const { container } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(timeContainer);
      expect(styles.fontWeight).toBe('300');
    });

    it('should apply custom fontWeight when specified', () => {
      const customPreferences: UserPreferences = {
        ...defaultPreferences,
        fontWeight: 700,
      };

      const { container } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={customPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(timeContainer);
      expect(styles.fontWeight).toBe('700');
    });

    it('should update fontWeight when preferences change', () => {
      const { container, rerender } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      let styles = window.getComputedStyle(timeContainer);
      expect(styles.fontWeight).toBe('300');

      const newPreferences: UserPreferences = {
        ...defaultPreferences,
        fontWeight: 900,
      };

      rerender(
        <TimeRenderer
          time={defaultTime}
          preferences={newPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      styles = window.getComputedStyle(timeContainer);
      expect(styles.fontWeight).toBe('900');
    });

    it('should support all standard font weight values', () => {
      const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

      fontWeights.forEach((weight) => {
        const customPreferences: UserPreferences = {
          ...defaultPreferences,
          fontWeight: weight,
        };

        const { container } = render(
          <TimeRenderer
            time={defaultTime}
            preferences={customPreferences}
            shouldAnimateDigit0={false}
            shouldAnimateDigit1={false}
            shouldAnimateDigit2={false}
            shouldAnimateDigit3={false}
            shouldAnimateDigit4={false}
            shouldAnimateDigit5={false}
          />
        );

        const timeContainer = container.firstChild as HTMLElement;
        const styles = window.getComputedStyle(timeContainer);
        expect(styles.fontWeight).toBe(weight.toString());
      });
    });
  });

  describe('Combined Font Styling', () => {
    it('should apply both fontFamily and fontWeight together', () => {
      const customPreferences: UserPreferences = {
        ...defaultPreferences,
        fontFamily: 'Times New Roman, serif',
        fontWeight: 600,
      };

      const { container } = render(
        <TimeRenderer
          time={defaultTime}
          preferences={customPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(timeContainer);
      expect(styles.fontFamily).toContain('Times New Roman');
      expect(styles.fontWeight).toBe('600');
    });
  });
});
