const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';

(async () => {
    try {
        console.log('🔗 Connecting to Database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to Database!');

        console.log('🗑️ Wiping old products...');
        await Product.deleteMany({});

        console.log('🌐 Fetching real products from DummyJSON...');
        // Using native fetch API
        const response = await fetch('https://dummyjson.com/products?limit=0');
        const data = await response.json();
        const dummyProducts = data.products;

        console.log(`📦 Found ${dummyProducts.length} products. Mapping data...`);

        const productsToInsert = dummyProducts.map(dp => {
            const timestamp = Date.now();
            const discount = Math.floor(dp.discountPercentage || 10);
            
            // DummyJSON prices are in USD, let's roughly convert them to INR (approx 83 multiplier)
            const priceInINR = Math.floor(dp.price * 83);
            const originalPriceInINR = Math.floor(priceInINR * (100 / (100 - discount)));

            return {
                id: `dummy_${dp.id}_${timestamp}`,
                title: dp.title,
                description: dp.description,
                price: priceInINR,
                originalPrice: originalPriceInINR,
                discount: discount,
                rating: dp.rating || 4.5,
                reviewCount: Math.floor(Math.random() * 500) + 50,
                category: dp.category.charAt(0).toUpperCase() + dp.category.slice(1),
                subcategory: dp.category,
                brand: dp.brand || 'Premium Brand',
                image: dp.thumbnail || (dp.images && dp.images[0]),
                images: dp.images && dp.images.length > 0 ? dp.images : [dp.thumbnail],
                isAssured: true,
                sellerType: 'Apna Assured',
                isEcoFriendly: false,
                isBudgetFriendly: priceInINR < 2000,
                stock: dp.stock || 50,
                source: 'DummyJSON',
                tags: dp.tags || [dp.category]
            };
        });

        console.log('💾 Saving real products and photos to MongoDB...');
        await Product.insertMany(productsToInsert);
        
        console.log(`🎉 MISSION SUCCESS! Added ${productsToInsert.length} REAL products with REAL images from DummyJSON!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err);
        process.exit(1);
    }
})();
