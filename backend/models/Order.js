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
    enum: ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  expectedDelivery: {
    type: Date,
    default: () => new Date(+new Date() + 3*24*60*60*1000) // Default 3 days from now
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
