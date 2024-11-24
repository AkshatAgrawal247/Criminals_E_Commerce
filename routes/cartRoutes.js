const express = require('express');
const router = express.Router();
const { Product } = require('../database'); // Import your Product model


// Add to cart
router.post('/api/cart/add/:productId', async (req, res) => {  // Use async/await
    const productId = parseInt(req.params.productId);
    try {
        const product = await Product.findByPk(productId); // Find product in database
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }


        if (!req.session.cart) {
            req.session.cart = [];
        }

        req.session.cart.push(product);
        res.json({ message: 'Product added to cart', cartCount: req.session.cart.length });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart' }); // Send error response as JSON
    }
});

// Get cart contents
router.get('/api/cart', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = []; // Ensure cart exists even if empty
    }
    res.json(req.session.cart);
});


module.exports = router;