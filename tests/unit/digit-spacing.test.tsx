import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeRenderer } from '@/src/components/TimeRenderer';
import { UserPreferences, TimeObject } from '@/src/types';

describe('Refactor: Digit Spacing Within Groups', () => {
  const defaultPreferences: UserPreferences = {
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
    flipStyle: 'drop-down',
  };

  const defaultTime: TimeObject = {
    hours: 12,
    minutes: 34,
    seconds: 56,
    date: 'Sunday, December 8, 2024',
  };

  describe('Given the clock is displayed', () => {
    it('When viewing digit groups, Then the gap between two digits in each group should be comfortable (>=0.3rem)', () => {
      render(
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

      // Find the time display and get its direct children that are flex containers (DigitGroups)
      const timeDisplay = screen.getByTestId('time-display');
      const children = Array.from(timeDisplay.children);
      
      // Filter to get only DigitGroups (divs with display: flex, excluding colons which are spans)
      const digitGroups = children.filter(child => {
        const styles = window.getComputedStyle(child);
        return child.tagName === 'DIV' && styles.display === 'flex';
      });
      
      // Should have at least 2 digit groups (hours and minutes) when seconds are hidden
      expect(digitGroups.length).toBeGreaterThanOrEqual(2);

      digitGroups.forEach((group) => {
        const styles = window.getComputedStyle(group);
        const gap = styles.gap;
        
        // Gap should be at least 0.3rem
        const gapValue = parseFloat(gap);
        expect(gapValue).toBeGreaterThanOrEqual(0.3);
      });
    });

    it('When seconds are shown, Then all three digit groups should have comfortable spacing', () => {
      const preferencesWithSeconds: UserPreferences = {
        ...defaultPreferences,
        showSeconds: true,
      };

      render(
        <TimeRenderer
          time={defaultTime}
          preferences={preferencesWithSeconds}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      const timeDisplay = screen.getByTestId('time-display');
      const children = Array.from(timeDisplay.children);
      
      const digitGroups = children.filter(child => {
        const styles = window.getComputedStyle(child);
        return child.tagName === 'DIV' && styles.display === 'flex';
      });
      
      // Should have 3 digit groups (hours, minutes, and seconds)
      expect(digitGroups.length).toBe(3);

      digitGroups.forEach((group) => {
        const styles = window.getComputedStyle(group);
        const gap = styles.gap;
        const gapValue = parseFloat(gap);
        expect(gapValue).toBeGreaterThanOrEqual(0.3);
      });
    });

    it('When viewing the clock, Then digit pairs should be visually distinct but grouped', () => {
      render(
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

      const timeDisplay = screen.getByTestId('time-display');
      const children = Array.from(timeDisplay.children);
      
      const digitGroups = children.filter(child => {
        const styles = window.getComputedStyle(child);
        return child.tagName === 'DIV' && styles.display === 'flex';
      });
      
      expect(timeDisplay).toBeInTheDocument();
      
      // The gap within digit groups should be less than the gap between groups
      if (digitGroups.length >= 2) {
        const firstGroup = digitGroups[0];
        const groupGap = parseFloat(window.getComputedStyle(firstGroup).gap);
        const displayGap = parseFloat(window.getComputedStyle(timeDisplay).gap);
        
        // Display gap (between groups) should be larger than group gap (within groups)
        expect(displayGap).toBeGreaterThan(groupGap);
      }
    });
  });
});
