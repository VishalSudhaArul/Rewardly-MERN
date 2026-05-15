const router = require('express').Router();
const { createShoutout, getAllShoutouts } = require('../controllers/shoutoutController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createShoutout);
router.get('/', protect, getAllShoutouts);

module.exports = router;
