'use client';

import React from 'react';
import styled from 'styled-components';
import { TimeObject, UserPreferences } from '@/src/types';
import { TimeRenderer } from './TimeRenderer';
import { AnimationHandler } from './AnimationHandler';

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
  const [time, setTime] = React.useState<TimeObject>({
    hours: 0,
    minutes: 0,
    date: '',
  });
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const newTime = {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        date: now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      if (newTime.minutes !== time.minutes) {
        setShouldAnimate(true);
        setTimeout(() => setShouldAnimate(false), 100);
      }

      setTime(newTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [time.minutes]);

  return (
    <ClockContainer $backgroundColor={preferences.backgroundColor}>
      <AnimationHandler trigger={shouldAnimate}>
        <TimeRenderer time={time} preferences={preferences} />
      </AnimationHandler>
    </ClockContainer>
  );
};
