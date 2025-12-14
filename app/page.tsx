'use client';

import React from 'react';
import { ClockDisplay, Settings, FullscreenButton } from '@/src/components';
import { loadPreferences, savePreferences, useFullscreen, useUserActivity } from '@/src/utils';
import { UserPreferences } from '@/src/types';
import styled from 'styled-components';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsButton = styled.button<{ $visible: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  z-index: 999;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ButtonContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 999;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
  transition: all 0.3s ease;
`;

export default function Home() {
  const [preferences, setPreferences] = React.useState<UserPreferences>({
    fontSize: 90,
    fontColor: '#FFFFFF',
    backgroundColor: '#7f3d3d',
    showSeconds: true,
    flipStyle: 'card-fold',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 400,
    use24HourFormat: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isUserActive = useUserActivity({ timeout: 3000, enabled: true });

  // Always auto-hide buttons based on user activity
  const showButtons = isUserActive;

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
      <ButtonContainer $visible={showButtons}>
        <FullscreenButton onClick={toggleFullscreen} isFullscreen={isFullscreen} />
      </ButtonContainer>
      <SettingsButton $visible={showButtons} onClick={() => setIsSettingsOpen(true)} aria-label="Settings">
        <SettingsIcon />
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
