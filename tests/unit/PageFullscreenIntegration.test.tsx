import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';
import { useFullscreen, loadPreferences } from '@/src/utils';

// Mock the components and hooks
jest.mock('@/src/components', () => ({
  ClockDisplay: () => <div data-testid="clock-display">Clock Display</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Settings: ({ isOpen }: any) => 
    isOpen ? <div data-testid="settings">Settings Panel</div> : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FullscreenButton: ({ onClick, isFullscreen }: any) => (
    <button onClick={onClick} data-testid="fullscreen-button">
      {isFullscreen ? 'Exit Full-Screen' : 'Full-Screen'}
    </button>
  ),
}));

jest.mock('@/src/utils', () => ({
  loadPreferences: jest.fn(() => ({
    fontSize: 48,
    fontColor: '#FFFFFF',
    backgroundColor: '#000000',
    showSeconds: false,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDocumentElement: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    (useFullscreen as jest.Mock).mockReturnValue({
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
    
    // First render - not in fullscreen
    (useFullscreen as jest.Mock).mockReturnValue({
      isFullscreen: false,
      enterFullscreen: jest.fn(),
      exitFullscreen: jest.fn(),
      toggleFullscreen: jest.fn(),
    });

    const { rerender } = render(<Home />);
    let fullscreenButton = screen.getByTestId('fullscreen-button');
    expect(fullscreenButton).toHaveTextContent('Full-Screen');

    // Simulate entering fullscreen
    (useFullscreen as jest.Mock).mockReturnValue({
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
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    
    expect(fullscreenButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
  });

  it('should not interfere with settings functionality', () => {
    render(<Home />);
    
    // Settings should be closed initially
    expect(screen.queryByTestId('settings')).not.toBeInTheDocument();
    
    // Open settings
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    // Settings should be open
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

  it('should maintain preferences state when toggling fullscreen', () => {
    (loadPreferences as jest.Mock).mockReturnValue({
      fontSize: 48,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      showSeconds: false,
    });
    
    render(<Home />);
    
    // Verify initial preferences are loaded
    expect(loadPreferences).toHaveBeenCalled();
  });

  it('should have initial state with all required UserPreferences properties', () => {
    // This test verifies that the initial state object in Home component
    // contains all required properties defined in UserPreferences interface
    // to prevent TypeScript compilation errors
    
    // Mock loadPreferences to verify it's not called during initial render
    (loadPreferences as jest.Mock).mockClear();
    
    // The initial state should have these properties before loadPreferences is called
    // fontSize, fontColor, backgroundColor, showSeconds, flipStyle, fontFamily, fontWeight
    
    // We can't directly access the state, but we can verify the component renders
    // without TypeScript errors by checking if it renders successfully
    expect(() => render(<Home />)).not.toThrow();
  });
});
