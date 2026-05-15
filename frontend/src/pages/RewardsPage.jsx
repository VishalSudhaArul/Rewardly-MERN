import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rewardAPI } from '../api';
import { toast } from 'react-hot-toast';
import { Gift, CreditCard, ShoppingBag, Coffee, Plane, Laptop, CheckCircle2 } from 'lucide-react';

export default function RewardsPage() {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshUser();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await rewardAPI.getRedemptions();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const rewards = [
    { id: 1, name: 'Amazon Gift Card', cost: 500, icon: <CreditCard size={24} />, desc: '$50 Digital Voucher', color: '#FF9900' },
    { id: 2, name: 'Extra Vacation Day', cost: 1200, icon: <Plane size={24} />, desc: '1-day paid leave', color: '#10b981' },
    { id: 3, name: 'Premium Tech Kit', cost: 3000, icon: <Laptop size={24} />, desc: 'Mechanical Keyboard + Mouse', color: '#7c3aed' },
    { id: 4, name: 'Coffee Subscription', cost: 300, icon: <Coffee size={24} />, desc: '1 month supply', color: '#cd7c3a' },
    { id: 5, name: 'Branded Hoodie', cost: 800, icon: <ShoppingBag size={24} />, desc: 'Custom Company Swag', color: '#f59e0b' },
  ];

  const handleRedeem = async (reward) => {
    if (user?.rewardPoints < reward.cost) {
      return toast.error('Insufficient reward points');
    }
    
    setLoading(true);
    try {
      await rewardAPI.redeem({ item: reward.name, points: reward.cost });
      toast.success(`Successfully redeemed ${reward.name}!`);
      fetchHistory();
      refreshUser();
    } catch (err) {
      toast.error('Redemption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rewards-page">
      <header className="page-header">
        <h1>Rewards Marketplace</h1>
        <p>Redeem your hard-earned points for exclusive perks and items.</p>
      </header>

      <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg3), var(--primary-glow))', border: '1px solid var(--primary)', marginBottom: '2rem' }}>
        <div className="flex-between">
          <div>
            <div className="text-muted text-sm">Your Available Points</div>
            <div className="font-bold" style={{ fontSize: '2.5rem', color: 'var(--primary-light)' }}>
              {Math.round(user?.rewardPoints || 0)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>PTS</span>
            </div>
          </div>
          <Gift size={48} className="text-muted" style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="card-title">Available Rewards</div>
      <div className="stats-grid mt-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {rewards.map(reward => (
          <div key={reward.id} className="stat-card" style={{ padding: '1.5rem', justifyContent: 'space-between' }}>
            <div className="flex-between">
              <div style={{ color: reward.color, background: reward.color + '15', padding: '0.75rem', borderRadius: '12px' }}>
                {reward.icon}
              </div>
              <div className="font-bold" style={{ color: 'var(--gold)' }}>{reward.cost} PTS</div>
            </div>
            <div className="mt-2">
              <div className="font-bold">{reward.name}</div>
              <div className="text-muted text-sm">{reward.desc}</div>
            </div>
            <button 
              className={`btn ${user?.rewardPoints >= reward.cost ? 'btn-primary' : 'btn-outline'} mt-2`} 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => handleRedeem(reward)}
              disabled={user?.rewardPoints < reward.cost || loading}
            >
              {user?.rewardPoints >= reward.cost ? 'Redeem Reward' : 'Insufficient Points'}
            </button>
          </div>
        ))}
      </div>

      <div className="card mt-3">
        <div className="card-title">Redemption History</div>
        <div className="table-wrap mt-2">
          <table>
            <thead>
              <tr>
                <th>Reward Item</th>
                <th>Points Spent</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((item) => (
                <tr key={item._id}>
                  <td>{item.rewardItem}</td>
                  <td>{item.pointsSpent}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`tier-badge tier-${item.status === 'Approved' ? 'Gold' : 'Silver'}`} style={{ fontSize: '0.6rem' }}>
                      {item.status === 'Approved' && <CheckCircle2 size={10} style={{ marginRight: '4px' }} />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }} className="text-muted">No redemptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
