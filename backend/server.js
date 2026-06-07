const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Search = require('./models/Search');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const multer = require('multer');
const fs = require('fs');

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

// Configure multer for local file uploads

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizeName = file.originalname.replace(/\s+/g, '-');
        cb(null, uniqueSuffix + '-' + sanitizeName);
    }
});
const upload = multer({ storage });


const app = express();
app.use(cors());
app.use(express.json());

// Serve the admin dashboard statically and uploaded images
const path = require('path');
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log(`[MongoDB] Connected successfully to ${MONGO_URI}`);
        await Admin.createDefault(); // Seed default admin if not exists
    })
    .catch((err) => console.error('[MongoDB] Connection error:', err));

// ─── Admin Auth Middleware ───────────────────────────────────────────────────
const ADMIN_SECRET = 'apnastore_admin_secret_2024';

function generateToken(username) {
    const payload = JSON.stringify({ username, exp: Date.now() + 24 * 60 * 60 * 1000 });
    const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
    return Buffer.from(payload).toString('base64') + '.' + sig;
}

function verifyToken(token) {
    try {
        const [payloadB64, sig] = token.split('.');
        const payload = Buffer.from(payloadB64, 'base64').toString();
        const expectedSig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
        if (sig !== expectedSig) return null;
        const data = JSON.parse(payload);
        if (Date.now() > data.exp) return null;
        return data;
    } catch { return null; }
}

function adminAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.slice(7);
    const data = verifyToken(token);
    if (!data) return res.status(401).json({ error: 'Invalid or expired token' });
    req.admin = data;
    next();
}

// ─── Admin Auth Routes ───────────────────────────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
        const hash = Admin.hashPassword(password);
        if (hash !== admin.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
        const token = generateToken(username);
        res.json({ token, username });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/admin/verify', adminAuth, (req, res) => {
    res.json({ ok: true, username: req.admin.username });
});

// ─── Admin Stats ─────────────────────────────────────────────────────────────
app.get('/api/admin/stats', adminAuth, async (req, res) => {
    try {
        const [totalProducts, totalOrders, orders] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find().sort({ date: -1 }).limit(5)
        ]);
        const revenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        res.json({
            totalProducts,
            totalOrders,
            revenue: revenue[0]?.total || 0,
            recentOrders: orders
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// ─── Admin Product Routes ─────────────────────────────────────────────────────
// Get all products (admin — no limit)
app.get('/api/admin/products', adminAuth, async (req, res) => {
    try {
        const { search, category, page = 1, limit = 20 } = req.query;
        let query = {};
        if (search) query.$text = { $search: search };
        if (category) {
            const catBase = category.replace(/s$/i, '');
            query.category = new RegExp('^' + catBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?$', 'i');
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [products, total] = await Promise.all([
            Product.find(query).sort({ _id: -1 }).skip(skip).limit(parseInt(limit)),
            Product.countDocuments(query)
        ]);
        res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Add new product
app.post('/api/admin/products', adminAuth, upload.single('imageFile'), async (req, res) => {
    try {
        const data = req.body;
        if (!data.title || !data.price || !data.category) {
            return res.status(400).json({ error: 'Title, price, and category are required' });
        }
        data.id = `admin_${Date.now()}`;
        if (req.file) {
            data.image = `http://localhost:5000/uploads/${req.file.filename}`;
            data.images = [data.image];
        }
        const product = new Product(data);
        await product.save();
        res.status(201).json({ message: 'Product created', product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create product: ' + err.message });
    }
});

// Update product
app.put('/api/admin/products/:id', adminAuth, upload.single('imageFile'), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.image = `http://localhost:5000/uploads/${req.file.filename}`;
            data.images = [data.image];
        }
        const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated', product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/admin/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ─── Admin Order Routes ───────────────────────────────────────────────────────
// Get all orders (admin)
app.get('/api/admin/orders', adminAuth, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = {};
        if (status) query.status = status;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [orders, total] = await Promise.all([
            Order.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
            Order.countDocuments(query)
        ]);
        res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order status
app.put('/api/admin/orders/:id', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order status updated', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Delete order
app.delete('/api/admin/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

// ─── Change Admin Password ────────────────────────────────────────────────────
app.put('/api/admin/password', adminAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findOne({ username: req.admin.username });
        if (Admin.hashPassword(currentPassword) !== admin.passwordHash) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        admin.passwordHash = Admin.hashPassword(newPassword);
        await admin.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// ─── Existing Public Routes ───────────────────────────────────────────────────
const { scrapeFlipkart } = require('./utils/scraper');

app.get('/api/products', async (req, res) => {
    try {
        const { q, category, sort, brand } = req.query;
        let query = {};
        let products = [];

        let sortOption = { _id: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        else if (sort === 'price-high') sortOption = { price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };

        if (q) {
            products = await Product.find({ $text: { $search: q } }).sort(sortOption).limit(60);
            if (products.length === 0) {
                console.log(`[API] DB empty for "${q}". Fetching from Flipkart/Amazon/Myntra...`);
                try {
                    await Promise.race([
                        scrapeFlipkart(q),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
                    ]);
                    products = await Product.find({ $text: { $search: q } }).sort(sortOption).limit(60);
                } catch (err) {
                    console.error("[API] Multi-site scraper failed/timed out:", err.message);
                }
            }
            try { await Search.create({ query: q }); } catch (err) { }
        } else {
            if (category) {
                const catBase = category.replace(/s$/i, '');
                const escaped = catBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                query.category = new RegExp('^' + escaped + 's?$', 'i');
            }
            if (brand) {
                const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                query.brand = new RegExp('^' + escaped + '$', 'i');
            }
            products = await Product.find(query).sort(sortOption).limit(60);
        }

        console.log(`[API] Returning ${products.length} products for query "${q || category || 'all'}"`);
        res.json(products);
    } catch (error) {
        console.error("API ERROR:", error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/scrape', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Query is required" });
        const result = await scrapeFlipkart(q);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { user, items, totalPrice } = req.body;
        if (!user || items.length === 0) return res.status(400).json({ error: 'Invalid order data' });
        const order = new Order({ user, items, totalPrice });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to place order' });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ error: 'User email is required' });
        const orders = await Order.find({ 'user.email': email }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Meta-Search backend running on http://localhost:${PORT}`));
