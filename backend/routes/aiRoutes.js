const router = require('express').Router();
const { getPersonalAudit } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/audit', protect, getPersonalAudit);

module.exports = router;
