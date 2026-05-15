const User = require('../models/User');
const Shoutout = require('../models/Shoutout');
const Performance = require('../models/Performance');
const Attendance = require('../models/Attendance');

exports.checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const currentBadges = user.badges.map(b => b.name);
    const newBadges = [];

    // 1. Social Butterfly (Sent 3 shoutouts)
    if (!currentBadges.includes('Social Butterfly')) {
      const shoutoutCount = await Shoutout.countDocuments({ fromUser: userId });
      if (shoutoutCount >= 3) {
        newBadges.push({ name: 'Social Butterfly', icon: 'MessageSquare' });
      }
    }

    // 2. Early Bird (5 early check-ins)
    if (!currentBadges.includes('Early Bird')) {
      const earlyCount = await Attendance.countDocuments({ 
        employee: userId, 
        checkIn: { $lt: '09:15:00' } 
      });
      if (earlyCount >= 5) {
        newBadges.push({ name: 'Early Bird', icon: 'Clock' });
      }
    }

    // 3. High Achiever (Performance score > 90)
    if (!currentBadges.includes('High Achiever')) {
      const highPerf = await Performance.findOne({ employee: userId, overallScore: { $gte: 90 } });
      if (highPerf) {
        newBadges.push({ name: 'High Achiever', icon: 'Zap' });
      }
    }

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
      await user.save();
      return newBadges;
    }
  } catch (err) {
    console.error('Badge awarding error:', err);
  }
  return [];
};
