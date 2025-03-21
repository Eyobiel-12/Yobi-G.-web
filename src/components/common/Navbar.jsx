import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { scrollTo } from '../../utils/scrollTo';
import { useLanguage } from '../../context/LanguageContext';
import { FiChevronDown, FiGlobe, FiMoon, FiSun, FiArrowRight } from 'react-icons/fi';

const Nav = styled(motion.nav)`
  padding: 1.25rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  background: ${props => props.isScrolled ? 'rgba(252, 253, 255, 0.98)' : 'rgba(252, 253, 255, 0.85)'};
  backdrop-filter: blur(15px);
  transition: all 0.4s ease-in-out;
  box-shadow: ${props => props.isScrolled ? '0 6px 25px rgba(37, 99, 235, 0.08)' : 'none'};
  border-bottom: ${props => props.isScrolled ? '1px solid rgba(229, 231, 255, 0.5)' : 'none'};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    position: relative;
  }
`;

const LogoContainer = styled(motion.div)`
  width: 100px;
  height: 40px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-left: 2.5rem;
  filter: drop-shadow(0 2px 5px rgba(37, 99, 235, 0.2));
  
  &:hover {
    .dotlottie-player {
      transform: scale(1.1);
    }
  }

  .dotlottie-player {
    transition: transform 0.3s ease;
  }
  
  @media (max-width: 768px) {
    margin-left: 3.5rem;
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
  font-weight: 600;
  position: relative;
  cursor: pointer;
  padding: 0.5rem 0;
  letter-spacing: 0.02em;
  font-size: 1.05rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #4f46e5);
    transition: width 0.3s cubic-bezier(0.65, 0, 0.35, 1);
    border-radius: 3px;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  &:hover {
    color: #2563eb;
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
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 10px;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: #1f2937;
  backdrop-filter: blur(5px);
  margin-left: 0.75rem;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }
  
  @media (max-width: 480px) {
    padding: 0.35rem;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 78px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  padding: 1.25rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border: 1px solid rgba(229, 231, 255, 0.6);
  border-top: none;
  z-index: 99;
  max-height: calc(100vh - 78px);
  overflow-y: auto;
  
  @media (min-width: 769px) {
    display: none;
  }
  
  @media (max-width: 480px) {
    top: 72px;
    padding: 1rem;
    max-height: calc(100vh - 72px);
  }
`;

const MobileLink = styled(motion.a)`
  display: block;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: #1f2937;
  font-weight: 600;
  text-align: center;
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
  -webkit-tap-highlight-color: transparent;
  
  &:hover {
    background: #f0f5ff;
    color: #2563eb;
    transform: translateX(5px);
  }

  &.active {
    background: #e0e7ff;
    color: #2563eb;
    box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.2);
  }
`;

const LanguageSwitcher = styled.div`
  position: relative;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  
  @media (max-width: 480px) {
    left: 0.5rem;
  }
`;

const LanguageButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.05);
  
  &:hover {
    background: #f0f5ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    border-color: rgba(79, 70, 229, 0.3);
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const LanguageDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 0 10px 35px rgba(37, 99, 235, 0.15);
  overflow: hidden;
  z-index: 110;
  min-width: 180px;
  border: 1px solid rgba(229, 231, 255, 0.7);
  
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    right: auto;
    top: calc(100% + 0.5rem);
    width: 200px;
  }
  
  @media (max-width: 480px) {
    width: 180px;
  }
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
  border-bottom: 1px solid rgba(243, 244, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f0f5ff;
    padding-left: 1.5rem;
  }
  
  &.active {
    background: #e0e7ff;
    font-weight: 600;
    color: #2563eb;
  }
`;

const FlagIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
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
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-tertiary);
    transform: rotate(15deg);
  }
`;

