import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaExternalLinkAlt, FaGithub, FaTools, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const projects = [
  {
    category: 'restaurant',
    items: [
      {
        id: 'habeshaMerhaba',
        lottie: 'https://lottie.host/e8b6491e-87c4-4ebc-a78b-b9d310ec59e9/qqvLWoKQWH.lottie',
        liveUrl: 'https://habesha-merhaba.nl/',
        status: 'completed'
      },
      {
        id: 'littleEthiopia',
        lottie: 'https://lottie.host/c89fdc2f-5375-4c3b-a9e3-535091c09ed0/v5FwUPlL3v.lottie',
        liveUrl: 'https://little-ethiopia.be/',
        status: 'completed'
      }
    ]
  },
  {
    category: 'maintenance',
    items: [
      {
        id: 'yohannesHoveniers',
        lottie: 'https://lottie.host/47245577-65a1-4e6f-afe7-eb7484f9588a/rS4FKkSIOK.lottie',
        status: 'completed'
      }
    ]
  },
  {
    category: 'landscaping',
    items: []
  },
  {
    category: 'beautyWellness',
    items: [
      {
        id: 'romysTouch',
        lottie: 'https://lottie.host/4ee06d04-7a4a-4831-a057-cfbae5de8e25/wjBylE82yI.lottie',
        liveUrl: 'https://www.romystouch.nl/',
        status: 'completed'
      }
    ]
  },
  {
    category: 'barbershop',
    items: [
      {
        id: 'kapsalonStars',
        lottie: 'https://lottie.host/0b06930e-54df-497e-bee9-19ce1c1b2fb8/ZYwHcQo8C1.lottie',
        liveUrl: 'https://kapsalonstars.nl/',
        status: 'completed'
      }
    ]
  },
  {
    category: 'comingSoon',
    items: [
      {
        id: 'ecommerce',
        status: 'in-development',
        lottie: 'https://lottie.host/48020c77-08bc-4e9a-8169-10a0d3d46109/mOtPlsQpSy.lottie'
      },
      {
        id: 'healthcare',
        status: 'in-development',
        lottie: 'https://lottie.host/48020c77-08bc-4e9a-8169-10a0d3d46109/mOtPlsQpSy.lottie'
      },
      {
        id: 'realEstate',
        status: 'in-development',
        lottie: 'https://lottie.host/48020c77-08bc-4e9a-8169-10a0d3d46109/mOtPlsQpSy.lottie'
      }
    ]
  }
];

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  padding: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    border-radius: 40px;
    z-index: -1;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  border: none;
  background: ${props => props.active ? 'var(--primary-600)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 8px 20px rgba(37, 99, 235, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-700)' : 'rgba(255, 255, 255, 1)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 10px 25px rgba(37, 99, 235, 0.4)' : '0 8px 20px rgba(0, 0, 0, 0.08)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const ProjectGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Portfolio = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [failedAnimations, setFailedAnimations] = useState({});
  const [hoverStates, setHoverStates] = useState({});
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 300, damping: 30 });

  // Parallax effect for background circles
  const circle1Y = useTransform(scrollYSpring, [0, 1000], [0, 200]);
  const circle2Y = useTransform(scrollYSpring, [0, 1000], [0, -200]);
  const circle1Opacity = useTransform(scrollYSpring, [0, 500], [0.1, 0.05]);
  const circle2Opacity = useTransform(scrollYSpring, [0, 500], [0.08, 0.04]);

  // Flatten projects for easier filtering
  const allProjects = projects.flatMap(category => 
    category.items.map(project => ({
      ...project,
      category: category.category
    }))
  );
  
  // Helper function to log animation load errors
  const handleAnimationError = (id, error) => {
    console.error(`Animation failed to load for project ${id}:`, error);
    setFailedAnimations(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Helper function to log animation loaded success
  const handleAnimationLoaded = (id) => {
    console.log(`Animation loaded successfully for project ${id}`);
    setFailedAnimations(prev => ({
      ...prev,
      [id]: false
    }));
  };
  
  // Project hover handler
  const handleProjectHover = (id, isHovering) => {
    setHoverStates(prev => ({
      ...prev,
      [id]: isHovering
    }));
  };
  
  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeFilter);
  
  // Get unique categories for filter buttons
  const categories = ['all', ...new Set(projects.map(p => p.category))];
  
  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5
      }
    },
    hover: {
      y: -12,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Function to handle category filter clicks
  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  return (
    <Section id="portfolio">
      <BackgroundCircle1 style={{ y: circle1Y, opacity: circle1Opacity }} />
      <BackgroundCircle2 style={{ y: circle2Y, opacity: circle2Opacity }} />
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <HeaderAccent />
          <h2>{t('portfolio.title')}</h2>
          <p>{t('portfolio.subtitle')}</p>
          <HeaderLine />
        </SectionHeader>

        <FilterContainer
          variants={filterVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={activeFilter === category}
              onClick={() => handleFilterClick(category)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === 'all' 
                ? t('portfolio.categories.all') 
                : category === 'maintenance' 
                  ? 'Maintenance'
                  : t(`portfolio.categories.${category}`)}
            </FilterButton>
          ))}
        </FilterContainer>

        <ProjectGrid
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                layout
                onMouseEnter={() => handleProjectHover(project.id, true)}
                onMouseLeave={() => handleProjectHover(project.id, false)}
                className={hoverStates[project.id] ? 'hover' : ''}
              >
                <ProjectImage className={hoverStates[project.id] ? 'hover' : ''}>
                  {!failedAnimations[project.id] ? (
                    <DotLottieReact
                      src={project.lottie}
                      loop
                      autoplay
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        maxWidth: '100%',
                        display: 'block',
                        transform: hoverStates[project.id] ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.5s ease'
                      }}
                      renderSettings={{
                        preserveAspectRatio: 'xMidYMid slice',
                        viewBoxSize: "0 0 512 512"
                      }}
                      onError={(error) => handleAnimationError(project.id, error)}
                      onLoad={() => handleAnimationLoaded(project.id)}
                    />
                  ) : (
                    <AnimationFallback>
                      {t(`portfolio.projects.${project.id}.title`).charAt(0)}
                    </AnimationFallback>
                  )}
                  <ImageOverlay className={hoverStates[project.id] ? 'hover' : ''} />
                </ProjectImage>
                <ProjectInfo>
                  <ProjectMeta>
                    {project.category === 'maintenance' ? (
                      <MaintenanceBadge className={hoverStates[project.id] ? 'hover' : ''}>
                        <FaTools style={{ marginRight: '6px' }} />
                        Maintenance
                      </MaintenanceBadge>
                    ) : project.status === 'in-development' ? (
                      <ComingSoonBadge className={hoverStates[project.id] ? 'hover' : ''}>
                        {t('portfolio.inDevelopment')}
                      </ComingSoonBadge>
                    ) : null}
                  </ProjectMeta>
                  <ProjectTitle className={hoverStates[project.id] ? 'hover' : ''}>
                    {t(`portfolio.projects.${project.id}.title`)}
                  </ProjectTitle>
                  <ProjectDescription>
                    {t(`portfolio.projects.${project.id}.description`)}
                  </ProjectDescription>
                  {project.liveUrl && (
                    <ProjectLinks>
                      <ProjectLink 
                        href={project.liveUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{t('portfolio.viewSite')}</span>
                        <FaArrowRight className="arrow-icon" />
                      </ProjectLink>
                    </ProjectLinks>
                  )}
                </ProjectInfo>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>
      </Container>
    </Section>
  );
};

