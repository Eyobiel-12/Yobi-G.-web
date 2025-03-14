import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Hero from './components/home/Hero';
import Services from './components/home/Services';
import Portfolio from './components/home/Portfolio';
import Reviews from './components/home/Reviews';
import Contact from './components/home/Contact';
import Chatbot from './components/common/Chatbot';
import GetStartedModal from './components/common/GetStartedModal';
import './index.css';
import './styles/theme.css';

function App() {
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const [pageLoadTime, setPageLoadTime] = useState(null);

  // Track page load performance
  useEffect(() => {
    // Record when the page finishes loading
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      setPageLoadTime(loadTime);
      
      // Log performance metrics
      console.log(`Page fully loaded in ${loadTime.toFixed(2)}ms`);
      
      // You could send this to an analytics service
      if ('sendBeacon' in navigator) {
        const performanceData = {
          loadTime,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
        
        // This is where you would send the data to your analytics endpoint
        // navigator.sendBeacon('/analytics', JSON.stringify(performanceData));
      }
    });
    
    // Track user engagement
    let lastActivityTime = Date.now();
    const trackActivity = () => {
      lastActivityTime = Date.now();
    };
    
    // Track various user interactions
    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('scroll', trackActivity);
    window.addEventListener('click', trackActivity);
    
    // Check for user engagement every minute
    const engagementInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityTime;
      if (inactiveTime > 60000) { // 1 minute
        console.log('User inactive for 1 minute');
        // You could log this to analytics
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      window.removeEventListener('click', trackActivity);
      clearInterval(engagementInterval);
    };
  }, []);

  const openGetStartedModal = () => {
    setIsGetStartedModalOpen(true);
    
    // Track modal open event
    console.log('Get Started modal opened');
    // You could send this to analytics
  };

  const closeGetStartedModal = () => {
    setIsGetStartedModalOpen(false);
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <div>
            <Navbar onGetStartedClick={openGetStartedModal} />
            <main>
              <Hero onGetStartedClick={openGetStartedModal} />
              <Services />
              <Portfolio />
              <Reviews />
              <Contact onGetStartedClick={openGetStartedModal} />
              <Chatbot openGetStartedModal={openGetStartedModal} />
              <GetStartedModal 
                isOpen={isGetStartedModalOpen} 
                onClose={closeGetStartedModal} 
              />
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App; 