import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from '../../context/LanguageContext';
import { FaArrowRight } from 'react-icons/fa';

const ServicesSection = styled.section`
  padding: 10rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled(motion.div)`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackgroundShape1 = styled(motion.div)`
  position: absolute;
  top: -200px;
  right: -150px;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.05) 100%);
  border-radius: 86px;
  z-index: 0;
  transition: opacity 0.8s ease;
`;

const BackgroundShape2 = styled(motion.div)`
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  border-radius: 50%;
  z-index: 0;
  transition: opacity 0.8s ease;
`;

const SectionHeaderContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 5rem;
  position: relative;
`;

const HeaderAccent = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  opacity: 0.5;
  background: conic-gradient(
    from 180deg at 50% 50%,
    #60a5fa 0deg,
    #3b82f6 120deg,
    #2563eb 240deg,
    #60a5fa 360deg
  );
  filter: blur(50px);
  z-index: -1;
`;

const HeaderLine = styled.div`
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #93c5fd);
  margin: 2rem auto 0;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    100% {
      left: 100%;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.75rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ServiceGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ServiceCard = styled(motion.div)`
  border-radius: 24px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  isolation: isolate;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &.hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;

const AnimationContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const ServiceContent = styled.div`
  padding: 2rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.4rem;
  color: #1e3a8a;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const ServiceDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const LearnMoreButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
  
  .arrow-icon {
    font-size: 0.875rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
    
    .arrow-icon {
      transform: translateX(4px);
    }
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.8rem;
  color: #1e3a8a;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ModalDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

const ModalButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    color: #64748b;
  }
`;

const Services = ({ openGetStartedModal }) => {
  const { t } = useLanguage();
  const [hoverStates, setHoverStates] = useState({});
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 300, damping: 30 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });

  // Parallax effects
  const servicesY = useTransform(scrollYSpring, [0, 1000], [0, -50]);
  const bgShape1Rotate = useTransform(scrollYSpring, [0, 1000], [0, 25]);
  const bgShape2Translate = useTransform(scrollYSpring, [0, 1000], [0, 100]);

  const services = [
    {
      id: "webDev",
      title: t('services.webDevelopment.title'),
      description: t('services.webDevelopment.description'),
      animation: "https://lottie.host/48269789-9848-46cc-97b1-f49fa6746078/ZvuLtRG4xe.lottie",
      bgColor: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      iconColor: "#0284c7"
    },
    {
      id: "ecommerce",
      title: t('services.ecommerce.title'),
      description: t('services.ecommerce.description'),
      animation: "https://lottie.host/473200cf-7b20-483b-afdc-3218997696df/PiNFS9lJKt.lottie",
      bgColor: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      iconColor: "#2563eb"
    },
    {
      id: "webDesign",
      title: t('services.webDesign.title'),
      description: t('services.webDesign.description'),
      animation: "https://lottie.host/061f37e0-0370-405e-a3c9-f13d0b941fb1/YYc2Q2pypb.lottie",
      bgColor: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      iconColor: "#0369a1"
    },
    {
      id: "seo",
      title: t('services.seo.title'),
      description: t('services.seo.description'),
      animation: "https://lottie.host/77b6a70d-79aa-45c7-ac95-ff65027e67eb/hIZ6k5zKiC.lottie",
      bgColor: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      iconColor: "#1d4ed8"
    }
  ];

  const handleServiceHover = (id, isHovering) => {
    setHoverStates(prev => ({
      ...prev,
      [id]: isHovering
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    hover: {
      y: -15,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <ServicesSection id="services" ref={ref}>
      <BackgroundShape1 
        style={{ 
          rotate: bgShape1Rotate,
          opacity: isInView ? 0.6 : 0
        }}
      />
      <BackgroundShape2 
        style={{ 
          y: bgShape2Translate,
          opacity: isInView ? 0.5 : 0
        }}
      />
      
      <ContentContainer style={{ y: servicesY }}>
        <SectionHeaderContainer
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <HeaderAccent />
          <SectionTitle>{t('services.title')}</SectionTitle>
          <SectionSubtitle>{t('services.subtitle')}</SectionSubtitle>
          <HeaderLine />
        </SectionHeaderContainer>
        
        <ServiceGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              variants={cardVariants}
              custom={index}
              whileHover="hover"
              onMouseEnter={() => handleServiceHover(service.id, true)}
              onMouseLeave={() => handleServiceHover(service.id, false)}
              className={hoverStates[service.id] ? 'hover' : ''}
            >
              <AnimationContainer style={{ background: service.bgColor }}>
                <DotLottieReact
                  src={service.animation}
                  style={{ 
                    width: '85%', 
                    height: '85%',
                    transform: hoverStates[service.id] ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.5s ease'
                  }}
                  autoplay
                  loop
                  renderSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
              </AnimationContainer>
              
              <ServiceContent>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                
                <LearnMoreButton 
                  className={hoverStates[service.id] ? 'hover' : ''} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openGetStartedModal}
                >
                  <span>Get Started</span>
                  <FaArrowRight className="arrow-icon" />
                </LearnMoreButton>
              </ServiceContent>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </ContentContainer>
    </ServicesSection>
  );
};

export default Services; 