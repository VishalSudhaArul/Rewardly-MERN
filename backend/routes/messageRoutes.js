const router = require('express').Router();
const { sendMessage, getConversation, getChatList } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/list', protect, getChatList);
router.get('/:userId', protect, getConversation);

module.exports = router;
