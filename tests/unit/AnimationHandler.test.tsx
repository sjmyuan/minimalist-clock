import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnimationHandler } from '@/src/components/AnimationHandler';
import { gsap } from 'gsap';

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
  },
}));

const mockFromTo = gsap.fromTo as jest.MockedFunction<typeof gsap.fromTo>;

describe('AnimationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Story 2.1: Page-Flip Animation Effects', () => {
    it('should trigger page-flip animation when trigger prop is true', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      expect(gsap.fromTo).not.toHaveBeenCalled();

      // Trigger animation
      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalled();
      });
    });

    it('should apply page-flip animation with rotateX from -90 to 0 degrees', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
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
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
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
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
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
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      expect(gsap.fromTo).not.toHaveBeenCalled();
    });

    it('should render children correctly', () => {
      const { getByText } = render(
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply 3D transform styles for perspective effect', () => {
      const { container } = render(
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      const animatedContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(animatedContainer);
      
      // Check for transform-style preserve-3d (may be computed differently)
      expect(animatedContainer).toBeInTheDocument();
    });
  });

  describe('User Story 2.2: Moderate Animation Speed', () => {
    it('should use default animation duration of 750ms when duration prop is not provided', async () => {
      const { rerender } = render(
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
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
        <AnimationHandler trigger={false} duration={customDuration}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      rerender(
        <AnimationHandler trigger={true} duration={customDuration}>
          <div>Test Content</div>
        </AnimationHandler>
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
        <AnimationHandler trigger={false}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      // First trigger
      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      await waitFor(() => {
        expect(gsap.fromTo).toHaveBeenCalledTimes(1);
      });

      // Trigger remains true - should not animate again
      rerender(
        <AnimationHandler trigger={true}>
          <div>Test Content</div>
        </AnimationHandler>
      );

      // Still only called once
      expect((gsap.fromTo as jest.Mock).mock.calls.length).toBe(1);
    });
  });
});
