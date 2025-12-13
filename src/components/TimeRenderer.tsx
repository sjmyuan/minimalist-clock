'use client';

import React from 'react';
import styled from 'styled-components';
import { TimeObject, UserPreferences } from '@/src/types';
import { AnimationHandler } from './AnimationHandler';
import { usePrevious } from '@/src/utils/usePrevious';

interface TimeRendererProps {
  time: TimeObject;
  preferences: UserPreferences;
  shouldAnimateDigit0: boolean; // hour tens
  shouldAnimateDigit1: boolean; // hour ones
  shouldAnimateDigit2: boolean; // minute tens
  shouldAnimateDigit3: boolean; // minute ones
  shouldAnimateDigit4: boolean; // second tens
  shouldAnimateDigit5: boolean; // second ones
  scaleFactor?: number;
}

const TimeContainer = styled.div<{ $preferences: UserPreferences; $scaleFactor: number }>`
  font-size: ${(props) => props.$preferences.fontSize * props.$scaleFactor}px;
  color: ${(props) => props.$preferences.fontColor};
  font-family: 'Courier New', monospace;
  font-weight: 300;
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const TimeDisplay = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1.5em;
  font-weight: 200;
  line-height: 1;
`;

const DigitGroup = styled.div`
  display: flex;
  gap: 0.3rem;
`;



const DateDisplay = styled.div`
  font-size: 0.2em;
  opacity: 0.6;
  font-weight: 300;
`;

export const TimeRenderer: React.FC<TimeRendererProps> = ({ 
  time, 
  preferences,
  shouldAnimateDigit0,
  shouldAnimateDigit1,
  shouldAnimateDigit2,
  shouldAnimateDigit3,
  shouldAnimateDigit4,
  shouldAnimateDigit5,
  scaleFactor = 1.0
}) => {
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const hourString = formatTime(time.hours);
  const minuteString = formatTime(time.minutes);
  const secondString = formatTime(time.seconds);

  // Track previous digit values for physical flip clock animation
  const prevHourString = usePrevious(hourString) ?? hourString;
  const prevMinuteString = usePrevious(minuteString) ?? minuteString;
  const prevSecondString = usePrevious(secondString) ?? secondString;

  // Determine if we should pass digit props (only for card-fold style)
  const shouldPassDigits = preferences.flipStyle === 'card-fold';

  const renderDigit = (
    digit: string, 
    prevDigit: string, 
    shouldAnimate: boolean, 
    key: string
  ) => (
    <AnimationHandler 
      key={key}
      trigger={shouldAnimate} 
      flipStyle={preferences.flipStyle}
      oldDigit={shouldPassDigits ? prevDigit : undefined}
      newDigit={shouldPassDigits ? digit : undefined}
      backgroundColor={preferences.backgroundColor}
      digit={digit}
    />
  );

  return (
    <TimeContainer $preferences={preferences} $scaleFactor={scaleFactor}>
      <TimeDisplay data-testid="time-display">
        <DigitGroup>
          {renderDigit(hourString[0], prevHourString[0], shouldAnimateDigit0, 'h0')}
          {renderDigit(hourString[1], prevHourString[1], shouldAnimateDigit1, 'h1')}
        </DigitGroup>
        <span>:</span>
        <DigitGroup>
          {renderDigit(minuteString[0], prevMinuteString[0], shouldAnimateDigit2, 'm0')}
          {renderDigit(minuteString[1], prevMinuteString[1], shouldAnimateDigit3, 'm1')}
        </DigitGroup>
        {preferences.showSeconds && (
          <>
            <span>:</span>
            <DigitGroup>
              {renderDigit(secondString[0], prevSecondString[0], shouldAnimateDigit4, 's0')}
              {renderDigit(secondString[1], prevSecondString[1], shouldAnimateDigit5, 's1')}
            </DigitGroup>
          </>
        )}
      </TimeDisplay>
      <DateDisplay>{time.date}</DateDisplay>
    </TimeContainer>
  );
};
