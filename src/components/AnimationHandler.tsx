'use client';

import React from 'react';
import styled from 'styled-components';
import { FlipStyle } from '@/src/types';
import { CardFoldAnimation } from './CardFoldAnimation';
import { ClassicFlipAnimation } from './ClassicFlipAnimation';
import { DropDownAnimation } from './DropDownAnimation';

interface AnimationHandlerProps {
  children?: React.ReactNode;
  trigger: boolean;
  duration?: number;
  flipStyle?: FlipStyle;
  oldDigit?: string;
  newDigit?: string;
  backgroundColor?: string;
  renderContent?: (digit: string) => React.ReactNode;
  digit?: string;
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
  digit,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  const effectiveDuration = prefersReducedMotion ? 0 : duration;

  const resolvedDigit = digit ?? newDigit ?? oldDigit ?? '';
  const resolvedRenderContent = renderContent ?? ((value: string) => <span>{value}</span>);

  if (flipStyle === 'card-fold') {
    const safeOldDigit = oldDigit ?? resolvedDigit;
    const safeNewDigit = newDigit ?? digit ?? safeOldDigit;

    // Prefer explicit renderContent when provided
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

    // Use digit-driven default rendering when digits are provided
    if (digit !== undefined || newDigit !== undefined || oldDigit !== undefined) {
      const renderDigit = (value: string) => resolvedRenderContent(value);
      return (
        <CardFoldAnimation 
          trigger={trigger}
          duration={effectiveDuration}
          oldDigit={safeOldDigit}
          newDigit={safeNewDigit}
          backgroundColor={backgroundColor}
          renderContent={renderDigit}
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
    return <AnimatedContainer>{children}</AnimatedContainer>;
  }

  const content = renderContent
    ? renderContent(resolvedDigit)
    : (digit !== undefined || newDigit !== undefined || oldDigit !== undefined)
      ? <span>{resolvedDigit}</span>
      : children;

  if (flipStyle === 'drop-down') {
    return (
      <DropDownAnimation
        trigger={trigger}
        duration={effectiveDuration}
        prefersReducedMotion={prefersReducedMotion}
      >
        {content}
      </DropDownAnimation>
    );
  }

  return (
    <ClassicFlipAnimation
      trigger={trigger}
      duration={effectiveDuration}
      prefersReducedMotion={prefersReducedMotion}
    >
      {content}
    </ClassicFlipAnimation>
  );
};
