import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FiCheck, FiAlertCircle, FiEdit2, FiGlobe, FiUpload, FiFile, FiX } from 'react-icons/fi';
import { IMaskInput } from 'react-imask';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../../context/LanguageContext';

// Define all styled components at the top
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    align-items: flex-start;
    overflow-y: auto;
  }
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 2rem;
    max-height: calc(100vh - 4rem);
    border-radius: 12px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4b5563;
`;

const ProgressWrapper = styled.div`
  margin: 2rem 0;
`;

const ProgressTrack = styled(motion.div)`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressIndicator = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  border-radius: 2px;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const FormContainer = styled(motion.div)`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormTitle = styled.h3`
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormField = styled(motion.div)`
  margin-bottom: 2rem;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    background: #f9fafb;
    
    &:focus {
      outline: none;
      border-color: #2563eb;
      background: white;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.secondary ? `
    background: white;
    border: 2px solid #e5e7eb;
    color: #4b5563;
    
    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  ` : `
    background: #2563eb;
    border: none;
    color: white;
    
    &:hover {
      background: #1d4ed8;
    }
  `}
`;

const Question = styled(motion.div)`
  margin-bottom: 2rem;

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #1f2937;
  }
`;

// Language selector components
const LanguageSelector = styled.div`
  position: absolute;
  top: 1rem;
  right: 3.5rem;
  z-index: 10;
`;

const LanguageButton = styled(motion.button)`
  background: none;
  border: none;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem;

  &:hover {
    opacity: 0.8;
  }
`;

const LanguageDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  min-width: 120px;
`;

const LanguageOption = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
  
  &.active {
    background: #f0f9ff;
    font-weight: 500;
  }
`;

const FlagIcon = styled.span`
  font-size: 1.25rem;
`;

// Selection components
const SelectWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 1.5rem;
`;

const SelectOption = styled(motion.button)`
    position: relative;
  padding: 1.25rem;
  background: white;
  border: 2px solid ${props => props.selected ? '#1e40af' : '#e5e7eb'};
  border-radius: 10px;
  color: ${props => props.selected ? '#1e40af' : '#374151'};
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
      cursor: pointer;
  
  &:hover {
    border-color: #1e40af;
    background: ${props => props.selected ? '#fff' : '#f8fafc'};
  }
`;

const MultiSelectWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 1.5rem;
`;

const MultiSelectOption = styled(SelectOption)`
  padding-left: 3rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid ${props => props.selected ? '#1e40af' : '#e5e7eb'};
    border-radius: 4px;
    background: ${props => props.selected ? '#1e40af' : 'transparent'};
    transition: all 0.2s ease;
  }

  &:after {
    content: '✓';
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    font-size: 0.875rem;
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

// Color selection components
const ColorOptionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ColorOption = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 2px solid ${props => props.selected ? '#1e40af' : '#e5e7eb'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1e40af;
  }
`;

const ColorPreview = styled.div`
    display: flex;
    gap: 0.5rem;
  margin-bottom: 0.75rem;
`;
    
const ColorSwatch = styled.div`
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
  background: ${props => props.color || '#e5e7eb'};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ColorName = styled.span`
    font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
`;

const StatusAnimation = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
`;

// Form animations
const formAnimations = {
  field: {
    initial: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    focused: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  },
  label: {
    initial: { 
      y: 0,
      color: "#374151"
    },
    focused: { 
      y: -2,
      color: "#2563eb",
      transition: {
        type: "spring",
        stiffness: 500
      }
    }
  }
};

