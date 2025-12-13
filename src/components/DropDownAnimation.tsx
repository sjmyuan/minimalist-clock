'use client';

import React from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

interface DropDownAnimationProps {
  trigger: boolean;
  duration?: number;
  prefersReducedMotion?: boolean;
  children?: React.ReactNode;
}

const AnimatedContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
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

export const DropDownAnimation: React.FC<DropDownAnimationProps> = ({
  trigger,
  duration = 0.75,
  prefersReducedMotion = false,
  children,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!trigger || !containerRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1, rotateX: 0, y: 0 });
      return;
    }

    gsap.fromTo(
      containerRef.current,
      {
        y: '-50%',
        rotateX: -15,
        opacity: 0,
        transformOrigin: 'center top',
      },
      {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration,
        ease: 'power2.out',
        transformOrigin: 'center top',
      }
    );
  }, [trigger, duration, prefersReducedMotion]);

  return (
    <AnimatedContainer ref={containerRef}>
      <DigitWrapper>
        {children}
      </DigitWrapper>
    </AnimatedContainer>
  );
};
