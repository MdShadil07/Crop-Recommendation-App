/**
 * AUTHENTICATION PAGES JAVASCRIPT
 * 
 * Handles login and signup functionality for CropWise
 * Features: Multi-step forms, validation, user type selection, animations
 */

class AuthManager {
  constructor() {
    this.currentStep = 1;
    this.maxSteps = 4;
    this.selectedUserType = null;
    this.formData = {};
    this.validationRules = {};
    this.init();
  }

  /**
   * Initialize authentication manager
   */
  init() {
    this.setupEventListeners();
    this.setupValidation();
    this.setupAnimations();
    this.loadSavedData();
    
    console.log('🔐 AuthManager initialized');
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Login form events
    this.setupLoginEvents();
    
    // Signup form events
    this.setupSignupEvents();
    
    // Common events
    this.setupCommonEvents();
    
    // Navigation events
    this.setupNavigationEvents();
  }

  /**
   * Setup login page events
   */
  setupLoginEvents() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // User type selection in login
    const userTypeInputs = document.querySelectorAll('input[name="userType"]');
    userTypeInputs.forEach(input => {
      input.addEventListener('change', this.handleUserTypeChange.bind(this));
    });

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
      togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
    }

    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
      btn.addEventListener('click', this.handleSocialLogin.bind(this));
    });

    // Show signup link
    const showSignup = document.getElementById('showSignup');
    if (showSignup) {
      showSignup.addEventListener('click', this.showSignupPage.bind(this));
    }

    // Forgot password
    const forgotPassword = document.querySelector('.forgot-password-link');
    if (forgotPassword) {
      forgotPassword.addEventListener('click', this.handleForgotPassword.bind(this));
    }
  }

  /**
   * Setup signup page events
   */
  setupSignupEvents() {
    // Account type selection
    const accountTypeInputs = document.querySelectorAll('input[name="accountType"]');
    accountTypeInputs.forEach(input => {
      input.addEventListener('change', this.handleAccountTypeSelection.bind(this));
    });

    // Step navigation
    this.setupStepNavigation();

    // Form validation
    this.setupFormValidation();

    // Password strength
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('input', this.checkPasswordStrength.bind(this));
    }

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', this.validateConfirmPassword.bind(this));
    }

    // Password toggle for signup
    const togglePasswordSignup = document.getElementById('togglePasswordSignup');
    if (togglePasswordSignup) {
      togglePasswordSignup.addEventListener('click', () => {
        this.togglePasswordVisibility('password', 'togglePasswordSignup');
      });
    }

    // OTP inputs
    this.setupOTPInputs();

    // Verification tabs
    this.setupVerificationTabs();

    // Show login link
    const showLogin = document.getElementById('showLogin');
    if (showLogin) {
      showLogin.addEventListener('click', this.showLoginPage.bind(this));
    }

    // Crop/Product selections
    this.setupSelectionGroups();
  }

  /**
   * Setup common events for both pages
   */
  setupCommonEvents() {
    // Language selection
    const languageOptions = document.querySelectorAll('[data-lang]');
    languageOptions.forEach(option => {
      option.addEventListener('click', this.handleLanguageChange.bind(this));
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

    // Form auto-save
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('change', this.autoSaveFormData.bind(this));
    });
  }

  /**
   * Setup navigation events
   */
  setupNavigationEvents() {
    // Back button handling
    window.addEventListener('popstate', this.handleBackButton.bind(this));

    // Prevent accidental page reload
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  /**
   * Setup step navigation for signup
   */
  setupStepNavigation() {
    // Step 1 navigation
    const step1Next = document.getElementById('step1Next');
    if (step1Next) {
      step1Next.addEventListener('click', () => this.goToStep(2));
    }

    // Step 2 navigation
    const step2Next = document.getElementById('step2Next');
    const step2Back = document.getElementById('step2Back');
    if (step2Next) {
      step2Next.addEventListener('click', () => this.validateAndProceed(2, 3));
    }
    if (step2Back) {
      step2Back.addEventListener('click', () => this.goToStep(1));
    }

    // Step 3 navigation
    const step3Next = document.getElementById('step3Next');
    const step3Back = document.getElementById('step3Back');
    if (step3Next) {
      step3Next.addEventListener('click', () => this.validateAndProceed(3, 4));
    }
    if (step3Back) {
      step3Back.addEventListener('click', () => this.goToStep(2));
    }

    // Step 4 navigation
    const step4Back = document.getElementById('step4Back');
    const completeSignup = document.getElementById('completeSignup');
    if (step4Back) {
      step4Back.addEventListener('click', () => this.goToStep(3));
    }
    if (completeSignup) {
      completeSignup.addEventListener('click', this.handleSignupComplete.bind(this));
    }
  }

  /**
   * Handle account type selection in signup
   */
  handleAccountTypeSelection(event) {
    this.selectedUserType = event.target.value;
    
    // Update hero content
    this.updateHeroContent();
    
    // Enable next button
    const nextBtn = document.getElementById('step1Next');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.classList.add('btn-enabled');
    }

    // Update form title
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    
    if (this.selectedUserType === 'farmer') {
      formTitle.textContent = 'Create Your Farmer Account';
      formSubtitle.textContent = 'Join thousands of smart farmers worldwide';
    } else if (this.selectedUserType === 'exporter') {
      formTitle.textContent = 'Create Your Exporter Account';
      formSubtitle.textContent = 'Connect with global agricultural markets';
    }

    // Save selection
    this.formData.userType = this.selectedUserType;
    this.autoSaveFormData();

    // Add animation effect
    const selectedCard = event.target.parentElement;
    selectedCard.style.transform = 'scale(1.02)';
    setTimeout(() => {
      selectedCard.style.transform = '';
    }, 300);
  }

  /**
   * Update hero content based on selected user type
   */
  updateHeroContent() {
    const defaultContent = document.getElementById('defaultContent');
    const farmerContent = document.getElementById('farmerContent');
    const exporterContent = document.getElementById('exporterContent');

    // Hide all content
    [defaultContent, farmerContent, exporterContent].forEach(content => {
      if (content) {
        content.classList.add('d-none');
      }
    });

    // Show relevant content
    if (this.selectedUserType === 'farmer' && farmerContent) {
      farmerContent.classList.remove('d-none');
      this.animateHeroContent(farmerContent);
    } else if (this.selectedUserType === 'exporter' && exporterContent) {
      exporterContent.classList.remove('d-none');
      this.animateHeroContent(exporterContent);
    } else if (defaultContent) {
      defaultContent.classList.remove('d-none');
    }
  }

  /**
   * Animate hero content transition
   */
  animateHeroContent(content) {
    content.style.opacity = '0';
    content.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
      content.style.transition = 'all 0.5s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateX(0)';
    }, 100);
  }

  /**
   * Go to specific step in signup
   */
  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.maxSteps) return;

    // Hide current step
    const currentStepEl = document.getElementById(`step${this.currentStep}`);
    if (currentStepEl) {
      currentStepEl.classList.remove('active');
    }

    // Show new step
    const newStepEl = document.getElementById(`step${stepNumber}`);
    if (newStepEl) {
      newStepEl.classList.add('active');
    }

    // Update progress indicator
    this.updateProgressIndicator(stepNumber);

    // Update current step
    this.currentStep = stepNumber;

    // Show/hide profile sections based on user type and step
    if (stepNumber === 3) {
      this.showProfileSection();
    }

    // Auto-focus first input in new step
    this.focusFirstInput(stepNumber);

    // Save progress
    this.saveProgress();
  }

  /**
   * Validate current step and proceed to next
   */
  validateAndProceed(currentStep, nextStep) {
    if (this.validateStep(currentStep)) {
      this.goToStep(nextStep);
    } else {
      this.showValidationErrors(currentStep);
    }
  }

  /**
   * Validate specific step
   */
  validateStep(stepNumber) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (!stepElement) return false;

    const requiredInputs = stepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    // Additional step-specific validation
    if (stepNumber === 2) {
      isValid = isValid && this.validateBasicInfo();
    } else if (stepNumber === 3) {
      isValid = isValid && this.validateProfileInfo();
    }

    return isValid;
  }

  /**
   * Validate basic information (Step 2)
   */
  validateBasicInfo() {
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    let isValid = true;

    // Email validation
    if (email && !this.isValidEmail(email.value)) {
      this.showFieldError(email, 'Please enter a valid email address');
      isValid = false;
    }

    // Phone validation
    if (phone && !this.isValidPhone(phone.value)) {
      this.showFieldError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    // Password strength validation
    if (password && !this.isValidPassword(password.value)) {
      this.showFieldError(password, 'Password must be at least 8 characters with mixed case, numbers, and symbols');
      isValid = false;
    }

    // Confirm password validation
    if (confirmPassword && confirmPassword.value !== password.value) {
      this.showFieldError(confirmPassword, 'Passwords do not match');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validate profile information (Step 3)
   */
  validateProfileInfo() {
    if (this.selectedUserType === 'farmer') {
      return this.validateFarmerProfile();
    } else if (this.selectedUserType === 'exporter') {
      return this.validateExporterProfile();
    }
    return true;
  }

  /**
   * Validate farmer profile
   */
  validateFarmerProfile() {
    const farmName = document.getElementById('farmName');
    const farmSize = document.getElementById('farmSize');
    const farmState = document.getElementById('farmState');
    const primaryCrops = document.querySelectorAll('input[name="primaryCrops"]:checked');

    let isValid = true;

    if (farmName && !farmName.value.trim()) {
      this.showFieldError(farmName, 'Farm name is required');
      isValid = false;
    }

    if (farmSize && (!farmSize.value || parseFloat(farmSize.value) <= 0)) {
      this.showFieldError(farmSize, 'Please enter a valid farm size');
      isValid = false;
    }

    if (farmState && !farmState.value) {
      this.showFieldError(farmState, 'Please select your state');
      isValid = false;
    }

    if (primaryCrops.length === 0) {
      this.showMessage('Please select at least one primary crop', 'warning');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validate exporter profile
   */
  validateExporterProfile() {
    const companyName = document.getElementById('companyName');
    const businessType = document.getElementById('businessType');
    const businessState = document.getElementById('businessState');
    const exportProducts = document.querySelectorAll('input[name="exportProducts"]:checked');

    let isValid = true;

    if (companyName && !companyName.value.trim()) {
      this.showFieldError(companyName, 'Company name is required');
      isValid = false;
    }

    if (businessType && !businessType.value) {
      this.showFieldError(businessType, 'Please select business type');
      isValid = false;
    }

    if (businessState && !businessState.value) {
      this.showFieldError(businessState, 'Please select business location');
      isValid = false;
    }

    if (exportProducts.length === 0) {
      this.showMessage('Please select at least one product of interest', 'warning');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Show profile section based on user type
   */
  showProfileSection() {
    const farmerProfile = document.getElementById('farmerProfile');
    const exporterProfile = document.getElementById('exporterProfile');

    // Hide both sections
    if (farmerProfile) farmerProfile.classList.add('d-none');
    if (exporterProfile) exporterProfile.classList.add('d-none');

    // Show appropriate section
    if (this.selectedUserType === 'farmer' && farmerProfile) {
      farmerProfile.classList.remove('d-none');
    } else if (this.selectedUserType === 'exporter' && exporterProfile) {
      exporterProfile.classList.remove('d-none');
    }
  }

  /**
   * Update progress indicator
   */
  updateProgressIndicator(currentStep) {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      
      step.classList.remove('active', 'completed');
      
      if (stepNumber === currentStep) {
        step.classList.add('active');
      } else if (stepNumber < currentStep) {
        step.classList.add('completed');
      }
    });
  }

  /**
   * Focus first input in step
   */
  focusFirstInput(stepNumber) {
    setTimeout(() => {
      const stepElement = document.getElementById(`step${stepNumber}`);
      if (stepElement) {
        const firstInput = stepElement.querySelector('input, select, textarea');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 300);
  }

  /**
   * Setup password strength checking
   */
  checkPasswordStrength(event) {
    const password = event.target.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-level');
    
    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let level = 'weak';
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Determine level
    if (strength >= 4) level = 'strong';
    else if (strength >= 3) level = 'good';
    else if (strength >= 2) level = 'fair';
    else level = 'weak';

    // Update UI
    strengthBar.className = `strength-fill ${level}`;
    strengthText.className = `strength-level ${level}`;
    strengthText.textContent = level.charAt(0).toUpperCase() + level.slice(1);
  }

  /**
   * Validate confirm password
   */
  validateConfirmPassword(event) {
    const password = document.getElementById('password');
    const confirmPassword = event.target;
    
    if (password && confirmPassword.value !== password.value) {
      confirmPassword.setCustomValidity('Passwords do not match');
      this.showFieldError(confirmPassword, 'Passwords do not match');
    } else {
      confirmPassword.setCustomValidity('');
      this.clearFieldError(confirmPassword);
    }
  }

  /**
   * Setup OTP inputs
   */
  setupOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d*$/.test(value)) {
          e.target.value = value.replace(/\D/g, '');
        }
        
        // Move to next input
        if (value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
        
        // Add filled class
        if (value) {
          e.target.classList.add('filled');
        } else {
          e.target.classList.remove('filled');
        }
      });
      
      input.addEventListener('keydown', (e) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });
  }

  /**
   * Setup verification tabs
   */
  setupVerificationTabs() {
    const verificationTabs = document.querySelectorAll('.verification-tab');
    const verificationSections = document.querySelectorAll('.verification-section');
    
    verificationTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.target.dataset.tab;
        
        // Update active tab
        verificationTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active section
        verificationSections.forEach(section => {
          section.classList.remove('active');
          if (section.id === `${targetTab}Verification`) {
            section.classList.add('active');
          }
        });
      });
    });
  }

  /**
   * Setup selection groups (crops, products, markets)
   */
  setupSelectionGroups() {
    // Crop selection animations
    const cropOptions = document.querySelectorAll('.crop-option');
    cropOptions.forEach(option => {
      option.addEventListener('change', this.handleCropSelection.bind(this));
    });

    // Product selection animations
    const productOptions = document.querySelectorAll('.product-option');
    productOptions.forEach(option => {
      option.addEventListener('change', this.handleProductSelection.bind(this));
    });

    // Market selection animations
    const marketOptions = document.querySelectorAll('.market-option');
    marketOptions.forEach(option => {
      option.addEventListener('change', this.handleMarketSelection.bind(this));
    });
  }

  /**
   * Handle crop selection with animation
   */
  handleCropSelection(event) {
    const chip = event.target.nextElementSibling;
    if (chip) {
      chip.style.transform = 'scale(1.1)';
      setTimeout(() => {
        chip.style.transform = '';
      }, 200);
    }
  }

  /**
   * Handle product selection with animation
   */
  handleProductSelection(event) {
    const chip = event.target.nextElementSibling;
    if (chip) {
      chip.style.transform = 'scale(1.1)';
      setTimeout(() => {
        chip.style.transform = '';
      }, 200);
    }
  }

  /**
   * Handle market selection with animation
   */
  handleMarketSelection(event) {
    const chip = event.target.nextElementSibling;
    if (chip) {
      chip.style.transform = 'scale(1.1)';
      setTimeout(() => {
        chip.style.transform = '';
      }, 200);
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.classList.add('loading');
    btnText.style.opacity = '0.7';
    btnLoader.classList.remove('d-none');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const loginData = {
        userType: formData.get('userType'),
        identifier: formData.get('loginIdentifier') || document.getElementById('loginIdentifier').value,
        password: formData.get('loginPassword') || document.getElementById('loginPassword').value,
        rememberMe: formData.get('rememberMe') === 'on'
      };

      // Validate input
      if (!loginData.identifier || !loginData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate API call
      const response = await this.submitLogin(loginData);
      
      if (response.success) {
        this.showMessage('Login successful! Redirecting...', 'success');
        
        // Save user data
        this.saveUserData(response.user);
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        throw new Error(response.message || 'Login failed');
      }
      
    } catch (error) {
      this.showMessage(error.message, 'error');
      console.error('Login error:', error);
    } finally {
      // Reset button state
      submitBtn.classList.remove('loading');
      btnText.style.opacity = '1';
      btnLoader.classList.add('d-none');
      submitBtn.disabled = false;
    }
  }

  /**
   * Handle signup completion
   */
  async handleSignupComplete(event) {
    event.preventDefault();
    
    const submitBtn = event.target;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Validate final step
    if (!this.validateFinalStep()) {
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    btnText.style.opacity = '0.7';
    btnLoader.classList.remove('d-none');
    submitBtn.disabled = true;

    try {
      // Collect all form data
      const signupData = this.collectSignupData();
      
      // Submit to API
      const response = await this.submitSignup(signupData);
      
      if (response.success) {
        this.showSuccessPage();
      } else {
        throw new Error(response.message || 'Signup failed');
      }
      
    } catch (error) {
      this.showMessage(error.message, 'error');
      console.error('Signup error:', error);
    } finally {
      // Reset button state
      submitBtn.classList.remove('loading');
      btnText.style.opacity = '1';
      btnLoader.classList.add('d-none');
      submitBtn.disabled = false;
    }
  }

  /**
   * Validate final step before submission
   */
  validateFinalStep() {
    const agreeTerms = document.getElementById('agreeTerms');
    const emailOTP = document.querySelectorAll('#emailVerification .otp-input');
    const phoneOTP = document.querySelectorAll('#phoneVerification .otp-input');
    
    if (!agreeTerms || !agreeTerms.checked) {
      this.showMessage('Please agree to the Terms of Service and Privacy Policy', 'warning');
      return false;
    }
    
    // Check if at least one verification method is completed
    const emailComplete = Array.from(emailOTP).every(input => input.value);
    const phoneComplete = Array.from(phoneOTP).every(input => input.value);
    
    if (!emailComplete && !phoneComplete) {
      this.showMessage('Please complete email or phone verification', 'warning');
      return false;
    }
    
    return true;
  }

  /**
   * Collect all signup data
   */
  collectSignupData() {
    const data = {
      userType: this.selectedUserType,
      personal: {
        firstName: document.getElementById('firstName')?.value,
        lastName: document.getElementById('lastName')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        password: document.getElementById('password')?.value
      },
      verification: {
        emailCode: this.getOTPValue('emailVerification'),
        phoneCode: this.getOTPValue('phoneVerification')
      },
      preferences: {
        marketingEmails: document.getElementById('marketingEmails')?.checked || false
      }
    };
    
    // Add profile-specific data
    if (this.selectedUserType === 'farmer') {
      data.profile = this.collectFarmerData();
    } else if (this.selectedUserType === 'exporter') {
      data.profile = this.collectExporterData();
    }
    
    return data;
  }

  /**
   * Collect farmer-specific data
   */
  collectFarmerData() {
    const primaryCrops = Array.from(document.querySelectorAll('input[name="primaryCrops"]:checked'))
      .map(input => input.value);
    
    const farmingType = document.querySelector('input[name="farmingType"]:checked')?.value;
    
    return {
      farmName: document.getElementById('farmName')?.value,
      farmSize: parseFloat(document.getElementById('farmSize')?.value),
      farmingExperience: document.getElementById('farmingExperience')?.value,
      location: {
        state: document.getElementById('farmState')?.value,
        city: document.getElementById('farmCity')?.value
      },
      primaryCrops,
      farmingType
    };
  }

  /**
   * Collect exporter-specific data
   */
  collectExporterData() {
    const exportProducts = Array.from(document.querySelectorAll('input[name="exportProducts"]:checked'))
      .map(input => input.value);
    
    const exportMarkets = Array.from(document.querySelectorAll('input[name="exportMarkets"]:checked'))
      .map(input => input.value);
    
    return {
      companyName: document.getElementById('companyName')?.value,
      businessType: document.getElementById('businessType')?.value,
      businessSize: document.getElementById('businessSize')?.value,
      location: {
        state: document.getElementById('businessState')?.value,
        city: document.getElementById('businessCity')?.value
      },
      exportProducts,
      exportMarkets
    };
  }

  /**
   * Get OTP value from inputs
   */
  getOTPValue(sectionId) {
    const inputs = document.querySelectorAll(`#${sectionId} .otp-input`);
    return Array.from(inputs).map(input => input.value).join('');
  }

  /**
   * Show success page after signup
   */
  showSuccessPage() {
    // Create success overlay
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.innerHTML = `
      <div class="success-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Welcome to CropWise!</h2>
        <p>Your account has been created successfully.</p>
        <div class="success-actions">
          <button class="btn btn-primary btn-lg" onclick="window.location.href='/dashboard'">
            <i class="fas fa-home me-2"></i>
            Go to Dashboard
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(successOverlay);
    
    // Add styles
    successOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.5s ease;
    `;
    
    // Clear saved form data
    this.clearSavedData();
  }

  /**
   * Submit login data to API
   */
  async submitLogin(loginData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful response
        resolve({
          success: true,
          user: {
            id: Date.now(),
            name: 'John Farmer',
            email: loginData.identifier,
            userType: loginData.userType,
            token: 'mock-jwt-token'
          }
        });
      }, 2000);
    });
  }

  /**
   * Submit signup data to API
   */
  async submitSignup(signupData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful response
        resolve({
          success: true,
          user: {
            id: Date.now(),
            name: `${signupData.personal.firstName} ${signupData.personal.lastName}`,
            email: signupData.personal.email,
            userType: signupData.userType,
            token: 'mock-jwt-token'
          }
        });
      }, 3000);
    });
  }

  /**
   * Handle social login
   */
  handleSocialLogin(event) {
    const provider = event.currentTarget.textContent.trim().toLowerCase();
    this.showMessage(`${provider} login will be available soon!`, 'info');
  }

  /**
   * Handle forgot password
   */
  handleForgotPassword(event) {
    event.preventDefault();
    
    const email = prompt('Please enter your email address:');
    if (email && this.isValidEmail(email)) {
      this.showMessage('Password reset link sent to your email!', 'success');
    } else if (email) {
      this.showMessage('Please enter a valid email address', 'error');
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(passwordFieldId = 'loginPassword', toggleButtonId = 'togglePassword') {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleButton = document.getElementById(toggleButtonId);
    
    if (!passwordField || !toggleButton) return;
    
    const icon = toggleButton.querySelector('i');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      passwordField.type = 'password';
      icon.className = 'fas fa-eye';
    }
  }

  /**
   * Handle user type change in login
   */
  handleUserTypeChange(event) {
    const userType = event.target.value;
    
    // Update placeholder text based on user type
    const identifierInput = document.getElementById('loginIdentifier');
    if (identifierInput) {
      if (userType === 'farmer') {
        identifierInput.placeholder = 'Enter your email or phone number';
      } else {
        identifierInput.placeholder = 'Enter your business email';
      }
    }
  }

  /**
   * Validation helpers
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  isValidPassword(password) {
    // At least 8 characters, with mixed case, numbers, and symbols
    return password.length >= 8 && 
           /[a-z]/.test(password) && 
           /[A-Z]/.test(password) && 
           /\d/.test(password) && 
           /[^A-Za-z0-9]/.test(password);
  }

  validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    
    if (input.required && !value) {
      this.showFieldError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && value && !this.isValidEmail(value)) {
      this.showFieldError(input, 'Please enter a valid email address');
      isValid = false;
    } else if (input.type === 'tel' && value && !this.isValidPhone(value)) {
      this.showFieldError(input, 'Please enter a valid phone number');
      isValid = false;
    } else {
      this.clearFieldError(input);
    }
    
    return isValid;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  /**
   * Show validation errors for step
   */
  showValidationErrors(stepNumber) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (!stepElement) return;

    const firstInvalidField = stepElement.querySelector('.is-invalid');
    if (firstInvalidField) {
      firstInvalidField.focus();
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Show message to user
   */
  showMessage(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${this.getToastIcon(type)} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }

  /**
   * Get toast icon based on type
   */
  getToastIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  /**
   * Handle language change
   */
  handleLanguageChange(event) {
    event.preventDefault();
    const language = event.target.dataset.lang;
    
    if (language) {
      localStorage.setItem('preferredLanguage', language);
      this.showMessage('Language changed successfully!', 'success');
      
      // Update language selector display
      const toggleText = document.querySelector('.language-toggle span');
      if (toggleText) {
        const languageNames = {
          'en': 'English',
          'hi': 'हिंदी',
          'mr': 'मराठी',
          'ta': 'தமிழ்',
          'te': 'తెలుగు',
          'bn': 'বাংলা'
        };
        toggleText.textContent = languageNames[language] || 'English';
      }
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(event) {
    // Enter key on step buttons
    if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
      event.target.click();
    }
    
    // Escape to go back
    if (event.key === 'Escape' && this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
    
    // Tab navigation enhancement
    if (event.key === 'Tab') {
      this.handleTabNavigation(event);
    }
  }

  /**
   * Enhanced tab navigation
   */
  handleTabNavigation(event) {
    const currentStep = document.getElementById(`step${this.currentStep}`);
    if (!currentStep) return;
    
    const focusableElements = currentStep.querySelectorAll(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Trap tab navigation within current step
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Auto-save form data
   */
  autoSaveFormData() {
    const formData = {};
    
    // Collect all form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        formData[input.id || input.name] = input.checked;
      } else if (input.type === 'radio') {
        if (input.checked) {
          formData[input.name] = input.value;
        }
      } else {
        formData[input.id || input.name] = input.value;
      }
    });
    
    // Save to localStorage
    localStorage.setItem('authFormData', JSON.stringify(formData));
  }

  /**
   * Load saved form data
   */
  loadSavedData() {
    const savedData = localStorage.getItem('authFormData');
    if (!savedData) return;
    
    try {
      const data = JSON.parse(savedData);
      
      // Restore form values
      Object.keys(data).forEach(key => {
        const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = data[key];
          } else if (element.type === 'radio') {
            if (element.value === data[key]) {
              element.checked = true;
            }
          } else {
            element.value = data[key];
          }
        }
      });
      
      // Restore user type selection
      if (data.accountType) {
        this.selectedUserType = data.accountType;
        this.updateHeroContent();
      }
      
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  /**
   * Save progress
   */
  saveProgress() {
    const progress = {
      currentStep: this.currentStep,
      selectedUserType: this.selectedUserType,
      timestamp: Date.now()
    };
    
    localStorage.setItem('authProgress', JSON.stringify(progress));
  }

  /**
   * Clear saved data
   */
  clearSavedData() {
    localStorage.removeItem('authFormData');
    localStorage.removeItem('authProgress');
  }

  /**
   * Save user data after successful login
   */
  saveUserData(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('authToken', user.token);
  }

  /**
   * Handle page navigation
   */
  showSignupPage() {
    // This would typically handle navigation between login/signup pages
    this.showMessage('Redirecting to signup...', 'info');
    // window.location.href = '/signup';
  }

  showLoginPage() {
    // This would typically handle navigation between login/signup pages
    this.showMessage('Redirecting to login...', 'info');
    // window.location.href = '/login';
  }

  /**
   * Handle browser back button
   */
  handleBackButton(event) {
    if (this.currentStep > 1) {
      event.preventDefault();
      this.goToStep(this.currentStep - 1);
    }
  }

  /**
   * Handle before page unload
   */
  handleBeforeUnload(event) {
    if (this.hasUnsavedChanges()) {
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message;
      return message;
    }
  }

  /**
   * Check for unsaved changes
   */
  hasUnsavedChanges() {
    const inputs = document.querySelectorAll('input, select, textarea');
    return Array.from(inputs).some(input => input.value.trim() !== '');
  }

  /**
   * Setup validation rules
   */
  setupValidation() {
    this.validationRules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      phone: {
        required: true,
        pattern: /^[+]?[\d\s\-\(\)]{10,}$/,
        message: 'Please enter a valid phone number'
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        message: 'Password must contain at least 8 characters with mixed case, numbers, and symbols'
      }
    };
  }

  /**
   * Setup animations
   */
  setupAnimations() {
    // Add entrance animations
    const cards = document.querySelectorAll('.auth-card, .account-type-card, .feature-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.6s ease forwards';
        }
      });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
      observer.observe(card);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: 1rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .toast-icon {
        font-size: 1.2rem;
      }
      
      .toast-message {
        flex: 1;
        color: var(--color-text);
      }
      
      .toast-close {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 0.25rem;
      }
      
      .toast-success .toast-icon { color: var(--color-success); }
      .toast-error .toast-icon { color: var(--color-error); }
      .toast-warning .toast-icon { color: var(--color-warning); }
      .toast-info .toast-icon { color: var(--color-info); }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Real-time validation
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateInput(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
      
      // Form submission validation
      form.addEventListener('submit', (event) => {
        if (!this.validateForm(form)) {
          event.preventDefault();
        }
      });
    });
  }

  /**
   * Validate entire form
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
}

// Initialize AuthManager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.authManager = new AuthManager();
  
  // Setup global error handling
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.authManager) {
      window.authManager.showMessage('Something went wrong. Please try again.', 'error');
    }
  });
  
  console.log('🌱 Authentication system ready!');
});