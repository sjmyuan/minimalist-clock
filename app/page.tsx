'use client';

import React from 'react';
import { ClockDisplay, Settings } from '@/src/components';
import { loadPreferences, savePreferences } from '@/src/utils';
import { UserPreferences } from '@/src/types';
import styled from 'styled-components';

const SettingsButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  z-index: 999;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

export default function Home() {
  const [preferences, setPreferences] = React.useState<UserPreferences>({
    fontSize: 120,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
  });
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  React.useEffect(() => {
    const loadedPreferences = loadPreferences();
    setPreferences(loadedPreferences);
  }, []);

  const handlePreferencesChange = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  return (
    <>
      <SettingsButton onClick={() => setIsSettingsOpen(true)}>
        ⚙ Settings
      </SettingsButton>
      <ClockDisplay preferences={preferences} />
      <Settings
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
