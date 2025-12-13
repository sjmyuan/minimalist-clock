import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClassicFlipAnimation } from '@/src/components/ClassicFlipAnimation';
import { gsap } from 'gsap';

jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
    set: jest.fn(),
  },
}));

describe('ClassicFlipAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers flip animation when trigger becomes true', async () => {
    const { rerender } = render(
      <ClassicFlipAnimation trigger={false}>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    rerender(
      <ClassicFlipAnimation trigger>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    await waitFor(() => {
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ rotateX: -90, opacity: 0 }),
        expect.objectContaining({ rotateX: 0, opacity: 1 })
      );
    });
  });

  it('uses default duration of 750ms', async () => {
    const { rerender } = render(
      <ClassicFlipAnimation trigger={false}>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    rerender(
      <ClassicFlipAnimation trigger>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    await waitFor(() => {
      const lastCall = (gsap.fromTo as jest.Mock).mock.calls.pop();
      expect(lastCall?.[2].duration).toBe(0.75);
    });
  });

  it('applies custom duration when provided', async () => {
    const { rerender } = render(
      <ClassicFlipAnimation trigger={false} duration={1.1}>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    rerender(
      <ClassicFlipAnimation trigger duration={1.1}>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    await waitFor(() => {
      const lastCall = (gsap.fromTo as jest.Mock).mock.calls.pop();
      expect(lastCall?.[2].duration).toBe(1.1);
    });
  });

  it('skips animation when prefersReducedMotion is true', () => {
    render(
      <ClassicFlipAnimation trigger prefersReducedMotion>
        <div>Digit</div>
      </ClassicFlipAnimation>
    );

    expect(gsap.fromTo).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ opacity: 1, rotateX: 0 }));
  });
});
