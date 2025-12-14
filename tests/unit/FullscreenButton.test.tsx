import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FullscreenButton } from '@/src/components/FullscreenButton';

describe('FullscreenButton component', () => {
  it('should render the fullscreen button with icon', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should display maximize icon when not in fullscreen mode', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toHaveClass('lucide-maximize-2');
  });

  it('should display minimize icon when in fullscreen mode', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={true} />);
    
    const button = screen.getByRole('button', { name: /exit fullscreen/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toHaveClass('lucide-minimize-2');
  });

  it('should call onClick when button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be styled consistently with circular design', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    
    // Check that button has proper styling
    expect(button).toHaveStyle({ 
      cursor: 'pointer',
      borderRadius: '50%'
    });
  });

  it('should have proper circular button styling', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toHaveStyle({ 
      padding: '0.75rem',
      width: '48px',
      height: '48px'
    });
  });

  it('should have hover effect styling', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    
    // Check that button has cursor pointer for hover
    expect(button).toHaveStyle({ cursor: 'pointer' });
  });

  it('should be visible and prominent', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    expect(button).toBeVisible();
  });

  it('should handle rapid clicks gracefully', () => {
    const mockOnClick = jest.fn();
    render(<FullscreenButton onClick={mockOnClick} isFullscreen={false} />);
    
    const button = screen.getByRole('button', { name: /enter fullscreen/i });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });
});
