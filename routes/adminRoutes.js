
const express = require('express');
const router = express.Router();
const auth = require('../auth');
const { Product } = require('../database');


router.get('/admin/dashboard', auth.ensureAdmin, async (req, res) => {
    const products = await Product.findAll();
    res.render('adminDashboard', { products, user: req.user });
});


module.exports = router;