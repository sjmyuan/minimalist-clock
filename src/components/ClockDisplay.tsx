'use client';

import React from 'react';
import styled from 'styled-components';
import { TimeObject, UserPreferences } from '@/src/types';
import { TimeRenderer } from './TimeRenderer';
import { useResponsiveLayout } from '@/src/utils';

interface ClockDisplayProps {
  preferences: UserPreferences;
}

const ClockContainer = styled.div<{ $backgroundColor: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$backgroundColor};
  transition: background-color 0.3s ease;
`;

export const ClockDisplay: React.FC<ClockDisplayProps> = ({ preferences }) => {
  const { scaleFactor } = useResponsiveLayout();
  const [time, setTime] = React.useState<TimeObject>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    date: '',
  });
  const [shouldAnimateDigit0, setShouldAnimateDigit0] = React.useState(false); // hour tens
  const [shouldAnimateDigit1, setShouldAnimateDigit1] = React.useState(false); // hour ones
  const [shouldAnimateDigit2, setShouldAnimateDigit2] = React.useState(false); // minute tens
  const [shouldAnimateDigit3, setShouldAnimateDigit3] = React.useState(false); // minute ones
  const [shouldAnimateDigit4, setShouldAnimateDigit4] = React.useState(false); // second tens
  const [shouldAnimateDigit5, setShouldAnimateDigit5] = React.useState(false); // second ones

  const lastTimeRef = React.useRef<TimeObject>(time);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const newTime = {
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

      const lastTime = lastTimeRef.current;

      // Convert hours to display format if needed
      const convert24To12 = (hours: number): number => {
        if (hours === 0) return 12;
        if (hours <= 12) return hours;
        return hours - 12;
      };

      const getDisplayHours = (hours: number): number => {
        return preferences.use24HourFormat ? hours : convert24To12(hours);
      };

      // Format old and new time to compare individual digits (using display format)
      const oldDisplayHours = getDisplayHours(lastTime.hours);
      const newDisplayHours = getDisplayHours(newTime.hours);
      const oldHourString = oldDisplayHours.toString().padStart(2, '0');
      const newHourString = newDisplayHours.toString().padStart(2, '0');
      const oldMinuteString = lastTime.minutes.toString().padStart(2, '0');
      const newMinuteString = newTime.minutes.toString().padStart(2, '0');
      const oldSecondString = lastTime.seconds.toString().padStart(2, '0');
      const newSecondString = newTime.seconds.toString().padStart(2, '0');

      // Check each digit independently
      if (oldHourString[0] !== newHourString[0]) {
        setShouldAnimateDigit0(true);
        setTimeout(() => setShouldAnimateDigit0(false), 100);
      }

      if (oldHourString[1] !== newHourString[1]) {
        setShouldAnimateDigit1(true);
        setTimeout(() => setShouldAnimateDigit1(false), 100);
      }

      if (oldMinuteString[0] !== newMinuteString[0]) {
        setShouldAnimateDigit2(true);
        setTimeout(() => setShouldAnimateDigit2(false), 100);
      }

      if (oldMinuteString[1] !== newMinuteString[1]) {
        setShouldAnimateDigit3(true);
        setTimeout(() => setShouldAnimateDigit3(false), 100);
      }

      if (oldSecondString[0] !== newSecondString[0]) {
        setShouldAnimateDigit4(true);
        setTimeout(() => setShouldAnimateDigit4(false), 100);
      }

      if (oldSecondString[1] !== newSecondString[1]) {
        setShouldAnimateDigit5(true);
        setTimeout(() => setShouldAnimateDigit5(false), 100);
      }

      setTime(newTime);
      lastTimeRef.current = newTime;
    };

    // Immediately update time when format or flip style changes
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [preferences.use24HourFormat, preferences.flipStyle]);

  // Force immediate re-render when time format or flip style changes
  React.useEffect(() => {
    // Trigger animation for all digits when format or flip style changes
    setShouldAnimateDigit0(true);
    setShouldAnimateDigit1(true);
    setShouldAnimateDigit2(true);
    setShouldAnimateDigit3(true);
    if (preferences.showSeconds) {
      setShouldAnimateDigit4(true);
      setShouldAnimateDigit5(true);
    }
    setTimeout(() => {
      setShouldAnimateDigit0(false);
      setShouldAnimateDigit1(false);
      setShouldAnimateDigit2(false);
      setShouldAnimateDigit3(false);
      setShouldAnimateDigit4(false);
      setShouldAnimateDigit5(false);
    }, 100);
  }, [preferences.use24HourFormat, preferences.flipStyle, preferences.showSeconds]);

  return (
    <ClockContainer $backgroundColor={preferences.backgroundColor}>
      <TimeRenderer 
        time={time} 
        preferences={preferences}
        shouldAnimateDigit0={shouldAnimateDigit0}
        shouldAnimateDigit1={shouldAnimateDigit1}
        shouldAnimateDigit2={shouldAnimateDigit2}
        shouldAnimateDigit3={shouldAnimateDigit3}
        shouldAnimateDigit4={shouldAnimateDigit4}
        shouldAnimateDigit5={shouldAnimateDigit5}
        scaleFactor={scaleFactor}
      />
    </ClockContainer>
  );
};
