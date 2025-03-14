import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const ChatbotContainer = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 9998;
  font-family: 'Inter', sans-serif;
  max-width: 90vw;
`;

export const ChatWindow = styled.div`
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  @media (max-width: 480px) {
    width: 320px;
    height: 520px;
  }
  
  &:hover {
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25), 0 2px 10px rgba(0, 0, 0, 0.15);
  }
`;

export const ChatHeader = styled.div`
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  .title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 1.2rem;
    
    svg {
      font-size: 1.4rem;
    }
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background-color: #f8fafc;
  background-image: 
    radial-gradient(circle at 25px 25px, rgba(74, 111, 220, 0.03) 2%, transparent 0%),
    radial-gradient(circle at 75px 75px, rgba(74, 111, 220, 0.03) 2%, transparent 0%);
  background-size: 100px 100px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(74, 111, 220, 0.2);
    border-radius: 20px;
  }
`;

export const Message = styled.div`
  padding: 0.8rem 1rem;
  border-radius: 15px;
  max-width: 80%;
  ${props => props.isBot ? `
    background: #f3f4f6;
    align-self: flex-start;
  ` : `
    background: #4a6fdc;
    color: white;
    align-self: flex-end;
  `}
`;

export const MessageContainer = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  max-width: 85%;
  margin-bottom: 12px;
  
  &.bot {
    align-self: flex-start;
    flex-direction: row;
  }
  
  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
`;

export const InputArea = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1.2rem;
  border: none;
  background: transparent;
  border-radius: 20px;
  outline: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #94a3b8;
  }
`;

export const SendButton = styled.button`
  background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(74, 111, 220, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 111, 220, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(74, 111, 220, 0.2);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

export const ChatbotButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 16px rgba(74, 111, 220, 0.3);
  z-index: 9999;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #3b5998 0%, #2d4373 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(74, 111, 220, 0.4);
  }
  
  svg {
    font-size: 18px;
  }
`;

export const Suggestions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  white-space: nowrap;
`;

export const SuggestionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  
  &:hover {
    background: #e5e7eb;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: rotate(90deg);
  }
`;

export const BotAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right: 12px;
  box-shadow: 0 2px 5px rgba(74, 111, 220, 0.2);
  border: 2px solid white;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 2px solid white;
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  
  &.bot {
    margin-left: 8px;
  }
  
  &.user {
    margin-right: 8px;
    align-items: flex-end;
  }
`;

export const MessageText = styled.div`
  padding: 1rem 1.2rem;
  border-radius: 18px;
  max-width: 100%;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  line-height: 1.5;
  font-size: 0.95rem;
  
  .bot & {
    background: white;
    color: #1f2937;
    border-bottom-left-radius: 4px;
    
    &:hover {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    }
  }
  
  .user & {
    background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
    color: white;
    border-bottom-right-radius: 4px;
    
    &:hover {
      box-shadow: 0 2px 5px rgba(74, 111, 220, 0.2);
    }
  }
`;

export const FileMessage = styled.div`
  padding: 0.9rem 1.2rem;
  border-radius: 18px;
  background: white;
  color: #4a6fdc;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border-bottom-left-radius: 4px;
  
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4a6fdc;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
    
    svg {
      font-size: 1.2rem;
    }
  }
`;

export const MessageTime = styled.div`
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 4px;
  
  .bot & {
    align-self: flex-start;
  }
  
  .user & {
    align-self: flex-end;
  }
`;

export const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  margin-top: 12px;
  padding: 0 12px;
  overflow-x: auto;
  justify-content: flex-start;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(74, 111, 220, 0.2);
    border-radius: 20px;
  }
`;

export const Suggestion = styled(motion.button)`
  padding: 8px 14px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  font-size: 0.8rem;
  color: #4a6fdc;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  flex: 0 0 auto;
  
  &:hover {
    background-color: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  &.primary {
    background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
    color: white;
    border: none;
    font-weight: 500;
    padding: 10px 16px;
    font-size: 0.85rem;
    
    &:hover {
      background: linear-gradient(135deg, #3b5998 0%, #2d4373 100%);
      box-shadow: 0 4px 8px rgba(74, 111, 220, 0.3);
    }
  }
`;

export const ChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8rem 1rem 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
  
  form {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 0.5rem 0.7rem;
    transition: all 0.2s ease;
    
    &:focus-within {
      border-color: #4a6fdc;
      box-shadow: 0 0 0 2px rgba(74, 111, 220, 0.1);
    }
  }
`;

export const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

export const ActionButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

export const DirectCallButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #45a049;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  }
`;

export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f0f2f5;
  border-radius: 18px;
  width: fit-content;
  height: 32px;
`;

export const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #6b7280;
  border-radius: 50%;
  margin: 0 2px;
  animation: typing 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-4px);
    }
  }
`;

export const EmojiPickerContainer = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 1001;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
`;

export const GetStartedButton = styled.button`
  background: linear-gradient(135deg, #4a6fdc 0%, #3b5998 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(74, 111, 220, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 111, 220, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(74, 111, 220, 0.2);
  }
  
  svg {
    font-size: 1.2rem;
  }
`; 