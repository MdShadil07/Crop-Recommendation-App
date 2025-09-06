// Application Data
const appData = {
  crops: [
    {
      id: 1,
      name: "Wheat",
      hindi_name: "गेहूं",
      image: "wheat.jpg",
      profit_margin: 85,
      yield_prediction: "45 quintals/acre",
      sustainability_score: "A",
      market_demand: "High",
      season: "Rabi",
      soil_ph: "6.0-7.5",
      water_requirement: "Medium",
      icon: "🌾"
    },
    {
      id: 2,
      name: "Rice",
      hindi_name: "चावल",
      image: "rice.jpg",
      profit_margin: 78,
      yield_prediction: "35 quintals/acre",
      sustainability_score: "B+",
      market_demand: "Very High",
      season: "Kharif",
      soil_ph: "5.5-6.5",
      water_requirement: "High",
      icon: "🌾"
    },
    {
      id: 3,
      name: "Cotton",
      hindi_name: "कपास",
      image: "cotton.jpg",
      profit_margin: 92,
      yield_prediction: "15 quintals/acre",
      sustainability_score: "B",
      market_demand: "High",
      season: "Kharif",
      soil_ph: "5.8-8.0",
      water_requirement: "Medium",
      icon: "☁️"
    },
    {
      id: 4,
      name: "Tomato",
      hindi_name: "टमाटर",
      image: "tomato.jpg",
      profit_margin: 95,
      yield_prediction: "400 quintals/acre",
      sustainability_score: "A-",
      market_demand: "Very High",
      season: "Year Round",
      soil_ph: "6.0-7.0",
      water_requirement: "High",
      icon: "🍅"
    },
    {
      id: 5,
      name: "Sugarcane",
      hindi_name: "गन्ना",
      image: "sugarcane.jpg",
      profit_margin: 88,
      yield_prediction: "800 quintals/acre",
      sustainability_score: "B+",
      market_demand: "Medium",
      season: "Year Round",
      soil_ph: "6.0-7.5",
      water_requirement: "Very High",
      icon: "🎋"
    },
    {
      id: 6,
      name: "Potato",
      hindi_name: "आलू",
      image: "potato.jpg",
      profit_margin: 82,
      yield_prediction: "250 quintals/acre",
      sustainability_score: "A-",
      market_demand: "High",
      season: "Rabi",
      soil_ph: "5.5-6.5",
      water_requirement: "Medium",
      icon: "🥔"
    }
  ],
  
  soil_data: {
    ph: 6.5,
    moisture: 45,
    nitrogen: 75,
    phosphorus: 60,
    potassium: 80,
    organic_matter: 3.2,
    temperature: 25,
    last_updated: "2025-09-05T22:30:00Z"
  },
  
  weather: {
    temperature: 28,
    humidity: 65,
    rainfall: "15mm (last 24h)",
    wind_speed: "12 km/h",
    forecast: "Partly cloudy with chance of rain",
    location: "Punjab, India"
  },
  
  market_prices: [
    { crop: "Wheat", price: 2150, unit: "per quintal", change: "+2.5%", trend: "up" },
    { crop: "Rice", price: 2800, unit: "per quintal", change: "-1.2%", trend: "down" },
    { crop: "Cotton", price: 6200, unit: "per quintal", change: "+5.8%", trend: "up" },
    { crop: "Tomato", price: 4500, unit: "per quintal", change: "+8.2%", trend: "up" },
    { crop: "Sugarcane", price: 350, unit: "per quintal", change: "+1.8%", trend: "up" },
    { crop: "Potato", price: 1800, unit: "per quintal", change: "-3.1%", trend: "down" }
  ],
  
  languages: [
    {code: "en", name: "English", native: "English"},
    {code: "hi", name: "Hindi", native: "हिन्दी"},
    {code: "mr", name: "Marathi", native: "मराठी"},
    {code: "ta", name: "Tamil", native: "தமிழ்"},
    {code: "te", name: "Telugu", native: "తెలుగు"},
    {code: "bn", name: "Bengali", native: "বাংলা"}
  ],
  
  chat_suggestions: [
    "What crop should I plant this season?",
    "How to treat wheat rust disease?",
    "Current market rates for vegetables",
    "Best fertilizer for my soil type",
    "Weather forecast for next week"
  ],
  
  farm_profiles: [
    {
      id: 1,
      name: "Main Farm",
      location: "Ludhiana, Punjab",
      size: "5 acres",
      crops_grown: ["Wheat", "Rice"],
      soil_type: "Alluvial"
    },
    {
      id: 2,
      name: "Secondary Plot",
      location: "Amritsar, Punjab",
      size: "2 acres",
      crops_grown: ["Cotton"],
      soil_type: "Sandy Loam"
    }
  ],
  
  notifications: [
    {
      id: 1,
      title: "Weather Alert",
      message: "Heavy rainfall expected tomorrow. Postpone harvesting.",
      time: "2 hours ago",
      type: "weather",
      icon: "fas fa-cloud-rain",
      unread: true
    },
    {
      id: 2,
      title: "Price Alert",
      message: "Wheat prices increased by 5.8% - ₹2,150/quintal",
      time: "4 hours ago",
      type: "market",
      icon: "fas fa-chart-line",
      unread: true
    },
    {
      id: 3,
      title: "Crop Recommendation",
      message: "New recommendations available based on updated soil data",
      time: "6 hours ago",
      type: "recommendation",
      icon: "fas fa-seedling",
      unread: true
    }
  ]
};

