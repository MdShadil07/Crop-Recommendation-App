const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Email templates
  getWelcomeEmailTemplate(user, credentials, lang = 'en') {
    const templates = {
      en: {
        subject: '🌱 Welcome to AgriAI - Your Smart Farming Journey Begins!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to AgriAI</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745, #34d058); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🌱 Welcome to AgriAI!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Smart Farming with Artificial Intelligence</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #28a745; margin-top: 0;">Hello ${user.firstName} ${user.lastName}! 👋</h2>
              
              <p>Congratulations! Your AgriAI ${user.userType} account has been successfully created. You're now part of our smart farming community that's revolutionizing agriculture with AI technology.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="margin: 0 0 15px 0; color: #28a745;">Your Login Credentials</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${user.phone}</p>
                <p style="margin: 5px 0;"><strong>Account Type:</strong> ${user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}</p>
              </div>
              
              <h3 style="color: #28a745;">🚀 What's Next?</h3>
              <ul style="padding-left: 20px;">
                <li><strong>Verify Your Account:</strong> Complete email and phone verification for full access</li>
                <li><strong>Complete Your Profile:</strong> Add more details to get personalized recommendations</li>
                <li><strong>Explore Features:</strong> Discover AI-powered crop recommendations, market insights, and more</li>
                <li><strong>Connect with Community:</strong> Join thousands of farmers and experts on our platform</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/login" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Dashboard</a>
              </div>
              
              <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #495057;">Need Help?</h4>
                <p style="margin: 0;">Contact our support team at <a href="mailto:support@agriai.com">support@agriai.com</a> or call +91-1234567890</p>
              </div>
              
              <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                Thanks for choosing AgriAI!<br>
                <strong>Team AgriAI</strong><br>
                Smart Farming Solutions
              </p>
            </div>
          </body>
          </html>
        `
      },
      hi: {
        subject: '🌱 AgriAI में आपका स्वागत है - स्मार्ट खेती की शुरुआत!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AgriAI में आपका स्वागत है</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745, #34d058); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🌱 AgriAI में आपका स्वागत है!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">कृत्रिम बुद्धिमत्ता के साथ स्मार्ट खेती</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #28a745; margin-top: 0;">नमस्ते ${user.firstName} ${user.lastName}! 👋</h2>
              
              <p>बधाई हो! आपका AgriAI ${user.userType === 'farmer' ? 'किसान' : 'विशेषज्ञ'} खाता सफलतापूर्वक बन गया है। अब आप हमारे स्मार्ट खेती समुदाय का हिस्सा हैं जो AI तकनीक से कृषि में क्रांति ला रहा है।</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="margin: 0 0 15px 0; color: #28a745;">आपकी लॉगिन जानकारी</h3>
                <p style="margin: 5px 0;"><strong>ईमेल:</strong> ${user.email}</p>
                <p style="margin: 5px 0;"><strong>फोन:</strong> ${user.phone}</p>
                <p style="margin: 5px 0;"><strong>खाता प्रकार:</strong> ${user.userType === 'farmer' ? 'किसान' : 'विशेषज्ञ'}</p>
              </div>
              
              <h3 style="color: #28a745;">🚀 आगे क्या करना है?</h3>
              <ul style="padding-left: 20px;">
                <li><strong>अपना खाता सत्यापित करें:</strong> पूर्ण पहुँच के लिए ईमेल और फोन सत्यापन पूरा करें</li>
                <li><strong>अपनी प्रोफ़ाइल पूरी करें:</strong> व्यक्तिगत सुझाव पाने के लिए अधिक विवरण जोड़ें</li>
                <li><strong>सुविधाओं का अन्वेषण करें:</strong> AI-संचालित फसल सुझाव, बाजार जानकारी और बहुत कुछ खोजें</li>
                <li><strong>समुदाय से जुड़ें:</strong> हमारे प्लेटफॉर्म पर हजारों किसानों और विशेषज्ञों से मिलें</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/login" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">डैशबोर्ड में लॉगिन करें</a>
              </div>
              
              <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #495057;">सहायता चाहिए?</h4>
                <p style="margin: 0;">हमारी सहायता टीम से <a href="mailto:support@agriai.com">support@agriai.com</a> पर संपर्क करें या +91-1234567890 पर कॉल करें</p>
              </div>
              
              <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                AgriAI चुनने के लिए धन्यवाद!<br>
                <strong>टीम AgriAI</strong><br>
                स्मार्ट खेती समाधान
              </p>
            </div>
          </body>
          </html>
        `
      }
    };

    return templates[lang] || templates['en'];
  }

  getVerificationEmailTemplate(user, verifyUrl, lang = 'en') {
    const templates = {
      en: {
        subject: '🔐 Verify Your AgriAI Email Address',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745, #34d058); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🔐 Email Verification</h1>
              <p style="margin: 10px 0 0 0;">AgriAI Security Team</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #28a745; margin-top: 0;">Hello ${user.firstName}!</h2>
              
              <p>Please verify your email address to complete your AgriAI account setup and access all features.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
              </div>
              
              <p style="font-size: 14px; color: #6c757d;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verifyUrl}" style="color: #28a745; word-break: break-all;">${verifyUrl}</a>
              </p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;"><strong>Security Note:</strong> This link will expire in 10 minutes for your security.</p>
              </div>
              
              <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                If you didn't create an AgriAI account, please ignore this email.<br>
                <strong>Team AgriAI</strong>
              </p>
            </div>
          </body>
          </html>
        `
      },
      hi: {
        subject: '🔐 अपना AgriAI ईमेल पता सत्यापित करें',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ईमेल सत्यापन</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745, #34d058); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🔐 ईमेल सत्यापन</h1>
              <p style="margin: 10px 0 0 0;">AgriAI सुरक्षा टीम</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #28a745; margin-top: 0;">नमस्ते ${user.firstName}!</h2>
              
              <p>कृपया अपने AgriAI खाते की स्थापना को पूरा करने और सभी सुविधाओं तक पहुंच प्राप्त करने के लिए अपने ईमेल पते की पुष्टि करें।</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">ईमेल पता सत्यापित करें</a>
              </div>
              
              <p style="font-size: 14px; color: #6c757d;">
                यदि बटन काम नहीं करता है, तो इस लिंक को कॉपी करके अपने ब्राउज़र में पेस्ट करें:<br>
                <a href="${verifyUrl}" style="color: #28a745; word-break: break-all;">${verifyUrl}</a>
              </p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;"><strong>सुरक्षा नोट:</strong> यह लिंक आपकी सुरक्षा के लिए 10 मिनट में समाप्त हो जाएगा।</p>
              </div>
              
              <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                यदि आपने AgriAI खाता नहीं बनाया है, तो कृपया इस ईमेल को अनदेखा करें।<br>
                <strong>टीम AgriAI</strong>
              </p>
            </div>
          </body>
          </html>
        `
      }
    };

    return templates[lang] || templates['en'];
  }

  getPasswordResetTemplate(user, resetUrl, lang = 'en') {
    const templates = {
      en: {
        subject: '🔒 Reset Your AgriAI Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc3545, #e85368); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🔒 Password Reset Request</h1>
              <p style="margin: 10px 0 0 0;">AgriAI Security Team</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #dc3545; margin-top: 0;">Hello ${user.firstName}!</h2>
              
              <p>You recently requested to reset your password for your AgriAI account. Click the button below to reset it.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              
              <p style="font-size: 14px; color: #6c757d;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
              </p>
              
              <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                <p style="margin: 0; color: #721c24;"><strong>Security Alert:</strong> This link will expire in 10 minutes. If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
              </div>
              
              <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                For security questions, contact us at security@agriai.com<br>
                <strong>Team AgriAI</strong>
              </p>
            </div>
          </body>
          </html>
        `
      },
      hi: {
        subject: '🔒 अपना AgriAI पासवर्ड रीसेट करें',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>पासवर्ड रीसेट</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc3545, #e85368); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🔒 पासवर्ड रीसेट अनुरोध</h1>
              <p style="margin: 10px 0 0 0;">AgriAI सुरक्षा टीम</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #dc3545; margin-top: 0;">नमस्ते ${user.firstName}!</h2>
              
              <p>आपने हाल ही में अपने AgriAI खाते के लिए पासवर्ड रीसेट का अनुरोध किया है। इसे रीसेट करने के लिए नीचे दिए गए बटन पर क्लिक करें।</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">पासवर्ड रीसेट करें</a>
              </div>
              
              <p style="font-size: 14px; color: #6c757d;">
                यदि बटन काम नहीं करता है, तो इस लिंक को कॉपी करके अपने ब्राउज़र में पेस्ट करें:<br>
                <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
              </p>
              
              <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                <p style="margin: 0; color: #721c24;"><strong>सुरक्षा चेतावनी:</strong> यह लिंक 10 मिनट में समाप्त हो जाएगा। यदि आपने इस पासवर्ड रीसेट का अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें और आपका पासवर्ड अपरिवर्तित रहेगा।</p>
              </div>
              
              <p style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
                सुरक्षा प्रश्नों के लिए, हमसे security@agriai.com पर संपर्क करें<br>
                <strong>टीम AgriAI</strong>
              </p>
            </div>
          </body>
          </html>
        `
      }
    };

    return templates[lang] || templates['en'];
  }

  // Send welcome email with credentials
  async sendWelcomeEmail(user, credentials, lang = 'en') {
    try {
      const template = this.getWelcomeEmailTemplate(user, credentials, lang);

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: template.subject,
        html: template.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send verification email
  async sendVerificationEmail(user, verifyUrl, lang = 'en') {
    try {
      const template = this.getVerificationEmailTemplate(user, verifyUrl, lang);

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: template.subject,
        html: template.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetUrl, lang = 'en') {
    try {
      const template = this.getPasswordResetTemplate(user, resetUrl, lang);

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: template.subject,
        html: template.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service ready');
      return { success: true };
    } catch (error) {
      console.error('❌ Email service error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();