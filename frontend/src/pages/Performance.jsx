import React, { useState, useEffect } from 'react';
import { performanceAPI } from '../api';
import { 
  Trophy, 
  Target, 
  BarChart, 
  Star, 
  Shield, 
  Zap,
  Activity
} from 'lucide-react';

export default function Performance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    performanceAPI.getMine().then(res => setData(res.data)).catch(console.error);
  }, []);

  const metrics = [
    { label: 'Work Efficiency', value: '92%', icon: <Zap size={20} />, color: 'var(--primary-light)' },
    { label: 'Task Completion', value: '88%', icon: <Target size={20} />, color: 'var(--green)' },
    { label: 'Collaboration', value: '95%', icon: <Activity size={20} />, color: 'var(--gold)' },
  ];

  const badges = [
    { name: 'Early Bird', level: 'Gold', icon: <Star size={24} />, desc: '7 days early check-in' },
    { name: 'Team Player', level: 'Silver', icon: <Shield size={24} />, desc: '5 peer appreciations' },
    { name: 'Top Performer', level: 'Bronze', icon: <Trophy size={24} />, desc: 'Monthly efficiency > 90%' },
  ];

  return (
    <div className="performance-page">
      <header className="page-header">
        <h1>Performance & Growth</h1>
        <p>Monitor your professional metrics and earned recognitions.</p>
      </header>

      <div className="stats-grid">
        {metrics.map((m, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: m.color + '22', color: m.color, padding: '0.75rem', borderRadius: '12px' }}>
              {m.icon}
            </div>
            <div>
              <div className="text-muted text-sm">{m.label}</div>
              <div className="font-bold" style={{ fontSize: '1.25rem' }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2 mt-3">
        <div className="card">
          <div className="card-title">Earned Badges</div>
          <div className="badges-grid mt-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {badges.map((b, i) => (
              <div key={i} className="stat-card" style={{ padding: '1rem', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ color: b.level === 'Gold' ? 'var(--gold)' : b.level === 'Silver' ? 'var(--silver)' : 'var(--bronze)', marginBottom: '0.5rem' }}>
                  {b.icon}
                </div>
                <div className="font-bold text-sm">{b.name}</div>
                <div className={`tier-badge tier-${b.level}`} style={{ fontSize: '0.6rem', marginTop: '0.25rem' }}>{b.level}</div>
                <div className="text-muted text-sm mt-1" style={{ fontSize: '0.7rem' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Performance Log (Last 6 Months)</div>
          <div className="table-wrap mt-2">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Overall</th>
                  <th>Target</th>
                  <th>Quality</th>
                  <th>Teamwork</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map((item) => (
                  <tr key={item._id}>
                    <td className="font-bold">{item.month}</td>
                    <td style={{ color: 'var(--primary-light)' }} className="font-bold">{item.overallScore}%</td>
                    <td>{item.targetAchievement}%</td>
                    <td>{item.qualityScore}%</td>
                    <td>{item.teamworkScore}%</td>
                    <td className="text-xs text-muted" style={{ maxWidth: '200px' }}>{item.managerNotes}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }} className="text-muted">No logs available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