// Application State
let currentLanguage = 'en';
let currentPage = 'dashboard';
let sidebarOpen = true;
let isOnline = true;
let voiceRecording = false;
let chatMessages = [];
let notificationPanelOpen = false;

// Utility Functions
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function simulateLoading(element, duration = 2000) {
  const originalContent = element.innerHTML;
  element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  setTimeout(() => {
    element.innerHTML = originalContent;
  }, duration);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Notification System
function toggleNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  const btn = document.getElementById('notification-btn');
  
  notificationPanelOpen = !notificationPanelOpen;
  
  if (notificationPanelOpen) {
    panel.classList.remove('hidden');
    btn.style.background = 'rgba(255, 255, 255, 0.1)';
  } else {
    panel.classList.add('hidden');
    btn.style.background = 'transparent';
  }
}

function markAllNotificationsRead() {
  appData.notifications.forEach(notification => {
    notification.unread = false;
  });
  
  // Update badge
  const badge = document.querySelector('.notification-badge');
  const unreadCount = appData.notifications.filter(n => n.unread).length;
  
  if (unreadCount === 0) {
    badge.style.display = 'none';
  } else {
    badge.textContent = unreadCount;
    badge.style.display = 'block';
  }
  
  // Update notification items
  document.querySelectorAll('.notification-item').forEach(item => {
    item.classList.remove('unread');
  });
  
  showToast('All notifications marked as read', 'success');
}

function closeNotificationPanel(e) {
  const panel = document.getElementById('notification-panel');
  const btn = document.getElementById('notification-btn');
  const wrapper = document.querySelector('.notification-wrapper');
  
  // Close if clicking outside the notification area
  if (!wrapper.contains(e.target) && notificationPanelOpen) {
    panel.classList.add('hidden');
    btn.style.background = 'transparent';
    notificationPanelOpen = false;
  }
}

// Language Management
function initializeLanguage() {
  const languageModal = document.getElementById('language-modal');
  const languageButtons = document.querySelectorAll('.language-btn');
  
  languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      languageModal.classList.add('hidden');
      showLandingPage();
    });
  });
}

function setLanguage(lang) {
  currentLanguage = lang;
  const selectedLang = appData.languages.find(l => l.code === lang);
  
  // Update language button text
  const langBtn = document.getElementById('language-btn');
  if (langBtn) {
    langBtn.innerHTML = `<i class="fas fa-globe"></i> ${selectedLang.native}`;
  }
  
  // Update header language selector
  const headerLang = document.getElementById('header-language');
  if (headerLang) {
    headerLang.value = lang;
  }
  
  showToast(`Language changed to ${selectedLang.native}`, 'success');
}

