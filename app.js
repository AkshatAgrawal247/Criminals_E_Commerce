const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { User } = require('./database'); // Import the User model
const auth = require('./auth');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');



// Use EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));



// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }  // Session expires in 24 hours
}));


// Middleware to fetch user data for every request (if logged in)
app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId);
        if (user) {
            req.user = user;
        }
    }
    next();
});


// Routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', adminRoutes);
app.use('/', orderRoutes);


// Default route (optional - could redirect to /products)
app.get('/', (req, res) => {
    res.redirect('/products');  // Or render a homepage view
});

// Error handling middleware (add this at the end)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!'); // Or render an error page
});


// Start Server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});