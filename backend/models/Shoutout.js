const mongoose = require('mongoose');

const shoutoutSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  pointsGifted: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Shoutout', shoutoutSchema);
