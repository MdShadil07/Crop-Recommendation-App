<<<<<<< HEAD
# AgriAI - Smart Farming Dashboard

A comprehensive crop recommendation platform with AI-powered insights, built with Node.js, Express, and Handlebars.

## Features

- **Multi-language Support** - English and Hindi with easy expansion for more languages
- **Modular Architecture** - Reusable header, sidebar, and footer components
- **Responsive Design** - Works on desktop and mobile devices
- **AI Assistant** - 24/7 multilingual support for farming queries
- **Market Insights** - Real-time crop prices and market analysis
- **Soil Analysis** - Advanced soil health monitoring
- **Offline Mode** - Essential features work without internet

## Project Structure

```
agri-ai-dashboard/
├── views/
│   ├── layouts/
│   │   └── layout.hbs          # Main layout template
│   ├── partials/
│   │   ├── header.hbs          # Reusable header component
│   │   ├── sidebar.hbs         # Reusable sidebar navigation
│   │   └── footer.hbs          # Reusable footer component
│   ├── home.hbs                # Landing page content
│   ├── dashboard.hbs           # Dashboard page (to be created)
│   ├── ai-assistant.hbs        # AI Assistant page (to be created)
│   └── market-insights.hbs     # Market insights page (to be created)
├── public/
│   ├── css/
│   │   └── style.css           # Main stylesheet
│   ├── js/
│   │   └── app.js              # Frontend JavaScript
│   └── images/                 # Static images
├── locales/                    # Translation files
│   ├── en.json                 # English translations
│   └── hi.json                 # Hindi translations
├── app.js                      # Express server configuration
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create translation files**
   
   Create `locales/en.json`:
   ```json
   {
     "siteName": "AgriAI",
     "heroTitle": "Smart Farming with AI",
     "heroSubtitle": "Get personalized crop recommendations...",
     "registerFarmer": "Register as Farmer",
     "login": "Login"
   }
   ```
   
   Create `locales/hi.json`:
   ```json
   {
     "siteName": "कृषि AI",
     "heroTitle": "AI के साथ स्मार्ट फार्मिंग",
     "heroSubtitle": "व्यक्तिगत फसल सिफारिशें...",
     "registerFarmer": "किसान के रूप में पंजीकरण करें",
     "login": "लॉगिन"
   }
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Language Selection
- Users see a language selection modal on first visit
- Language preference is stored in cookies
- Users can change language anytime using the header dropdown

### Navigation
- **Landing Page**: `/` - Public homepage with features and registration
- **Dashboard**: `/dashboard` - Main dashboard after login (requires authentication)
- **AI Assistant**: `/ai-assistant` - Chat interface with AI
- **Market Insights**: `/market-insights` - Real-time market data
- **Soil Analysis**: `/soil-analysis` - Soil health monitoring tools

### Component Reusability

#### Header Component (`header.hbs`)
- Contains logo, language selector, and login button
- Automatically updates based on current language
- Used across all pages

#### Sidebar Component (`sidebar.hbs`)
- Navigation menu for authenticated users
- Shows active page highlighting
- User profile section at bottom
- Hidden on landing page, visible on dashboard pages

#### Footer Component (`footer.hbs`)
- Links to important pages and features
- Multi-language support
- Social media links
- Copyright information

## Development

### Adding New Pages

1. **Create the HBS template** in `views/`
2. **Add route** in `app.js`
3. **Add translations** in locale files
4. **Update sidebar navigation** if needed

Example:
```javascript
app.get('/new-page', (req, res) => {
    res.render('new-page', {
        layout: 'layout',
        title: 'New Page',
        showSidebar: true,
        currentPage: 'new-page'
    });
});
```

### Adding New Languages

1. **Create locale file** (e.g., `locales/es.json`)
2. **Add to i18n config** in `app.js`
3. **Add language option** to header and modal templates
4. **Update language data object**

### Customization

#### Colors
The design uses a dark theme with green accents:
- Background: Dark (#0a0a0a)
- Primary: Green (#22c55e)
- Text: Blue for large headings
- Cards: Dark gray with subtle borders

#### Typography
- Large headings use blue color as requested
- Body text uses light colors for contrast
- Icons are used throughout for visual appeal

## Backend Integration

The application is set up for easy integration with:
- **Authentication** - User login/registration
- **Database** - MongoDB with Mongoose
- **APIs** - RESTful endpoints for data
- **File Upload** - Multer for image uploads
- **Security** - Helmet, rate limiting, CORS

## Next Steps

1. **Implement Authentication**
   - User registration and login
   - Session management
   - Route protection

2. **Create Additional Pages**
   - AI Assistant chat interface
   - Market data visualization
   - Soil analysis tools
   - Crop recommendation engine

3. **Add Database Integration**
   - User profiles
   - Crop data
   - Market information
   - Analysis history

4. **Enhance Functionality**
   - Real-time notifications
   - Data export features
   - Mobile app integration
   - Advanced analytics

## License

MIT License - feel free to modify and use for your project.

## Support

For questions about implementation or additional features, please refer to the documentation or create an issue in the project repository.
=======
# AI-Based-Crop-Recommendation
>>>>>>> 1615b6a825db54123e438f1d6f6f1184dfba56a4
