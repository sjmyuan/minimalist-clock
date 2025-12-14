import { describe, it, expect } from '@jest/globals';
import type { UserPreferences } from '../../src/types';
import * as stories from '../../src/components/TimeRenderer.stories';

describe('TimeRenderer Stories - UserPreferences Conformance', () => {
  it('should have use24HourFormat property in Default story preferences', () => {
    const preferences = stories.Default.args?.preferences as UserPreferences;
    expect(preferences).toHaveProperty('use24HourFormat');
    expect(typeof preferences.use24HourFormat).toBe('boolean');
  });

  it('should have use24HourFormat property in SmallSize story preferences', () => {
    const preferences = stories.SmallSize.args?.preferences as UserPreferences;
    expect(preferences).toHaveProperty('use24HourFormat');
    expect(typeof preferences.use24HourFormat).toBe('boolean');
  });

  it('should have use24HourFormat property in CustomColors story preferences', () => {
    const preferences = stories.CustomColors.args?.preferences as UserPreferences;
    expect(preferences).toHaveProperty('use24HourFormat');
    expect(typeof preferences.use24HourFormat).toBe('boolean');
  });

  it('should have all required UserPreferences properties in Default story', () => {
    const preferences = stories.Default.args?.preferences as UserPreferences;
    expect(preferences).toHaveProperty('fontSize');
    expect(preferences).toHaveProperty('fontColor');
    expect(preferences).toHaveProperty('backgroundColor');
    expect(preferences).toHaveProperty('showSeconds');
    expect(preferences).toHaveProperty('flipStyle');
    expect(preferences).toHaveProperty('fontFamily');
    expect(preferences).toHaveProperty('fontWeight');
    expect(preferences).toHaveProperty('use24HourFormat');
  });
});
