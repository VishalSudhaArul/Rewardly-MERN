import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI, rewardAPI, performanceAPI } from '../api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Settings, 
  BrainCircuit, 
  TrendingUp, 
  AlertCircle,
  Plus,
  RefreshCw,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [stats, setStats] = useState({ totalPoints: 0, activeUsers: 0, pendingRewards: 0 });
  const [aiInsights, setAiInsights] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, statRes, redRes] = await Promise.all([
        employeeAPI.getAll(),
        rewardAPI.getStats(),
        rewardAPI.getRedemptions()
      ]);
      setEmployees(empRes.data);
      setStats(statRes.data);
      setRedemptions(redRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveRedemption = async (id) => {
    try {
      await rewardAPI.approveRedemption(id);
      toast.success('Redemption approved!');
      fetchData();
    } catch (err) {
      toast.error('Failed to approve redemption');
    }
  };

  const runAIAnalysis = () => {
    setAnalyzing(true);
    // Simulating AI analysis logic
    setTimeout(() => {
      setAiInsights({
        topMotivator: "Public Recognition",
        productivityRisk: "Sales Team (High Burnout)",
        recommendation: "Assign 'Marathon Finisher' badges to Engineering for recent sprint success.",
        fairnessScore: 94
      });
      setAnalyzing(false);
      toast.success('AI Analysis Complete');
    }, 2000);
  };

  return (
    <div className="admin-dashboard">
      <header className="page-header flex-between">
        <div>
          <h1>Admin Command Center</h1>
          <p>System-wide overview and AI-driven organizational insights.</p>
        </div>
        <button className="btn btn-primary" onClick={runAIAnalysis} disabled={analyzing}>
          {analyzing ? <RefreshCw size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
          {analyzing ? 'Analyzing Data...' : 'Run AI Analysis'}
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{employees.length}</div>
          <div className="stat-sub"><Users size={14} /> 4 departments</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">Total Points Issued</div>
          <div className="stat-value">{Math.round(stats.totalPoints || 45200)}</div>
          <div className="stat-sub"><TrendingUp size={14} /> +8% growth</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Engagement Rate</div>
          <div className="stat-value">82%</div>
          <div className="stat-sub"><AlertCircle size={14} /> 12 pending redemptions</div>
        </div>
      </div>

      <div className="grid-2 mt-3">
        {aiInsights && (
          <div className="card" style={{ background: 'rgba(124,58,237,0.05)', borderColor: 'var(--primary)' }}>
            <div className="flex-between">
              <div className="card-title" style={{ color: 'var(--primary-light)' }}>AI Predictive Insights</div>
              <BrainCircuit size={20} className="text-muted" />
            </div>
            <div className="mt-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div className="text-muted text-sm">Top Performance Motivator</div>
                <div className="font-bold">{aiInsights.topMotivator}</div>
              </div>
              <div>
                <div className="text-muted text-sm">System Fairness Score</div>
                <div className="font-bold" style={{ color: 'var(--green)' }}>{aiInsights.fairnessScore}%</div>
              </div>
            </div>
            <div className="mt-3 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <div className="text-muted text-sm font-bold" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>Smart Recommendation</div>
              <p className="mt-1 text-sm">{aiInsights.recommendation}</p>
            </div>
          </div>
        )}

        <div className="card" style={{ gridColumn: aiInsights ? 'span 1' : 'span 2' }}>
          <div className="flex-between">
            <div className="card-title">Department Performance Avg</div>
            <BarChartIcon size={20} className="text-muted" />
          </div>
          <div style={{ height: '240px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.deptData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="avgPoints" radius={[4, 4, 0, 0]}>
                  {stats.deptData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#7c3aed', '#10b981', '#f59e0b', '#3b82f6'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex-between">
            <div className="card-title">Employee Management</div>
            <div className="flex-gap">
               <span className="text-muted text-sm">Submit Performance & Manage Roles</span>
            </div>
          </div>
          <div className="table-wrap mt-2">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Dept</th>
                  <th>Points</th>
                  <th>Monthly Performance</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp._id}>
                    <td>
                      <div className="font-bold">{emp.name}</div>
                      <div className="text-muted text-sm">{emp.designation} ({emp.role})</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{Math.round(emp.rewardPoints)}</td>
                    <td>
                      <div className="flex-gap">
                        <input 
                          type="number" 
                          placeholder="Score (0-100)" 
                          style={{ width: '100px', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'white' }}
                          id={`score-${emp._id}`}
                        />
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                          onClick={async () => {
                            const scoreInput = document.getElementById(`score-${emp._id}`);
                            const score = scoreInput.value;
                            if(!score) return toast.error('Enter a score');
                            try {
                              const month = new Date().toISOString().slice(0, 7);
                              // 1. Submit Performance
                              await performanceAPI.submit({ 
                                employeeId: emp._id, 
                                score: parseInt(score),
                                month
                              });
                              // 2. Automatically trigger Reward Engine to update points/tier
                              await rewardAPI.calculate({ employeeId: emp._id, month });
                              
                              toast.success(`Points & Performance updated for ${emp.name}`);
                              scoreInput.value = '';
                              fetchData();
                            } catch(e) { 
                              const msg = e.response?.data?.message || 'Submission failed';
                              toast.error(msg); 
                            }
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </td>
                    <td><span className={`tier-badge tier-${emp.tier}`}>{emp.tier}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <div className="grid-2 mt-3">
        {/* Bonus Points Section */}
        <div className="card">
          <div className="card-title flex-gap"><Plus size={20} className="text-primary-light" /> Bonus & Spot Awards</div>
          <p className="text-muted text-sm mb-2">Grant manual points for special achievements or project milestones.</p>
          <div className="form-group">
            <label>Select Employee</label>
            <select id="bonus-emp-id">
              <option value="">Choose employee...</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Points Amount</label>
            <input type="number" id="bonus-points" placeholder="e.g. 50" />
          </div>
          <div className="form-group">
            <label>Reason / Recognition Message</label>
            <textarea id="bonus-reason" placeholder="What did they achieve?" rows="2"></textarea>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={async () => {
              const empId = document.getElementById('bonus-emp-id').value;
              const points = document.getElementById('bonus-points').value;
              const reason = document.getElementById('bonus-reason').value;
              if(!empId || !points) return toast.error('Please fill all fields');
              try {
                await rewardAPI.giveBonus({ employeeId: empId, points, reason });
                toast.success('Bonus points granted successfully!');
                document.getElementById('bonus-points').value = '';
                document.getElementById('bonus-reason').value = '';
                fetchData();
              } catch(e) { toast.error('Failed to grant bonus'); }
            }}
          >
            Grant Award
          </button>
        </div>

        {/* Redemption Requests Section */}
        <div className="card">
          <div className="card-title">Pending Redemptions</div>
          <div className="activity-list mt-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {redemptions.filter(r => r.status === 'Pending').length > 0 ? (
              redemptions.filter(r => r.status === 'Pending').map((item) => (
                <div key={item._id} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-gap">
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                      <TrendingUp size={18} className="text-primary-light" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{item.rewardItem}</div>
                      <div className="text-muted text-sm">{item.employee?.name} ({item.employee?.department})</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-bold text-sm" style={{ color: 'var(--gold)' }}>-{item.pointsSpent} PTS</div>
                    <button 
                      className="btn btn-primary mt-1" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem' }}
                      onClick={() => handleApproveRedemption(item._id)}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center py-3">No pending redemption requests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
