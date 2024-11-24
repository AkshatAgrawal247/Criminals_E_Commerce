const express = require('express');
const app = express();
const port = 3000;

// Sample product data (replace with database later)
let products = [
    { id: 1, name: 'Printed shirt for Men', price: 899, image: 'images/shirt1.jpeg' },
    { id: 2, name: 'Beach shirt for Men', price: 899, image: 'images/shirt2.jpeg' },
    // ... more products
];

// Serve static files
app.use(express.static('public'));

// Cart data (in-memory - replace with database later)
let cart = [];



// API endpoint to get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// API endpoint to get a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Add to cart endpoint
app.post('/api/cart/add/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const product = products.find(p => p.id === productId);

    if (product) {
        cart.push(product);
        res.json({ message: 'Product added to cart', cartCount: cart.length });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Get cart contents endpoint
app.get('/api/cart', (req, res) => {
    res.json(cart);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});