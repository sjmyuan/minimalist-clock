import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeRenderer } from '@/src/components/TimeRenderer';
import { UserPreferences } from '@/src/types';

describe('TimeRenderer - Z-Index Layering', () => {
  const defaultPreferences: UserPreferences = {
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
    flipStyle: 'drop-down',
  };

  const mockTime = {
    hours: 10,
    minutes: 30,
    seconds: 45,
    date: 'Sunday, December 8, 2024',
  };

  describe('Cross line covering digit', () => {
    it('should render digit span with z-index 1 so cross lines can cover it', () => {
      const { container } = render(
        <TimeRenderer
          time={mockTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // Get the time display element which is rendered
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toBeInTheDocument();
      
      // Find all span elements inside the time display
      const allSpans = timeDisplay.querySelectorAll('span');
      
      // Filter to get only digit spans (exclude colons)
      const digitSpans = Array.from(allSpans).filter(span => {
        const text = span.textContent || '';
        return text.length === 1 && /\d/.test(text);
      });
      
      // Should have at least 4 digits (hours and minutes)
      expect(digitSpans.length).toBeGreaterThanOrEqual(4);
      
      // Check that each digit span has the correct z-index
      digitSpans.forEach((span) => {
        const styles = window.getComputedStyle(span);
        const zIndex = styles.getPropertyValue('z-index');
        
        // The digit span should have z-index: 1 (lower than cross lines which should be 2)
        expect(zIndex).toBe('1');
      });
    });

    it('should have digit wrapper with position relative to enable z-index stacking', () => {
      const { container } = render(
        <TimeRenderer
          time={mockTime}
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
      const allSpans = timeDisplay.querySelectorAll('span');
      
      // Get parent divs of digit spans (the DigitWrappers)
      const digitWrappers = Array.from(allSpans)
        .filter(span => {
          const text = span.textContent || '';
          return text.length === 1 && /\d/.test(text);
        })
        .map(span => span.parentElement)
        .filter((el): el is HTMLElement => el !== null);
      
      expect(digitWrappers.length).toBeGreaterThanOrEqual(4);
      
      digitWrappers.forEach((wrapper) => {
        const styles = window.getComputedStyle(wrapper);
        const position = styles.getPropertyValue('position');
        
        // Wrapper must have position: relative for z-index to work
        expect(position).toBe('relative');
      });
    });
  });
});
