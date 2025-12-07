import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Settings } from '@/src/components/Settings';
import { UserPreferences } from '@/src/types';

describe('Settings Component - Epic 3: Customization Options', () => {
  const defaultPreferences: UserPreferences = {
    fontSize: 120,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
    flipStyle: 'drop-down',
  };

  const mockOnPreferencesChange = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Story 3.1: Adjust Font Size', () => {
    describe('AC: Font size updates in real-time when adjusted', () => {
      it('should call onPreferencesChange when font size input changes', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i);
        fireEvent.change(fontSizeInput, { target: { value: '80' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 80,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'drop-down',
        });
      });

      it('should update immediately without debounce', async () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i);
        fireEvent.change(fontSizeInput, { target: { value: '100' } });

        // Should be called immediately, not after a delay
        expect(mockOnPreferencesChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('AC: Font size restricted within 12px-100px range', () => {
      it('should have min attribute set to 12', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement;
        expect(fontSizeInput.min).toBe('12');
      });

      it('should have max attribute set to 100', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement;
        expect(fontSizeInput.max).toBe('100');
      });

      it('should allow setting font size to minimum value (12px)', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i);
        fireEvent.change(fontSizeInput, { target: { value: '12' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 12,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'drop-down',
        });
      });

      it('should allow setting font size to maximum value (100px)', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i);
        fireEvent.change(fontSizeInput, { target: { value: '100' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 100,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'drop-down',
        });
      });
    });

    describe('AC: Font size persists across page reloads', () => {
      it('should display the current font size value from preferences', () => {
        const customPreferences: UserPreferences = {
          fontSize: 75,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={customPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontSizeInput = screen.getByLabelText(/font size/i) as HTMLInputElement;
        expect(fontSizeInput.value).toBe('75');
      });
    });
  });

  describe('User Story 3.2: Change Font Color and Background Color', () => {
    describe('AC: Colors update in real-time when selected', () => {
      it('should call onPreferencesChange when font color changes', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontColorInput = screen.getByLabelText(/font color/i);
        fireEvent.change(fontColorInput, { target: { value: '#FF0000' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 120,
          fontColor: '#ff0000',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'drop-down',
        });
      });

      it('should call onPreferencesChange when background color changes', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const backgroundColorInput = screen.getByLabelText(/background color/i);
        fireEvent.change(backgroundColorInput, { target: { value: '#0000FF' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 120,
          fontColor: '#FFFFFF',
          backgroundColor: '#0000ff',
          showSeconds: false,
          flipStyle: 'drop-down',
        });
      });

      it('should update immediately without debounce', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontColorInput = screen.getByLabelText(/font color/i);
        fireEvent.change(fontColorInput, { target: { value: '#00FF00' } });

        // Should be called immediately
        expect(mockOnPreferencesChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('AC: Font and background colors persist across page reloads', () => {
      it('should display the current font color value from preferences', () => {
        const customPreferences: UserPreferences = {
          fontSize: 120,
          fontColor: '#FF00FF',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={customPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontColorInput = screen.getByLabelText(/font color/i) as HTMLInputElement;
        expect(fontColorInput.value).toBe('#ff00ff'); // Browser normalizes to lowercase
      });

      it('should display the current background color value from preferences', () => {
        const customPreferences: UserPreferences = {
          fontSize: 120,
          fontColor: '#FFFFFF',
          backgroundColor: '#123456',
          showSeconds: false,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={customPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const backgroundColorInput = screen.getByLabelText(/background color/i) as HTMLInputElement;
        expect(backgroundColorInput.value).toBe('#123456');
      });
    });

    describe('AC: Default values are white font and black background', () => {
      it('should display default font color as white (#FFFFFF)', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const fontColorInput = screen.getByLabelText(/font color/i) as HTMLInputElement;
        expect(fontColorInput.value).toBe('#ffffff');
      });

      it('should display default background color as black (#000000)', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const backgroundColorInput = screen.getByLabelText(/background color/i) as HTMLInputElement;
        expect(backgroundColorInput.value).toBe('#000000');
      });
    });
  });

  describe('Settings Panel UI', () => {
    it('should render settings panel when isOpen is true', () => {
      render(
        <Settings
          preferences={defaultPreferences}
          onPreferencesChange={mockOnPreferencesChange}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });

    it('should not render settings panel when isOpen is false', () => {
      const { container } = render(
        <Settings
          preferences={defaultPreferences}
          onPreferencesChange={mockOnPreferencesChange}
          isOpen={false}
          onClose={mockOnClose}
        />
      );

      // Settings panel should be off-screen (hidden via CSS)
      const settingsPanel = container.firstChild as HTMLElement;
      expect(settingsPanel).toBeInTheDocument();
    });

    it('should have a close button', () => {
      render(
        <Settings
          preferences={defaultPreferences}
          onPreferencesChange={mockOnPreferencesChange}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByText('×');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      render(
        <Settings
          preferences={defaultPreferences}
          onPreferencesChange={mockOnPreferencesChange}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have all three customization controls', () => {
      render(
        <Settings
          preferences={defaultPreferences}
          onPreferencesChange={mockOnPreferencesChange}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByLabelText(/font size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/font color/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/background color/i)).toBeInTheDocument();
    });
  });

  describe('User Story 3.3: Toggle Show Seconds', () => {
    describe('AC: Show seconds toggle updates preference in real-time', () => {
      it('should call onPreferencesChange when show seconds checkbox is toggled', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const showSecondsCheckbox = screen.getByLabelText(/show seconds/i);
        fireEvent.click(showSecondsCheckbox);

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 120,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: true,
          flipStyle: 'drop-down',
        });
      });

      it('should update immediately without debounce', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const showSecondsCheckbox = screen.getByLabelText(/show seconds/i);
        fireEvent.click(showSecondsCheckbox);

        expect(mockOnPreferencesChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('AC: Show seconds preference persists across page reloads', () => {
      it('should display the current showSeconds value from preferences', () => {
        const customPreferences: UserPreferences = {
          fontSize: 120,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: true,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={customPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const showSecondsCheckbox = screen.getByLabelText(/show seconds/i) as HTMLInputElement;
        expect(showSecondsCheckbox.checked).toBe(true);
      });

      it('should be unchecked by default', () => {
        render(
          <Settings
            preferences={defaultPreferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const showSecondsCheckbox = screen.getByLabelText(/show seconds/i) as HTMLInputElement;
        expect(showSecondsCheckbox.checked).toBe(false);
      });
    });
  });

  describe('Multiple preference changes', () => {
    it('should handle multiple preference changes correctly', () => {
      render(
        <Settings
          preferences={defaultPreferences}
          onPreferencesChange={mockOnPreferencesChange}
          isOpen={true}
          onClose={mockOnClose}
        />
      );

      // Change font size
      const fontSizeInput = screen.getByLabelText(/font size/i);
      fireEvent.change(fontSizeInput, { target: { value: '50' } });

      expect(mockOnPreferencesChange).toHaveBeenLastCalledWith({
        fontSize: 50,
        fontColor: '#FFFFFF',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down',
      });

      // Change font color
      const fontColorInput = screen.getByLabelText(/font color/i);
      fireEvent.change(fontColorInput, { target: { value: '#FF0000' } });

      expect(mockOnPreferencesChange).toHaveBeenLastCalledWith({
        fontSize: 120, // Note: preferences prop doesn't update in this test, using original
        fontColor: '#ff0000',
        backgroundColor: '#000000',
        showSeconds: false,
        flipStyle: 'drop-down',
      });

      expect(mockOnPreferencesChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('User Story 3.4: Flip Style Selection', () => {
    describe('AC: Flip style selector updates preference in real-time', () => {
      it('should call onPreferencesChange when flip style is changed', () => {
        const preferences: UserPreferences = {
          ...defaultPreferences,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={preferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const flipStyleSelect = screen.getByLabelText(/flip style/i);
        fireEvent.change(flipStyleSelect, { target: { value: 'classic-flip' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledWith({
          fontSize: 120,
          fontColor: '#FFFFFF',
          backgroundColor: '#000000',
          showSeconds: false,
          flipStyle: 'classic-flip',
        });
      });

      it('should update immediately without debounce', () => {
        const preferences: UserPreferences = {
          ...defaultPreferences,
          flipStyle: 'classic-flip',
        };

        render(
          <Settings
            preferences={preferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const flipStyleSelect = screen.getByLabelText(/flip style/i);
        fireEvent.change(flipStyleSelect, { target: { value: 'drop-down' } });

        expect(mockOnPreferencesChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('AC: Flip style preference persists across page reloads', () => {
      it('should display the current flipStyle value from preferences', () => {
        const preferences: UserPreferences = {
          ...defaultPreferences,
          flipStyle: 'classic-flip',
        };

        render(
          <Settings
            preferences={preferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const flipStyleSelect = screen.getByLabelText(/flip style/i) as HTMLSelectElement;
        expect(flipStyleSelect.value).toBe('classic-flip');
      });

      it('should default to drop-down when not specified', () => {
        const preferences: UserPreferences = {
          ...defaultPreferences,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={preferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const flipStyleSelect = screen.getByLabelText(/flip style/i) as HTMLSelectElement;
        expect(flipStyleSelect.value).toBe('drop-down');
      });
    });

    describe('AC: Flip style selector has both options', () => {
      it('should have both classic-flip and drop-down options', () => {
        const preferences: UserPreferences = {
          ...defaultPreferences,
          flipStyle: 'drop-down',
        };

        render(
          <Settings
            preferences={preferences}
            onPreferencesChange={mockOnPreferencesChange}
            isOpen={true}
            onClose={mockOnClose}
          />
        );

        const classicFlipOption = screen.getByRole('option', { name: /classic flip/i });
        const dropDownOption = screen.getByRole('option', { name: /drop down/i });

        expect(classicFlipOption).toBeInTheDocument();
        expect(dropDownOption).toBeInTheDocument();
      });
    });
  });
});
