const express = require('express');
const router = express.Router();



// Root route → views/index.hbs
router.get("/", (req, res) => {
  res.render("index", { 
    title: "Home", 
    layout: "main" 
  });
});

// Dashboard page → views/pages/dashboard.hbs
router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { 
    title: "Dashboard", 
    layout: "main" 
  });
});

// Market Trends → views/pages/market-trends.hbs
router.get("/market-trends", (req, res) => {
  res.render("pages/market-trends", { 
    title: "Market Trends", 
    layout: "main" 
  });
});

// AI Assistant → views/pages/ai-assistant.hbs
router.get("/ai-assistant", (req, res) => {
  res.render("pages/ai-assistant", { 
    title: "AI Assistant", 
    layout: "main" 
  });
});

// Farm Diary → views/pages/farm-diary.hbs
router.get("/farm-diary", (req, res) => {
  res.render("pages/farm-diary", { 
    title: "Farm Diary", 
    layout: "main" 
  });
});

// Settings → views/pages/setting.hbs
router.get("/settings", (req, res) => {
  res.render("pages/setting", { 
    title: "Settings", 
    layout: "main" 
  });
});

module.exports = router;
