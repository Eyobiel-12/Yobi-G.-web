const responsePatterns = {
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
    responses: [
      "Hello! How can I help you today?",
      "Hi there! What can I assist you with?",
      "Welcome! How may I help you?"
    ]
  },
  services: {
    patterns: ['services', 'what do you do', 'help me with', 'offer'],
    responses: [
      "We offer several services:\n• Web Development\n• Mobile Apps\n• UI/UX Design\n• Digital Marketing\n\nWhich service interests you?",
      "Our main services include web development, mobile apps, design, and digital marketing. Would you like specific information about any of these?"
    ]
  },
  pricing: {
    patterns: ['price', 'cost', 'how much', 'pricing', 'package'],
    responses: [
      "Our pricing varies based on project requirements. Here's a general overview:\n• Basic Website: Starting from $1,000\n• E-commerce: Starting from $2,500\n• Custom Web App: Starting from $5,000\n\nWould you like a detailed quote?",
      "I can help you with pricing. Could you tell me more about your project requirements?"
    ]
  },
  contact: {
    patterns: ['contact', 'email', 'phone', 'reach', 'talk to human'],
    responses: [
      "You can reach us through:\n• Email: contact@ysmweb.com\n• Phone: +123 456 7890\n• Office: Your Address\n\nWould you like me to arrange a callback?",
      "I'll connect you with our team. Would you prefer email or phone contact?"
    ]
  },
  portfolio: {
    patterns: ['portfolio', 'previous work', 'examples', 'projects'],
    responses: [
      "You can view our portfolio at ysmweb.com/portfolio. Some notable projects include:\n• E-commerce platform for Fashion Brand\n• Banking App UI/UX\n• Real Estate Website\n\nWould you like specific examples?",
      "I'd be happy to show you some relevant examples. What type of project are you interested in?"
    ]
  }
};

export const generateResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  // Check each pattern category
  for (const [category, data] of Object.entries(responsePatterns)) {
    if (data.patterns.some(pattern => lowerInput.includes(pattern))) {
      return {
        text: data.responses[Math.floor(Math.random() * data.responses.length)],
        category,
        suggestions: getSuggestions(category)
      };
    }
  }
  
  // Default response
  return {
    text: "I'm not sure I understand. Could you rephrase that? Or would you like to know about our services?",
    category: 'unknown',
    suggestions: ['Services', 'Pricing', 'Contact Us']
  };
};

const getSuggestions = (category) => {
  const suggestionMap = {
    greeting: ['Services', 'Portfolio', 'Contact Us'],
    services: ['Pricing', 'Portfolio', 'Contact Team'],
    pricing: ['Get Quote', 'Services Details', 'Talk to Sales'],
    contact: ['Schedule Call', 'Send Email', 'Visit Office'],
    portfolio: ['Services', 'Pricing', 'Contact Us']
  };
  
  return suggestionMap[category] || ['Services', 'Pricing', 'Contact Us'];
}; 