const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  dailyEarning: { type: Number, default: 2500 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', productSchema);
