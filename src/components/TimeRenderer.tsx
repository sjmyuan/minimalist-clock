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
  gap: 0.1rem;
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
    z-index: 1;
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
    z-index: 1;
  }
  
  span {
    position: relative;
    z-index: 2;
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

  return (
    <TimeContainer $preferences={preferences} $scaleFactor={scaleFactor}>
      <TimeDisplay data-testid="time-display">
        <DigitGroup>
          <AnimationHandler trigger={shouldAnimateDigit0} flipStyle={preferences.flipStyle}>
            <DigitWrapper>
              <span>{hourString[0]}</span>
            </DigitWrapper>
          </AnimationHandler>
          <AnimationHandler trigger={shouldAnimateDigit1} flipStyle={preferences.flipStyle}>
            <DigitWrapper>
              <span>{hourString[1]}</span>
            </DigitWrapper>
          </AnimationHandler>
        </DigitGroup>
        <span>:</span>
        <DigitGroup>
          <AnimationHandler trigger={shouldAnimateDigit2} flipStyle={preferences.flipStyle}>
            <DigitWrapper>
              <span>{minuteString[0]}</span>
            </DigitWrapper>
          </AnimationHandler>
          <AnimationHandler trigger={shouldAnimateDigit3} flipStyle={preferences.flipStyle}>
            <DigitWrapper>
              <span>{minuteString[1]}</span>
            </DigitWrapper>
          </AnimationHandler>
        </DigitGroup>
        {preferences.showSeconds && (
          <>
            <span>:</span>
            <DigitGroup>
              <AnimationHandler trigger={shouldAnimateDigit4} flipStyle={preferences.flipStyle}>
                <DigitWrapper>
                  <span>{secondString[0]}</span>
                </DigitWrapper>
              </AnimationHandler>
              <AnimationHandler trigger={shouldAnimateDigit5} flipStyle={preferences.flipStyle}>
                <DigitWrapper>
                  <span>{secondString[1]}</span>
                </DigitWrapper>
              </AnimationHandler>
            </DigitGroup>
          </>
        )}
      </TimeDisplay>
      <DateDisplay>{time.date}</DateDisplay>
    </TimeContainer>
  );
};
