'use client';

import React from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { FlipStyle } from '@/src/types';

interface AnimationHandlerProps {
  children: React.ReactNode;
  trigger: boolean;
  duration?: number;
  flipStyle?: FlipStyle;
  oldDigit?: string;
  newDigit?: string;
  backgroundColor?: string;
}

const AnimatedContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

// Flip clock card structure components
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

export const AnimationHandler: React.FC<AnimationHandlerProps> = ({
  children,
  trigger,
  duration = 0.75,
  flipStyle = 'classic-flip',
  oldDigit,
  newDigit,
  backgroundColor = '#000000',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const overlayContentRef = React.useRef<HTMLDivElement>(null);
  
  const [overlayClipPath, setOverlayClipPath] = React.useState('inset(0 0 50% 0)');
  const [overlayDigit, setOverlayDigit] = React.useState<string | undefined>(oldDigit);
  const [bottomCardDigit, setBottomCardDigit] = React.useState<string | undefined>(oldDigit);

  React.useEffect(() => {
    if (trigger && overlayRef.current && flipStyle === 'card-fold') {
      // Physical flip clock: Two-phase animation timeline
      const overlay = overlayRef.current;
      const overlayContent = overlayContentRef.current;
      
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
    
    if (trigger && containerRef.current) {
      if (flipStyle === 'drop-down') {
        // Drop-down animation: upper half drops with 3D perspective
        gsap.fromTo(
          containerRef.current,
          { 
            y: '-50%', 
            rotateX: -15, 
            opacity: 0,
            transformOrigin: 'center top'
          },
          { 
            y: 0, 
            rotateX: 0, 
            opacity: 1, 
            duration, 
            ease: 'power2.out',
            transformOrigin: 'center top'
          }
        );
      } else {
        // Classic flip animation: full 3D rotateX flip
        gsap.fromTo(
          containerRef.current,
          { rotateX: -90, opacity: 0 },
          { rotateX: 0, opacity: 1, duration, ease: 'power2.out' }
        );
      }
    }
  }, [trigger, duration, flipStyle]);

  // Render split card structure for card-fold style
  if (flipStyle === 'card-fold') {
    // Clone children to extract wrapper styling
    const createDigitContent = (digit: string | undefined) => {
      if (digit && React.isValidElement(children)) {
        const props = { ...children.props as object, children: <span>{digit}</span> };
        return React.cloneElement(children, props);
      }
      return children;
    };

    const oldDigitContent = createDigitContent(oldDigit);
    const newDigitContent = createDigitContent(newDigit);
    const overlayContent = createDigitContent(overlayDigit);
    const bottomCardContent = createDigitContent(bottomCardDigit);
    const displayContent = newDigitContent || oldDigitContent;

    return (
      <FlipCardContainer ref={containerRef}>
        <HeightReference>{displayContent}</HeightReference>
        {/* Upper static card: top half of old digit */}
        <StaticCard data-card-type="upper" $clipPath="inset(0 0 50% 0)" $backgroundColor={backgroundColor}>
          {oldDigitContent}
        </StaticCard>
        {/* Bottom static card: starts with bottom half of old digit, switches to new digit */}
        <StaticCard data-card-type="bottom" $clipPath="inset(50% 0 0 0)" $backgroundColor={backgroundColor}>
          {bottomCardContent}
        </StaticCard>
        {/* Overlay: starts as top half of old digit, becomes bottom half of new digit */}
        <OverlayCard 
          ref={overlayRef} 
          data-card-type="overlay"
          $clipPath={overlayClipPath}
          $backgroundColor={backgroundColor}
        >
          <div ref={overlayContentRef}>
            {overlayContent}
          </div>
        </OverlayCard>
      </FlipCardContainer>
    );
  }

  return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
};
