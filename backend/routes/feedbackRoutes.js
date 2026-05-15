const router = require('express').Router();
const { submitFeedback, getMyFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, submitFeedback);
router.get('/me', protect, getMyFeedback);
router.get('/all', protect, adminOnly, getAllFeedback);

module.exports = router;
