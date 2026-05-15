const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // "YYYY-MM"
  targetAchievement: { type: Number, default: 0 }, // 0-100
  qualityScore: { type: Number, default: 0 },      // 0-100
  teamworkScore: { type: Number, default: 0 },     // 0-100
  punctualityScore: { type: Number, default: 0 },  // 0-100
  overallScore: { type: Number, default: 0 },
  managerNotes: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
