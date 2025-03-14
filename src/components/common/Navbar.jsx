import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { scrollTo } from '../../utils/scrollTo';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { FiChevronDown, FiGlobe, FiMoon, FiSun, FiArrowRight } from 'react-icons/fi';

const Nav = styled(motion.nav)`
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  background: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;
  box-shadow: ${props => props.isScrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled(motion.div)`
  width: 100px;
  height: 40px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  
  &:hover {
    .dotlottie-player {
      transform: scale(1.1);
    }
  }

  .dotlottie-player {
    transition: transform 0.3s ease;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #2563eb;
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover::after {
    width: 100%;
  }

  &.active {
    color: #2563eb;
    &::after {
      width: 100%;
    }
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #1f2937;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileLink = styled(motion.a)`
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
    color: #2563eb;
  }

  &.active {
    background: #e0e7ff;
    color: #2563eb;
  }
`;

const LanguageSwitcher = styled.div`
  position: relative;
  margin-left: 1rem;
`;

const LanguageButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
`;

const LanguageDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  min-width: 150px;
`;

const LanguageOption = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9fafb;
  }
  
  &.active {
    background: #f0f9ff;
    font-weight: 500;
  }
`;

const FlagIcon = styled.span`
  font-size: 1.25rem;
`;

const ThemeToggle = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
  color: var(--text-secondary);
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-tertiary);
  }
`;

const GetStartedButton = styled(motion.button)`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1.5rem;
  
  &:hover {
    background: #1d4ed8;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Navbar = ({ onGetStartedClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const languageDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['hero', 'services', 'portfolio', 'reviews', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    
    if (sectionId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = 80; // Height of your navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
    setActiveSection(sectionId);
  };

  const navItems = [
    { id: 'hero', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'portfolio', label: t('nav.portfolio') },
    { id: 'reviews', label: t('nav.reviews') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const menuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' }
  ];

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      isScrolled={isScrolled}
    >
      <NavContainer>
        <LogoContainer onClick={() => handleNavClick('hero')}>
          <DotLottieReact
            src="https://lottie.host/1c0c85cf-6001-45c0-8634-08ed2c57f104/rEuQg3ej90.lottie"
            loop
            autoplay
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              visibility: 'visible',
              opacity: 1
            }}
          />
        </LogoContainer>
        
        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={activeSection === item.id ? 'active' : ''}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </NavLink>
          ))}
          
          <ThemeToggle
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </ThemeToggle>
          
          <LanguageSwitcher ref={languageDropdownRef}>
            <LanguageButton
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiGlobe />
              <span>{languageOptions.find(option => option.code === language)?.flag}</span>
              <FiChevronDown style={{ fontSize: '0.875rem' }} />
            </LanguageButton>
            
            <AnimatePresence>
              {isLanguageDropdownOpen && (
                <LanguageDropdown
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {languageOptions.map((option) => (
                    <LanguageOption
                      key={option.code}
                      className={language === option.code ? 'active' : ''}
                      onClick={() => {
                        setLanguage(option.code);
                        setIsLanguageDropdownOpen(false);
                      }}
                    >
                      <FlagIcon>{option.flag}</FlagIcon>
                      <span>{option.name}</span>
                    </LanguageOption>
                  ))}
                </LanguageDropdown>
              )}
            </AnimatePresence>
          </LanguageSwitcher>
          
          <GetStartedButton
            onClick={onGetStartedClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t('hero.cta')}</span>
            <FiArrowRight />
          </GetStartedButton>
        </NavLinks>

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {navItems.map((item) => (
                <MobileLink
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={activeSection === item.id ? 'active' : ''}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </MobileLink>
              ))}
              
              <MobileLink
                onClick={onGetStartedClick}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  background: '#2563eb', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}
              >
                <span>{t('hero.cta')}</span>
                <FiArrowRight />
              </MobileLink>
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 