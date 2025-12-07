import { useState, useEffect } from 'react';

export type ViewportType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveLayout {
  viewport: ViewportType;
  scaleFactor: number;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const calculateScaleFactor = (width: number): number => {
  // Mobile: 0.4 - 0.6 scale
  if (width < MOBILE_BREAKPOINT) {
    return Math.max(0.4, Math.min(0.6, width / 1280));
  }
  
  // Tablet: 0.75 - 1.0 scale (inclusive of 1024)
  if (width <= TABLET_BREAKPOINT) {
    const tabletRange = TABLET_BREAKPOINT - MOBILE_BREAKPOINT;
    const position = width - MOBILE_BREAKPOINT;
    return 0.75 + (position / tabletRange) * 0.25;
  }
  
  // Desktop: 1.0 - 1.5 scale
  // At 1920px = 1.0, at 3840px = 1.5
  if (width <= 1920) {
    return 1.0;
  }
  
  return Math.min(1.5, 1.0 + ((width - 1920) / 1920) * 0.5);
};

const getViewportType = (width: number): ViewportType => {
  if (width < MOBILE_BREAKPOINT) return 'mobile';
  if (width <= TABLET_BREAKPOINT) return 'tablet';
  return 'desktop';
};

export const useResponsiveLayout = (): ResponsiveLayout => {
  const [layout, setLayout] = useState<ResponsiveLayout>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    return {
      viewport: getViewportType(width),
      scaleFactor: calculateScaleFactor(width),
    };
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setLayout({
          viewport: getViewportType(width),
          scaleFactor: calculateScaleFactor(width),
        });
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return layout;
};
