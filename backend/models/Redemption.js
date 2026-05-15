const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewardItem: { type: String, required: true },
  pointsSpent: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Delivered'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Redemption', redemptionSchema);
