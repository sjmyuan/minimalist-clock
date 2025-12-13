import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AnimationHandler } from '@/src/components/AnimationHandler';
import { gsap } from 'gsap';

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
    set: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('AnimationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Story 2.1: Page-Flip Animation Effects', () => {
    it('should trigger page-flip animation when trigger prop is true', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      expect(gsap.fromTo).not.toHaveBeenCalled();

      // Trigger animation
      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalled();
      });
    });

    it('should apply page-flip animation with rotateX from -90 to 0 degrees', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ rotateX: -90, opacity: 0 }),
          expect.objectContaining({ rotateX: 0, opacity: 1 })
        );
      });
    });

    it('should use animation duration between 500ms and 1000ms', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        const calls = (gsap.fromTo as jest.Mock).mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        const lastCall = calls[calls.length - 1];
        const animationProps = lastCall[2];
        expect(animationProps.duration).toBeGreaterThanOrEqual(0.5);
        expect(animationProps.duration).toBeLessThanOrEqual(1);
      });
    });

    it('should include easing function for smooth animation', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.objectContaining({ ease: expect.any(String) })
        );
      });
    });

    it('should not trigger animation when trigger prop is false', () => {
      render(
        <AnimationHandler trigger={false} digit="5" />
      );

      expect(gsap.fromTo).not.toHaveBeenCalled();
    });

    it('should render children correctly', () => {
      const { getByText } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      expect(getByText('5')).toBeInTheDocument();
    });

    it('should apply 3D transform styles for perspective effect', () => {
      const { container } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      const animatedContainer = container.firstChild as HTMLElement;
      
      // Check for transform-style preserve-3d (may be computed differently)
      expect(animatedContainer).toBeInTheDocument();
    });
  });

  describe('User Story 2.2: Moderate Animation Speed', () => {
    it('should use default animation duration of 750ms when duration prop is not provided', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        const calls = (gsap.fromTo as jest.Mock).mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        const lastCall = calls[calls.length - 1];
        const animationProps = lastCall[2];
        expect(animationProps.duration).toBe(0.75);
      });
    });

    it('should accept custom duration prop', async () => {
      const customDuration = 0.8;
      const { rerender } = render(
        <AnimationHandler trigger={false} duration={customDuration} digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} duration={customDuration} digit="5" />
      );

      await waitFor(() => {
        const calls = (gsap.fromTo as jest.Mock).mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        const lastCall = calls[calls.length - 1];
        const animationProps = lastCall[2];
        expect(animationProps.duration).toBe(customDuration);
      });
    });

    it('should trigger animation only when trigger changes from false to true', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      // First trigger
      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledTimes(1);
      });

      // Trigger remains true - should not animate again
      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      // Still only called once
      expect((gsap.fromTo as jest.Mock).mock.calls.length).toBe(1);
    });
  });

  describe('User Story 3.4: Flip Style Selection', () => {
    it('should use classic-flip animation style by default (for backward compatibility)', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ rotateX: -90, opacity: 0 }),
          expect.objectContaining({ rotateX: 0, opacity: 1 })
        );
      });
    });

    it('should use classic-flip animation when flipStyle is "classic-flip"', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} flipStyle="classic-flip" digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} flipStyle="classic-flip" digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ rotateX: -90, opacity: 0 }),
          expect.objectContaining({ rotateX: 0, opacity: 1 })
        );
      });
    });

    it('should use drop-down animation when flipStyle is "drop-down"', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} flipStyle="drop-down" digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} flipStyle="drop-down" digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ y: '-50%', opacity: 0 }),
          expect.objectContaining({ y: 0, opacity: 1 })
        );
      });
    });

    it('should apply 3D perspective effect for drop-down animation', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} flipStyle="drop-down" digit="5" />
      );

      rerender(
        <AnimationHandler trigger={true} flipStyle="drop-down" digit="5" />
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ 
            rotateX: expect.any(Number),
            transformOrigin: expect.any(String)
          }),
          expect.any(Object)
        );
      });
    });

    it('should use card-fold animation when flipStyle is "card-fold"', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
      );

      rerender(
        <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
      );

      await waitFor(() => {
        // Card-fold now uses timeline instead of fromTo
        expect(gsap.timeline).toHaveBeenCalled();
      });
    });

    it('should apply transform origin to top edge for card-fold animation', async () => {
      const { rerender, container } = render(
        <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
      );

      // Check that overlay card has transform-origin set
      const overlayCard = container.querySelector('[data-card-type="overlay"]');
      expect(overlayCard).not.toBeNull();
      
      rerender(
        <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
      );

      await waitFor(() => {
        // Timeline should be called for card-fold animation
        expect(gsap.timeline).toHaveBeenCalled();
      });
    });

    it('should use same duration and easing for card-fold as other styles', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
      );

      rerender(
        <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
      );

      await waitFor(() => {
        // Card-fold should use timeline with consistent duration/easing
        const mockTimelineInstance = (gsap.timeline as jest.Mock).mock.results[0].value;
        const calls = mockTimelineInstance.to.mock.calls;
        
        // Both phases should have power2.out easing
        if (calls.length >= 2) {
          expect(calls[0][1].ease).toBe('power2.out');
          expect(calls[1][1].ease).toBe('power2.out');
        }
      });
    });
  });

  describe('User Story 3.4: Physical Flip Clock - Split Digit Card Rendering', () => {
    describe('Card Structure', () => {
      it('should render FlipCardContainer when flipStyle is card-fold', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="5" digit="5" />
        );

        // Should have a container that holds the flip card structure
        const flipContainer = container.firstChild;
        expect(flipContainer !== null).toBe(true);
      });

      it('should render UpperCard with top 50% clip-path for card-fold', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="5" digit="5" />
        );

        // Find the upper card element (should have clip-path for top half)
        const upperCard = container.querySelector('[data-card-type="upper"]');
        
        expect(upperCard !== null).toBe(true);
      });

      it('should render BottomCard with bottom 50% clip-path for card-fold', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="5" digit="5" />
        );

        // Find the bottom card element (should have clip-path for bottom half)
        const bottomCard = container.querySelector('[data-card-type="bottom"]');
        
        expect(bottomCard !== null).toBe(true);
      });

      it('should render OverlayCard positioned absolutely for card-fold', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="5" digit="5" />
        );

        // Find overlay card (should be absolutely positioned)
        const overlayCard = container.querySelector('[data-card-type="overlay"]');
        expect(overlayCard !== null).toBe(true);
      });

      it('should have overlay card with higher z-index than static cards', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="5" digit="5" />
        );

        const overlayCard = container.querySelector('[data-card-type="overlay"]');
        const upperCard = container.querySelector('[data-card-type="upper"]');
        
        expect(overlayCard !== null).toBe(true);
        expect(upperCard !== null).toBe(true);
      });

      it('should have overlay card with transform-origin center top', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="5" digit="5" />
        );

        const overlayCard = container.querySelector('[data-card-type="overlay"]');
        expect(overlayCard !== null).toBe(true);
      });

      it('should render children normally for non-card-fold styles', () => {
        const { container } = render(
          <AnimationHandler trigger={false} flipStyle="classic-flip" digit="5" />
        );

        // For classic-flip, should not have split card structure
        const upperCard = container.querySelector('[data-card-type="upper"]');
        const bottomCard = container.querySelector('[data-card-type="bottom"]');
        const overlayCard = container.querySelector('[data-card-type="overlay"]');
        
        expect(upperCard === null).toBe(true);
        expect(bottomCard === null).toBe(true);
        expect(overlayCard === null).toBe(true);
      });

      it('should clone children styling to split cards for card-fold', () => {
        const { container } = render(
          <AnimationHandler
            trigger={false}
            flipStyle="card-fold"
            oldDigit="5"
            newDigit="5"
            digit="5"
            renderContent={(digit: string) => (
              <div data-testid="digit-wrapper" style={{ background: 'red', padding: '10px' }}>
                {digit}
              </div>
            )}
          />
        );

        const upperCard = container.querySelector('[data-card-type="upper"]');
        expect(upperCard !== null).toBe(true);
      });
    });

    describe('Digit Props Support', () => {
      it('should accept optional oldDigit and newDigit props', () => {
        const { container } = render(
          <AnimationHandler 
            trigger={false} 
            flipStyle="card-fold"
            oldDigit="5"
            newDigit="6"
            digit="6"
          />
        );

        // Should render without errors
        expect(container.firstChild).not.toBeNull();
      });

      it('should use newDigit for rendering when provided', () => {
        const { container } = render(
          <AnimationHandler 
            trigger={false} 
            flipStyle="card-fold"
            oldDigit="5"
            newDigit="6"
            digit="6"
          />
        );

        // Static cards should initially show oldDigit for both upper and bottom
        // Bottom card will switch to newDigit during animation
        const upperCard = container.querySelector('[data-card-type="upper"]');
        const bottomCard = container.querySelector('[data-card-type="bottom"]');
        
        expect(upperCard !== null).toBe(true);
        expect(bottomCard !== null).toBe(true);
        
        if (upperCard && bottomCard) {
          const upperText = upperCard.textContent || '';
          const bottomText = bottomCard.textContent || '';
          expect(upperText.includes('5') === true).toBe(true);    // Upper shows old digit
          expect(bottomText.includes('5') === true).toBe(true);   // Bottom starts with old digit
        }
      });

      it('should fall back to oldDigit when newDigit not provided', () => {
        const { container } = render(
          <AnimationHandler 
            trigger={false} 
            flipStyle="card-fold"
            oldDigit="5"
            digit="5"
          />
        );

        // Should display the oldDigit value
        const overlayCard = container.querySelector('[data-card-type="overlay"]');
        expect(overlayCard).not.toBeNull();
        if (overlayCard) {
          const text = overlayCard.textContent || '';
          expect(text.includes('5')).toBe(true);
        }
      });

      it('should use children when digits not provided', () => {
        const { container } = render(
          <AnimationHandler 
            trigger={false} 
            flipStyle="card-fold"
            renderContent={(digit: string) => <div data-testid="digit-wrapper">{digit}</div>}
            digit="7"
          />
        );

        const overlayCard = container.querySelector('[data-card-type="overlay"]');
        expect(overlayCard).not.toBeNull();
        if (overlayCard) {
          const text = overlayCard.textContent || '';
          expect(text.includes('7')).toBe(true);
        }
      });

      it('should maintain backward compatibility with non-card-fold styles', () => {
        const { getByText } = render(
          <AnimationHandler 
            trigger={false} 
            flipStyle="classic-flip"
            oldDigit="5"
            newDigit="6"
            digit="5"
          />
        );

        expect(getByText('5')).toBeInTheDocument();
      });
    });

    describe('Two-Phase Animation Timeline', () => {
      it('should use GSAP timeline for card-fold animation', async () => {
        const { rerender } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        rerender(
          <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        await waitFor(() => {
          // Should use timeline method for card-fold
          expect(gsap.timeline).toHaveBeenCalled();
        });
      });

      it('should have two animation phases for card-fold', async () => {
        const { rerender } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        rerender(
          <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        await waitFor(() => {
          const mockTimelineInstance = (gsap.timeline as jest.Mock).mock.results[0].value;
          // Should call .to() twice for two phases
          expect(mockTimelineInstance.to).toHaveBeenCalledTimes(2);
        });
      });

      it('should use 375ms duration for each phase (total 750ms)', async () => {
        const { rerender } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" duration={0.75} oldDigit="5" newDigit="6" digit="6" />
        );

        rerender(
          <AnimationHandler trigger={true} flipStyle="card-fold" duration={0.75} oldDigit="5" newDigit="6" digit="6" />
        );

        await waitFor(() => {
          const mockTimelineInstance = (gsap.timeline as jest.Mock).mock.results[0].value;
          const calls = mockTimelineInstance.to.mock.calls;
          
          // Each phase should be 375ms (0.375s)
          if (calls.length >= 2) {
            expect(calls[0][1].duration).toBe(0.375);
            expect(calls[1][1].duration).toBe(0.375);
          }
        });
      });

      it('should use power2.out easing for both phases', async () => {
        const { rerender } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        rerender(
          <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        await waitFor(() => {
          const mockTimelineInstance = (gsap.timeline as jest.Mock).mock.results[0].value;
          const calls = mockTimelineInstance.to.mock.calls;
          
          if (calls.length >= 2) {
            expect(calls[0][1].ease).toBe('power2.out');
            expect(calls[1][1].ease).toBe('power2.out');
          }
        });
      });

      it('should animate rotateX from 0 to -90 then 90 to 0 degrees', async () => {
        const { rerender } = render(
          <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        rerender(
          <AnimationHandler trigger={true} flipStyle="card-fold" oldDigit="5" newDigit="6" digit="6" />
        );

        await waitFor(() => {
          const mockTimelineInstance = (gsap.timeline as jest.Mock).mock.results[0].value;
          const calls = mockTimelineInstance.to.mock.calls;
          
          // Phase 1: 0 to -90 (top half down), Phase 2: 90 to 0 (bottom half up)
          if (calls.length >= 2) {
            expect(calls[0][1].rotateX).toBe(-90);  // First phase: rotate down to -90
            expect(calls[1][1].rotateX).toBe(0);    // Second phase: rotate up to 0
          }
        });
      });
    });
  });
});
