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

  return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
};
