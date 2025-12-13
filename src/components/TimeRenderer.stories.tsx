import type { Meta, StoryObj } from '@storybook/react';
import { TimeRenderer } from './TimeRenderer';

const meta: Meta<typeof TimeRenderer> = {
  title: 'Components/TimeRenderer',
  component: TimeRenderer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimeRenderer>;

export const Default: Story = {
  args: {
    time: {
      hours: 14,
      minutes: 30,
      seconds: 0,
      date: 'Saturday, December 7, 2025',
    },
    preferences: {
      fontSize: 120,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      showSeconds: false,
      flipStyle: 'classic-flip',
    },
    shouldAnimateDigit0: false,
    shouldAnimateDigit1: false,
    shouldAnimateDigit2: false,
    shouldAnimateDigit3: false,
  },
};

export const SmallSize: Story = {
  args: {
    time: {
      hours: 9,
      minutes: 5,
      seconds: 0,
      date: 'Saturday, December 7, 2025',
    },
    preferences: {
      fontSize: 48,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      showSeconds: false,
      flipStyle: 'classic-flip',
    },
    shouldAnimateDigit0: false,
    shouldAnimateDigit1: false,
    shouldAnimateDigit2: false,
    shouldAnimateDigit3: false,
  },
};

export const CustomColors: Story = {
  args: {
    time: {
      hours: 23,
      minutes: 59,
      seconds: 0,
      date: 'Saturday, December 7, 2025',
    },
    preferences: {
      fontSize: 120,
      fontColor: '#00FF00',
      backgroundColor: '#000000',
      showSeconds: false,
      flipStyle: 'classic-flip',
    },
    shouldAnimateDigit0: false,
    shouldAnimateDigit1: false,
    shouldAnimateDigit2: false,
    shouldAnimateDigit3: false,
  },
};
