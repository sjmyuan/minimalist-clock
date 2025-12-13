'use client';

import React from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

interface CardFoldAnimationProps {
  trigger: boolean;
  duration?: number;
  oldDigit: string;
  newDigit: string;
  backgroundColor?: string;
  renderContent: (digit: string) => React.ReactNode;
}

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

const FlipCardContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const HeightReference = styled.div`
  visibility: hidden;
`;

const StaticCard = styled.div<{ $clipPath: string; $backgroundColor: string }>`
  clip-path: ${props => props.$clipPath};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
  border-radius: 0.15em;
  
  & > * {
    overflow: hidden;
    border-radius: 0.15em;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$backgroundColor};
    z-index: -1;
  }
`;

const OverlayCard = styled.div<{ $clipPath: string; $backgroundColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  clip-path: ${props => props.$clipPath};
  transform-style: preserve-3d;
  overflow: hidden;
  border-radius: 0.15em;
  
  & > * {
    overflow: hidden;
    border-radius: 0.15em;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$backgroundColor};
    z-index: -1;
  }
`;

export const CardFoldAnimation: React.FC<CardFoldAnimationProps> = ({
  trigger,
  duration = 0.75,
  oldDigit,
  newDigit,
  backgroundColor = '#000000',
  renderContent,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const overlayContentRef = React.useRef<HTMLDivElement>(null);
  
  const [overlayClipPath, setOverlayClipPath] = React.useState('inset(0 0 50% 0)');
  const [overlayDigit, setOverlayDigit] = React.useState<string>(oldDigit);
  const [bottomCardDigit, setBottomCardDigit] = React.useState<string>(oldDigit);

  React.useEffect(() => {
    if (trigger && overlayRef.current) {
      // Physical flip clock: Two-phase animation timeline
      const overlay = overlayRef.current;
      
      if (duration === 0) {
        // Instant update for reduced motion or zero duration
        setOverlayClipPath('inset(50% 0 0 0)');
        setOverlayDigit(newDigit);
        setBottomCardDigit(newDigit);
        return;
      }
      
      // Reset overlay to show top half of old digit
      setOverlayClipPath('inset(0 0 50% 0)');
      setOverlayDigit(oldDigit);
      setBottomCardDigit(oldDigit);
      
      const timeline = gsap.timeline();
      const phaseDuration = duration / 2; // 375ms per phase
      
      // Phase 1: Top half of old digit rotates down (0° to -90°)
      // Set initial state with transform-origin at center center
      gsap.set(overlay, { 
        rotateX: 0,
        transformOrigin: 'center center'
      });
      
      // Phase 1 (0-375ms): Top half rotates down from 0° to -90°
      timeline.to(overlay, {
        rotateX: -90,
        transformOrigin: 'center center',
        duration: phaseDuration,
        ease: 'power2.out',
        onComplete: () => {
          // Switch to Phase 2: bottom half of new digit
          setOverlayClipPath('inset(50% 0 0 0)');
          setOverlayDigit(newDigit);
          
          // Immediately set new rotation and origin for phase 2
          gsap.set(overlay, { 
            rotateX: 90,
            transformOrigin: 'center center'
          });
        }
      });
      
      // Phase 2 (375-750ms): Bottom half rotates up from 90° to 0°
      timeline.to(overlay, {
        rotateX: 0,
        transformOrigin: 'center center',
        duration: phaseDuration,
        ease: 'power2.out',
        onComplete: () => {
          // After animation completes, switch bottom card to new digit
          setBottomCardDigit(newDigit);
        }
      });
      
      return;
    }
  }, [trigger, duration, oldDigit, newDigit]);

  const oldDigitContent = <DigitWrapper>{renderContent(oldDigit)}</DigitWrapper>;
  const overlayContent = <DigitWrapper>{renderContent(overlayDigit)}</DigitWrapper>;
  const bottomCardContent = <DigitWrapper>{renderContent(bottomCardDigit)}</DigitWrapper>;
  // Use newDigit for the height reference to ensure container size is correct for the incoming digit
  // (though usually digits are monospaced/same size)
  const displayContent = <DigitWrapper>{renderContent(newDigit)}</DigitWrapper>;

  return (
    <FlipCardContainer ref={containerRef}>
      {/* Height reference is the only one accessible to screen readers */}
      <HeightReference>{displayContent}</HeightReference>
      
      {/* Upper static card: top half of old digit */}
      <StaticCard 
        data-card-type="upper" 
        $clipPath="inset(0 0 50% 0)" 
        $backgroundColor={backgroundColor}
        aria-hidden="true"
      >
        {oldDigitContent}
      </StaticCard>
      
      {/* Bottom static card: starts with bottom half of old digit, switches to new digit */}
      <StaticCard 
        data-card-type="bottom" 
        $clipPath="inset(50% 0 0 0)" 
        $backgroundColor={backgroundColor}
        aria-hidden="true"
      >
        {bottomCardContent}
      </StaticCard>
      
      {/* Overlay: starts as top half of old digit, becomes bottom half of new digit */}
      <OverlayCard 
        ref={overlayRef} 
        data-card-type="overlay"
        $clipPath={overlayClipPath}
        $backgroundColor={backgroundColor}
        aria-hidden="true"
      >
        <div ref={overlayContentRef}>
          {overlayContent}
        </div>
      </OverlayCard>
    </FlipCardContainer>
  );
};
