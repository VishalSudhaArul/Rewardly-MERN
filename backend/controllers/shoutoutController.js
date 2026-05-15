const Shoutout = require('../models/Shoutout');
const User = require('../models/User');
const { checkAndAwardBadges } = require('./badgeController');
const { createNotification } = require('./notificationController');

exports.createShoutout = async (req, res) => {
  try {
    const { toUserId, message, points } = req.body;
    const fromUserId = req.user.id;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "You can't give a shoutout to yourself!" });
    }

    const fromUser = await User.findById(fromUserId);
    if (points > 0 && fromUser.rewardPoints < points) {
      return res.status(400).json({ message: "Insufficient points to gift" });
    }

    const shoutout = await Shoutout.create({
      fromUser: fromUserId,
      toUser: toUserId,
      message,
      pointsGifted: points || 0
    });

    // Update points
    if (points > 0) {
      fromUser.rewardPoints -= points;
      await fromUser.save();

      const toUser = await User.findById(toUserId);
      toUser.rewardPoints += points;
      toUser.pointsEarned += points; // Also count as earned
      await toUser.save();
    }

    await checkAndAwardBadges(fromUserId);
    await createNotification(toUserId, 'New Shoutout Received! 🌟', `${fromUser.name} sent you a shoutout!`, 'shoutout');

    const populated = await Shoutout.findById(shoutout._id)
      .populate('fromUser', 'name avatar')
      .populate('toUser', 'name avatar');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllShoutouts = async (req, res) => {
  try {
    const shoutouts = await Shoutout.find()
      .populate('fromUser', 'name avatar department')
      .populate('toUser', 'name avatar department')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(shoutouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
