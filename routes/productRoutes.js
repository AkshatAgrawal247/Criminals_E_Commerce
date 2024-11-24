const express = require('express');
const router = express.Router();
const { Product } = require('../database');
const auth = require('../auth');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
 destination: './public/images/',
 filename: function (req, file, cb) {
     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
 }
});

const upload = multer({
 storage: storage,
 limits: { fileSize: 1000000 }, // 1 MB limit
 fileFilter: function (req, file, cb) {
     checkFileType(file, cb);
 }
});

function checkFileType(file, cb) {
 const filetypes = /jpeg|jpg|png|gif/;
 const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 const mimetype = filetypes.test(file.mimetype);

 if (mimetype && extname) {
     return cb(null, true);
 } else {
     cb('Error: Images Only!');
 }
}



router.get('/products', async (req, res) => {
 const products = await Product.findAll();
 res.render('products', { products, user: req.user });
});

router.get('/products/:id', async (req, res) => {
 const product = await Product.findByPk(req.params.id);
 if (product) {
     res.render('productDetails', { product, user: req.user });
 } else {
     res.status(404).send('Product not found');
 }
});

router.get('/add-product', auth.ensureAdmin, (req, res) => {
 res.render('addProduct');
});


router.post('/add-product', upload.single('image'), auth.ensureAdmin, async (req, res) => {
    const { name, price, description } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null; // Get image path

    try {
        await Product.create({ name, price, image, description }); // Save image path
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});


router.get('/edit-product/:id', auth.ensureAdmin, async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('editProduct', { product }); // Render the editProduct view
});



router.post('/edit-product/:id', upload.single('image'), auth.ensureAdmin, async (req, res) => {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    let image = req.body.existingImage; // Use the existing image initially

    // If a new image was uploaded, update the image path
    if (req.file) {
        image = `/images/${req.file.filename}`;
    }
    try {
        await Product.update({ name, price, image, description }, { where: { id: productId } });
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send('Error updating product');
    }
});



router.post('/delete-product/:id', auth.ensureAdmin, async (req, res) => {
    const productId = req.params.id;
    try {
        await Product.destroy({ where: { id: productId } });
        res.redirect('/admin/dashboard'); // Redirect back to the admin dashboard
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send('Error deleting product');
    }
});





module.exports = router;