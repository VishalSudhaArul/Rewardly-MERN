const router = require('express').Router();
const { getAllEmployees, getEmployee, updateEmployee, getLeaderboard } = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllEmployees);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/:id', protect, getEmployee);
router.put('/:id', protect, adminOnly, updateEmployee);

module.exports = router;
