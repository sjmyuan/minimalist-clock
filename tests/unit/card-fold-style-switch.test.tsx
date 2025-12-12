import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnimationHandler } from '@/src/components/AnimationHandler';
import { gsap } from 'gsap';

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
    set: jest.fn(),
    timeline: jest.fn(() => {
      const callbacks: Array<() => void> = [];
      return {
        to: jest.fn(function(this: any, _target: any, config: any) {
          if (config.onComplete) {
            callbacks.push(config.onComplete);
          }
          // Execute callbacks immediately for testing
          setTimeout(() => {
            callbacks.forEach(cb => cb());
          }, 0);
          return this;
        }),
      };
    }),
  },
}));

describe('Card Fold - Style Switch Bug Fix', () => {
  describe('AC: When oldDigit and newDigit are the same, static cards should show the same digit', () => {
    it('should render upper and bottom static cards with the same digit when oldDigit equals newDigit', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="5"
        >
          <div data-testid="digit-wrapper">
            <span>5</span>
          </div>
        </AnimationHandler>
      );

      const upperCard = container.querySelector('[data-card-type="upper"]');
      const bottomCard = container.querySelector('[data-card-type="bottom"]');
      
      expect(upperCard !== null).toBe(true);
      expect(bottomCard !== null).toBe(true);
      
      // Both should show digit "5"
      expect(upperCard?.textContent === '5').toBe(true);
      expect(bottomCard?.textContent === '5').toBe(true);
    });

    it('should maintain correct bottom card digit after style switch when no animation has occurred', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="8"
          newDigit="8"
        >
          <div data-testid="digit-wrapper">
            <span>8</span>
          </div>
        </AnimationHandler>
      );

      const bottomCard = container.querySelector('[data-card-type="bottom"]');
      
      expect(bottomCard !== null).toBe(true);
      expect(bottomCard?.textContent === '8').toBe(true);
    });
  });

  describe('AC: When oldDigit and newDigit are different, bottom card should eventually show newDigit', () => {
    it('should initialize bottom card with oldDigit before animation', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="3"
          newDigit="4"
        >
          <div data-testid="digit-wrapper">
            <span>4</span>
          </div>
        </AnimationHandler>
      );

      const bottomCard = container.querySelector('[data-card-type="bottom"]');
      
      expect(bottomCard !== null).toBe(true);
      // Bottom card should start with oldDigit
      expect(bottomCard?.textContent === '3').toBe(true);
    });
  });

  describe('AC: Upper static card should always show oldDigit regardless of style switch', () => {
    it('should render upper static card with oldDigit even when it equals newDigit', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="6"
          newDigit="6"
        >
          <div data-testid="digit-wrapper">
            <span>6</span>
          </div>
        </AnimationHandler>
      );

      const upperCard = container.querySelector('[data-card-type="upper"]');
      
      expect(upperCard !== null).toBe(true);
      expect(upperCard?.textContent === '6').toBe(true);
    });

    it('should render upper static card with oldDigit when it differs from newDigit', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="2"
          newDigit="3"
        >
          <div data-testid="digit-wrapper">
            <span>3</span>
          </div>
        </AnimationHandler>
      );

      const upperCard = container.querySelector('[data-card-type="upper"]');
      
      expect(upperCard !== null).toBe(true);
      expect(upperCard?.textContent === '2').toBe(true);
    });
  });

  describe('AC: Overlay card should update correctly during animation phases', () => {
    it('should initialize overlay with oldDigit before animation', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="1"
          newDigit="2"
        >
          <div data-testid="digit-wrapper">
            <span>2</span>
          </div>
        </AnimationHandler>
      );

      const overlayCard = container.querySelector('[data-card-type="overlay"]');
      
      expect(overlayCard !== null).toBe(true);
      // Overlay should start with oldDigit
      expect(overlayCard?.textContent === '1').toBe(true);
    });
  });
});
