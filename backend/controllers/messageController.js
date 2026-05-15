const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    // Safety Check: Employees can't chat with other employees
    const sender = await User.findById(req.user.id);
    const recipient = await User.findById(recipientId);
    
    if (sender.role === 'employee' && recipient.role === 'employee') {
      return res.status(403).json({ message: 'Peer-to-peer chat is disabled.' });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content
    });
    
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conversation between current user and another user
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark as read
    await Message.updateMany(
      { sender: userId, recipient: req.user.id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get list of people current user has chatted with
exports.getChatList = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }]
    }).sort({ createdAt: -1 });

    const userIds = new Set();
    messages.forEach(m => {
      userIds.add(m.sender.toString());
      userIds.add(m.recipient.toString());
    });
    userIds.delete(req.user.id.toString());

    const chatPartners = await User.find({ _id: { $in: Array.from(userIds) } })
      .select('name role department designation');
      
    res.json(chatPartners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
