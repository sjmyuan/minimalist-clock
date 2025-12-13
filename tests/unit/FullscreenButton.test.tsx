import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FullscreenButton } from '@/src/components/FullscreenButton';

describe('FullscreenButton component', () => {
  it('should render the fullscreen button', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    expect(button).toBeInTheDocument();
  });

  it('should display "Full-Screen" text when not in fullscreen mode', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    expect(screen.getByText(/full-screen/i)).toBeInTheDocument();
  });

  it('should display "Exit Full-Screen" text when in fullscreen mode', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={true} />);
    
    expect(screen.getByText(/exit full-screen/i)).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be styled consistently with the overall design', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    
    // Check that button has proper styling
    expect(button).toHaveStyle({ 
      cursor: 'pointer',
      borderRadius: '4px'
    });
  });

  it('should have proper button styling', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    expect(button).toHaveStyle({ 
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem'
    });
  });

  it('should have hover effect styling', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    
    // Check that button has cursor pointer for hover
    expect(button).toHaveStyle({ cursor: 'pointer' });
  });

  it('should be visible and prominent', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    expect(button).toBeVisible();
  });

  it('should handle rapid clicks gracefully', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /full-screen/i });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });
});
