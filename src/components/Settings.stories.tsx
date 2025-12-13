import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from './Settings';
import { useState, ComponentProps } from 'react';

const meta: Meta<typeof Settings> = {
  title: 'Components/Settings',
  component: Settings,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Settings>;

const SettingsWrapper = (args: ComponentProps<typeof Settings>) => {
  const [preferences, setPreferences] = useState(args.preferences);
  
  return (
    <Settings
      {...args}
      preferences={preferences}
      onPreferencesChange={setPreferences}
    />
  );
};

export const Open: Story = {
  render: (args) => <SettingsWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked'),
    preferences: {
      fontSize: 120,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
    },
  },
};

export const Closed: Story = {
  render: (args) => <SettingsWrapper {...args} />,
  args: {
    isOpen: false,
    onClose: () => console.log('Close clicked'),
    preferences: {
      fontSize: 120,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
    },
  },
};
