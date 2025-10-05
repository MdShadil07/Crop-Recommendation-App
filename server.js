const express = require("express");
const path = require("path");
const session = require("express-session");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const { ensureAuthenticatedJWT } = require("./middleware/auth");

// Load environment variables
dotenv.config();

const app = express();

// ---------- Database Connection ----------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ---------- Security Middleware ----------
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com"
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://code.jquery.com",
          "https://cdn.jsdelivr.net"
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// ---------- Rate Limiting ----------
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---------- Body Parsing ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------- Cookie Parser ----------
app.use(cookieParser());

// ---------- Session ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);

// ---------- Flash Messages ----------
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// ---------- Express Handlebars ----------
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    eq: (a, b) => a === b,
    neq: (a, b) => a !== b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    and: (...args) => args.slice(0, -1).every(Boolean),
    or: (...args) => args.slice(0, -1).some(Boolean),
    not: (a) => !a,
    t: (key) => {
      const translations = {
        siteName: "AI Crop Advisor",
        login: "Login",
        signup: "Signup",
      };
      return translations[key] || key;
    },
    ifEq: (a, b, options) =>
      a === b ? options.fn(this) : options.inverse(this),
  },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ---------- Global User in Views (JWT) ----------
app.use(async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) res.locals.user = user;
    }
  } catch (err) {
    console.error("Error decoding JWT in middleware:", err);
  }
  next();
});

// ---------- Static Files ----------
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public")));

// ---------- Routes ----------
const pagesRouter = require("./route/pages");
app.use("/", pagesRouter);

app.use("/auth", require("./route/auth"));
app.use("/soil", require("./route/soil"));

// ---------- Health & Status ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Crop Advisor Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/api/status", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    success: true,
    services: {
      database: {
        status: dbStatus,
        host: mongoose.connection.host,
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 AI Crop Advisor Backend Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Environment: ${process.env.NODE_ENV}
🔗 Server: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/api/health
🔧 Status Check: http://localhost:${PORT}/api/status
📡 Pages Base: http://localhost:${PORT}/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});

// ---------- Graceful Shutdown ----------
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => console.log("Process terminated"));
});

module.exports = app;
