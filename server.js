const express = require("express");
const path = require("path");
const session = require("express-session");
const exphbs = require("express-handlebars");

const app = express();

// ---------- Express Handlebars Setup ----------
app.engine('hbs', exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main', // matches your layout.hbs
    layoutsDir: path.join(__dirname, 'view/layouts'),
    partialsDir: path.join(__dirname, 'view/partials'),
    helpers: {
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b,
        lt: (a, b) => a < b,
        lte: (a, b) => a <= b,
        gt: (a, b) => a > b,
        gte: (a, b) => a >= b,
        and: (...args) => args.slice(0, -1).every(Boolean),
        or: (...args) => args.slice(0, -1).some(Boolean),
        not: a => !a,
        t: (key) => {
            const translations = {
                siteName: "AI Crop Advisor",
                login: "Login",
                signup: "Signup"
            };
            return translations[key] || key;
        },
        ifEq: (a, b, options) => (a === b) ? options.fn(this) : options.inverse(this)
    }
}).engine);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---------- Session ----------
app.use(session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if using HTTPS
}));

// ---------- Make session user available in views ----------
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
});

// ---------- Static Files ----------
app.use(express.static(path.join(__dirname, "public"))); // CSS/JS/images

// ---------- Routes ----------
const pagesRouter = require("./route/pages");
app.use("/", pagesRouter);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
