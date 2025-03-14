import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
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
    category: 'landscaping',
    items: [
      {
        id: 'yohannesHoveniers',
        lottie: 'https://lottie.host/47245577-65a1-4e6f-afe7-eb7484f9588a/rS4FKkSIOK.lottie',
        liveUrl: 'https://yohanneshoveniersbedrijf.nl/',
        status: 'completed'
      }
    ]
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
    category: 'comingSoon',
    items: [
      {
        id: 'ecommerce',
        status: 'in-development'
      },
      {
        id: 'healthcare',
        status: 'in-development'
      },
      {
        id: 'realEstate',
        status: 'in-development'
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
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  border: 1px solid var(--border-color);
  background: ${props => props.active ? 'var(--primary-600)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-700)' : 'var(--bg-tertiary)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
`;

const ProjectGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

const Portfolio = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Flatten projects for easier filtering
  const allProjects = projects.flatMap(category => 
    category.items.map(project => ({
      ...project,
      category: category.category
    }))
  );
  
  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeFilter);
  
  // Get unique categories for filter buttons
  const categories = ['all', ...new Set(projects.map(p => p.category))];

  return (
    <Section id="portfolio">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>{t('portfolio.title')}</h2>
          <p>{t('portfolio.subtitle')}</p>
        </SectionHeader>

        <FilterContainer>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={activeFilter === category}
              onClick={() => setActiveFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === 'all' ? t('portfolio.categories.all') : t(`portfolio.categories.${category}`)}
            </FilterButton>
          ))}
        </FilterContainer>

        <ProjectGrid
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  layout: { duration: 0.3 }
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                }}
              >
                {project.status === 'completed' ? (
                  <>
                    <ProjectImage>
                      <DotLottieReact
                        src={project.lottie}
                        loop
                        autoplay
                      />
                    </ProjectImage>
                    <ProjectInfo>
                      <h3>{t(`portfolio.projects.${project.id}.title`)}</h3>
                      <p>{t(`portfolio.projects.${project.id}.description`)}</p>
                      <ProjectLinks>
                        <ProjectLink 
                          href={project.liveUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaExternalLinkAlt />
                          <span>{t('portfolio.viewSite')}</span>
                        </ProjectLink>
                      </ProjectLinks>
                    </ProjectInfo>
                  </>
                ) : (
                  <ComingSoonCard>
                    <h3>{t(`portfolio.projects.${project.id}.title`)}</h3>
                    <p>{t(`portfolio.projects.${project.id}.description`)}</p>
                    <ComingSoonBadge>
                      {t('portfolio.inDevelopment')}
                    </ComingSoonBadge>
                  </ComingSoonCard>
                )}
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>
      </Container>
    </Section>
  );
};

const Section = styled.section`
  padding: 6rem 0;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    color: #1e40af;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.2rem;
    color: #64748b;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 4rem;
`;

const CategoryHeader = styled.h3`
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #3b82f6;
    border-radius: 2px;
  }
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const ProjectImage = styled.div`
  position: relative;
  height: 240px;
  overflow: hidden;
  background: #f8fafc;
  visibility: visible;
  opacity: 1;

  .dotlottie-player {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h4`
  font-size: 1.25rem;
  color: #1e40af;
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ProjectLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProjectLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1e40af;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  svg {
    font-size: 0.875rem;
  }
`;

const ComingSoonCard = styled.div`
  padding: 2rem;
  text-align: center;

  h3 {
    font-size: 1.25rem;
    color: #1e40af;
    margin: 1rem 0 0.5rem;
  }

  p {
    color: #64748b;
    margin-bottom: 1rem;
  }
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export default Portfolio; 