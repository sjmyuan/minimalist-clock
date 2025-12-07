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
}

const AnimatedContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

export const AnimationHandler: React.FC<AnimationHandlerProps> = ({
  children,
  trigger,
  duration = 0.75,
  flipStyle = 'classic-flip',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

  return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
};
