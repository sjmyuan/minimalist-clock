import { renderHook, act } from '@testing-library/react';
import { useFullscreen } from '@/src/utils/fullscreen';

describe('fullscreen utils', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDocumentElement: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDocument: any;

  beforeEach(() => {
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
      value: mockDocumentElement,
    });

    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useFullscreen hook', () => {
    it('should initialize with isFullscreen as false', () => {
      const { result } = renderHook(() => useFullscreen());
      
      expect(result.current.isFullscreen).toBe(false);
    });

    it('should enter fullscreen when enterFullscreen is called', async () => {
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.enterFullscreen();
      });

      expect(mockDocumentElement.requestFullscreen).toHaveBeenCalled();
    });

    it('should exit fullscreen when exitFullscreen is called', async () => {
      mockDocument.fullscreenElement = document.documentElement;
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.exitFullscreen();
      });

      expect(mockDocument.exitFullscreen).toHaveBeenCalled();
    });

    it('should toggle fullscreen when toggleFullscreen is called', async () => {
      const { result } = renderHook(() => useFullscreen());
      
      // Toggle from non-fullscreen to fullscreen
      await act(async () => {
        await result.current.toggleFullscreen();
      });

      expect(mockDocumentElement.requestFullscreen).toHaveBeenCalled();
    });

    it('should toggle from fullscreen to non-fullscreen', async () => {
      mockDocument.fullscreenElement = document.documentElement;
      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.toggleFullscreen();
      });

      expect(mockDocument.exitFullscreen).toHaveBeenCalled();
    });

    it('should listen to fullscreenchange events', () => {
      renderHook(() => useFullscreen());
      
      expect(mockDocument.addEventListener).toHaveBeenCalledWith(
        'fullscreenchange',
        expect.any(Function)
      );
    });

    it('should update isFullscreen state when fullscreen changes', () => {
      const { result } = renderHook(() => useFullscreen());
      const fullscreenChangeHandler = mockDocument.addEventListener.mock.calls.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (call: any[]) => call[0] === 'fullscreenchange'
      )?.[1];

      expect(result.current.isFullscreen).toBe(false);

      // Simulate entering fullscreen
      mockDocument.fullscreenElement = document.documentElement;
      act(() => {
        fullscreenChangeHandler();
      });

      expect(result.current.isFullscreen).toBe(true);

      // Simulate exiting fullscreen
      mockDocument.fullscreenElement = null;
      act(() => {
        fullscreenChangeHandler();
      });

      expect(result.current.isFullscreen).toBe(false);
    });

    it('should cleanup event listener on unmount', () => {
      const { unmount } = renderHook(() => useFullscreen());
      
      unmount();

      expect(mockDocument.removeEventListener).toHaveBeenCalledWith(
        'fullscreenchange',
        expect.any(Function)
      );
    });

    it('should handle errors when entering fullscreen fails', async () => {
      const error = new Error('Fullscreen request failed');
      mockDocumentElement.requestFullscreen.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.enterFullscreen();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error entering fullscreen:', error);
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors when exiting fullscreen fails', async () => {
      const error = new Error('Exit fullscreen failed');
      mockDocument.exitFullscreen.mockRejectedValue(error);
      mockDocument.fullscreenElement = document.documentElement;
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useFullscreen());
      
      await act(async () => {
        await result.current.exitFullscreen();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error exiting fullscreen:', error);
      consoleErrorSpy.mockRestore();
    });
  });
});
