'use client';

import React from 'react';
import styled from 'styled-components';

interface FullscreenButtonProps {
  onClick: () => void;
  isFullscreen: boolean;
}

const StyledButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ onClick, isFullscreen }) => {
  return (
    <StyledButton onClick={onClick}>
      {isFullscreen ? '⬅ Exit Full-Screen' : '⛶ Full-Screen'}
    </StyledButton>
  );
};
