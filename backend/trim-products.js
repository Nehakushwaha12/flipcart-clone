const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flipkart_clone';

(async () => {
    try {
        console.log('🔗 Connecting to Database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to Database!');

        // Get all unique categories
        const categories = await Product.distinct('category');
        console.log('🔍 Categories found:', categories);

        let totalDeleted = 0;
        let totalKept = 0;

        for (const category of categories) {
            // Find all products in this category
            const products = await Product.find({ category: category });
            
            if (products.length > 30) {
                // Keep the first 30
                const productsToKeep = products.slice(0, 30);
                const productsToDelete = products.slice(30);

                const idsToDelete = productsToDelete.map(p => p._id);
                
                // Delete the rest
                await Product.deleteMany({ _id: { $in: idsToDelete } });
                
                console.log(`✅ ${category}: Kept 30, Deleted ${idsToDelete.length}`);
                totalDeleted += idsToDelete.length;
                totalKept += 30;
            } else {
                console.log(`ℹ️ ${category}: Already has ${products.length} products (No deletion needed)`);
                totalKept += products.length;
            }
        }

        console.log(`\n🎉 MISSION SUCCESS!`);
        console.log(`🗑️ Total Products Deleted: ${totalDeleted}`);
        console.log(`📦 Total Products Remaining in Database: ${totalKept}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err);
        process.exit(1);
    }
})();
