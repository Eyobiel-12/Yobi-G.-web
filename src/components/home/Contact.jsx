import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLanguage } from '../../context/LanguageContext';
import { FiArrowRight } from 'react-icons/fi';

const ContactSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  h2 {
    font-size: 2.5rem;
    color: #1e40af;
    margin-bottom: 1rem;
  }

  p {
    color: #64748b;
    font-size: 1.1rem;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    .lottie-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .icon {
      font-size: 1.5rem;
    }

    h3 {
      color: #1e40af;
      margin-bottom: 0.5rem;
    }

    p {
      color: #64748b;
      margin: 0.25rem 0;
    }

    a {
      &:hover {
        color: #1e3a8a;
      }
    }
  }
`;

const ContactForm = styled(motion.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  h3 {
    color: #1e40af;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #2563eb, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #64748b;
    font-size: 1.1rem;
  }
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #1e40af;
  font-weight: 500;
  
  span {
    font-size: 1.2rem;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;

  input, textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8fafc;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      background: white;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${props => props.style};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  span {
    font-size: 1.2rem;
  }

  &:hover {
    background: linear-gradient(45deg, #1e40af, #2563eb);
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoadingDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: bounce 0.8s infinite;
  animation-delay: ${props => props.delay}s;

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const GetStartedButton = styled(motion.button)`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1.5rem;
  
  &:hover {
    background: #1d4ed8;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #94a3b8;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  span {
    padding: 0 1rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const StatusMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.status === 'success' ? '#d1fae5' : '#fef2f2'};
  color: ${props => props.status === 'success' ? '#15803d' : '#b91c1c'};
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Contact = ({ onGetStartedClick }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const messageData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date().toISOString()
      };

      // First try Firebase
      try {
        await addDoc(collection(db, 'contacts'), messageData);
      } catch (firebaseError) {
        console.error('Firebase error:', firebaseError);
      }
      
      // Then try EmailJS
      const emailResult = await emailjs.send(
        'service_s5k2d2j',
        'template_y2bzb2k',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'web10yobi@gmail.com'
        },
        'F5VfIJwQKM0go4NAS'
      );

      console.log('EmailJS Response:', emailResult);
      
      // Show success message using state
      setSubmitStatus({
        type: 'success',
        message: t('contact.form.sent')
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);

    } catch (error) {
      console.error('Detailed error:', error);
      setSubmitStatus({
        type: 'error',
        message: t('contact.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactSection id="contact">
      <ContactContainer>
        <ContactInfo
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.subtitle')}</p>
          
          <div style={{ marginTop: '2rem' }}>
            <motion.div 
              className="info-item"
              whileHover={{ scale: 1.05 }}
            >
              <div className="lottie-icon">
                <DotLottieReact
                  src="https://lottie.host/5751b640-2190-47d1-a65d-5339717afe6a/9JJaydyIwG.lottie"
                  loop
                  autoplay
                />
              </div>
              <div>
                <h3>{t('contact.info.location.title')}</h3>
                <p>{t('contact.info.location.name')}</p>
                <p>{t('contact.info.location.shared')}</p>
                <a 
                  href="https://maps.app.goo.gl/z96LaH1H5hUg4V2Y7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('contact.info.location.address')}
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="info-item"
              whileHover={{ scale: 1.05 }}
            >
              <div className="lottie-icon">
                <DotLottieReact
                  src="https://lottie.host/6e2b36bb-7a59-473a-b4d3-d9d2ae797142/JBso3WNBsD.lottie"
                  loop
                  autoplay
                />
              </div>
              <div>
                <h3>{t('contact.info.email.title')}</h3>
                <a href="mailto:info@ysmweb.com" style={{ 
                  color: '#2563eb',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}>
                  {t('contact.info.email.value')}
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="info-item"
              whileHover={{ scale: 1.05 }}
            >
              <div className="lottie-icon">
                <DotLottieReact
                  src="https://lottie.host/041bf44c-f006-4ef9-8291-e9d0c12aef93/UALlQigCrK.lottie"
                  loop
                  autoplay
                />
              </div>
              <div>
                <h3>{t('contact.info.hours.title')}</h3>
                <p>{t('contact.info.hours.weekdays')}</p>
                <p>{t('contact.info.hours.weekend')}</p>
              </div>
            </motion.div>

            <motion.div 
              className="info-item"
              whileHover={{ scale: 1.05 }}
            >
              <div className="lottie-icon">
                <DotLottieReact
                  src="https://lottie.host/eaccbd63-a617-4bef-be26-d05e4740a481/fjQUShJ4aT.lottie"
                  loop
                  autoplay
                />
              </div>
              <div>
                <h3>{t('contact.info.connect.title')}</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <motion.a 
                    href="https://www.linkedin.com/company/ysm-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    style={{ 
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {t('contact.info.connect.social.linkedin')}
                  </motion.a>
                  <motion.a 
                    href="https://www.instagram.com/ysmweb"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    style={{ 
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {t('contact.info.connect.social.instagram')}
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </ContactInfo>

        <ContactForm
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
        >
          <FormHeader>
            <h3>{t('contact.form.title')}</h3>
            <p>{t('contact.form.subtitle')}</p>
          </FormHeader>
          
          <FormField>
            <FormLabel>
              <span>👤</span>
              {t('contact.form.name')}
            </FormLabel>
            <input 
              type="text" 
              placeholder={t('contact.form.namePlaceholder')}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </FormField>
          
          <FormField>
            <FormLabel>
              <span>✉️</span>
              {t('contact.form.email')}
            </FormLabel>
            <input 
              type="email" 
              placeholder={t('contact.form.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </FormField>
          
          <FormField>
            <FormLabel>
              <span>💭</span>
              {t('contact.form.message')}
            </FormLabel>
            <textarea 
              placeholder={t('contact.form.messagePlaceholder')}
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            ></textarea>
          </FormField>
          
          <FormGroup>
            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
            </SubmitButton>
          </FormGroup>
          
          <OrDivider>
            <span>{t('contact.form.or')}</span>
          </OrDivider>
          
          <GetStartedButton
            onClick={onGetStartedClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            {t('hero.cta')} <FiArrowRight />
          </GetStartedButton>
          
          {submitStatus && (
            <StatusMessage status={submitStatus.type}>
              {submitStatus.message}
            </StatusMessage>
          )}
        </ContactForm>
      </ContactContainer>
    </ContactSection>
  );
};

export default Contact; 