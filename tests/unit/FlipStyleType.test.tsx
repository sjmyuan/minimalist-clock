import React from 'react';
import { render } from '@testing-library/react';
import { AnimationHandler } from '@/src/components/AnimationHandler';
import { FlipStyle } from '@/src/types';

describe('FlipStyle Type - Card Fold Support', () => {
  describe('AC: FlipStyle type should include "card-fold" option', () => {
    it('should accept "card-fold" as a valid flipStyle value', () => {
      const flipStyle: FlipStyle = 'card-fold';
      
      // This test validates that TypeScript accepts 'card-fold' as a valid FlipStyle
      expect(flipStyle).toBe('card-fold');
    });

    it('should render AnimationHandler with card-fold style without TypeScript errors', () => {
      const { container } = render(
        <AnimationHandler trigger={false} flipStyle="card-fold" oldDigit="1" newDigit="1" digit="1" />
      );

      expect(container).toBeInTheDocument();
    });

    it('should accept all three flip styles: classic-flip, drop-down, and card-fold', () => {
      const styles: FlipStyle[] = ['classic-flip', 'drop-down', 'card-fold'];
      
      expect(styles).toHaveLength(3);
      expect(styles).toContain('classic-flip');
      expect(styles).toContain('drop-down');
      expect(styles).toContain('card-fold');
    });
  });
});
