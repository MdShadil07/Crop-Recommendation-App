const express = require('express');
const router = express.Router();

// Root route → Landing page (no sidebar/footer)
router.get("/", (req, res) => {
  res.render("index", { 
    title: "Home", 
    layout: "main",
    showSidebar: false,  // hide sidebar
    showFooter: false,
    showHeader: false   // hide footer
  });
});

router.get("/signup-page", (req, res)=>{
  res.render("signup-page")
});

// Dashboard page → show sidebar/footer
router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { 
    title: "Dashboard", 
    layout: "main",
    showSidebar: true,
    showFooter: true
  });
});

// Market Trends
router.get("/market-trends", (req, res) => {
  res.render("pages/market-trends", { 
    title: "Market Trends", 
    layout: "main",
    showSidebar: true,
    showFooter: true
  });
});

// AI Assistant
router.get("/ai-assistant", (req, res) => {
  res.render("pages/ai-assistant", { 
    title: "AI Assistant", 
    layout: "main",
    showSidebar: true,
    showFooter: true
  });
});

// Farm Diary
router.get("/farm-diary", (req, res) => {
  res.render("pages/farm-diary", { 
    title: "Farm Diary", 
    layout: "main",
    showSidebar: true,
    showFooter: true
  });
});

// Settings
router.get("/settings", (req, res) => {
  res.render("pages/setting", { 
    title: "Settings", 
    layout: "main",
    showSidebar: true,
    showFooter: true
  });
});

module.exports = router;
