const express = require('express');
const router = express.Router();
const auth = require('../auth');
const { User } = require('../database');

router.get('/login', (req, res) => {
 res.render('login');
});

router.post('/login', async (req, res) => {
 const { username, password } = req.body;
 const user = await auth.authenticateUser(username, password);
 if (user) {
     req.session.userId = user.id;  // Set user ID in session upon successful login
     if (user.role === 'admin') {
         res.redirect('/admin/dashboard');
     } else {
         res.redirect('/products');
     }
 } else {
     res.render('login', { error: 'Invalid credentials' });
 }
});

router.get('/signup', (req, res) => {
 res.render('signup');
});

router.post('/signup', async (req, res) => {
 const { username, password } = req.body;
 try {
     const hashedPassword = await auth.hashPassword(password);
     await User.create({ username, password: hashedPassword });
     res.redirect('/login');
 } catch (error) {
     if (error.name === 'SequelizeUniqueConstraintError') {
         res.render('signup', { error: 'Username already taken' });
     } else {
         res.render('signup', { error: 'An error occurred' });
     }
 }
});

router.get('/logout', (req, res) => {
 req.session.destroy(err => {
     if (err) {
         return res.status(500).send('Could not log out.');
     }
     res.redirect('/login'); // Redirect to login or home page after logout
 });
});

module.exports = router;