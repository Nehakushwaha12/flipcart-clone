const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String },
    image: { type: String },
    images: [{ type: String }],
    isAssured: { type: Boolean, default: false },
    sellerType: { type: String, default: 'Flipkart Assured' },
    isEcoFriendly: { type: Boolean, default: false },
    isBudgetFriendly: { type: Boolean, default: false },
    subcategory: { type: String, default: '' },
    tags: [{ type: String }],
});

// Adding text index for search functionality
productSchema.index({ title: 'text', category: 'text', brand: 'text', subcategory: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
