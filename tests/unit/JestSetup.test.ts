describe('Jest Setup', () => {
  describe('jest.setup.js configuration', () => {
    it('should have @testing-library/jest-dom matchers available', () => {
      const element = document.createElement('div');
      element.textContent = 'Test';
      document.body.appendChild(element);
      
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent('Test');
      
      document.body.removeChild(element);
    });

    it('should have matchMedia mock available', () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      expect(mediaQuery).toBeDefined();
      expect(mediaQuery.matches).toBe(false);
      expect(typeof mediaQuery.addEventListener).toBe('function');
    });

    it('should allow matchMedia mock to be overridden in tests', () => {
      const mockMatchMedia = jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      window.matchMedia = mockMatchMedia;

      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      expect(mediaQuery.matches).toBe(true);
    });
  });
});
