const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const i18n = require('i18n');

const app = express();
const PORT = process.env.PORT || 3000;

// i18n Configuration
i18n.configure({
    locales: ['en', 'hi'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    cookie: 'lang',
    queryParameter: 'lang',
    register: global
});

// Handlebars Configuration
const hbsConfig = hbs.create({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        t: function(key) {
            return i18n.__(key);
        },
        eq: function(a, b) {
            return a === b;
        },
        json: function(context) {
            return JSON.stringify(context);
        }
    }
});

// View Engine Setup
app.engine('.hbs', hbsConfig.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(i18n.init);

// Language Data
const languageData = {
    en: {
        siteName: "AgriAI",
        heroTitle: "Smart Farming with AI",
        heroSubtitle: "Get personalized crop recommendations, real-time market insights, and expert agricultural advice powered by artificial intelligence.",
        registerFarmer: "Register as Farmer",
        registerExpert: "Register as Expert",
        login: "Login",
        featuresTitle: "Powerful Features for Modern Farmers",
        chooseLanguage: "Choose Language",
        navigation: "Navigation",
        dashboard: "Dashboard",
        aiAssistant: "AI Assistant",
        marketInsights: "Market Insights",
        soilAnalysis: "Soil Analysis",
        cropRecommendations: "Crop Recommendations",
        weather: "Weather",
        offlineMode: "Offline Mode",
        quickLinks: "Quick Links",
        aboutUs: "About Us",
        services: "Services",
        contactUs: "Contact Us",
        help: "Help",
        features: "Features",
        support: "Support",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        faq: "FAQ",
        feedback: "Feedback",
        allRightsReserved: "All rights reserved.",
        footerDescription: "Empowering farmers with AI-driven insights and recommendations for sustainable agriculture.",
        readyToStart: "Ready to Start Smart Farming?",
        joinThousands: "Join thousands of farmers already using AgriAI",
        getStarted: "Get Started",
        learnMore: "Learn More"
    },
    hi: {
        siteName: "कृषि AI",
        heroTitle: "AI के साथ स्मार्ट फार्मिंग",
        heroSubtitle: "व्यक्तिगत फसल सिफारिशें, रियल-टाइम बाजार अंतर्दृष्टि और कृत्रिम बुद्धिमत्ता द्वारा संचालित विशेषज्ञ कृषि सलाह प्राप्त करें।",
        registerFarmer: "किसान के रूप में पंजीकरण करें",
        registerExpert: "विशेषज्ञ के रूप में पंजीकरण करें",
        login: "लॉगिन",
        featuresTitle: "आधुनिक किसानों के लिए शक्तिशाली सुविधाएं",
        chooseLanguage: "भाषा चुनें",
        navigation: "नेवीगेशन",
        dashboard: "डैशबोर्ड",
        aiAssistant: "AI सहायक",
        marketInsights: "बाजार अंतर्दृष्टि",
        soilAnalysis: "मिट्टी विश्लेषण",
        cropRecommendations: "फसल सिफारिशें",
        weather: "मौसम",
        offlineMode: "ऑफलाइन मोड",
        quickLinks: "त्वरित लिंक",
        aboutUs: "हमारे बारे में",
        services: "सेवाएं",
        contactUs: "संपर्क करें",
        help: "सहायता",
        features: "विशेषताएं",
        support: "समर्थन",
        privacyPolicy: "गोपनीयता नीति",
        termsOfService: "सेवा की शर्तें",
        faq: "अक्सर पूछे जाने वाले प्रश्न",
        feedback: "प्रतिक्रिया",
        allRightsReserved: "सभी अधिकार सुरक्षित।",
        footerDescription: "टिकाऊ कृषि के लिए AI-संचालित अंतर्दृष्टि और सिफारिशों के साथ किसानों को सशक्त बनाना।",
        readyToStart: "स्मार्ट फार्मिंग शुरू करने के लिए तैयार हैं?",
        joinThousands: "पहले से ही AgriAI का उपयोग कर रहे हजारों किसानों से जुड़ें",
        getStarted: "शुरू करें",
        learnMore: "और जानें"
    }
};

// Features data
const features = [
    {
        icon: "🤖",
        title: "AI Assistant",
        description: "24/7 multilingual AI support for crop queries and farming advice"
    },
    {
        icon: "📊", 
        title: "Market Insights",
        description: "Real-time crop prices and market trend analysis"
    },
    {
        icon: "🧩",
        title: "Soil Analysis", 
        description: "Advanced soil health monitoring with satellite imagery"
    },
    {
        icon: "📱",
        title: "Offline Mode",
        description: "Access essential features even without internet connection"
    }
];

// Routes
app.get('/', (req, res) => {
    const lang = req.getLocale();
    const showLanguageModal = !req.cookies.lang;
    
    res.render('home', {
        layout: 'layout',
        title: languageData[lang].siteName,
        lang: lang,
        showLanguageModal: showLanguageModal,
        showSidebar: false,
        languageDataJson: JSON.stringify(languageData),
        features: features,
        year: new Date().getFullYear()
    });
});

// Language switching route
app.post('/set-language/:lang', (req, res) => {
    const lang = req.params.lang;
    if (languageData[lang]) {
        res.cookie('lang', lang, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        req.setLocale(lang);
    }
    res.redirect('back');
});

// Dashboard routes (for future implementation)
app.get('/dashboard', (req, res) => {
    // Check authentication here
    res.render('dashboard', {
        layout: 'layout',
        title: 'Dashboard',
        showSidebar: true,
        currentPage: 'dashboard'
    });
});

app.get('/ai-assistant', (req, res) => {
    res.render('ai-assistant', {
        layout: 'layout', 
        title: 'AI Assistant',
        showSidebar: true,
        currentPage: 'ai-assistant'
    });
});

app.get('/market-insights', (req, res) => {
    res.render('market-insights', {
        layout: 'layout',
        title: 'Market Insights', 
        showSidebar: true,
        currentPage: 'market-insights'
    });
});

app.get('/soil-analysis', (req, res) => {
    res.render('soil-analysis', {
        layout: 'layout',
        title: 'Soil Analysis',
        showSidebar: true,
        currentPage: 'soil-analysis'
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).render('404', {
        layout: 'layout',
        title: '404 - Page Not Found'
    });
});

app.listen(PORT, () => {
    console.log(`AgriAI server running on port ${PORT}`);
});

module.exports = app;