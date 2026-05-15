const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // "YYYY-MM"
  attendancePoints: { type: Number, default: 0 },
  performancePoints: { type: Number, default: 0 },
  feedbackPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  tier: { type: String, enum: ['Gold', 'Silver', 'Bronze', 'Standard'], default: 'Standard' },
  bonusAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Approved', 'Paid'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
