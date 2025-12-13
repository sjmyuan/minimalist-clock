'use client';

import React from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

interface ClassicFlipAnimationProps {
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

export const ClassicFlipAnimation: React.FC<ClassicFlipAnimationProps> = ({
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
      { rotateX: -90, opacity: 0 },
      { rotateX: 0, opacity: 1, duration, ease: 'power2.out' }
    );
  }, [trigger, duration, prefersReducedMotion]);

  return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
};
