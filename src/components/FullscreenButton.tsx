'use client';

import React from 'react';
import styled from 'styled-components';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenButtonProps {
  onClick: () => void;
  isFullscreen: boolean;
}

const StyledButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ onClick, isFullscreen }) => {
  return (
    <StyledButton onClick={onClick} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
      {isFullscreen ? <Minimize2 /> : <Maximize2 />}
    </StyledButton>
  );
};
