/**
 * Core type definitions for the Minimalist Clock application
 */

/**
 * Represents the current time state
 */
export interface TimeObject {
  hours: number;
  minutes: number;
  seconds: number;
  date: string;
}

/**
 * Animation flip styles
 */
export type FlipStyle = 'classic-flip' | 'drop-down' | 'card-fold';

/**
 * User preferences for clock customization
 */
export interface UserPreferences {
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  showSeconds: boolean;
  flipStyle: FlipStyle;
  fontFamily: string;
  fontWeight: number;
  use24HourFormat: boolean;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  easing?: string;
}

/**
 * Clock display properties
 */
export interface ClockDisplayProps {
  time: TimeObject;
  preferences: UserPreferences;
}

/**
 * Settings component properties
 */
export interface SettingsProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}
