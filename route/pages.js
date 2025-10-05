const express = require("express");
const { ensureAuthenticatedJWT } = require("../middleware/auth"); // ✅ use JWT middleware
const router = express.Router();

// Root route → Landing page (no sidebar/footer)
router.get("/", (req, res) => {
  res.render("index", { 
    title: "Home", 
    layout: "main",
    showSidebar: false,
    showFooter: false,
    showHeader: false
  });
});

// Route for login page
router.get('/login', (req, res) => {
    res.render('pages/login-page', { isSignupPage: false });
});

// Route for signup page
router.get('/signup', (req, res) => {
    res.render('pages/signup-page', { isSignupPage: true });
});

// Dashboard → protected
router.get("/dashboard", ensureAuthenticatedJWT, (req, res) => {
  res.render("pages/dashboard", { 
    title: "Dashboard", 
    layout: "main",
    showSidebar: true,
    showFooter: true,
    user: req.user // optional: pass user to template
  });
});

// Market Trends → protected
router.get("/market-trends", ensureAuthenticatedJWT, (req, res) => {
  res.render("pages/market-trends", { 
    title: "Market Trends", 
    layout: "main",
    showSidebar: true,
    showFooter: true,
    user: req.user
  });
});

// AI Assistant → protected
router.get("/ai-assistant", ensureAuthenticatedJWT, (req, res) => {
  res.render("pages/ai-assistant", { 
    title: "AI Assistant", 
    layout: "main",
    showSidebar: true,
    showFooter: true,
    user: req.user
  });
});

// Farm Diary → protected
router.get("/farm-diary", ensureAuthenticatedJWT, (req, res) => {
  res.render("pages/farm-diary", { 
    title: "Farm Diary", 
    layout: "main",
    showSidebar: true,
    showFooter: true,
    user: req.user
  });
});

// Settings → protected
router.get("/settings", ensureAuthenticatedJWT, (req, res) => {
  res.render("pages/setting", { 
    title: "Settings", 
    layout: "main",
    showSidebar: true,
    showFooter: true,
    user: req.user
  });
});

module.exports = router;
