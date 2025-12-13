'use client';

import React from 'react';
import styled from 'styled-components';
import { TimeObject, UserPreferences } from '@/src/types';
import { AnimationHandler } from './AnimationHandler';

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

const DigitWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3em 0.4em;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.15em;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  min-width: 0.8em;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 0, 0, 0.3) 10%, 
      rgba(0, 0, 0, 0.3) 90%, 
      transparent 100%
    );
    transform: translateY(-50%);
    z-index: 2;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 10%, 
      rgba(255, 255, 255, 0.1) 90%, 
      transparent 100%
    );
    transform: translateY(calc(-50% + 1px));
    z-index: 2;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
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
  const prevHourStringRef = React.useRef(hourString);
  const prevMinuteStringRef = React.useRef(minuteString);
  const prevSecondStringRef = React.useRef(secondString);

  // Store current values as previous for next render
  React.useEffect(() => {
    prevHourStringRef.current = hourString;
    prevMinuteStringRef.current = minuteString;
    prevSecondStringRef.current = secondString;
  });

  // Determine if we should pass digit props (only for card-fold style)
  const shouldPassDigits = preferences.flipStyle === 'card-fold';

  const renderDigitContent = (digit: string) => (
    <DigitWrapper>
      <span>{digit}</span>
    </DigitWrapper>
  );

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
      renderContent={renderDigitContent}
    >
      {renderDigitContent(digit)}
    </AnimationHandler>
  );

  return (
    <TimeContainer $preferences={preferences} $scaleFactor={scaleFactor}>
      <TimeDisplay data-testid="time-display">
        <DigitGroup>
          {renderDigit(hourString[0], prevHourStringRef.current[0], shouldAnimateDigit0, 'h0')}
          {renderDigit(hourString[1], prevHourStringRef.current[1], shouldAnimateDigit1, 'h1')}
        </DigitGroup>
        <span>:</span>
        <DigitGroup>
          {renderDigit(minuteString[0], prevMinuteStringRef.current[0], shouldAnimateDigit2, 'm0')}
          {renderDigit(minuteString[1], prevMinuteStringRef.current[1], shouldAnimateDigit3, 'm1')}
        </DigitGroup>
        {preferences.showSeconds && (
          <>
            <span>:</span>
            <DigitGroup>
              {renderDigit(secondString[0], prevSecondStringRef.current[0], shouldAnimateDigit4, 's0')}
              {renderDigit(secondString[1], prevSecondStringRef.current[1], shouldAnimateDigit5, 's1')}
            </DigitGroup>
          </>
        )}
      </TimeDisplay>
      <DateDisplay>{time.date}</DateDisplay>
    </TimeContainer>
  );
};
