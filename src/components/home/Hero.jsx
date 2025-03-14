import { useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Button from '../common/Button';
import { useResponsive } from '../../hooks/useResponsive';
import { useLanguage } from '../../context/LanguageContext';

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
  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    background: linear-gradient(45deg, #2563eb, #1d4ed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: #4b5563;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const ParallaxShape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, #2563eb20, #3b82f630);
  filter: blur(40px);
  z-index: 0;
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

const Hero = ({ onGetStartedClick }) => {
  const { isMobile } = useResponsive();
  const heroRef = useRef(null);
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <HeroSection ref={heroRef}>
      <ParallaxShape
        style={{
          width: '600px',
          height: '600px',
          top: '-200px',
          right: '-200px',
          y,
          opacity
        }}
      />
      <ParallaxShape
        style={{
          width: '400px',
          height: '400px',
          bottom: '-100px',
          left: '-100px',
          y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]),
          opacity
        }}
      />
      
      <HeroContent>
        <TextContent>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={onGetStartedClick}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.cta')}
            </Button>
          </motion.div>
        </TextContent>
        
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <AnimationContainer>
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
          </AnimationContainer>
        </motion.div>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero; 