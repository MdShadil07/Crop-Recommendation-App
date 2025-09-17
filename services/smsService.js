const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  // SMS templates
  getWelcomeSMSTemplate(user, lang = 'en') {
    const templates = {
      en: `🌱 Welcome to AgriAI, ${user.firstName}! Your ${user.userType} account has been created successfully. 

📧 Email: ${user.email}
📱 Phone: ${user.phone}

Complete verification to access all features. 

Login: ${process.env.CLIENT_URL}/login

Need help? Call +91-1234567890

Team AgriAI`,

      hi: `🌱 AgriAI में आपका स्वागत है, ${user.firstName}! आपका ${user.userType === 'farmer' ? 'किसान' : 'विशेषज्ञ'} खाता सफलतापूर्वक बन गया है।

📧 ईमेल: ${user.email}
📱 फोन: ${user.phone}

सभी सुविधाओं का उपयोग करने के लिए सत्यापन पूरा करें।

लॉगिन: ${process.env.CLIENT_URL}/login

सहायता चाहिए? कॉल करें +91-1234567890

टीम AgriAI`
    };

    return templates[lang] || templates['en'];
  }

  getVerificationSMSTemplate(user, code, lang = 'en') {
    const templates = {
      en: `🔐 AgriAI Phone Verification

Hello ${user.firstName}!

Your verification code is: ${code}

This code will expire in 10 minutes.

Do not share this code with anyone.

Team AgriAI`,

      hi: `🔐 AgriAI फोन सत्यापन

नमस्ते ${user.firstName}!

आपका सत्यापन कोड है: ${code}

यह कोड 10 मिनट में समाप्त हो जाएगा।

इस कोड को किसी के साथ साझा न करें।

टीम AgriAI`
    };

    return templates[lang] || templates['en'];
  }

  getPasswordResetSMSTemplate(user, code, lang = 'en') {
    const templates = {
      en: `🔒 AgriAI Password Reset

Hello ${user.firstName}!

Your password reset code is: ${code}

This code will expire in 10 minutes.

If you didn't request this, please ignore this message.

Team AgriAI`,

      hi: `🔒 AgriAI पासवर्ड रीसेट

नमस्ते ${user.firstName}!

आपका पासवर्ड रीसेट कोड है: ${code}

यह कोड 10 मिनट में समाप्त हो जाएगा।

यदि आपने इसका अनुरोध नहीं किया है, तो कृपया इस संदेश को अनदेखा करें।

टीम AgriAI`
    };

    return templates[lang] || templates['en'];
  }

  // Send welcome SMS
  async sendWelcomeSMS(user, lang = 'en') {
    try {
      const message = this.getWelcomeSMSTemplate(user, lang);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: user.phone
      });

      console.log('✅ Welcome SMS sent:', result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ Error sending welcome SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send verification SMS
  async sendVerificationSMS(user, code, lang = 'en') {
    try {
      const message = this.getVerificationSMSTemplate(user, code, lang);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: user.phone
      });

      console.log('✅ Verification SMS sent:', result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ Error sending verification SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset SMS
  async sendPasswordResetSMS(user, code, lang = 'en') {
    try {
      const message = this.getPasswordResetSMSTemplate(user, code, lang);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: user.phone
      });

      console.log('✅ Password reset SMS sent:', result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ Error sending password reset SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Send generic SMS
  async sendSMS(phoneNumber, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log('✅ SMS sent:', result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Format phone number for Twilio (add country code if needed)
  formatPhoneNumber(phoneNumber, countryCode = '+91') {
    // Remove all non-digit characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, add it
    if (!cleanNumber.startsWith('91') && !phoneNumber.startsWith('+')) {
      cleanNumber = countryCode.replace('+', '') + cleanNumber;
    }
    
    // Add + if not present
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    
    return cleanNumber;
  }

  // Test SMS service
  async testConnection() {
    try {
      // Get account details to test connection
      const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('✅ SMS service ready:', account.friendlyName);
      return { success: true, account: account.friendlyName };
    } catch (error) {
      console.error('❌ SMS service error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SMSService();