// Page Navigation
function showLandingPage() {
  document.getElementById('landing-page').classList.remove('hidden');
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('floating-chat').classList.add('hidden');
}

function showMainApp() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('floating-chat').classList.remove('hidden');
  showPage('dashboard');
}

function showPage(pageName) {
  // Hide all content pages
  document.querySelectorAll('.content-page').forEach(page => {
    page.classList.add('hidden');
  });
  
  // Show selected page
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
  }
  
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNav = document.querySelector(`[data-page="${pageName}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
  
  currentPage = pageName;
  
  // Load page-specific content
  switch (pageName) {
    case 'recommendations':
      loadCropRecommendations();
      break;
    case 'market-trends':
      loadMarketTrends();
      break;
    case 'ai-assistant':
      initializeChatInterface();
      break;
    case 'soil-analysis':
      updateSoilAnalysis();
      break;
    case 'farm-diary':
      loadFarmDiary();
      break;
  }
}

// Dashboard Functions
function updateDashboard() {
  // Update weather data
  const weather = appData.weather;
  document.querySelector('.temperature').textContent = `${weather.temperature}°C`;
  document.querySelector('.location').textContent = weather.location;
  
  // Update weather details
  const weatherItems = document.querySelectorAll('.weather-item span');
  weatherItems[0].textContent = `${weather.humidity}% Humidity`;
  weatherItems[1].textContent = weather.rainfall;
  weatherItems[2].textContent = weather.wind_speed;
  
  document.querySelector('.weather-forecast').textContent = weather.forecast;
  
  // Update soil metrics
  const soil = appData.soil_data;
  const metrics = document.querySelectorAll('.metric');
  
  metrics[0].querySelector('span').textContent = soil.ph;
  metrics[0].querySelector('.progress-fill').style.width = `${(soil.ph / 14) * 100}%`;
  
  metrics[1].querySelector('span').textContent = `${soil.moisture}%`;
  metrics[1].querySelector('.progress-fill').style.width = `${soil.moisture}%`;
  
  metrics[2].querySelector('span').textContent = `${soil.nitrogen}%`;
  metrics[2].querySelector('.progress-fill').style.width = `${soil.nitrogen}%`;
  
  // Update recommendations carousel
  updateRecommendationsCarousel();
}

function updateRecommendationsCarousel() {
  const carousel = document.querySelector('.recommendations-carousel');
  const topCrops = appData.crops
    .sort((a, b) => b.profit_margin - a.profit_margin)
    .slice(0, 3);
  
  carousel.innerHTML = topCrops.map(crop => `
    <div class="recommendation-item">
      <div class="crop-icon">${crop.icon}</div>
      <div class="crop-info">
        <h4>${crop.name}</h4>
        <p>${crop.profit_margin}% profit margin</p>
        <span class="status status--success">${crop.market_demand} Demand</span>
      </div>
    </div>
  `).join('');
}

// Crop Recommendations
function loadCropRecommendations() {
  const cropsGrid = document.getElementById('crops-grid');
  cropsGrid.innerHTML = '';
  
  appData.crops.forEach(crop => {
    const cropCard = createCropCard(crop);
    cropsGrid.appendChild(cropCard);
  });
}

function createCropCard(crop) {
  const card = document.createElement('div');
  card.className = 'crop-card card';
  
  const sustainabilityClass = crop.sustainability_score.toLowerCase().replace('+', '').replace('-', '');
  
  card.innerHTML = `
    <div class="card__body">
      <div class="crop-header">
        <div>
          <h3 class="crop-name">${crop.name}</h3>
          <p class="crop-hindi">${crop.hindi_name}</p>
        </div>
        <div class="crop-icon-large">${crop.icon}</div>
      </div>
      
      <div class="crop-metrics">
        <div class="crop-metric">
          <div class="metric-value">${crop.profit_margin}%</div>
          <div class="metric-label">Profit Margin</div>
        </div>
        <div class="crop-metric">
          <div class="metric-value">${crop.yield_prediction}</div>
          <div class="metric-label">Expected Yield</div>
        </div>
        <div class="crop-metric">
          <div class="metric-value">${crop.market_demand}</div>
          <div class="metric-label">Market Demand</div>
        </div>
        <div class="crop-metric">
          <div class="metric-value">
            <span class="sustainability-score ${sustainabilityClass}">${crop.sustainability_score}</span>
          </div>
          <div class="metric-label">Sustainability</div>
        </div>
      </div>
      
      <div class="crop-details">
        <p><strong>Season:</strong> ${crop.season}</p>
        <p><strong>Soil pH:</strong> ${crop.soil_ph}</p>
        <p><strong>Water Need:</strong> ${crop.water_requirement}</p>
      </div>
      
      <button class="btn btn--primary btn--full-width" onclick="selectCrop(${crop.id})">
        <i class="fas fa-seedling"></i> Select This Crop
      </button>
    </div>
  `;
  
  return card;
}

function selectCrop(cropId) {
  const crop = appData.crops.find(c => c.id === cropId);
  showToast(`${crop.name} selected for planting recommendation!`, 'success');
}

function applyFilters() {
  const seasonFilter = document.getElementById('season-filter').value;
  const profitFilter = document.getElementById('profit-filter').value;
  
  let filteredCrops = appData.crops;
  
  if (seasonFilter) {
    filteredCrops = filteredCrops.filter(crop => 
      crop.season.toLowerCase().includes(seasonFilter.toLowerCase())
    );
  }
  
  if (profitFilter) {
    switch (profitFilter) {
      case 'high':
        filteredCrops = filteredCrops.filter(crop => crop.profit_margin > 80);
        break;
      case 'medium':
        filteredCrops = filteredCrops.filter(crop => crop.profit_margin >= 60 && crop.profit_margin <= 80);
        break;
      case 'low':
        filteredCrops = filteredCrops.filter(crop => crop.profit_margin < 60);
        break;
    }
  }
  
  const cropsGrid = document.getElementById('crops-grid');
  cropsGrid.innerHTML = '';
  
  filteredCrops.forEach(crop => {
    const cropCard = createCropCard(crop);
    cropsGrid.appendChild(cropCard);
  });
  
  showToast(`Found ${filteredCrops.length} crops matching your criteria`, 'info');
}

// Soil Analysis
function updateSoilAnalysis() {
  const soil = appData.soil_data;
  
  // Update nutrient bars
  const nutrientBars = document.querySelectorAll('.nutrient-bar');
  
  if (nutrientBars.length >= 3) {
    nutrientBars[0].querySelector('.progress-fill').style.width = `${soil.nitrogen}%`;
    nutrientBars[0].querySelector('span').textContent = `${soil.nitrogen}%`;
    
    nutrientBars[1].querySelector('.progress-fill').style.width = `${soil.phosphorus}%`;
    nutrientBars[1].querySelector('span').textContent = `${soil.phosphorus}%`;
    
    nutrientBars[2].querySelector('.progress-fill').style.width = `${soil.potassium}%`;
    nutrientBars[2].querySelector('span').textContent = `${soil.potassium}%`;
  }
  
  // Update soil meters
  const meterValues = document.querySelectorAll('.meter-value');
  if (meterValues.length >= 3) {
    meterValues[0].textContent = soil.ph;
    meterValues[1].textContent = `${soil.moisture}%`;
    meterValues[2].textContent = `${soil.organic_matter}%`;
  }
}

// Market Trends
function loadMarketTrends() {
  const priceCards = document.querySelector('.price-cards');
  
  priceCards.innerHTML = appData.market_prices.map(item => `
    <div class="price-card">
      <h3>${item.crop}</h3>
      <div class="price">₹${item.price.toLocaleString()}</div>
      <div class="unit">${item.unit}</div>
      <div class="change ${item.trend === 'up' ? 'positive' : 'negative'}">${item.change}</div>
    </div>
  `).join('');
}

// AI Chat Interface
function initializeChatInterface() {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const voiceBtn = document.getElementById('voice-btn');
  const cameraBtn = document.getElementById('camera-btn');
  
  // Initialize with welcome message if empty
  if (chatMessages.children.length <= 1) {
    addBotMessage("Hello! I'm your AI farming assistant. You can ask me about crops, diseases, weather, market prices, or upload images for analysis. How can I help you today?");
  }
  
  // Remove existing event listeners to prevent duplicates
  const newSendBtn = sendBtn.cloneNode(true);
  sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
  
  const newVoiceBtn = voiceBtn.cloneNode(true);
  voiceBtn.parentNode.replaceChild(newVoiceBtn, voiceBtn);
  
  const newCameraBtn = cameraBtn.cloneNode(true);
  cameraBtn.parentNode.replaceChild(newCameraBtn, cameraBtn);
  
  // Add fresh event listeners
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('voice-btn').addEventListener('click', toggleVoiceRecording);
  document.getElementById('camera-btn').addEventListener('click', simulateImageUpload);
  
  // Chat input enter key
  const newChatInput = chatInput.cloneNode(true);
  chatInput.parentNode.replaceChild(newChatInput, chatInput);
  
  document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Suggestion chips
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('chat-input').value = chip.textContent;
      sendMessage();
    });
  });
}

function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  addUserMessage(message);
  chatInput.value = '';
  
  // Simulate AI response
  setTimeout(() => {
    const response = generateAIResponse(message);
    addBotMessage(response);
  }, 1000 + Math.random() * 2000);
}

function addUserMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-user"></i>
    </div>
    <div class="message-content">
      <p>${message}</p>
      <small>Just now</small>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-robot"></i>
    </div>
    <div class="message-content">
      <p>${message}</p>
      <small>Just now</small>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('crop') && message.includes('plant')) {
    return `Based on your soil analysis (pH: ${appData.soil_data.ph}, Moisture: ${appData.soil_data.moisture}%) and current season, I recommend planting Wheat or Tomato. Wheat has an 85% profit margin and is perfect for Rabi season. Would you like detailed planting guidelines?`;
  }
  
  if (message.includes('disease') || message.includes('rust')) {
    return "Wheat rust is a common fungal disease. Treatment options include: 1) Apply fungicide containing propiconazole, 2) Ensure proper field drainage, 3) Use resistant wheat varieties like HD-3086. Early detection is key for effective treatment.";
  }
  
  if (message.includes('market') || message.includes('price')) {
    const randomCrop = appData.market_prices[Math.floor(Math.random() * appData.market_prices.length)];
    return `Current market rates: ${randomCrop.crop} is trading at ₹${randomCrop.price} per quintal (${randomCrop.change} from yesterday). Market demand is high for tomatoes and cotton this week. Would you like price alerts for specific crops?`;
  }
  
  if (message.includes('weather') || message.includes('forecast')) {
    return `Weather forecast for next 7 days: Partly cloudy with temperatures ranging 24-30°C. Expected rainfall: 20-25mm over weekend. Good conditions for field preparation. Avoid harvesting on Saturday due to expected showers.`;
  }
  
  if (message.includes('fertilizer') || message.includes('soil')) {
    return `Based on your soil test results, I recommend: NPK 12:32:16 at 2 bags/acre for base application. Your soil has good nitrogen levels (75%) but needs phosphorus boost (60%). Apply organic manure 2 weeks before sowing for better results.`;
  }
  
  return "I understand you're asking about farming. Could you please be more specific? I can help with crop selection, disease management, market prices, weather forecasts, soil analysis, and fertilizer recommendations. What would you like to know more about?";
}

function toggleVoiceRecording() {
  const voiceBtn = document.getElementById('voice-btn');
  
  voiceRecording = !voiceRecording;
  
  if (voiceRecording) {
    voiceBtn.classList.add('recording');
    voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
    showToast('Listening... Speak now', 'info');
    
    // Simulate voice recording
    setTimeout(() => {
      stopVoiceRecording();
      const simulatedText = "What is the best crop for my soil type?";
      document.getElementById('chat-input').value = simulatedText;
      showToast('Voice input received', 'success');
    }, 3000);
  } else {
    stopVoiceRecording();
  }
}

function stopVoiceRecording() {
  const voiceBtn = document.getElementById('voice-btn');
  voiceRecording = false;
  voiceBtn.classList.remove('recording');
  voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
}

function simulateImageUpload() {
  showToast('Camera opened. Taking photo...', 'info');
  
  setTimeout(() => {
    addUserMessage("📷 [Image uploaded: Wheat plant with brown spots]");
    
    setTimeout(() => {
      addBotMessage("I can see brown spots on your wheat leaves. This appears to be wheat leaf rust (Puccinia triticina). Immediate treatment recommended: Apply Propiconazole 25% EC @ 0.1% solution. Spray in evening hours. Also ensure proper field drainage to prevent fungal spread. Monitor plants daily for next week.");
    }, 1500);
  }, 2000);
}

// Farm Diary
function loadFarmDiary() {
  const farmSelector = document.getElementById('farm-selector');
  const diaryEntries = document.querySelector('.diary-entries');
  
  // Populate farm selector
  if (farmSelector && appData.farm_profiles) {
    farmSelector.innerHTML = appData.farm_profiles.map(farm => 
      `<option value="${farm.id}">${farm.name} - ${farm.location} (${farm.size})</option>`
    ).join('');
  }
  
  // Add sample entries if empty
  if (diaryEntries && diaryEntries.children.length <= 1) {
    addSampleDiaryEntries();
  }
}

function addSampleDiaryEntries() {
  const diaryEntries = document.querySelector('.diary-entries');
  
  const sampleEntries = [
    {
      date: '2025-09-05',
      title: 'Wheat Sowing Preparation',
      content: 'Prepared field for wheat sowing. Applied NPK fertilizer as recommended by AI assistant. Soil moisture level is optimal at 45%.',
      day: '05',
      month: 'Sep'
    },
    {
      date: '2025-09-03',
      title: 'Irrigation System Check',
      content: 'Tested drip irrigation system. All nozzles working properly. Scheduled watering for early morning hours to reduce evaporation.',
      day: '03',
      month: 'Sep'
    },
    {
      date: '2025-09-01',
      title: 'Soil Analysis Results',
      content: 'Received soil test results from lab. pH level is 6.5 (optimal). Nitrogen levels good but phosphorus needs supplementation.',
      day: '01',
      month: 'Sep'
    }
  ];
  
  sampleEntries.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'diary-entry';
    entryDiv.innerHTML = `
      <div class="entry-date">
        <div class="date-day">${entry.day}</div>
        <div class="date-month">${entry.month}</div>
      </div>
      <div class="entry-content">
        <h4>${entry.title}</h4>
        <p>${entry.content}</p>
        <div class="entry-media">
          <div class="media-placeholder">
            <i class="fas fa-image"></i>
          </div>
        </div>
        <div class="entry-actions">
          <button class="btn btn--outline btn--sm">
            <i class="fas fa-microphone"></i> Voice Note
          </button>
          <button class="btn btn--outline btn--sm">
            <i class="fas fa-camera"></i> Add Photo
          </button>
        </div>
      </div>
    `;
    
    diaryEntries.appendChild(entryDiv);
  });
}

// Quick Actions
function handleQuickAction(action) {
  switch (action) {
    case 'scan':
      showToast('Camera activated. Point at your field to analyze crop health', 'info');
      setTimeout(() => {
        showToast('Field scan complete. Crop health: Good. No diseases detected.', 'success');
      }, 3000);
      break;
      
    case 'ai':
      showPage('ai-assistant');
      break;
      
    case 'market':
      showPage('market-trends');
      break;
      
    case 'calendar':
      showToast('Crop Calendar: Wheat sowing starts in 2 weeks. Prepare field now.', 'info');
      break;
  }
}

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebarOpen = !sidebarOpen;
  
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open', sidebarOpen);
  }
}

// Offline Mode Simulation
function toggleOfflineMode() {
  isOnline = !isOnline;
  const offlineIndicator = document.getElementById('offline-indicator');
  const syncBtn = document.getElementById('sync-btn');
  
  if (isOnline) {
    offlineIndicator.classList.add('hidden');
    syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    showToast('Back online. Data syncing...', 'success');
  } else {
    offlineIndicator.classList.remove('hidden');
    syncBtn.innerHTML = '<i class="fas fa-wifi-slash"></i>';
    showToast('Offline mode activated. Limited functionality available.', 'warning');
  }
}

// Sync Data
function syncData() {
  if (!isOnline) {
    showToast('Cannot sync while offline', 'error');
    return;
  }
  
  const syncBtn = document.getElementById('sync-btn');
  const originalIcon = syncBtn.innerHTML;
  
  syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  showToast('Syncing farm data...', 'info');
  
  setTimeout(() => {
    syncBtn.innerHTML = originalIcon;
    showToast('All data synced successfully', 'success');
  }, 2000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize language selection
  initializeLanguage();
  
  // Landing page buttons
  document.getElementById('language-btn').addEventListener('click', () => {
    document.getElementById('language-modal').classList.remove('hidden');
  });
  
  document.getElementById('login-btn').addEventListener('click', () => {
    showToast('Login feature coming soon!', 'info');
  });
  
  document.getElementById('register-farmer-btn').addEventListener('click', () => {
    showMainApp();
    showToast('Welcome to AgriAI! Your farming assistant is ready.', 'success');
  });
  
  document.getElementById('register-expert-btn').addEventListener('click', () => {
    showToast('Expert registration coming soon!', 'info');
  });
  
  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      showPage(page);
    });
  });
  
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  // Header controls
  const headerLang = document.getElementById('header-language');
  if (headerLang) {
    headerLang.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
  
  const syncBtn = document.getElementById('sync-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', syncData);
  }
  
  // Notification system
  const notificationBtn = document.getElementById('notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNotificationPanel();
    });
  }
  
  const markAllReadBtn = document.getElementById('mark-all-read');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', markAllNotificationsRead);
  }
  
  // Close notification panel when clicking outside
  document.addEventListener('click', closeNotificationPanel);
  
  // Quick actions
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      handleQuickAction(action);
    });
  });
  
  // Filter applications
  const applyFiltersBtn = document.getElementById('apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
  }
  
  // Floating chat button
  const floatingChat = document.getElementById('floating-chat');
  if (floatingChat) {
    floatingChat.addEventListener('click', () => {
      showPage('ai-assistant');
    });
  }
  
  // Add diary entry
  const addEntryBtn = document.getElementById('add-entry-btn');
  if (addEntryBtn) {
    addEntryBtn.addEventListener('click', () => {
      showToast('New diary entry form will open here', 'info');
    });
  }
  
  // Initialize dashboard
  updateDashboard();
  
  // Simulate periodic updates
  setInterval(() => {
    if (isOnline && currentPage === 'dashboard') {
      // Simulate minor weather/data updates
      const temp = document.querySelector('.temperature');
      if (temp) {
        const currentTemp = parseInt(temp.textContent);
        const newTemp = currentTemp + (Math.random() - 0.5) * 2;
        temp.textContent = `${Math.round(newTemp)}°C`;
      }
    }
  }, 30000); // Update every 30 seconds
  
  // Simulate network status changes
  setTimeout(() => {
    if (Math.random() > 0.7) {
      toggleOfflineMode();
      setTimeout(() => {
        if (!isOnline) toggleOfflineMode();
      }, 10000);
    }
  }, 60000);
  
  // Handle responsive sidebar
  function handleResize() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      sidebarOpen = false;
    } else {
      sidebar.classList.remove('open');
      sidebarOpen = true;
    }
  }
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Call once on load
});

// Global functions for button clicks
window.selectCrop = selectCrop;