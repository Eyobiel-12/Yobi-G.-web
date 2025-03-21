import { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Button from '../common/Button';
import { useResponsive } from '../../hooks/useResponsive';
import { useLanguage } from '../../context/LanguageContext';
import { FaArrowRight } from 'react-icons/fa';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-top: 6rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    padding-top: 2rem;
  }
`;

const TextContent = styled.div`
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: linear-gradient(45deg, #2563eb, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, transparent);
    border-radius: 2px;
    
    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 90%;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const HeroAccent = styled(motion.div)`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%);
  border-radius: 50%;
  z-index: 0;
`;

const ParallaxShape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, #2563eb20, #3b82f630);
  filter: blur(40px);
  z-index: 0;
`;

const AnimatedText = styled(motion.span)`
  display: inline-block;
  white-space: nowrap;
`;

const AnimatedWord = styled(motion.span)`
  display: inline-block;
  margin-right: 0.5rem;
`;

const AnimatedChar = styled(motion.span)`
  display: inline-block;
  position: relative;
  color: inherit;
  background: inherit;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AnimationContainer = styled(motion.div)`
  width: 100%;
  max-width: 650px;
  height: auto;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    max-width: 550px;
    min-height: 450px;
    margin-top: -40px;
  }

  .dotlottie-player {
    width: 100% !important;
    height: 100% !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

const GlowingOrb = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%);
  filter: blur(20px);
  z-index: 0;
`;

const AnimatedButton = styled(motion.div)`
  display: inline-flex;
  position: relative;
  z-index: 2;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border-radius: 50%;
  background: ${props => props.color || 'rgba(59, 130, 246, 0.1)'};
  filter: blur(5px);
`;

// New component for animated features
const FeatureList = styled(motion.div)`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4b5563;
  font-size: 1rem;
  
  svg {
    color: #3b82f6;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Hero = ({ onGetStartedClick }) => {
  const { isMobile } = useResponsive();
  const heroRef = useRef(null);
  const { t } = useLanguage();
  const [isAnimationInView, setIsAnimationInView] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };
  
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
      }
    }
  };
  
  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8 + (i * 0.2),
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    })
  };
  
  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  // Split title and subtitle text for animation
  const titleWords = t('hero.title').split(' ');
  const subtitleWords = t('hero.subtitle').split(' ');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationInView(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Generate floating elements
  const floatingElements = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: `${20 + Math.random() * 40}px`,
    color: `rgba(${59 + Math.random() * 40}, ${130 + Math.random() * 30}, ${246}, ${0.05 + Math.random() * 0.1})`,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    duration: 10 + Math.random() * 20
  }));

  return (
    <HeroSection ref={heroRef}>
      <FloatingElements>
        {floatingElements.map(element => (
          <FloatingElement
            key={element.id}
            size={element.size}
            color={element.color}
            initial={{ x: element.x, y: element.y, opacity: 0 }}
            animate={{ 
              x: [element.x, `${parseFloat(element.x) - 10}%`, `${parseFloat(element.x) + 10}%`, element.x],
              y: [element.y, `${parseFloat(element.y) + 10}%`, `${parseFloat(element.y) - 10}%`, element.y],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: element.duration, 
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1]
            }}
          />
        ))}
      </FloatingElements>
      
      <ParallaxShape
        style={{
          width: '600px',
          height: '600px',
          top: '-200px',
          right: '-200px',
          y,
          opacity,
          scale
        }}
      />
      <ParallaxShape
        style={{
          width: '400px',
          height: '400px',
          bottom: '-100px',
          left: '-100px',
          y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]),
          opacity,
          scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
        }}
      />
      
      <HeroContent>
        <TextContent>
          <HeroAccent
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          
          <HeroTitle
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {titleWords.map((word, i) => (
              <AnimatedWord key={i} variants={wordVariants}>
                {word}
              </AnimatedWord>
            ))}
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('hero.subtitle')}
          </HeroSubtitle>
          
          <FeatureList
            initial="hidden"
            animate="visible"
          >
            <FeatureItem custom={0} variants={featureVariants}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('services.webDevelopment.title')}</span>
            </FeatureItem>
            <FeatureItem custom={1} variants={featureVariants}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('services.webDesign.title')}</span>
            </FeatureItem>
            <FeatureItem custom={2} variants={featureVariants}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('services.ecommerce.title')}</span>
            </FeatureItem>
          </FeatureList>
          
          <AnimatedButton
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Button
              onClick={onGetStartedClick}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
              }}
            >
              {t('hero.cta')}
              <FaArrowRight style={{ marginLeft: '0.25rem', fontSize: '0.8rem' }} />
            </Button>
          </AnimatedButton>
        </TextContent>
        
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.2
          }}
        >
          <AnimationContainer>
            <GlowingOrb 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [0, -20, 20, 0],
                y: [0, 20, -20, 0]
              }}
              transition={{ 
                opacity: { duration: 1.5 },
                scale: { duration: 1.5 },
                x: { 
                  repeat: Infinity, 
                  duration: 10,
                  ease: "easeInOut" 
                },
                y: { 
                  repeat: Infinity, 
                  duration: 10,
                  ease: "easeInOut" 
                }
              }}
            />
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 0.98, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '100%', height: '100%' }}
            >
              {isAnimationInView && (
                <DotLottieReact
                  src="https://lottie.host/54895a53-c9e9-4a1b-b995-6466468f19da/elQuN3AwsF.lottie"
                  loop
                  autoplay
                  style={{
                    width: '100%',
                    height: '100%',
                    visibility: 'visible',
                    opacity: 1
                  }}
                />
              )}
            </motion.div>
          </AnimationContainer>
        </motion.div>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero; 