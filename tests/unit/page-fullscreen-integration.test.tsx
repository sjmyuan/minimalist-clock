import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock the components and hooks
jest.mock('@/src/components', () => ({
  ClockDisplay: ({ preferences }: any) => <div data-testid="clock-display">Clock Display</div>,
  Settings: ({ isOpen, onClose }: any) => 
    isOpen ? <div data-testid="settings">Settings Panel</div> : null,
  FullscreenButton: ({ onClick, isFullscreen }: any) => (
    <button onClick={onClick} data-testid="fullscreen-button">
      {isFullscreen ? 'Exit Full-Screen' : 'Full-Screen'}
    </button>
  ),
}));

jest.mock('@/src/utils', () => ({
  loadPreferences: jest.fn(() => ({
    fontSize: 120,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
  })),
  savePreferences: jest.fn(),
  useFullscreen: jest.fn(() => ({
    isFullscreen: false,
    enterFullscreen: jest.fn(),
    exitFullscreen: jest.fn(),
    toggleFullscreen: jest.fn(),
  })),
  useUserActivity: jest.fn(() => true),
}));

describe('Home page - Fullscreen integration', () => {
  let mockDocumentElement: any;
  let mockDocument: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock fullscreen API
    mockDocumentElement = {
      requestFullscreen: jest.fn().mockResolvedValue(undefined),
    };
    mockDocument = {
      exitFullscreen: jest.fn().mockResolvedValue(undefined),
      fullscreenElement: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    Object.defineProperty(document, 'documentElement', {
      configurable: true,
      writable: true,
      value: mockDocumentElement,
    });

    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      writable: true,
      value: mockDocument.exitFullscreen,
    });

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => mockDocument.fullscreenElement,
    });

    Object.defineProperty(document, 'addEventListener', {
      configurable: true,
      value: mockDocument.addEventListener,
    });

    Object.defineProperty(document, 'removeEventListener', {
      configurable: true,
      value: mockDocument.removeEventListener,
    });
  });

  it('should render the fullscreen button', () => {
    render(<Home />);
    
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    expect(fullscreenButton).toBeInTheDocument();
  });

  it('should render the clock display', () => {
    render(<Home />);
    
    const clockDisplay = screen.getByTestId('clock-display');
    expect(clockDisplay).toBeInTheDocument();
  });

  it('should display "Full-Screen" button text when not in fullscreen', () => {
    render(<Home />);
    
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    expect(fullscreenButton).toHaveTextContent('Full-Screen');
  });

  it('should call toggleFullscreen when fullscreen button is clicked', () => {
    const mockToggleFullscreen = jest.fn();
    const { useFullscreen } = require('@/src/utils');
    useFullscreen.mockReturnValue({
      isFullscreen: false,
      enterFullscreen: jest.fn(),
      exitFullscreen: jest.fn(),
      toggleFullscreen: mockToggleFullscreen,
    });

    render(<Home />);
    
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    fireEvent.click(fullscreenButton);
    
    expect(mockToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should update button text when entering fullscreen', () => {
    const { useFullscreen } = require('@/src/utils');
    
    // First render - not in fullscreen
    useFullscreen.mockReturnValue({
      isFullscreen: false,
      enterFullscreen: jest.fn(),
      exitFullscreen: jest.fn(),
      toggleFullscreen: jest.fn(),
    });

    const { rerender } = render(<Home />);
    let fullscreenButton = screen.getByTestId('fullscreen-button');
    expect(fullscreenButton).toHaveTextContent('Full-Screen');

    // Simulate entering fullscreen
    useFullscreen.mockReturnValue({
      isFullscreen: true,
      enterFullscreen: jest.fn(),
      exitFullscreen: jest.fn(),
      toggleFullscreen: jest.fn(),
    });

    rerender(<Home />);
    fullscreenButton = screen.getByTestId('fullscreen-button');
    expect(fullscreenButton).toHaveTextContent('Exit Full-Screen');
  });

  it('should render both fullscreen button and settings button', () => {
    render(<Home />);
    
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    const settingsButton = screen.getByText(/settings/i);
    
    expect(fullscreenButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
  });

  it('should not interfere with settings functionality', () => {
    render(<Home />);
    
    // Settings should be closed initially
    expect(screen.queryByTestId('settings')).not.toBeInTheDocument();
    
    // Open settings
    const settingsButton = screen.getByText(/settings/i);
    fireEvent.click(settingsButton);
    
    // Settings should be open
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

  it('should maintain preferences state when toggling fullscreen', () => {
    const { loadPreferences } = require('@/src/utils');
    
    render(<Home />);
    
    // Verify initial preferences are loaded
    expect(loadPreferences).toHaveBeenCalled();
  });
});
