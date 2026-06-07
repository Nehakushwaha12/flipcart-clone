const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';

(async () => {
    try {
        console.log('🔗 Connecting to Database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to Database!');

        console.log('🌐 Fetching all products from DummyJSON...');
        const response = await fetch('https://dummyjson.com/products?limit=0');
        const data = await response.json();
        const dummyProducts = data.products;
        console.log(`📦 Fetched ${dummyProducts.length} real products from DummyJSON.`);

        console.log('🔍 Fetching your existing products...');
        const myProducts = await Product.find({});
        console.log(`📦 Found ${myProducts.length} products in your database.`);

        let updatedCount = 0;

        for (let product of myProducts) {
            // Prepare search keywords from your product (Category, Subcategory, and Title words)
            let searchTerms = [];
            if (product.subcategory) searchTerms.push(...product.subcategory.toLowerCase().split(' '));
            if (product.category) searchTerms.push(...product.category.toLowerCase().split(' '));
            if (product.title) searchTerms.push(...product.title.toLowerCase().split(' '));

            // Filter out small common words
            searchTerms = searchTerms.filter(word => word.length > 3);

            let foundImageUrl = null;

            // Try to find a matching product in DummyJSON
            for (let dummy of dummyProducts) {
                const dummyText = (dummy.title + ' ' + dummy.category + ' ' + (dummy.tags ? dummy.tags.join(' ') : '')).toLowerCase();
                
                // Special mapping for Indian terms to DummyJSON terms
                const specialMatches = {
                    'mobile': 'smartphones',
                    'phone': 'smartphones',
                    'tshirt': 'shirts',
                    'shirt': 'shirts',
                    'jeans': 'mens-shirts',
                    'saree': 'womens-dresses',
                    'kurti': 'womens-dresses',
                    'watch': 'watches',
                    'bag': 'bags',
                    'sneaker': 'shoes',
                    'shoe': 'shoes',
                    'makeup': 'skincare',
                    'beauty': 'skincare',
                    'furniture': 'furniture'
                };

                let isMatch = false;
                for (let term of searchTerms) {
                    let checkTerm = specialMatches[term] || term;
                    if (dummyText.includes(checkTerm)) {
                        isMatch = true;
                        break;
                    }
                }

                if (isMatch) {
                    foundImageUrl = dummy.thumbnail || dummy.images[0];
                    break;
                }
            }

            // If a match is found, ONLY update the images
            if (foundImageUrl) {
                product.image = foundImageUrl;
                if (!product.images || product.images.length === 0) {
                    product.images = [foundImageUrl];
                } else {
                    product.images[0] = foundImageUrl;
                }
                await product.save();
                updatedCount++;
            }
        }

        console.log(`\n🎉 MISSION SUCCESS! Mapped DummyJSON photos to ${updatedCount} products.`);
        console.log(`ℹ️ Jo products match nahi hue, unme unki purani photo hi rehne di gayi hai.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err);
        process.exit(1);
    }
})();
