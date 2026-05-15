const Reward = require('../models/Reward');
const Attendance = require('../models/Attendance');
const Performance = require('../models/Performance');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { checkAndAwardBadges } = require('./badgeController');
const { createNotification } = require('./notificationController');

const getTier = (points) => {
  if (points >= 90) return { tier: 'Gold', bonus: 5000 };
  if (points >= 75) return { tier: 'Silver', bonus: 2500 };
  if (points >= 60) return { tier: 'Bronze', bonus: 1000 };
  return { tier: 'Standard', bonus: 0 };
};

// Calculate and save reward for an employee for a month
exports.calculateReward = async (req, res) => {
  try {
    const { employeeId, month } = req.body;

    // Attendance points (40%)
    const attRecords = await Attendance.find({ employee: employeeId, date: { $regex: month } });
    const totalWorkingDays = 26;
    const presentDays = attRecords.filter(r => r.status === 'Present').length;
    const lateDays = attRecords.filter(r => r.status === 'Late').length;
    const attendanceScore = Math.min(100, ((presentDays + lateDays * 0.5) / totalWorkingDays) * 100);
    const attendancePoints = attendanceScore * 0.4;

    // Performance points (40%)
    const perf = await Performance.findOne({ employee: employeeId, month });
    const perfScore = perf ? perf.overallScore : 0;
    const performancePoints = perfScore * 0.4;

    // Feedback points (20%)
    const feedbacks = await Feedback.find({ toEmployee: employeeId, month });
    const avgFeedback = feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) * 20
      : 0;
    const feedbackPoints = avgFeedback * 0.2;

    const totalPoints = Math.round((attendancePoints + performancePoints + feedbackPoints) * 100) / 100;
    const { tier, bonus } = getTier(totalPoints);

    let reward = await Reward.findOne({ employee: employeeId, month });
    const oldPoints = reward ? reward.totalPoints : 0;

    if (reward) {
      Object.assign(reward, { attendancePoints, performancePoints, feedbackPoints, totalPoints, tier, bonusAmount: bonus });
      await reward.save();
    } else {
      reward = await Reward.create({ employee: employeeId, month, attendancePoints, performancePoints, feedbackPoints, totalPoints, tier, bonusAmount: bonus });
    }

    // Update user tier and cumulative points
    const user = await User.findById(employeeId);
    if (user) {
      const diff = totalPoints - oldPoints;
      user.rewardPoints = Math.round((user.rewardPoints + diff) * 100) / 100;
      user.pointsEarned = Math.round((user.pointsEarned + Math.max(0, diff)) * 100) / 100;
      user.tier = tier;
      await user.save();
      await checkAndAwardBadges(employeeId);
      await createNotification(employeeId, 'Monthly Rewards Calculated', `Your rewards for ${month} have been calculated. You earned ${totalPoints} points!`, 'reward');
    }

    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my rewards
exports.getMyRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ employee: req.user.id }).sort({ month: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all rewards (admin)
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find()
      .populate('employee', 'name department designation')
      .sort({ month: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve reward (admin)
exports.approveReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved', approvedBy: req.user.id },
      { new: true }
    );
    await createNotification(reward.employee, 'Monthly Reward Approved', `Your reward for ${reward.month} has been approved by admin.`, 'reward');
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard stats (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const allRewards = await Reward.find().populate('employee', 'name department');
    const tierCounts = { Gold: 0, Silver: 0, Bronze: 0, Standard: 0 };
    allRewards.forEach(r => { tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1; });
    const totalBonus = allRewards.reduce((sum, r) => sum + r.bonusAmount, 0);
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const users = await User.find({ role: 'employee' });
    const totalPointsIssued = users.reduce((sum, u) => sum + (u.pointsEarned || 0), 0);

    const deptStats = {};
    users.forEach(u => {
      if (!deptStats[u.department]) deptStats[u.department] = { points: 0, count: 0 };
      deptStats[u.department].points += (u.rewardPoints || 0);
      deptStats[u.department].count += 1;
    });
    
    const deptData = Object.keys(deptStats).map(dept => ({
      name: dept,
      avgPoints: Math.round(deptStats[dept].points / deptStats[dept].count),
      employees: deptStats[dept].count
    }));
    
    res.json({ tierCounts, totalBonus, totalEmployees, totalRewards: allRewards.length, totalPoints: totalPointsIssued, deptData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Redemption = require('../models/Redemption');

// Redeem points for an item
exports.redeemPoints = async (req, res) => {
  try {
    const { item, points } = req.body;
    const user = await User.findById(req.user.id);

    if (user.rewardPoints < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points
    user.rewardPoints -= points;
    await user.save();

    // Create redemption record
    const redemption = await Redemption.create({
      employee: req.user.id,
      rewardItem: item,
      pointsSpent: points,
      status: 'Pending'
    });

    res.status(201).json({ message: 'Redemption successful', redemption, currentPoints: user.rewardPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Give bonus points (Admin/Manager)
exports.giveBonusPoints = async (req, res) => {
  try {
    const { employeeId, points, reason } = req.body;
    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bonus = parseInt(points);
    user.rewardPoints = Math.round((user.rewardPoints + bonus) * 100) / 100;
    user.pointsEarned = Math.round((user.pointsEarned + bonus) * 100) / 100;
    await user.save();

    await createNotification(employeeId, 'Bonus Points Received!', `${points} points have been added to your balance for: ${reason}`, 'reward');

    res.json({ message: `Success! ${points} points added to ${user.name}`, currentPoints: user.rewardPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all redemptions
exports.getRedemptions = async (req, res) => {
  try {
    const query = req.user.role === 'employee' ? { employee: req.user.id } : {};
    const redemptions = await Redemption.find(query)
      .populate('employee', 'name department')
      .sort({ createdAt: -1 });
    res.json(redemptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve redemption (admin)
exports.approveRedemption = async (req, res) => {
  try {
    const redemption = await Redemption.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.json(redemption);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
