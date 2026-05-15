import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI, rewardAPI, performanceAPI, aiAPI } from '../api';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ShoutoutFeed from '../components/ShoutoutFeed';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    points: 0,
    attendance: 'Not Checked In',
    performance: 0,
    history: []
  });

  const [showAI, setShowAI] = useState(false);
  const [aiData, setAiData] = useState(null);

  const fetchAI = async () => {
    try {
      const res = await aiAPI.getAudit();
      setAiData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Refresh user data to get latest points
        const updatedUser = await refreshUser();
        
        const [attRes, rewRes] = await Promise.all([
          attendanceAPI.getToday(),
          rewardAPI.getMine()
        ]);
        
        const historyData = rewRes.data?.map(r => ({ name: r.month, points: Math.round(r.totalPoints) })) || [];
        setStats(prev => ({
          ...prev,
          points: updatedUser?.rewardPoints || 0,
          attendance: attRes.data?.checkIn ? 'Checked In' : 'Not Checked In',
          history: historyData.length > 0 ? historyData : [
            { name: 'Jan', points: 400 },
            { name: 'Feb', points: 650 },
            { name: 'Mar', points: 500 },
            { name: 'Apr', points: 900 },
            { name: 'May', points: updatedUser?.rewardPoints || 1200 },
          ]
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Welcome, {user?.name.split(' ')[0]}! 👋</h1>
        <p>You're in the <strong>{user?.tier}</strong> tier. Keep it up!</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label">Total Reward Points</div>
          <div className="stat-value">{Math.round(user?.rewardPoints || 0)}</div>
          <div className="stat-sub"><TrendingUp size={14} /> +12% from last month</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">Current Tier</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{user?.tier}</div>
          <div className="stat-sub"><Award size={14} /> Next: {user?.tier === 'Standard' ? 'Bronze' : user?.tier === 'Bronze' ? 'Silver' : 'Gold'}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Attendance Today</div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.attendance}</div>
          <div className="stat-sub"><Calendar size={14} /> Check-in before 10 AM</div>
        </div>
        <div className="stat-card silver">
          <div className="stat-label">Earned Badges</div>
          <div className="flex-gap mt-1" style={{ flexWrap: 'wrap' }}>
            {user?.badges?.length > 0 ? user.badges.slice(0, 3).map((b, i) => (
              <div key={i} title={b.name} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                {b.icon === 'Clock' ? <Clock size={16} className="text-primary-light" /> : 
                 b.icon === 'Zap' ? <Zap size={16} style={{ color: 'var(--gold)' }} /> : 
                 <Star size={16} style={{ color: 'var(--primary-light)' }} />}
              </div>
            )) : (
              <div className="text-muted text-xs">No badges yet</div>
            )}
            {user?.badges?.length > 3 && <div className="text-xs">+{user.badges.length - 3}</div>}
          </div>
          <div className="stat-sub"><Star size={14} /> {user?.badges?.length || 0} milestones reached</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Points Growth History</div>
          <div style={{ height: '240px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.history}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary-light)' }}
                />
                <Area type="monotone" dataKey="points" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPoints)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Public Appreciation Wall 🌟</div>
          <div className="mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <ShoutoutFeed />
          </div>
        </div>
      </div>

      <div className="card mt-3" style={{ background: 'linear-gradient(90deg, var(--bg3), var(--bg2))' }}>
        <div className="flex-between">
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>AI Productivity Insight 🤖</h3>
            <p className="text-muted">Based on your recent attendance and feedback, we recommend taking a short break today to maintain your peak performance.</p>
          </div>
          <button className="btn btn-outline" onClick={() => { setShowAI(true); fetchAI(); }}>View Analysis</button>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAI && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyCenter: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2 className="flex-gap" style={{ marginBottom: '1.5rem' }}><BrainCircuit className="text-primary-light" /> Your Personal AI Audit</h2>
            <div className="grid-2">
               <div className="stat-card purple">
                  <div className="stat-label">Personal Efficiency</div>
                  <div className="stat-value">{aiData?.efficiency || '--'}%</div>
               </div>
               <div className="stat-card green">
                  <div className="stat-label">Next Milestone</div>
                  <div className="stat-value">{aiData?.nextTier || '--'}</div>
               </div>
            </div>
            <p className="mt-3 text-muted" style={{ lineHeight: 1.6 }}>
               {aiData?.message || 'Analyzing your productivity data...'}
            </p>
            
            {aiData?.growthTasks?.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-bold text-muted mb-2 uppercase">Your Growth Roadmap</h4>
                <div className="flex-column gap-2">
                  {aiData.growthTasks.map((t, i) => (
                    <div key={i} className="flex-between p-2 rounded" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                      <span className="text-sm">{t.task}</span>
                      <span className="text-primary-light font-bold">+{t.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button className="btn btn-primary mt-3" onClick={() => setShowAI(false)} style={{ width: '100%', justifyContent: 'center' }}>Close Audit</button>
          </div>
        </div>
      )}
    </div>
  );
}

import { BrainCircuit } from 'lucide-react';

// Minimal missing component imports
import { MessageSquare } from 'lucide-react';
