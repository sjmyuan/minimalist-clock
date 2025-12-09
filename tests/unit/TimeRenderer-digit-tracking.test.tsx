import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeRenderer } from '@/src/components/TimeRenderer';
import { TimeObject, UserPreferences } from '@/src/types';

// Mock AnimationHandler to capture props
let capturedAnimationProps: any[] = [];

jest.mock('@/src/components/AnimationHandler', () => ({
  AnimationHandler: ({ children, oldDigit, newDigit, trigger, flipStyle }: any) => {
    capturedAnimationProps.push({ oldDigit, newDigit, trigger, flipStyle });
    return <div data-testid="animation-handler">{children}</div>;
  },
}));

describe('TimeRenderer - Digit Tracking for Physical Flip Clock', () => {
  const defaultPreferences: UserPreferences = {
    fontSize: 120,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
    flipStyle: 'card-fold',
  };

  beforeEach(() => {
    capturedAnimationProps = [];
  });

  describe('Previous Digit Tracking', () => {
    it('should track previous hour digits when time changes', () => {
      const initialTime: TimeObject = {
        hours: 9,
        minutes: 30,
        seconds: 0,
        date: '2024-01-01',
      };

      const { rerender } = render(
        <TimeRenderer
          time={initialTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // Change hour from 09 to 10 (both digits change)
      const newTime: TimeObject = {
        hours: 10,
        minutes: 30,
        seconds: 0,
        date: '2024-01-01',
      };

      capturedAnimationProps = [];
      rerender(
        <TimeRenderer
          time={newTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={true}  // hour tens: 0 -> 1
          shouldAnimateDigit1={true}  // hour ones: 9 -> 0
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // Find the animation handlers for hour digits
      const hourTensProps = capturedAnimationProps[0];
      const hourOnesProps = capturedAnimationProps[1];

      // Hour tens should have oldDigit='0' and newDigit='1'
      expect(hourTensProps.oldDigit).toBe('0');
      expect(hourTensProps.newDigit).toBe('1');

      // Hour ones should have oldDigit='9' and newDigit='0'
      expect(hourOnesProps.oldDigit).toBe('9');
      expect(hourOnesProps.newDigit).toBe('0');
    });

    it('should track previous minute digits when time changes', () => {
      const initialTime: TimeObject = {
        hours: 10,
        minutes: 59,
        seconds: 0,
        date: '2024-01-01',
      };

      const { rerender } = render(
        <TimeRenderer
          time={initialTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // Change minute from 59 to 00 (both digits change)
      const newTime: TimeObject = {
        hours: 11,
        minutes: 0,
        seconds: 0,
        date: '2024-01-01',
      };

      capturedAnimationProps = [];
      rerender(
        <TimeRenderer
          time={newTime}
          preferences={defaultPreferences}
          shouldAnimateDigit0={true}  // hour tens
          shouldAnimateDigit1={true}  // hour ones
          shouldAnimateDigit2={true}  // minute tens: 5 -> 0
          shouldAnimateDigit3={true}  // minute ones: 9 -> 0
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // Find the animation handlers for minute digits
      const minuteTensProps = capturedAnimationProps[2];
      const minuteOnesProps = capturedAnimationProps[3];

      // Minute tens should have oldDigit='5' and newDigit='0'
      expect(minuteTensProps.oldDigit).toBe('5');
      expect(minuteTensProps.newDigit).toBe('0');

      // Minute ones should have oldDigit='9' and newDigit='0'
      expect(minuteOnesProps.oldDigit).toBe('9');
      expect(minuteOnesProps.newDigit).toBe('0');
    });

    it('should track previous second digits when showSeconds is enabled', () => {
      const preferencesWithSeconds: UserPreferences = {
        ...defaultPreferences,
        showSeconds: true,
      };

      const initialTime: TimeObject = {
        hours: 10,
        minutes: 30,
        seconds: 59,
        date: '2024-01-01',
      };

      const { rerender } = render(
        <TimeRenderer
          time={initialTime}
          preferences={preferencesWithSeconds}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // Change second from 59 to 00
      const newTime: TimeObject = {
        hours: 10,
        minutes: 31,
        seconds: 0,
        date: '2024-01-01',
      };

      capturedAnimationProps = [];
      rerender(
        <TimeRenderer
          time={newTime}
          preferences={preferencesWithSeconds}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={true}  // minute ones
          shouldAnimateDigit4={true}  // second tens: 5 -> 0
          shouldAnimateDigit5={true}  // second ones: 9 -> 0
        />
      );

      // Find the animation handlers for second digits
      const secondTensProps = capturedAnimationProps[4];
      const secondOnesProps = capturedAnimationProps[5];

      // Second tens should have oldDigit='5' and newDigit='0'
      expect(secondTensProps.oldDigit).toBe('5');
      expect(secondTensProps.newDigit).toBe('0');

      // Second ones should have oldDigit='9' and newDigit='0'
      expect(secondOnesProps.oldDigit).toBe('9');
      expect(secondOnesProps.newDigit).toBe('0');
    });

    it('should only pass digits when flipStyle is card-fold', () => {
      const classicFlipPreferences: UserPreferences = {
        ...defaultPreferences,
        flipStyle: 'classic-flip',
      };

      const time: TimeObject = {
        hours: 10,
        minutes: 30,
        seconds: 0,
        date: '2024-01-01',
      };

      render(
        <TimeRenderer
          time={time}
          preferences={classicFlipPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // For non-card-fold styles, oldDigit and newDigit should be undefined
      capturedAnimationProps.forEach(props => {
        expect(props.oldDigit).toBeUndefined();
        expect(props.newDigit).toBeUndefined();
      });
    });

    it('should pass digits only when flipStyle is card-fold', () => {
      const time: TimeObject = {
        hours: 10,
        minutes: 30,
        seconds: 0,
        date: '2024-01-01',
      };

      render(
        <TimeRenderer
          time={time}
          preferences={defaultPreferences}
          shouldAnimateDigit0={false}
          shouldAnimateDigit1={false}
          shouldAnimateDigit2={false}
          shouldAnimateDigit3={false}
          shouldAnimateDigit4={false}
          shouldAnimateDigit5={false}
        />
      );

      // For card-fold, oldDigit and newDigit should be defined
      capturedAnimationProps.forEach(props => {
        expect(props.oldDigit).toBeDefined();
        expect(props.newDigit).toBeDefined();
      });
    });
  });
});
