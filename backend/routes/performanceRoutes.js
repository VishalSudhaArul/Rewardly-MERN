const router = require('express').Router();
const { submitPerformance, getMyPerformance, getAllPerformance } = require('../controllers/performanceController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, adminOnly, submitPerformance);
router.get('/me', protect, getMyPerformance);
router.get('/all', protect, adminOnly, getAllPerformance);

module.exports = router;
