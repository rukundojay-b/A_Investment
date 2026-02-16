const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  lastProfitDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }


});
module.exports = mongoose.model('Investment', investmentSchema);

