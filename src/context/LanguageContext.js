import { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (path) => {
    const translatedValue = path.split('.').reduce((obj, key) => obj?.[key], translations[language]);
    
    if (!translatedValue) {
      console.warn(`Translation missing for path: ${path} in language: ${language}`);
      // Try to get the English translation as a fallback
      const englishValue = path.split('.').reduce((obj, key) => obj?.[key], translations['en']);
      return englishValue || path;
    }
    
    return translatedValue;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 