// Updated SummaryView component to use translations
const SummaryView = ({ answers, onEdit, onSubmit, isSubmitting }) => {
  const { t } = useLanguage();
  
  const formatAnswer = (questionId, answer) => {
    if (!answer) return 'Not provided';
    
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    
    if (typeof answer === 'object' && answer.name) {
      return answer.name;
    }
    
    return answer;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e40af' }}>
        {t('getStartedModal.summary.title')}
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>
        {t('getStartedModal.summary.subtitle')}
      </p>
      
      {questions.map((question, index) => {
        if (question.type === 'form') {
          return (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#1f2937', display: 'flex', justifyContent: 'space-between' }}>
                {t(`getStartedModal.steps.${question.id}.question`)}
                <motion.button
                  onClick={() => onEdit(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.875rem' }}
                >
                  <FiEdit2 /> {t('getStartedModal.summary.edit')}
                </motion.button>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {question.fields.map(field => (
                  <div key={field.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' }}>
                      {t(`getStartedModal.steps.${question.id}.fields.${field.id}.label`)}:
                    </div>
                    <div style={{ color: '#1f2937' }}>
                      {formatAnswer(field.id, answers[field.id]) || 'Not provided'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        
        return (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#1f2937', margin: 0 }}>
                {t(`getStartedModal.steps.${question.id}.question`)}
              </h3>
              <motion.button
                onClick={() => onEdit(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.875rem' }}
              >
                <FiEdit2 /> {t('getStartedModal.summary.edit')}
              </motion.button>
            </div>
            <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', color: '#4b5563' }}>
              {formatAnswer(question.id, answers[question.id])}
            </div>
          </div>
        );
      })}

      <ButtonGroup>
        <Button 
          secondary
          onClick={() => onEdit(questions.length - 1)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('getStartedModal.buttons.back')}
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? t('getStartedModal.summary.submitting') : t('getStartedModal.buttons.submit')}
        </Button>
      </ButtonGroup>
    </motion.div>
  );
};

// Add file upload styled components
const FileUploadArea = styled(motion.div)`
  border: 2px dashed #2563eb;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? '#2563eb10' : 'transparent'};
  margin-top: 1.5rem;

  &:hover {
    background: #2563eb10;
  }

  input {
    display: none;
  }
`;

const FilePreview = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;

  .file-item {
    position: relative;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .file-icon {
      color: #2563eb;
      font-size: 1.25rem;
    }

    .file-name {
      font-size: 0.875rem;
      color: #1f2937;
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-size {
      font-size: 0.75rem;
      color: #6b7280;
    }

    button {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: #fee2e2;
      }
    }
  }
`;

// Add business category options
const businessCategories = [
  'Retail & E-commerce',
  'Professional Services',
  'Healthcare & Medical',
  'Restaurant & Food',
  'Beauty & Wellness',
  'Real Estate',
  'Technology',
  'Education',
  'Manufacturing',
  'Construction',
  'Finance & Insurance',
  'Travel & Hospitality',
  'Arts & Entertainment',
  'Non-Profit',
  'Other'
];

// Update questions array to include more powerful options
const questions = [
  {
    id: 'projectType',
    type: 'select',
    required: true
  },
  {
    id: 'industry',
    type: 'select',
    required: true,
    options: businessCategories
  },
  {
    id: 'currentSituation',
    type: 'select',
    required: true
  },
  {
    id: 'priority',
    type: 'select',
    required: true
  },
  {
    id: 'budget',
    type: 'select',
    required: true,
    options: [
      '$1,000 - $5,000',
      '$5,000 - $10,000',
      '$10,000 - $25,000',
      '$25,000 - $50,000',
      '$50,000+'
    ]
  },
  {
    id: 'colorScheme',
    type: 'color',
    required: true,
    options: [
      { name: 'Modern Blue', primary: '#2563eb', secondary: '#1d4ed8' },
      { name: 'Forest Green', primary: '#16a34a', secondary: '#15803d' },
      { name: 'Royal Purple', primary: '#7c3aed', secondary: '#6d28d9' },
      { name: 'Sunset Orange', primary: '#ea580c', secondary: '#c2410c' },
      { name: 'Ocean Teal', primary: '#0d9488', secondary: '#0f766e' },
      { name: 'Custom Colors', primary: '', secondary: '' }
    ]
  },
  {
    id: 'contact',
    type: 'form',
    required: true,
    fields: [
      {
        id: 'businessName',
        type: 'text',
        required: true
      },
      {
        id: 'businessCategory',
        type: 'select',
        required: true,
        options: businessCategories
      },
      {
        id: 'website',
        type: 'text',
        required: false
      },
      {
        id: 'name',
        type: 'text',
        required: true
      },
      {
        id: 'role',
        type: 'text',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        required: true,
        validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      {
        id: 'phone',
        type: 'tel',
        required: true,
        validation: /^\+?[\d\s-()]{10,}$/
      },
      {
        id: 'timeline',
        type: 'select',
        required: true
      },
      {
        id: 'referral',
        type: 'select',
        required: false,
        options: [
          'Google Search',
          'Social Media',
          'Referral',
          'Online Advertisement',
          'Other'
        ]
      },
      {
        id: 'requirements',
        type: 'textarea',
        required: false
      }
    ]
  },
  {
    id: 'attachments',
    type: 'file',
    required: false
  }
];

// Add file size formatter
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Add progress calculation function
const calculateProgress = (currentStep, answers) => {
  const totalSteps = questions.length;
  const currentProgress = ((currentStep + 1) / totalSteps) * 100;
  return Math.round(currentProgress);
};

// Updated AnimatedFormField component to use translations
const AnimatedFormField = ({ field, value, onChange, errors }) => {
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
  return (
          <input
            type={field.type}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={t(`getStartedModal.steps.contact.fields.${field.id}.placeholder`)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );
      case 'tel':
        return (
          <IMaskInput
            mask="+{0}000000000000"
            unmask={false}
            value={value || ''}
            onAccept={(value) => onChange(field.id, value)}
            placeholder={t(`getStartedModal.steps.contact.fields.${field.id}.placeholder`)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );
      case 'textarea':
        return (
          <textarea
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={t(`getStartedModal.steps.contact.fields.${field.id}.placeholder`)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="" disabled>
              {t('getStartedModal.steps.contact.fields.timeline.placeholder') || 'Select an option'}
            </option>
            {t(`getStartedModal.steps.contact.fields.${field.id}.options`, { returnObjects: true }).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };
  
  return (
    <FormField
      initial="initial"
      animate={isFocused ? "focused" : "initial"}
      variants={formAnimations.field}
    >
      <motion.label
        variants={formAnimations.label}
      >
        {t(`getStartedModal.steps.contact.fields.${field.id}.label`)}
        {field.required && <span style={{ color: '#ef4444' }}> *</span>}
      </motion.label>
      
      {renderField()}
      
      {field.hint && (
        <div className="hint">
          {t(`getStartedModal.steps.contact.fields.${field.id}.hint`)}
        </div>
      )}
      
      {errors && errors[field.id] && (
        <div className="error">
          {errors[field.id]}
        </div>
      )}
    </FormField>
  );
};

// Add FormWrapper component
const FormWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Add ConsultationOption component
const ConsultationOption = styled(motion.div)`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border-radius: 12px;
  border: 1px solid #bae6fd;
  text-align: center;
`;

const ConsultationButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #0284c7;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 1rem;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    background: #0369a1;
  }
`;

// Updated GetStartedModal component to use translations
const GetStartedModal = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showConsultationOption, setShowConsultationOption] = useState(false);
  const fileInputRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Language options
  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' }
  ];

  // Load saved form data when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const savedData = localStorage.getItem('getStartedFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setAnswers(parsedData.answers || {});
          setCurrentStep(parsedData.currentStep || 0);
          setShowSummary(parsedData.showSummary || false);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [isOpen]);

  // Save form data when it changes
  useEffect(() => {
    if (isOpen && Object.keys(answers).length > 0) {
      try {
        const dataToSave = {
          answers,
          currentStep,
          showSummary,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('getStartedFormData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  }, [answers, currentStep, showSummary, isOpen]);

  // Clear saved form data after successful submission
  const clearSavedFormData = () => {
    try {
      localStorage.removeItem('getStartedFormData');
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAnswer = (questionId, answer) => {
    setErrors(prev => ({ ...prev, [questionId]: null }));
    
    // Create a new answers object with the updated answer
    const updatedAnswers = { ...answers, [questionId]: answer };
    setAnswers(updatedAnswers);
    
    // Special handling for "Not Sure (Need Consultation)"
    if (questionId === 'projectType' && answer === t('getStartedModal.steps.projectType.options', { returnObjects: true })[4]) {
      // Show consultation option
      setShowConsultationOption(true);
    } else if (questionId === 'projectType') {
      setShowConsultationOption(false);
    }
    
    // Save form data to localStorage
    localStorage.setItem('getStartedFormData', JSON.stringify({
      answers: updatedAnswers,
      currentStep,
      showSummary
    }));
  };

  const handleMultiSelect = (id, value) => {
    setAnswers(prev => {
      const currentValues = prev[id] || [];
      return {
        ...prev,
        [id]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  // Handle file drag events
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Remove file
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentStep];
    
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'select':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>{t(`getStartedModal.steps.${currentQuestion.id}.question`)}</h3>
            
            <SelectWrapper>
              {t(`getStartedModal.steps.${currentQuestion.id}.options`, { returnObjects: true }).map((option) => (
                <SelectOption
                  key={option}
                  selected={answers[currentQuestion.id] === option}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </SelectOption>
              ))}
            </SelectWrapper>
            
            {/* Show consultation option if "Not Sure (Need Consultation)" is selected */}
            {showConsultationOption && currentQuestion.id === 'projectType' && (
              <ConsultationOption
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 style={{ marginTop: 0, color: '#0284c7' }}>
                  {language === 'nl' ? "Directe hulp nodig?" : 
                   language === 'am' ? "ፈጣን እርዳታ ይፈልጋሉ?" : 
                   language === 'ti' ? "ፈጣን ሓገዝ ይደልዩ?" : 
                   "Need immediate assistance?"}
                </h4>
                <p>
                  {language === 'nl' ? "Spreek rechtstreeks met onze Software Engineer, Eyobiel Goitom, om uw projectbehoeften te bespreken." : 
                   language === 'am' ? "ስለ ፕሮጀክትዎ ፍላጎቶች ለመወያየት ከሶፍትዌር ኢንጂነራችን ከኢዮብኤል ጎይቶም ጋር በቀጥታ ይነጋገሩ።" : 
                   language === 'ti' ? "ብዛዕባ ድሌታት ፕሮጀክትኹም ንምዝታይ ምስ ሶፍትዌር ኢንጂነርና ኢዮብኤል ጎይቶም ብቐጥታ ተዘራረቡ።" : 
                   "Speak directly with our Software Engineer, Eyobiel Goitom, to discuss your project needs."}
                </p>
                <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#4b5563' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {language === 'nl' ? "Maandag - Vrijdag: 9:00 - 18:00" : 
                     language === 'am' ? "ሰኞ - አርብ: 9:00 - 18:00" : 
                     language === 'ti' ? "ሰኑይ - ዓርቢ: 9:00 - 18:00" : 
                     "Monday - Friday: 9:00 - 18:00"}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {language === 'nl' ? "Weekend: Op afspraak" : 
                     language === 'am' ? "ቅዳሜ-እሁድ: በቀጠሮ" : 
                     language === 'ti' ? "ቀዳም-ሰንበት: ብቆጸራ" : 
                     "Weekend: By appointment"}
                  </div>
                </div>
                <ConsultationButton 
                  href="tel:+31687033774"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginBottom: '10px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  {language === 'nl' ? "Bel Eyobiel Goitom (+31687033774)" : 
                   language === 'am' ? "ኢዮብኤል ጎይቶምን ይደውሉ (+31687033774)" : 
                   language === 'ti' ? "ናብ ኢዮብኤል ጎይቶም ደውሉ (+31687033774)" : 
                   "Call Eyobiel Goitom (+31687033774)"}
                </ConsultationButton>
                <ConsultationButton 
                  href="mailto:info@ysm.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {language === 'nl' ? "E-mail ons (info@ysm.com)" : 
                   language === 'am' ? "ኢሜይል ይላኩልን (info@ysm.com)" : 
                   language === 'ti' ? "ኢመይል ስደዱልና (info@ysm.com)" : 
                   "Email us (info@ysm.com)"}
                </ConsultationButton>
              </ConsultationOption>
            )}
          </motion.div>
        );

      case 'multiSelect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>{t(`getStartedModal.steps.${currentQuestion.id}.question`)}</h3>
            
            <MultiSelectWrapper>
              {t(`getStartedModal.steps.${currentQuestion.id}.options`, { returnObjects: true }).map((option) => (
                <MultiSelectOption
                  key={option}
                  selected={(answers[currentQuestion.id] || []).includes(option)}
                  onClick={() => handleMultiSelect(currentQuestion.id, option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </MultiSelectOption>
              ))}
            </MultiSelectWrapper>
          </motion.div>
        );

      case 'form':
        return (
          <FormWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e40af', fontSize: '1.5rem' }}>
              {t(`getStartedModal.steps.${currentQuestion.id}.question`)}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {currentQuestion.fields.map(field => {
                // Skip the requirements field as it should be full width
                if (field.id === 'requirements') return null;
                
                return (
                  <FormField
                key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label>
                      {t(`getStartedModal.steps.contact.fields.${field.id}.label`)}
                      {field.required && <span style={{ color: '#ef4444' }}> *</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={answers[field.id] || ''}
                        onChange={(e) => handleAnswer(field.id, e.target.value)}
                      >
                        <option value="" disabled>
                          {t(`getStartedModal.steps.contact.fields.${field.id}.placeholder`)}
                        </option>
                        {(field.options || t(`getStartedModal.steps.contact.fields.${field.id}.options`, { returnObjects: true })).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'tel' ? (
                      <IMaskInput
                        mask="+{0}000000000000"
                        unmask={false}
                        value={answers[field.id] || ''}
                        onAccept={(value) => handleAnswer(field.id, value)}
                        placeholder={t(`getStartedModal.steps.contact.fields.${field.id}.placeholder`)}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={answers[field.id] || ''}
                        onChange={(e) => handleAnswer(field.id, e.target.value)}
                        placeholder={t(`getStartedModal.steps.contact.fields.${field.id}.placeholder`)}
                      />
                    )}
                    
                    {errors[field.id] ? (
                      <div className="error">{errors[field.id]}</div>
                    ) : (
                      <div className="hint">
                        {t(`getStartedModal.steps.contact.fields.${field.id}.hint`)}
                      </div>
                    )}
                  </FormField>
                );
              })}
            </div>
            
            {/* Requirements field - full width */}
            {currentQuestion.fields.find(field => field.id === 'requirements') && (
              <FormField
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label>
                  {t('getStartedModal.steps.contact.fields.requirements.label')}
                  {currentQuestion.fields.find(field => field.id === 'requirements').required && (
                    <span style={{ color: '#ef4444' }}> *</span>
                  )}
                </label>
                
                <textarea
                  value={answers.requirements || ''}
                  onChange={(e) => handleAnswer('requirements', e.target.value)}
                  placeholder={t('getStartedModal.steps.contact.fields.requirements.placeholder')}
                  rows={4}
                />
                
                {errors.requirements ? (
                  <div className="error">{errors.requirements}</div>
                ) : (
                  <div className="hint">
                    {t('getStartedModal.steps.contact.fields.requirements.hint')}
                  </div>
                )}
              </FormField>
            )}
          </FormWrapper>
        );

      case 'color':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>{t(`getStartedModal.steps.${currentQuestion.id}.question`)}</h3>
            
            <ColorOptionsWrapper>
              {currentQuestion.options.map((option) => (
                <ColorOption
                  key={option.name}
                  selected={answers[currentQuestion.id]?.name === option.name}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ColorPreview>
                    <ColorSwatch color={option.primary} />
                    <ColorSwatch color={option.secondary} />
                  </ColorPreview>
                  <ColorName>{t(`getStartedModal.steps.${currentQuestion.id}.options`)[currentQuestion.options.findIndex(o => o.name === option.name)]}</ColorName>
                </ColorOption>
              ))}
            </ColorOptionsWrapper>
          </motion.div>
        );

      case 'file':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>{t(`getStartedModal.steps.${currentQuestion.id}.question`)}</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {t(`getStartedModal.steps.${currentQuestion.id}.description`)}
            </p>
            
            <FileUploadArea
              isDragging={isDragging}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
              />
              <FiUpload size={32} color="#2563eb" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>
                {t(`getStartedModal.steps.${currentQuestion.id}.uploadTitle`)}
              </h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {t(`getStartedModal.steps.${currentQuestion.id}.uploadDescription`)}
              </p>
            </FileUploadArea>
            
            {files.length > 0 && (
              <FilePreview>
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    className="file-item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="file-icon">
                      <FiFile />
                    </span>
                    <div>
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatFileSize(file.size)}</div>
                    </div>
                    <button onClick={() => removeFile(index)}>
                      <FiX />
                    </button>
                  </motion.div>
                ))}
              </FilePreview>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const validateField = (field, value) => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }
    
    if (field.validation && value && !field.validation.test(value)) {
      return 'Please enter a valid value';
    }
    
    return null;
  };

  const validateStep = () => {
    const currentQuestion = questions[currentStep];
    let isValid = true;
    const newErrors = {};

    if (currentQuestion.type === 'form') {
      currentQuestion.fields.forEach(field => {
        const error = validateField(field, answers[field.id]);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      });
    } else if (currentQuestion.required) {
      if (!answers[currentQuestion.id]) {
      newErrors[currentQuestion.id] = 'Please make a selection';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
      setIsSubmitting(true);
    
    try {
      // Create a new project document
      const projectRef = await addDoc(collection(db, 'projects'), {
        ...answers,
        status: 'new',
        createdAt: serverTimestamp()
      });
      
      // Upload files if any
      if (files.length > 0) {
        const fileUrls = [];
        
        for (const file of files) {
          const fileRef = ref(storage, `projects/${projectRef.id}/${file.name}`);
          await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(fileRef);
          fileUrls.push({ name: file.name, url: downloadUrl });
        }
        
        // Update project with file URLs
        await updateDoc(projectRef, {
          attachments: fileUrls
        });
      }
      
      // Send email notification
      const templateParams = {
        to_email: 'info@ysm.com',
        from_name: `${answers.firstName} ${answers.lastName}`,
        from_email: answers.email,
        business_name: answers.businessName,
        phone: answers.phone,
        project_type: answers.projectType,
        message: answers.requirements || 'No specific requirements provided.',
        contact_info: 'Eyobiel Goitom: +31687033774, Email: info@ysm.com'
      };
      
        await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      );
      
      setStatusMessage('success');
      
      // Clear saved form data after successful submission
      clearSavedFormData();
      
      // Reset form after 3 seconds
        setTimeout(() => {
          setAnswers({});
          setCurrentStep(0);
          setShowSummary(false);
        setIsSubmitting(false);
          setStatusMessage(null);
        setFiles([]);
        onClose();
        }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage('error');
      setIsSubmitting(false);
    }
  };

  // Handle modal close with confirmation if form has data
  const handleClose = () => {
    if (Object.keys(answers).length > 0 && !statusMessage) {
      if (window.confirm(t('getStartedModal.closeConfirmation'))) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <LanguageSelector ref={languageDropdownRef}>
              <LanguageButton
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiGlobe />
                <span>{languageOptions.find(option => option.code === language)?.flag}</span>
              </LanguageButton>
              
              <AnimatePresence>
                {showLanguageDropdown && (
                  <LanguageDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languageOptions.map((option) => (
                      <LanguageOption
                        key={option.code}
                        className={language === option.code ? 'active' : ''}
                        onClick={() => {
                          setLanguage(option.code);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        <FlagIcon>{option.flag}</FlagIcon>
                        <span>{option.name}</span>
                      </LanguageOption>
                    ))}
                  </LanguageDropdown>
                )}
              </AnimatePresence>
            </LanguageSelector>
            
            <CloseButton onClick={handleClose}>✕</CloseButton>
            
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1e40af' }}>
              {t('getStartedModal.title')}
            </h2>
            
            {!showSummary && (
                <ProgressWrapper>
                  <ProgressTrack>
                    <ProgressIndicator
                    initial={{ width: '0%' }}
                    animate={{ width: `${calculateProgress(currentStep, answers)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </ProgressTrack>
                  <StepIndicator>
                    <span>Step {currentStep + 1} of {questions.length}</span>
                  <span>{calculateProgress(currentStep, answers)}% Complete</span>
                  </StepIndicator>
                </ProgressWrapper>
            )}
            
            <AnimatePresence mode="wait">
              {statusMessage ? (
                <StatusAnimation
                  key="status"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  {statusMessage === 'success' ? (
                    <>
                      <DotLottieReact
                        src="/animations/success.lottie"
                        autoplay
                        loop={false}
                      />
                      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#10b981', fontWeight: '500' }}>
                        {t('getStartedModal.summary.success')}
                      </p>
              </>
            ) : (
                    <>
                      <DotLottieReact
                        src="/animations/error.lottie"
                        autoplay
                        loop={false}
                      />
                      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ef4444', fontWeight: '500' }}>
                        {t('getStartedModal.summary.error')}
                      </p>
                    </>
                  )}
                </StatusAnimation>
              ) : showSummary ? (
              <SummaryView
                  key="summary"
                answers={answers}
                  onEdit={setCurrentStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
              ) : (
                <FormContainer key={`step-${currentStep}`}>
                  {renderQuestion()}
                  
                  <ButtonGroup>
                    <Button
                      secondary
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
                    >
                      {t('getStartedModal.buttons.back')}
                    </Button>
                    <Button
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('getStartedModal.buttons.next')}
                    </Button>
                  </ButtonGroup>
                </FormContainer>
              )}
            </AnimatePresence>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default GetStartedModal; 