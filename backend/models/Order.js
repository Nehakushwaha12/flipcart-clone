const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  items: [
    {
      id: String,
      title: String,
      price: Number,
      image: String,
      quantity: Number
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Delivered' // Mocking "Delivered" state for demonstration based on previous hardcoded UI
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
