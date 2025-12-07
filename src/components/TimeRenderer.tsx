'use client';

import React from 'react';
import styled from 'styled-components';
import { TimeObject, UserPreferences } from '@/src/types';

interface TimeRendererProps {
  time: TimeObject;
  preferences: UserPreferences;
}

const TimeContainer = styled.div<{ $preferences: UserPreferences }>`
  font-size: ${(props) => props.$preferences.fontSize}px;
  color: ${(props) => props.$preferences.fontColor};
  font-family: 'Courier New', monospace;
  font-weight: 300;
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const TimeDisplay = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const DateDisplay = styled.div`
  font-size: 0.4em;
  opacity: 0.8;
`;

export const TimeRenderer: React.FC<TimeRendererProps> = ({ time, preferences }) => {
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <TimeContainer $preferences={preferences}>
      <TimeDisplay>
        <span>{formatTime(time.hours)}</span>
        <span>:</span>
        <span>{formatTime(time.minutes)}</span>
      </TimeDisplay>
      <DateDisplay>{time.date}</DateDisplay>
    </TimeContainer>
  );
};
