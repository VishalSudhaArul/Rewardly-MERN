const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager', 'admin'], default: 'employee' },
  department: { type: String, default: '' },
  designation: { type: String, default: '' },
  avatar: { type: String, default: '' },
  rewardPoints: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  tier: { type: String, enum: ['Gold', 'Silver', 'Bronze', 'Standard'], default: 'Standard' },
  badges: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
