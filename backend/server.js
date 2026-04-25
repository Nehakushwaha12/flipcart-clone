const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Search = require('./models/Search');
const Order = require('./models/Order');
const Product = require('./models/Product');

const app = express();
app.use(cors());
app.use(express.json()); // Allow parsing JSON bodies

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';
mongoose.connect(MONGO_URI)
  .then(() => console.log(`[MongoDB] Connected successfully to ${MONGO_URI}`))
  .catch((err) => console.error('[MongoDB] Connection error:', err));

// A simple utility function to add a delay if needed
const delay = ms => new Promise(res => setTimeout(res, ms));

app.get('/api/products', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, minRating } = req.query;
        let query = {};

        if (q) {
            const searchWords = q.split(' ').map(word => ({ title: { $regex: word, $options: 'i' } }));
            
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { subcategory: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } }
            ];

            if (searchWords.length > 1) {
                // Also match products where the title contains all the words, even if out of order
                query.$or.push({ $and: searchWords });
            }
            
            // Save query to MongoDB
            try {
                await Search.create({ query: q });
            } catch (err) {
                console.error('[API] Failed to save search query to DB:', err.message);
            }
        }

        if (category) {
            query.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        if (minRating !== undefined && minRating > 0) {
            query.rating = { $gte: Number(minRating) };
        }

        console.log(`[API] Fetching products with query:`, JSON.stringify(query));
        const products = await Product.find(query).limit(100);
        res.json(products);
    } catch (error) {
        console.error("[API] Database error:", error.message);
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
});

// Get a single product by id
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error("[API] Error fetching product by id:", error.message);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Add a new order
app.post('/api/orders', async (req, res) => {
    try {
        const { user, items, totalPrice } = req.body;
        if (!user || items.length === 0) {
            return res.status(400).json({ error: 'Invalid order data' });
        }

        const order = new Order({
            user,
            items,
            totalPrice
        });

        await order.save();
        console.log(`[API] Order placed successfully for ${user.email}`);
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        console.error('[API] Error placing order:', err.message);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Get user orders
app.get('/api/orders', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: 'User email is required' });
        }

        // Return orders sorted by most recent first
        const orders = await Order.find({ 'user.email': email }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error('[API] Error fetching orders:', err.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Meta-Search backend running on http://localhost:${PORT}`));
