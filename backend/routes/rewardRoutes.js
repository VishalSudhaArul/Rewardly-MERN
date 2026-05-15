const router = require('express').Router();
const { 
  calculateReward, 
  getMyRewards, 
  getAllRewards, 
  approveReward, 
  getDashboardStats,
  redeemPoints,
  giveBonusPoints,
  giftPoints,
  getRedemptions,
  approveRedemption
} = require('../controllers/rewardController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/calculate', protect, adminOnly, calculateReward);
router.post('/redeem', protect, redeemPoints);
router.post('/bonus', protect, adminOnly, giveBonusPoints);
router.post('/gift', protect, giftPoints);
router.get('/redemptions', protect, getRedemptions);
router.get('/me', protect, getMyRewards);
router.get('/all', protect, adminOnly, getAllRewards);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.patch('/:id/approve', protect, adminOnly, approveReward);
router.patch('/redemptions/:id/approve', protect, adminOnly, approveRedemption);

module.exports = router;
