import styled from '@emotion/styled';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatbotContainer,
  ChatWindow,
  ChatHeader,
  ChatMessages,
  Input,
  SendButton,
  ChatbotButton,
  FileInput,
  CloseButton,
  MessageContainer,
  BotAvatar,
  UserAvatar,
  MessageContent,
  MessageText,
  FileMessage,
  MessageTime,
  SuggestionsContainer,
  Suggestion,
  ChatInputContainer,
  InputActions,
  ActionButton,
  TypingIndicator,
  TypingDot,
  EmojiPickerContainer,
  DirectCallButton
} from './ChatbotStyles';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FiMic, FiMicOff, FiUser, FiArrowRight, FiPaperclip, FiSend, FiX, FiMessageSquare, FiFile, FiSmile, FiPhone } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Chatbot = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initial suggestions
  const initialSuggestions = useMemo(() => [
    t('chatbot.suggestions.services'),
    t('chatbot.suggestions.pricing'),
    t('chatbot.suggestions.portfolio'),
    t('chatbot.suggestions.contact')
  ], [t]);

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: t('chatbot.welcomeMessage'),
        timestamp: new Date().toISOString()
      }
    ]);
  }, [t]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji) => {
    setInputValue(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  // Handle file change
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Create a storage reference
      const storageRef = ref(storage, `chat_files/${Date.now()}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Add file message to chat
      const fileMessage = {
        id: Date.now().toString(),
        sender: 'user',
        file: downloadURL,
        fileName: file.name,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      // Reset file input
      e.target.value = '';
      
      // Simulate typing
      setIsTyping(true);
      
      // Simulate bot response after delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: t('chatbot.responses.fallback'),
          timestamp: new Date().toISOString()
        }]);
      }, 1500);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [t]);

  // Handle sending a message
  const handleSendMessage = useCallback((e) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSuggestionsVisible(false);
    
    // Simulate typing
    setIsTyping(true);
    
    // Determine response based on user input
    let response = t('chatbot.responses.fallback');
    let showCallButton = false;
    const lowerInput = inputValue.toLowerCase();
    
    if (lowerInput.includes('service') || lowerInput.includes('offer')) {
      response = t('chatbot.responses.services');
    } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      response = t('chatbot.responses.pricing');
      showCallButton = true;
    } else if (lowerInput.includes('portfolio') || lowerInput.includes('example')) {
      response = t('chatbot.responses.portfolio');
    } else if (lowerInput.includes('contact') || lowerInput.includes('speak') || lowerInput.includes('talk') || 
               lowerInput.includes('call') || lowerInput.includes('help') || lowerInput.includes('consult')) {
      response = t('chatbot.responses.contact');
      showCallButton = true;
    } else if (lowerInput.includes('start') || lowerInput.includes('begin') || lowerInput.includes('project')) {
      response = t('chatbot.responses.getStarted');
      showCallButton = true;
    }
    
    // Simulate bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        timestamp: new Date().toISOString(),
        showCallButton: showCallButton
      }]);
      
      // Show suggestions again after response
      setTimeout(() => {
        setSuggestionsVisible(true);
      }, 500);
    }, 1500);
  }, [inputValue, t]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: suggestion,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setSuggestionsVisible(false);
    
    // Simulate typing
    setIsTyping(true);
    
    // Determine response based on suggestion
    let response = t('chatbot.responses.fallback');
    let showCallButton = false;
    
    if (suggestion === t('chatbot.suggestions.services')) {
      response = t('chatbot.responses.services');
    } else if (suggestion === t('chatbot.suggestions.pricing')) {
      response = t('chatbot.responses.pricing');
      showCallButton = true;
    } else if (suggestion === t('chatbot.suggestions.portfolio')) {
      response = t('chatbot.responses.portfolio');
    } else if (suggestion === t('chatbot.suggestions.contact')) {
      response = t('chatbot.responses.contact');
      showCallButton = true;
    }
    
    // Add bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response,
        timestamp: new Date().toISOString(),
        showCallButton: showCallButton
      }]);
      
      // Show suggestions again after a delay
      setTimeout(() => {
        setSuggestionsVisible(true);
      }, 500);
    }, 1000);
  }, [t]);

  // Handle get started button
  const handleGetStarted = useCallback(() => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: t('chatbot.getStarted'),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setSuggestionsVisible(false);
    
    // Simulate typing
    setIsTyping(true);
    
    // Add bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: t('chatbot.responses.getStarted'),
        timestamp: new Date().toISOString()
      }]);
      
      // Show suggestions again after a delay
      setTimeout(() => {
        setSuggestionsVisible(true);
      }, 500);
    }, 1000);
  }, [t]);

  // Toggle speech recognition
  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    
    if (!isListening) {
      // Check if browser supports speech recognition
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = language === 'nl' ? 'nl-NL' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        console.log('Speech recognition not supported');
        setIsListening(false);
      }
    }
  }, [isListening, language]);

  // Format timestamp
  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  // Add the handleDirectCall function near the other handler functions
  const handleDirectCall = useCallback(() => {
    window.location.href = `tel:+31687033774`;
  }, []);

  return (
    <>
      <ChatbotButton 
        onClick={() => setIsOpen(!isOpen)}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <FiMessageSquare /> {t('chatbot.title')}
      </ChatbotButton>
      
      <AnimatePresence>
        {isOpen && (
          <ChatbotContainer
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ChatWindow>
              <ChatHeader>
                <div className="title">
                  <FiMessageSquare /> {t('chatbot.title')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CloseButton onClick={() => setIsOpen(false)}>
                    <FiX />
                  </CloseButton>
                </div>
              </ChatHeader>
              
              <ChatMessages>
                {messages.map((message) => (
                  <MessageContainer 
                    key={message.id} 
                    className={message.sender === 'bot' ? 'bot' : 'user'}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {message.sender === 'bot' && <BotAvatar><FiMessageSquare /></BotAvatar>}
                    <MessageContent className={message.sender}>
                      {message.file ? (
                        <FileMessage>
                          <FiFile /> {message.fileName}
                          <a href={message.file} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </FileMessage>
                      ) : (
                        <>
                          <MessageText>{message.text}</MessageText>
                          {message.showCallButton && (
                            <>
                              <DirectCallButton onClick={handleDirectCall}>
                                <FiPhone style={{ marginRight: '8px' }} />
                                {language === 'nl' ? "Bel Eyobiel Goitom (+31687033774)" : 
                                 language === 'am' ? "ኢዮብኤል ጎይቶምን ይደውሉ (+31687033774)" : 
                                 language === 'ti' ? "ናብ ኢዮብኤል ጎይቶም ደውሉ (+31687033774)" : 
                                 "Call Eyobiel Goitom (+31687033774)"}
                              </DirectCallButton>
                              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                                {console.log('Current language:', language)}
                                {console.log('Weekdays translation:', t('getStartedModal.steps.projectType.consultation.weekdays'))}
                                {console.log('Weekend translation:', t('getStartedModal.steps.projectType.consultation.weekend'))}
                                <p style={{ margin: '2px 0' }}>
                                  {language === 'nl' ? "Maandag - Vrijdag: 9:00 - 18:00" : 
                                   language === 'am' ? "ሰኞ - አርብ: 9:00 - 18:00" : 
                                   language === 'ti' ? "ሰኑይ - ዓርቢ: 9:00 - 18:00" : 
                                   "Monday - Friday: 9:00 - 18:00"}
                                </p>
                                <p style={{ margin: '2px 0' }}>
                                  {language === 'nl' ? "Weekend: Op afspraak" : 
                                   language === 'am' ? "ቅዳሜ-እሁድ: በቀጠሮ" : 
                                   language === 'ti' ? "ቀዳም-ሰንበት: ብቆጸራ" : 
                                   "Weekend: By appointment"}
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      <MessageTime>
                        {formatTimestamp(message.timestamp)}
                      </MessageTime>
                    </MessageContent>
                    {message.sender === 'user' && <UserAvatar><FiUser /></UserAvatar>}
                  </MessageContainer>
                ))}
                
                {isTyping && (
                  <MessageContainer className="bot" variants={messageVariants} initial="hidden" animate="visible">
                    <BotAvatar><FiMessageSquare /></BotAvatar>
                    <MessageContent className="bot">
                      <TypingIndicator>
                        <TypingDot delay="0s" />
                        <TypingDot delay="0.1s" />
                        <TypingDot delay="0.2s" />
                      </TypingIndicator>
                    </MessageContent>
                  </MessageContainer>
                )}
                <div ref={messagesEndRef} />
              </ChatMessages>
              
              {suggestionsVisible && (
                <>
                  <SuggestionsContainer>
                    {initialSuggestions.map((suggestion, index) => (
                      <Suggestion
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        {suggestion}
                      </Suggestion>
                    ))}
                  </SuggestionsContainer>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                    <Suggestion
                      onClick={handleGetStarted}
                      className="primary"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      {t('chatbot.getStarted')} <FiArrowRight />
                    </Suggestion>
                  </div>
                </>
              )}
              
              <ChatInputContainer>
                <form onSubmit={handleSendMessage}>
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t('chatbot.inputPlaceholder')}
                    disabled={isListening}
                  />
                  <InputActions>
                    <ActionButton type="button" onClick={handleFileUpload} title={t('chatbot.attachFile')}>
                      <FiPaperclip />
                    </ActionButton>
                    <ActionButton type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} title={t('chatbot.addEmoji')}>
                      <FiSmile />
                    </ActionButton>
                    <ActionButton type="button" onClick={toggleListening} title={isListening ? t('chatbot.stopListening') : t('chatbot.startListening')}>
                      {isListening ? <FiMicOff /> : <FiMic />}
                    </ActionButton>
                    <SendButton type="submit" title={t('chatbot.send')}>
                      <FiSend />
                    </SendButton>
                  </InputActions>
                </form>
                <AnimatePresence>
                  {showEmojiPicker && (
                    <EmojiPickerContainer
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Picker 
                        data={data} 
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                        previewPosition="none"
                      />
                    </EmojiPickerContainer>
                  )}
                </AnimatePresence>
                <FileInput
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </ChatInputContainer>
            </ChatWindow>
          </ChatbotContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 