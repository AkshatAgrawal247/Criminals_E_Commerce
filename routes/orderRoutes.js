const express = require('express');
const router = express.Router();
const auth = require('../auth');
const { Order, OrderItem, Product } = require('../database');


// Checkout route
router.post('/checkout', auth.ensureAuthenticated, async (req, res) => {
    try {
        if (!req.session.cart || req.session.cart.length === 0) {
            return res.redirect('/cart');  // Redirect to cart if empty
        }


        const order = await Order.create({
            userId: req.user.id,
            total: calculateCartTotal(req.session.cart), // Implement this function
            // Other order details (address, payment, etc.)
        });

        // Create order items
        for (const cartItem of req.session.cart) {
             await OrderItem.create({
                orderId: order.id,
                productId: cartItem.id,
                quantity: 1,  // Get quantity from cart if needed
                price: cartItem.price,  // Store price at time of order

            });
        }



        req.session.cart = [];  // Clear the cart

        res.redirect('/orders'); // Redirect to order history or confirmation page

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});


// Helper function to calculate cart total
function calculateCartTotal(cartItems) {
    return cartItems.reduce((total, item) => total + item.price, 0);
}



// Order history route
router.get('/orders', auth.ensureAuthenticated, async (req, res) => {
    const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [OrderItem],  // Include order items
        order: [['createdAt', 'DESC']],  // Order by most recent
    });
    res.render('orderHistory', { orders });
});



module.exports = router;