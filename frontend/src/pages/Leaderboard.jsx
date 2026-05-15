import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../api';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    employeeAPI.getLeaderboard().then(res => setLeaders(res.data)).catch(console.error);
  }, []);

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
