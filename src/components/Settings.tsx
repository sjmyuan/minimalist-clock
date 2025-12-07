'use client';

import React from 'react';
import styled from 'styled-components';
import { UserPreferences } from '@/src/types';

interface SettingsProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$isOpen ? '0' : '-400px')};
  width: 400px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 2rem;
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
`;

const SettingsTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
`;

const SettingGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

export const Settings: React.FC<SettingsProps> = ({
  preferences,
  onPreferencesChange,
  isOpen,
  onClose,
}) => {
  const handleChange = (key: keyof UserPreferences, value: string | number) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <SettingsOverlay $isOpen={isOpen}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <SettingsTitle>Settings</SettingsTitle>

      <SettingGroup>
        <Label htmlFor="fontSize">Font Size (px)</Label>
        <Input
          id="fontSize"
          type="number"
          min="24"
          max="200"
          value={preferences.fontSize}
          onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
        />
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="fontColor">Font Color</Label>
        <Input
          id="fontColor"
          type="color"
          value={preferences.fontColor}
          onChange={(e) => handleChange('fontColor', e.target.value)}
        />
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={preferences.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
      </SettingGroup>
    </SettingsOverlay>
  );
};
