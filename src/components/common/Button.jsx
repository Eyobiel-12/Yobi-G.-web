import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';

const StyledButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(45deg, #2563eb, #3b82f6);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: auto;
  white-space: nowrap;

  /* Glow effect */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #2563eb, #3b82f6, #60a5fa);
    border-radius: 14px;
    z-index: -1;
    animation: glowing 1.5s ease-in-out infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Hover state */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
    
    &::before {
      opacity: 1;
    }
  }

  /* Active state */
  &:active {
    transform: translateY(1px);
  }

  /* Glow animation */
  @keyframes glowing {
    0% {
      opacity: 0.5;
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 30px rgba(37, 99, 235, 0.6),
                  0 0 40px rgba(37, 99, 235, 0.3);
    }
    100% {
      opacity: 0.5;
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
    }
  }

  /* Pulse animation on load */
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }

  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1.2rem 2rem;
    width: 100%;
    max-width: 300px;
    margin: 1rem auto;
    
    &::before {
      animation: glowing 2s ease-in-out infinite;
    }
  }

  /* Small mobile optimization */
  @media (max-width: 380px) {
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    max-width: 250px;
  }

  ${props => props.secondary && css`
    background: transparent;
    border: 2px solid #2563eb;
    color: #2563eb;
    
    &:hover {
      background: #2563eb;
      color: white;
    }
  `}
`;

const Button = ({ children, secondary, ...props }) => {
  return (
    <StyledButton
      $secondary={secondary}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 