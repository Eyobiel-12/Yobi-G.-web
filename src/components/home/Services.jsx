import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from '../../context/LanguageContext';

const ServicesSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled(motion.div)`
  padding: 2rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  }
`;

const AnimationContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t('services.webDevelopment.title'),
      description: t('services.webDevelopment.description'),
      animation: "https://lottie.host/48269789-9848-46cc-97b1-f49fa6746078/ZvuLtRG4xe.lottie"
    },
    {
      title: t('services.ecommerce.title'),
      description: t('services.ecommerce.description'),
      animation: "https://lottie.host/473200cf-7b20-483b-afdc-3218997696df/PiNFS9lJKt.lottie"
    },
    {
      title: t('services.webDesign.title'),
      description: t('services.webDesign.description'),
      animation: "https://lottie.host/061f37e0-0370-405e-a3c9-f13d0b941fb1/YYc2Q2pypb.lottie"
    },
    {
      title: t('services.seo.title'),
      description: t('services.seo.description'),
      animation: "https://lottie.host/77b6a70d-79aa-45c7-ac95-ff65027e67eb/hIZ6k5zKiC.lottie"
    }
  ];

  return (
    <ServicesSection id="services">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        {t('services.title')}
      </motion.h2>
      
      <ServiceGrid>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <AnimationContainer>
              <DotLottieReact
                src={service.animation}
                style={{ width: '150px', height: '150px' }}
                autoplay
                loop
              />
            </AnimationContainer>
            <h3 style={{ marginBottom: '1rem' }}>{service.title}</h3>
            <p>{service.description}</p>
          </ServiceCard>
        ))}
      </ServiceGrid>
    </ServicesSection>
  );
};

export default Services; 