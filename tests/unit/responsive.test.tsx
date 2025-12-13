import React from 'react';
import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import { useResponsiveLayout } from '@/src/utils/useResponsiveLayout';
import { ClockDisplay } from '@/src/components/ClockDisplay';
import { UserPreferences } from '@/src/types';

describe('Epic 4: Responsive Design', () => {
  describe('User Story 4.1: Clock displays well on different devices', () => {
    // Helper to set viewport size
    const setViewportSize = (width: number, height: number = 768) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
      });
    };

    // Helper to trigger resize event
    const triggerResize = () => {
      window.dispatchEvent(new Event('resize'));
    };

    beforeEach(() => {
      // Reset to default desktop size before each test
      setViewportSize(1920, 1080);
    });

    describe('AC: Clock automatically adjusts layout to fit screen width on tablet', () => {
      it('should detect tablet viewport size (768px-1024px) on mount', () => {
        setViewportSize(800, 600);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('tablet');
        expect(result.current.scaleFactor).toBeGreaterThan(0);
        expect(result.current.scaleFactor).toBeLessThan(1.5);
      });

      it('should apply appropriate scale factor for tablet viewport at 768px', () => {
        setViewportSize(768, 600);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('tablet');
        expect(result.current.scaleFactor).toBeCloseTo(0.75, 1);
      });

      it('should apply appropriate scale factor for tablet viewport at 1024px', () => {
        setViewportSize(1024, 768);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('tablet');
        expect(result.current.scaleFactor).toBeCloseTo(1.0, 1);
      });

      it('should detect small tablet viewport (<768px) and apply smaller scale', () => {
        setViewportSize(600, 800);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('mobile');
        expect(result.current.scaleFactor).toBeGreaterThan(0);
        expect(result.current.scaleFactor).toBeLessThanOrEqual(0.75);
      });

      it('should adjust clock font size based on tablet viewport scale', () => {
        setViewportSize(800, 600);
        
        const preferences: UserPreferences = {
          fontSize: 48,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
        };

        render(<ClockDisplay preferences={preferences} />);
        
        const timeDisplay = screen.getByTestId('time-display');
        const styles = window.getComputedStyle(timeDisplay.parentElement!);
        
        // Font size should be scaled down from base 48px
        const fontSize = parseInt(styles.fontSize);
        expect(fontSize).toBeLessThan(48);
        expect(fontSize).toBeGreaterThan(20);
      });
    });

    describe('AC: Clock maximizes screen space on desktop', () => {
      it('should detect desktop viewport size (>1024px) on mount', () => {
        setViewportSize(1920, 1080);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('desktop');
        expect(result.current.scaleFactor).toBeGreaterThanOrEqual(1.0);
      });

      it('should apply scale factor of 1.0 for desktop viewport at 1920px', () => {
        setViewportSize(1920, 1080);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('desktop');
        expect(result.current.scaleFactor).toBeCloseTo(1.0, 1);
      });

      it('should apply larger scale factor for wide desktop viewport (>2560px)', () => {
        setViewportSize(3840, 2160); // 4K display
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('desktop');
        expect(result.current.scaleFactor).toBeGreaterThan(1.0);
        expect(result.current.scaleFactor).toBeLessThanOrEqual(1.5);
      });

      it('should maintain full font size on desktop viewport', () => {
        setViewportSize(1920, 1080);
        
        const preferences: UserPreferences = {
          fontSize: 48,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
        };

        render(<ClockDisplay preferences={preferences} />);
        
        const timeDisplay = screen.getByTestId('time-display');
        const styles = window.getComputedStyle(timeDisplay.parentElement!);
        
        // Font size should be at or near base 48px
        const fontSize = parseInt(styles.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(40);
      });
    });

    describe('AC: Clock layout dynamically adjusts when window width changes', () => {
      it('should update layout from desktop to tablet on window resize', async () => {
        setViewportSize(1920, 1080);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('desktop');
        
        act(() => {
          setViewportSize(800, 600);
          triggerResize();
        });

        await waitFor(() => {
          expect(result.current.viewport).toBe('tablet');
          expect(result.current.scaleFactor).toBeLessThan(1.0);
        });
      });

      it('should update layout from tablet to desktop on window resize', async () => {
        setViewportSize(800, 600);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('tablet');
        
        act(() => {
          setViewportSize(1920, 1080);
          triggerResize();
        });

        await waitFor(() => {
          expect(result.current.viewport).toBe('desktop');
          expect(result.current.scaleFactor).toBeGreaterThanOrEqual(1.0);
        });
      });

      it('should update layout from desktop to mobile on window resize', async () => {
        setViewportSize(1920, 1080);
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('desktop');
        
        act(() => {
          setViewportSize(600, 800);
          triggerResize();
        });

        await waitFor(() => {
          expect(result.current.viewport).toBe('mobile');
          expect(result.current.scaleFactor).toBeLessThan(0.75);
        });
      });

      it('should debounce resize events to avoid excessive updates', async () => {
        jest.useFakeTimers();
        setViewportSize(1920, 1080);
        
        const { result } = renderHook(() => useResponsiveLayout());
        const initialViewport = result.current.viewport;
        
        // Trigger multiple resize events rapidly
        act(() => {
          setViewportSize(800, 600);
          triggerResize();
        });
        
        act(() => {
          setViewportSize(1024, 768);
          triggerResize();
        });
        
        act(() => {
          setViewportSize(600, 800);
          triggerResize();
        });

        // Should not update immediately (still debouncing)
        expect(result.current.viewport).toBe(initialViewport);
        
        // Advance timers to trigger debounced update
        await act(async () => {
          jest.advanceTimersByTime(250);
        });

        // Now it should be updated to the last viewport size (600 = mobile)
        expect(result.current.viewport).toBe('mobile');
        expect(result.current.viewport).not.toBe(initialViewport);

        jest.useRealTimers();
      });

      it('should update clock display font size when resizing', async () => {
        setViewportSize(1920, 1080);
        
        const preferences: UserPreferences = {
          fontSize: 48,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
        };

        const { rerender } = render(<ClockDisplay preferences={preferences} />);
        
        const timeDisplay = screen.getByTestId('time-display');
        const initialFontSize = parseInt(window.getComputedStyle(timeDisplay.parentElement!).fontSize);
        
        act(() => {
          setViewportSize(800, 600);
          triggerResize();
        });

        rerender(<ClockDisplay preferences={preferences} />);

        await waitFor(() => {
          const newFontSize = parseInt(window.getComputedStyle(timeDisplay.parentElement!).fontSize);
          expect(newFontSize).toBeLessThan(initialFontSize);
        });
      });
    });

    describe('Additional responsive behavior', () => {
      it('should cleanup resize event listener on unmount', () => {
        setViewportSize(1920, 1080);
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        
        const { unmount } = renderHook(() => useResponsiveLayout());
        
        unmount();
        
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        removeEventListenerSpy.mockRestore();
      });

      it('should handle portrait orientation on tablets', () => {
        setViewportSize(768, 1024); // Portrait tablet
        
        const { result } = renderHook(() => useResponsiveLayout());
        
        expect(result.current.viewport).toBe('tablet');
        expect(result.current.scaleFactor).toBeGreaterThan(0);
      });

      it('should calculate scale factor based on viewport width', () => {
        // Test various viewport sizes
        const testCases = [
          { width: 375, expected: 'mobile', maxScale: 0.6 },
          { width: 768, expected: 'tablet', maxScale: 0.8 },
          { width: 1024, expected: 'tablet', maxScale: 1.0 },
          { width: 1440, expected: 'desktop', minScale: 1.0 },
          { width: 1920, expected: 'desktop', minScale: 1.0 },
        ];

        testCases.forEach(({ width, expected, maxScale, minScale }) => {
          setViewportSize(width, 768);
          const { result } = renderHook(() => useResponsiveLayout());
          
          expect(result.current.viewport).toBe(expected);
          if (maxScale) {
            expect(result.current.scaleFactor).toBeLessThanOrEqual(maxScale);
          }
          if (minScale) {
            expect(result.current.scaleFactor).toBeGreaterThanOrEqual(minScale);
          }
        });
      });
    });
  });
});