const GetStartedButton = styled(motion.button)`
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1.5rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #4f46e5, #2563eb);
    transition: left 0.3s ease;
    z-index: -1;
  }
  
  &:hover::before {
    left: 0;
  }
  
  &:hover {
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Updated hamburger menu styling
const HamburgerIcon = styled(motion.div)`
  width: 24px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`;

const Line = styled(motion.div)`
  height: 2px;
  background-color: #4f46e5;
  border-radius: 5px;
  width: 100%;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: flex-end;
    flex: 1;
    position: relative;
  }
`;

// Create a new container for the left side elements
const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Now modify the Navbar component to use our enhanced components
const Navbar = ({ onGetStartedClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
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
    // Close the mobile menu first
    setIsMobileMenuOpen(false);
    
    // Add a longer delay to ensure the mobile menu transition completes before scrolling
    setTimeout(() => {
      if (sectionId === 'hero') {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          // Get the actual navbar height dynamically
          const navbar = document.querySelector('nav');
          const navHeight = navbar ? navbar.offsetHeight : 80;
          
          // Calculate position manually for better cross-browser compatibility
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
      setActiveSection(sectionId);
    }, 300); // Increased delay to ensure menu closes completely first
  };

  const navItems = [
    { id: 'hero', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'portfolio', label: t('nav.portfolio') },
    { id: 'reviews', label: t('nav.reviews') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const linkVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Add the missing toggleMobileMenu function
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Render the hamburger menu icon with animations
  const renderHamburgerIcon = () => (
    <HamburgerIcon onClick={toggleMobileMenu}>
      <Line
        animate={isMobileMenuOpen ? {rotate: 45, y: 9} : {rotate: 0, y: 0}}
        transition={{duration: 0.3}}
      />
      <Line
        animate={isMobileMenuOpen ? {opacity: 0} : {opacity: 1}}
        transition={{duration: 0.3}}
      />
      <Line
        animate={isMobileMenuOpen ? {rotate: -45, y: -9} : {rotate: 0, y: 0}}
        transition={{duration: 0.3}}
      />
    </HamburgerIcon>
  );

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' }
  ];

  // Also modify the effect to prevent body scrolling when mobile menu is open
  useEffect(() => {
    // Prevent scrolling on body when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <Nav
      isScrolled={isScrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <NavContainer>
        <LeftContainer>
          <LanguageSwitcher>
            <LanguageButton 
              onClick={() => {
                // Toggle the dropdown directly
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiGlobe />
              {languageOptions.find(option => option.code === language)?.flag}
              <FiChevronDown size={14} style={{ 
                transform: isLanguageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} />
            </LanguageButton>
            
            <AnimatePresence>
              {isLanguageDropdownOpen && (
                <LanguageDropdown
                  ref={languageDropdownRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FlagIcon>{option.flag}</FlagIcon>
                      <span>{option.name}</span>
                    </LanguageOption>
                  ))}
                </LanguageDropdown>
              )}
            </AnimatePresence>
          </LanguageSwitcher>
          
          <LogoContainer
            onClick={() => scrollTo('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DotLottieReact
              src="https://lottie.host/5a8bf850-d698-4dd6-bdeb-fcfd51172f3d/v4iGoPdlj1.lottie"
              autoplay
              loop
            />
          </LogoContainer>
        </LeftContainer>
        
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
        </NavLinks>
        
        <RightContainer>
          <GetStartedButton
            onClick={onGetStartedClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('hero.cta')}
            <FiArrowRight />
          </GetStartedButton>
          
          <MobileMenuButton
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {renderHamburgerIcon()}
          </MobileMenuButton>
        </RightContainer>
      </NavContainer>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {navItems.map((item, index) => (
              <MobileLink
                key={item.id}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  handleNavClick(item.id);
                }}
                className={activeSection === item.id ? 'active' : ''}
                custom={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </MobileLink>
            ))}
            <MobileLink
              onClick={() => {
                onGetStartedClick();
                setIsMobileMenuOpen(false);
              }}
              custom={navItems.length}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: 'white',
                marginTop: '1rem',
                fontWeight: '600',
                boxShadow: '0 6px 18px rgba(37, 99, 235, 0.25)',
                borderRadius: '14px',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.cta')}
            </MobileLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar; 