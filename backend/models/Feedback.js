const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // "YYYY-MM"
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  type: { type: String, enum: ['manager', 'peer', 'self'], default: 'peer' },
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Neutral' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
