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
  const handleChange = (key: keyof UserPreferences, value: string | number | boolean) => {
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
          min="12"
          max="100"
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

      <SettingGroup>
        <Label htmlFor="showSeconds">
          <input
            id="showSeconds"
            type="checkbox"
            checked={preferences.showSeconds}
            onChange={(e) => handleChange('showSeconds', e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          Show Seconds
        </Label>
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="flipStyle">Flip Style</Label>
        <Input
          as="select"
          id="flipStyle"
          value={preferences.flipStyle}
          onChange={(e) => handleChange('flipStyle', e.target.value)}
        >
          <option value="drop-down">Drop Down</option>
          <option value="classic-flip">Classic Flip</option>
          <option value="card-fold">Card Fold</option>
        </Input>
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Input
          as="select"
          id="fontFamily"
          value={preferences.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        >
          <option value="Courier New, monospace">Courier New</option>
          <option value="monospace">Monospace</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="serif">Serif</option>
        </Input>
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="fontWeight">Font Weight</Label>
        <Input
          as="select"
          id="fontWeight"
          value={preferences.fontWeight}
          onChange={(e) => handleChange('fontWeight', parseInt(e.target.value))}
        >
          <option value="100">100 - Thin</option>
          <option value="200">200 - Extra Light</option>
          <option value="300">300 - Light</option>
          <option value="400">400 - Normal</option>
          <option value="500">500 - Medium</option>
          <option value="600">600 - Semi Bold</option>
          <option value="700">700 - Bold</option>
          <option value="800">800 - Extra Bold</option>
          <option value="900">900 - Black</option>
        </Input>
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="timeFormat">Time Format</Label>
        <Input
          as="select"
          id="timeFormat"
          value={String(preferences.use24HourFormat)}
          onChange={(e) => handleChange('use24HourFormat', e.target.value === 'true')}
        >
          <option value="true">24 Hour</option>
          <option value="false">12 Hour (AM/PM)</option>
        </Input>
      </SettingGroup>
    </SettingsOverlay>
  );
};
