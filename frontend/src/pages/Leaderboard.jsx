import React, { useState, useEffect } from 'react';
import { employeeAPI, rewardAPI } from '../api';
import { Trophy, Medal, Crown, Star, Gift, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const { user: currentUser, refreshUser } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [gifting, setGifting] = useState(null);
  const [giftData, setGiftData] = useState({ points: 50, message: '' });

  const fetchLeaders = () => {
    employeeAPI.getLeaderboard().then(res => setLeaders(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleGift = async (e) => {
    e.preventDefault();
    try {
      await rewardAPI.giftPoints({
        recipientId: gifting._id,
        points: parseInt(giftData.points),
        message: giftData.message || `Great work on the leaderboard, ${gifting.name}!`
      });
      toast.success(`Gifted ${giftData.points} points to ${gifting.name}!`);
      setGifting(null);
      setGiftData({ points: 50, message: '' });
      fetchLeaders();
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gifting failed');
    }
  };

  return (
    <div className="leaderboard-page">
      <header className="page-header">
        <h1>Wall of Fame</h1>
        <p>Top performers in the reward ecosystem this month.</p>
      </header>

      <div className="card">
        <div className="card-title">Top 10 Performers</div>
        <div className="leaderboard-list mt-2">
          {leaders.length > 0 ? leaders.map((user, i) => (
            <div key={user._id} className="leaderboard-item">
              <div className={`rank rank-${i + 1}`}>
                {i === 0 ? <Crown size={24} /> : i === 1 ? <Medal size={24} /> : i === 2 ? <Medal size={24} /> : i + 1}
              </div>
              <div className="avatar">
                {user.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div className="font-bold">{user.name}</div>
                <div className="text-muted text-sm">{user.department} • {user.designation}</div>
              </div>
              
              <div className="flex-gap" style={{ marginRight: '1rem' }}>
                <span className={`tier-badge tier-${user.tier}`}>{user.tier}</span>
                {currentUser?._id !== user._id && (
                  <button className="btn btn-outline" style={{ padding: '0.4rem', height: 'auto' }} onClick={() => setGifting(user)} title="Gift Points">
                    <Gift size={16} className="text-primary-light" />
                  </button>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-bold" style={{ color: 'var(--primary-light)' }}>{Math.round(user.rewardPoints)}</div>
                <div className="text-muted text-sm">Points</div>
              </div>
            </div>
          )) : (
            <div className="text-muted" style={{ textAlign: 'center', padding: '3rem' }}>
              Calculating leaderboard...
            </div>
          )}
        </div>
      </div>

      {/* Gifting Modal */}
      {gifting && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card animate-pop" style={{ maxWidth: '440px', width: '90%' }}>
            <h2 className="flex-gap" style={{ marginBottom: '1rem' }}><Gift className="text-primary-light" /> Gift Kudos to {gifting.name}</h2>
            <p className="text-muted text-sm mb-3">Send points from your own balance to appreciate their hard work.</p>
            
            <form onSubmit={handleGift}>
              <div className="form-group">
                <label>Points to Gift</label>
                <select value={giftData.points} onChange={(e) => setGiftData({ ...giftData, points: e.target.value })}>
                  <option value="10">10 Points</option>
                  <option value="25">25 Points</option>
                  <option value="50">50 Points</option>
                  <option value="100">100 Points</option>
                </select>
              </div>
              <div className="form-group">
                <label>Appreciation Message</label>
                <textarea 
                  placeholder="e.g. Great work on the last project!"
                  value={giftData.message}
                  onChange={(e) => setGiftData({ ...giftData, message: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className="grid-2 mt-2">
                <button type="button" className="btn btn-outline" onClick={() => setGifting(null)} style={{ justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={16} /> Send Kudos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-3 grid-2">
        <div className="card" style={{ background: 'var(--bg2)', textAlign: 'center' }}>
          <Star size={32} className="text-muted" style={{ marginBottom: '0.5rem' }} />
          <div className="font-bold">Most Consistent</div>
          <div className="text-muted text-sm">Employee with most check-ins</div>
        </div>
        <div className="card" style={{ background: 'var(--bg2)', textAlign: 'center' }}>
          <Trophy size={32} className="text-muted" style={{ marginBottom: '0.5rem' }} />
          <div className="font-bold">Team Spirit</div>
          <div className="text-muted text-sm">Most peer appreciations sent</div>
        </div>
      </div>
    </div>
  );
}
