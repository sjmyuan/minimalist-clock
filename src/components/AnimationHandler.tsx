'use client';

import React from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { FlipStyle } from '@/src/types';
import { CardFoldAnimation } from './CardFoldAnimation';

interface AnimationHandlerProps {
  children?: React.ReactNode;
  trigger: boolean;
  duration?: number;
  flipStyle?: FlipStyle;
  oldDigit?: string;
  newDigit?: string;
  backgroundColor?: string;
  renderContent?: (digit: string) => React.ReactNode;
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
  oldDigit,
  newDigit,
  backgroundColor = '#000000',
  renderContent,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  const effectiveDuration = prefersReducedMotion ? 0 : duration;

  React.useEffect(() => {
    if (trigger && containerRef.current && flipStyle !== 'card-fold') {
      if (prefersReducedMotion) {
        // Instant update without animation
        gsap.set(containerRef.current, { opacity: 1, rotateX: 0, y: 0 });
        return;
      }

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
            duration: effectiveDuration, 
            ease: 'power2.out',
            transformOrigin: 'center top'
          }
        );
      } else {
        // Classic flip animation: full 3D rotateX flip
        gsap.fromTo(
          containerRef.current,
          { rotateX: -90, opacity: 0 },
          { rotateX: 0, opacity: 1, duration: effectiveDuration, ease: 'power2.out' }
        );
      }
    }
  }, [trigger, effectiveDuration, flipStyle, prefersReducedMotion]);

  if (flipStyle === 'card-fold') {
    const safeOldDigit = oldDigit ?? '';
    const safeNewDigit = newDigit ?? safeOldDigit;

    // Prefer renderContent if available
    if (renderContent) {
      return (
        <CardFoldAnimation 
          trigger={trigger}
          duration={effectiveDuration}
          oldDigit={safeOldDigit}
          newDigit={safeNewDigit}
          backgroundColor={backgroundColor}
          renderContent={renderContent}
        />
      );
    }

    // Fallback for backward compatibility: clone children
    if (children && React.isValidElement(children)) {
       const fallbackRenderContent = (digit: string) => {
          if (!digit) return children;
          const props = { ...children.props as object, children: <span>{digit}</span> };
          return React.cloneElement(children, props);
       };
       return (
          <CardFoldAnimation 
            trigger={trigger}
            duration={effectiveDuration}
            oldDigit={safeOldDigit}
            newDigit={safeNewDigit}
            backgroundColor={backgroundColor}
            renderContent={fallbackRenderContent}
          />
       );
    }
    
    // If we can't render card-fold properly, just render children (though animation won't work right)
    return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
  }

  return <AnimatedContainer ref={containerRef}>{children}</AnimatedContainer>;
};
