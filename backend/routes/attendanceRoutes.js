const router = require('express').Router();
const { checkIn, checkOut, getMyAttendance, getAllAttendance, getTodayStatus } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/me', protect, getMyAttendance);
router.get('/today', protect, getTodayStatus);
router.get('/all', protect, adminOnly, getAllAttendance);

module.exports = router;
