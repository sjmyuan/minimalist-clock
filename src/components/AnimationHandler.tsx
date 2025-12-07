'use client';

import React from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

interface AnimationHandlerProps {
  children: React.ReactNode;
  trigger: boolean;
  duration?: number;
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
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (trigger && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { rotateX: -90, opacity: 0 },
        { rotateX: 0, opacity: 1, duration, ease: 'power2.out' }
      );
    }
  }, [trigger, duration]);

  return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
};