const Section = styled.section`
  padding: 10rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 5rem;
  position: relative;

  h2 {
    font-size: 3rem;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.3rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #93c5fd);
    margin: 2rem auto 0;
    border-radius: 2px;
  }
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center bottom;
  
  &.hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectImage = styled.div`
  position: relative;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f9ff 0%, #f0f7ff 100%);
  visibility: visible;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.hover::before {
    opacity: 1;
  }

  @media (max-width: 1024px) {
    height: 220px;
  }

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 180px;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.35rem;
  color: #1e3a8a;
  margin-bottom: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
  
  &.hover {
    color: #3b82f6;
  }
`;

const ProjectInfo = styled.div`
  padding: 1.75rem;
  position: relative;
  
  p {
    color: #64748b;
    margin-bottom: 1.25rem;
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ProjectLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
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

const ComingSoonBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
  transition: all 0.3s ease;
  
  &.hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.2);
  }
`;

const MaintenanceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #b91c1c;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(185, 28, 28, 0.15);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &.hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(185, 28, 28, 0.2);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  
  &.hover {
    opacity: 1;
  }
`;

const AnimationFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #1e40af;
  font-size: 5rem;
  font-weight: bold;
  border-radius: 8px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 210%;
    height: 210%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%);
    animation: rotate 8s linear infinite;
    top: -55%;
    left: -55%;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const BackgroundCircle1 = styled(motion.div)`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%);
  top: -400px;
  right: -200px;
  z-index: 0;
  pointer-events: none;
`;

const BackgroundCircle2 = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(96, 165, 250, 0) 70%);
  bottom: -200px;
  left: -100px;
  z-index: 0;
  pointer-events: none;
`;

const HeaderAccent = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  border-radius: 20px;
  transform-origin: center;
  animation: rotate 10s linear infinite;
  
  @keyframes rotate {
    from {
      transform: translateX(-50%) rotate(0deg);
    }
    to {
      transform: translateX(-50%) rotate(360deg);
    }
  }
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

const ProjectMeta = styled.div`
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
`;

export default Portfolio; 