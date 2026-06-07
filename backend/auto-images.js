const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';

(async () => {
    try {
        console.log('🔗 Connecting to Database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to Database!');

        console.log('🔍 Fetching all products...');
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products. Updating images...`);

        let updatedCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            
            // Creating a keyword from category to get a relevant image
            let keyword = product.category ? product.category.toLowerCase().replace(/\s+/g, ',') : 'product';
            
            // Add a random number to avoid caching the exact same image for the same category
            const randomNum = Math.floor(Math.random() * 10000);
            const newImageUrl = `https://loremflickr.com/400/400/${keyword}?random=${randomNum}`;

            // Update the image and images array
            product.image = newImageUrl;
            if (!product.images || product.images.length === 0) {
                product.images = [newImageUrl];
            } else {
                product.images[0] = newImageUrl; 
            }
            
            await product.save();
            updatedCount++;
            
            if (updatedCount % 50 === 0) {
                console.log(`⏳ Updated ${updatedCount} products...`);
            }
        }

        console.log(`\n🎉 MISSION SUCCESS! Automatically set images for ${updatedCount} products from the internet.`);
        console.log('👉 Agar koi image pasand nahi aati hai, toh aap Admin Panel mein jaakar use aasaani se Edit kar sakti hain!');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err);
        process.exit(1);
    }
})();
