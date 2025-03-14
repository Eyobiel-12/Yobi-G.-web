import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from '../../context/LanguageContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ReviewsSection = styled.section`
  padding: 6rem 1rem;
  background: transparent;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const ReviewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const ReviewsCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Quote = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  height: 150px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 60px;
  
  .lottie-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    h4 {
      font-size: 1.1rem;
      color: #1f2937;
      margin: 0;
      line-height: 1.4;
    }
    
    p {
      color: #6b7280;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.4;
    }
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 6rem;
  color: #2563eb;
  opacity: 0.1;
  z-index: 0;
`;

const ReviewSlider = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
`;

const ReviewsTrack = styled(motion.div)`
  display: flex;
  width: 100%;
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: var(--text-secondary);
  font-size: 1.5rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.prev {
    left: -25px;
    
    @media (max-width: 768px) {
      left: 10px;
    }
  }
  
  &.next {
    right: -25px;
    
    @media (max-width: 768px) {
      right: 10px;
    }
  }
`;

const IndicatorsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Indicator = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? 'var(--primary-600)' : 'var(--gray-300)'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-700)' : 'var(--gray-400)'};
  }
`;

const Reviews = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Get testimonials from translations and ensure it's an array
  const testimonials = t('reviews.testimonials') || [];
  const hasTestimonials = Array.isArray(testimonials) && testimonials.length > 0;
  
  const goToPrevious = () => {
    if (!hasTestimonials) return;
    setDirection(-1);
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    if (!hasTestimonials) return;
    setDirection(1);
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const goToSlide = (index) => {
    if (!hasTestimonials) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  // Auto-advance carousel
  useEffect(() => {
    if (!hasTestimonials) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, hasTestimonials]);
  
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // If no testimonials, show a fallback
  if (!hasTestimonials) {
    return (
      <ReviewsSection id="reviews">
        <ReviewsContainer>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            {t('reviews.title')}
          </motion.h2>
          
          <ReviewsCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <QuoteIcon>"</QuoteIcon>
            <Quote>YSM Web transformed our online presence completely. Their creative solutions and attention to detail exceeded our expectations.</Quote>
            <ClientInfo>
              <div className="lottie-wrapper">
                <DotLottieReact
                  src="https://lottie.host/1c0c85cf-6001-45c0-8634-08ed2c57f104/rEuQg3ej90.lottie"
                  loop
                  autoplay
                />
              </div>
              <div className="details">
                <h4>Sarah Johnson</h4>
                <p>CEO, TechStart</p>
              </div>
            </ClientInfo>
          </ReviewsCard>
        </ReviewsContainer>
      </ReviewsSection>
    );
  }

  return (
    <ReviewsSection id="reviews">
      <ReviewsContainer>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title"
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          {t('reviews.title')}
        </motion.h2>

        <ReviewSlider>
          <NavigationButton 
            className="prev"
            onClick={goToPrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={testimonials.length <= 1}
          >
            <FiChevronLeft />
          </NavigationButton>
          
          <AnimatePresence initial={false} custom={direction}>
            <ReviewsTrack>
              <ReviewsCard
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                style={{ width: '100%', flex: 'none' }}
              >
                <QuoteIcon>"</QuoteIcon>
                <Quote>{testimonials[currentIndex]?.text}</Quote>
                <ClientInfo>
                  <div className="lottie-wrapper">
                    <DotLottieReact
                      src="https://lottie.host/1c0c85cf-6001-45c0-8634-08ed2c57f104/rEuQg3ej90.lottie"
                      loop
                      autoplay
                    />
                  </div>
                  <div className="details">
                    <h4>{testimonials[currentIndex]?.name}</h4>
                    <p>{testimonials[currentIndex]?.position}</p>
                  </div>
                </ClientInfo>
              </ReviewsCard>
            </ReviewsTrack>
          </AnimatePresence>
          
          <NavigationButton 
            className="next"
            onClick={goToNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={testimonials.length <= 1}
          >
            <FiChevronRight />
          </NavigationButton>
        </ReviewSlider>
        
        <IndicatorsContainer>
          {testimonials.map((_, index) => (
            <Indicator 
              key={index}
              active={currentIndex === index}
              onClick={() => goToSlide(index)}
            />
          ))}
        </IndicatorsContainer>
      </ReviewsContainer>
    </ReviewsSection>
  );
};

export default Reviews; 