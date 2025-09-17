// Translations for the AgriAI application
const translations = {
  en: {
    // Site Information
    siteName: 'AgriAI',
    
    // Meta Information
    meta: {
      description: 'Smart Farming with AI - Get personalized crop recommendations, real-time market insights, and expert agricultural advice powered by artificial intelligence.'
    },
    
    // Hero Section
    hero: {
      badge: 'Powered by Artificial Intelligence',
      title: 'Smart Farming with AI',
      subtitle: 'Get personalized crop recommendations, real-time market insights, and expert agricultural advice powered by artificial intelligence.'
    },
    
    // Features
    features: {
      aiAssistant: {
        title: 'AI Assistant',
        description: '24/7 multilingual AI support for crop queries and farming advice'
      },
      marketInsights: {
        title: 'Market Insights',
        description: 'Real-time crop prices and market trend analysis'
      },
      soilAnalysis: {
        title: 'Soil Analysis',
        description: 'Advanced soil health monitoring with satellite imagery'
      },
      offlineMode: {
        title: 'Offline Mode',
        description: 'Access essential features even without internet connection'
      }
    },
    
    // Authentication
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      socialLogin: 'Or continue with',
      socialSignup: 'Or create account with',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create one now',
      signIn: 'Sign in'
    },
    
    // Login Form
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your smart farming dashboard',
      userType: 'I am a',
      identifier: 'Email or Phone',
      identifierPlaceholder: 'Enter your email or phone number',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?',
      submit: 'Sign In to Dashboard'
    },
    
    // Signup Form
    signup: {
      step1: {
        title: 'Personal Information',
        subtitle: 'Tell us about yourself',
        userTypeLabel: 'I want to register as a',
        personalInfo: 'Personal Information'
      },
      step2: {
        title: 'Farm Details',
        subtitle: 'Information about your farming',
        farmLocation: 'Farm Location',
        fieldSize: 'Field Size',
        crops: 'Crops You Grow (Select multiple)',
        farmingMethod: 'Farming Method',
        addCustomCrop: 'Add Custom Crop',
        addCustomCropTitle: 'Add Custom Crop',
        customCropPlaceholder: 'Enter crop name',
        expertise: 'Area of Expertise',
        experience: 'Years of Experience',
        qualification: 'Highest Qualification',
        organization: 'Current Organization (Optional)'
      },
      step3: {
        title: 'Verification Method',
        subtitle: 'Choose how to verify your account',
        verificationMethod: 'Choose Verification Method',
        sendCode: 'Send Verification Code'
      },
      step4: {
        title: 'Complete Registration',
        subtitle: 'Verify and agree to terms',
        agreeTerms: 'I agree to the <a href="{{termsUrl}}" target="_blank">Terms of Service</a> and <a href="{{privacyUrl}}" target="_blank">Privacy Policy</a>',
        marketingEmails: 'I want to receive updates about new features and agricultural insights',
        createAccount: 'Create Account'
      }
    },
    
    // User Types
    userTypes: {
      farmer: 'Farmer',
      farmerDesc: 'Grow & manage crops',
      expert: 'Expert',
      expertDesc: 'Agricultural advisor'
    },
    
    // Form Fields
    forms: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Create Password',
      confirmPassword: 'Confirm Password',
      selectState: 'Select State',
      selectDistrict: 'Select District',
      acres: 'Acres',
      selectExpertise: 'Select your expertise',
      selectExperience: 'Select experience',
      selectQualification: 'Select qualification',
      organizationPlaceholder: 'University, Company, or Independent'
    },
    
    // Verification
    verification: {
      email: 'Email',
      emailDesc: 'Verify via email',
      phone: 'Phone',
      phoneDesc: 'Verify via SMS',
      enterEmail: 'Enter Email Address',
      enterPhone: 'Enter Phone Number',
      emailPlaceholder: 'Enter your email address',
      phonePlaceholder: 'Enter your phone number',
      enterCode: 'Enter Verification Code',
      codeMessage: "We've sent a 6-digit code to your contact method",
      resendCode: "Didn't receive code? Resend"
    },
    
    // Common
    common: {
      continue: 'Continue',
      back: 'Back',
      cancel: 'Cancel',
      add: 'Add',
      loading: 'Loading...',
      processing: 'Processing...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    },
    
    // Crops
    crops: {
      wheat: 'Wheat',
      rice: 'Rice',
      corn: 'Corn',
      potato: 'Potato',
      tomato: 'Tomato',
      onion: 'Onion',
      cotton: 'Cotton',
      sugarcane: 'Sugarcane'
    },
    
    // Farming Methods
    farmingMethods: {
      organic: {
        title: 'Organic',
        description: 'Chemical-free farming'
      },
      traditional: {
        title: 'Traditional',
        description: 'Conventional methods'
      },
      hybrid: {
        title: 'Hybrid',
        description: 'Mixed approach'
      }
    },
    
    // Expertise Areas
    expertiseAreas: {
      'crop-science': 'Crop Science',
      'soil-science': 'Soil Science',
      'agricultural-engineering': 'Agricultural Engineering',
      'plant-pathology': 'Plant Pathology',
      'entomology': 'Entomology',
      'agribusiness': 'Agribusiness',
      'sustainable-agriculture': 'Sustainable Agriculture'
    },
    
    // Experience Levels
    experienceLevels: {
      '1-3': '1-3 years',
      '4-7': '4-7 years',
      '8-15': '8-15 years',
      '15+': '15+ years'
    },
    
    // Qualifications
    qualifications: {
      'diploma': 'Diploma in Agriculture',
      'bachelor': "Bachelor's in Agriculture",
      'master': "Master's in Agriculture",
      'phd': 'PhD in Agriculture'
    }
  },
  
  hi: {
    // Site Information
    siteName: 'AgriAI',
    
    // Meta Information
    meta: {
      description: 'AI के साथ स्मार्ट खेती - व्यक्तिगत फसल सुझाव, वास्तविक समय बाजार जानकारी, और कृत्रिम बुद्धिमत्ता द्वारा संचालित विशेषज्ञ कृषि सलाह प्राप्त करें।'
    },
    
    // Hero Section
    hero: {
      badge: 'कृत्रिम बुद्धिमत्ता द्वारा संचालित',
      title: 'AI के साथ स्मार्ट खेती',
      subtitle: 'कृत्रिम बुद्धिमत्ता द्वारा संचालित व्यक्तिगत फसल सुझाव, वास्तविक समय बाजार जानकारी, और विशेषज्ञ कृषि सलाह प्राप्त करें।'
    },
    
    // Features
    features: {
      aiAssistant: {
        title: 'AI सहायक',
        description: 'फसल प्रश्नों और खेती की सलाह के लिए 24/7 बहुभाषी AI सहायता'
      },
      marketInsights: {
        title: 'बाजार अंतर्दृष्टि',
        description: 'वास्तविक समय फसल की कीमतें और बाजार के रुझान का विश्लेषण'
      },
      soilAnalysis: {
        title: 'मिट्टी विश्लेषण',
        description: 'उपग्रह इमेजरी के साथ उन्नत मिट्टी स्वास्थ्य निगरानी'
      },
      offlineMode: {
        title: 'ऑफलाइन मोड',
        description: 'इंटरनेट कनेक्शन के बिना भी आवश्यक सुविधाओं तक पहुंच'
      }
    },
    
    // Authentication
    auth: {
      login: 'लॉगिन',
      signup: 'साइन अप',
      socialLogin: 'या इसके साथ जारी रखें',
      socialSignup: 'या इसके साथ खाता बनाएं',
      noAccount: 'कोई खाता नहीं है?',
      hasAccount: 'पहले से खाता है?',
      createAccount: 'अभी बनाएं',
      signIn: 'साइन इन'
    },
    
    // Login Form
    login: {
      title: 'वापसी पर स्वागत',
      subtitle: 'अपने स्मार्ट खेती डैशबोर्ड में साइन इन करें',
      userType: 'मैं हूं एक',
      identifier: 'ईमेल या फोन',
      identifierPlaceholder: 'अपना ईमेल या फोन नंबर दर्ज करें',
      password: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      submit: 'डैशबोर्ड में साइन इन'
    },
    
    // Signup Form
    signup: {
      step1: {
        title: 'व्यक्तिगत जानकारी',
        subtitle: 'हमें अपने बारे में बताएं',
        userTypeLabel: 'मैं एक के रूप में पंजीकरण करना चाहता हूँ',
        personalInfo: 'व्यक्तिगत जानकारी'
      },
      step2: {
        title: 'खेत विवरण',
        subtitle: 'अपनी खेती के बारे में जानकारी',
        farmLocation: 'खेत का स्थान',
        fieldSize: 'खेत का आकार',
        crops: 'आप जो फसलें उगाते हैं (कई चुनें)',
        farmingMethod: 'खेती की विधि',
        addCustomCrop: 'कस्टम फसल जोड़ें',
        addCustomCropTitle: 'कस्टम फसल जोड़ें',
        customCropPlaceholder: 'फसल का नाम दर्ज करें',
        expertise: 'विशेषज्ञता का क्षेत्र',
        experience: 'अनुभव के वर्ष',
        qualification: 'उच्चतम योग्यता',
        organization: 'वर्तमान संगठन (वैकल्पिक)'
      },
      step3: {
        title: 'सत्यापन विधि',
        subtitle: 'अपने खाते को सत्यापित करने का तरीका चुनें',
        verificationMethod: 'सत्यापन विधि चुनें',
        sendCode: 'सत्यापन कोड भेजें'
      },
      step4: {
        title: 'पंजीकरण पूरा करें',
        subtitle: 'सत्यापित करें और नियमों से सहमत हों',
        agreeTerms: 'मैं <a href="{{termsUrl}}" target="_blank">सेवा की शर्तों</a> और <a href="{{privacyUrl}}" target="_blank">गोपनीयता नीति</a> से सहमत हूं',
        marketingEmails: 'मैं नई सुविधाओं और कृषि अंतर्दृष्टि के बारे में अपडेट प्राप्त करना चाहता हूं',
        createAccount: 'खाता बनाएं'
      }
    },
    
    // User Types
    userTypes: {
      farmer: 'किसान',
      farmerDesc: 'फसल उगाएं और प्रबंधन करें',
      expert: 'विशेषज्ञ',
      expertDesc: 'कृषि सलाहकार'
    },
    
    // Form Fields
    forms: {
      firstName: 'पहला नाम',
      lastName: 'अंतिम नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      password: 'पासवर्ड बनाएं',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      selectState: 'राज्य चुनें',
      selectDistrict: 'जिला चुनें',
      acres: 'एकड़',
      selectExpertise: 'अपनी विशेषज्ञता चुनें',
      selectExperience: 'अनुभव चुनें',
      selectQualification: 'योग्यता चुनें',
      organizationPlaceholder: 'विश्वविद्यालय, कंपनी, या स्वतंत्र'
    },
    
    // Verification
    verification: {
      email: 'ईमेल',
      emailDesc: 'ईमेल के माध्यम से सत्यापित करें',
      phone: 'फोन',
      phoneDesc: 'SMS के माध्यम से सत्यापित करें',
      enterEmail: 'ईमेल पता दर्ज करें',
      enterPhone: 'फोन नंबर दर्ज करें',
      emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
      phonePlaceholder: 'अपना फोन नंबर दर्ज करें',
      enterCode: 'सत्यापन कोड दर्ज करें',
      codeMessage: 'हमने आपकी संपर्क विधि पर 6-अंकीय कोड भेजा है',
      resendCode: 'कोड नहीं मिला? पुनः भेजें'
    },
    
    // Common
    common: {
      continue: 'जारी रखें',
      back: 'पीछे',
      cancel: 'रद्द करें',
      add: 'जोड़ें',
      loading: 'लोड हो रहा है...',
      processing: 'प्रसंस्करण...',
      success: 'सफलता',
      error: 'त्रुटि',
      warning: 'चेतावनी',
      info: 'जानकारी'
    },
    
    // Crops
    crops: {
      wheat: 'गेहूं',
      rice: 'चावल',
      corn: 'मक्का',
      potato: 'आलू',
      tomato: 'टमाटर',
      onion: 'प्याज',
      cotton: 'कपास',
      sugarcane: 'गन्ना'
    },
    
    // Farming Methods
    farmingMethods: {
      organic: {
        title: 'जैविक',
        description: 'रसायन मुक्त खेती'
      },
      traditional: {
        title: 'पारंपरिक',
        description: 'पारंपरिक तरीके'
      },
      hybrid: {
        title: 'संकर',
        description: 'मिश्रित दृष्टिकोण'
      }
    },
    
    // Expertise Areas
    expertiseAreas: {
      'crop-science': 'फसल विज्ञान',
      'soil-science': 'मिट्टी विज्ञान',
      'agricultural-engineering': 'कृषि इंजीनियरिंग',
      'plant-pathology': 'पादप रोग विज्ञान',
      'entomology': 'कीट विज्ञान',
      'agribusiness': 'कृषि व्यवसाय',
      'sustainable-agriculture': 'टिकाऊ कृषि'
    },
    
    // Experience Levels
    experienceLevels: {
      '1-3': '1-3 वर्ष',
      '4-7': '4-7 वर्ष',
      '8-15': '8-15 वर्ष',
      '15+': '15+ वर्ष'
    },
    
    // Qualifications
    qualifications: {
      'diploma': 'कृषि में डिप्लोमा',
      'bachelor': 'कृषि में स्नातक',
      'master': 'कृषि में स्नातकोत्तर',
      'phd': 'कृषि में पीएचडी'
    }
  }
};

module.exports = translations;