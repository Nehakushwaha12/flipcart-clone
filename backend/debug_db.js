const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = 'mongodb://127.0.0.1:27017/flipkart_clone';

(async () => {
    await mongoose.connect(MONGO_URI);
    const products = await Product.find({}).limit(5);
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
})();
