const Feedback = require('../models/Feedback');

const getSentiment = (rating) => {
  if (rating >= 4) return 'Positive';
  if (rating === 3) return 'Neutral';
  return 'Negative';
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { toEmployee, month, rating, comment, type } = req.body;
    const sentiment = getSentiment(rating);
    const feedback = await Feedback.create({
      fromUser: req.user.id, toEmployee, month, rating, comment, type, sentiment
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get feedback received by me
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ toEmployee: req.user.id })
      .populate('fromUser', 'name role')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all feedback (admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('fromUser', 'name role')
      .populate('toEmployee', 'name department')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
