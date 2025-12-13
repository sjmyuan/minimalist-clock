import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DropDownAnimation } from '@/src/components/DropDownAnimation';
import { gsap } from 'gsap';

jest.mock('gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
    set: jest.fn(),
  },
}));

describe('DropDownAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers drop-down animation when trigger becomes true', async () => {
    const { rerender } = render(
      <DropDownAnimation trigger={false}>
        <div>Digit</div>
      </DropDownAnimation>
    );

    rerender(
      <DropDownAnimation trigger>
        <div>Digit</div>
      </DropDownAnimation>
    );

    await waitFor(() => {
      expect(gsap.fromTo).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ y: '-50%', opacity: 0 }),
        expect.objectContaining({ y: 0, opacity: 1 })
      );
    });
  });

  it('uses default duration of 750ms', async () => {
    const { rerender } = render(
      <DropDownAnimation trigger={false}>
        <div>Digit</div>
      </DropDownAnimation>
    );

    rerender(
      <DropDownAnimation trigger>
        <div>Digit</div>
      </DropDownAnimation>
    );

    await waitFor(() => {
      const lastCall = (gsap.fromTo as jest.Mock).mock.calls.pop();
      expect(lastCall?.[2].duration).toBe(0.75);
    });
  });

  it('applies custom duration when provided', async () => {
    const { rerender } = render(
      <DropDownAnimation trigger={false} duration={1.2}>
        <div>Digit</div>
      </DropDownAnimation>
    );

    rerender(
      <DropDownAnimation trigger duration={1.2}>
        <div>Digit</div>
      </DropDownAnimation>
    );

    await waitFor(() => {
      const lastCall = (gsap.fromTo as jest.Mock).mock.calls.pop();
      expect(lastCall?.[2].duration).toBe(1.2);
    });
  });

  it('uses top-centered transform origin and rotation for perspective', async () => {
    const { rerender } = render(
      <DropDownAnimation trigger={false}>
        <div>Digit</div>
      </DropDownAnimation>
    );

    rerender(
      <DropDownAnimation trigger>
        <div>Digit</div>
      </DropDownAnimation>
    );

    await waitFor(() => {
      const lastCall = (gsap.fromTo as jest.Mock).mock.calls.pop();
      expect(lastCall?.[1]).toEqual(expect.objectContaining({ rotateX: -15, transformOrigin: 'center top' }));
      expect(lastCall?.[2]).toEqual(expect.objectContaining({ transformOrigin: 'center top' }));
    });
  });

  it('skips animation when prefersReducedMotion is true', () => {
    render(
      <DropDownAnimation trigger prefersReducedMotion>
        <div>Digit</div>
      </DropDownAnimation>
    );

    expect(gsap.fromTo).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ opacity: 1, rotateX: 0, y: 0 }));
  });
});
