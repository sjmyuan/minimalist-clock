import React from 'react';
import { render } from '@testing-library/react';
import { AnimationHandler } from '@/src/components/AnimationHandler';

describe('Card Fold - Overflow Hidden Bug Fix', () => {
  describe('AC: StaticCard containers should hide overflow to prevent rectangular corners from showing', () => {
    it('should have overflow: hidden on upper StaticCard container', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const upperCard = container.querySelector('[data-card-type="upper"]');
      expect(upperCard !== null).toBe(true);
      
      if (upperCard) {
        const styles = window.getComputedStyle(upperCard);
        expect(styles.overflow === 'hidden').toBe(true);
      }
    });

    it('should have overflow: hidden on bottom StaticCard container', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const bottomCard = container.querySelector('[data-card-type="bottom"]');
      expect(bottomCard !== null).toBe(true);
      
      if (bottomCard) {
        const styles = window.getComputedStyle(bottomCard);
        expect(styles.overflow === 'hidden').toBe(true);
      }
    });
  });

  describe('AC: StaticCard children should hide overflow to prevent rectangular corners from showing', () => {
    it('should have overflow: hidden on upper StaticCard children', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const upperCard = container.querySelector('[data-card-type="upper"]');
      expect(upperCard !== null).toBe(true);
      
      if (upperCard && upperCard.firstChild) {
        const styles = window.getComputedStyle(upperCard.firstChild as Element);
        expect(styles.overflow === 'hidden').toBe(true);
      }
    });

    it('should have overflow: hidden on bottom StaticCard children', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const bottomCard = container.querySelector('[data-card-type="bottom"]');
      expect(bottomCard !== null).toBe(true);
      
      if (bottomCard && bottomCard.firstChild) {
        const styles = window.getComputedStyle(bottomCard.firstChild as Element);
        expect(styles.overflow === 'hidden').toBe(true);
      }
    });
  });

  describe('AC: OverlayCard container should hide overflow to prevent rectangular corners from showing', () => {
    it('should have overflow: hidden on OverlayCard container', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const overlayCard = container.querySelector('[data-card-type="overlay"]');
      expect(overlayCard !== null).toBe(true);
      
      if (overlayCard) {
        const styles = window.getComputedStyle(overlayCard);
        expect(styles.overflow === 'hidden').toBe(true);
      }
    });
  });

  describe('AC: OverlayCard children should hide overflow to prevent rectangular corners from showing', () => {
    it('should have overflow: hidden on OverlayCard children', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const overlayCard = container.querySelector('[data-card-type="overlay"]');
      expect(overlayCard !== null).toBe(true);
      
      if (overlayCard && overlayCard.firstChild) {
        const styles = window.getComputedStyle(overlayCard.firstChild as Element);
        expect(styles.overflow === 'hidden').toBe(true);
      }
    });
  });

  describe('AC: Non card-fold styles should not be affected', () => {
    it('should not add overflow: hidden to classic-flip style', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="classic-flip"
          digit="5"
        />
      );

      // Classic flip doesn't have card elements
      const upperCard = container.querySelector('[data-card-type="upper"]');
      expect(upperCard === null).toBe(true);
    });

    it('should not add overflow: hidden to drop-down style', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="drop-down"
          digit="5"
        />
      );

      // Drop-down doesn't have card elements
      const upperCard = container.querySelector('[data-card-type="upper"]');
      expect(upperCard === null).toBe(true);
    });
  });

  describe('AC: Card element children should have border-radius matching DigitWrapper', () => {
    it('should have border-radius on upper StaticCard children', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const upperCard = container.querySelector('[data-card-type="upper"]');
      expect(upperCard !== null).toBe(true);
      
      if (upperCard && upperCard.firstChild) {
        const styles = window.getComputedStyle(upperCard.firstChild as Element);
        // Should have some border-radius value
        expect(styles.borderRadius !== '0px' && styles.borderRadius !== '').toBe(true);
      }
    });

    it('should have border-radius on OverlayCard children', () => {
      const { container } = render(
        <AnimationHandler 
          trigger={false} 
          flipStyle="card-fold"
          oldDigit="5"
          newDigit="6"
          digit="6"
        />
      );

      const overlayCard = container.querySelector('[data-card-type="overlay"]');
      expect(overlayCard !== null).toBe(true);
      
      if (overlayCard && overlayCard.firstChild) {
        const styles = window.getComputedStyle(overlayCard.firstChild as Element);
        // Should have some border-radius value
        expect(styles.borderRadius !== '0px' && styles.borderRadius !== '').toBe(true);
      }
    });
  });
});
