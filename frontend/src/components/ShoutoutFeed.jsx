import React, { useState, useEffect } from 'react';
import { shoutoutAPI, employeeAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Heart, Send, Users, Star } from 'lucide-react';

export default function ShoutoutFeed() {
  const { user, refreshUser } = useAuth();
  const [shoutouts, setShoutouts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ toUserId: '', message: '', points: 0 });

  useEffect(() => {
    fetchShoutouts();
    fetchEmployees();
  }, []);

  const fetchShoutouts = async () => {
    try {
      const res = await shoutoutAPI.getAll();
      setShoutouts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data.filter(e => e._id !== user?._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.toUserId || !formData.message) return toast.error('Please select a colleague and write a message');
    
    setLoading(true);
    try {
      await shoutoutAPI.create(formData);
      toast.success('Shoutout posted!');
      setFormData({ toUserId: '', message: '', points: 0 });
      fetchShoutouts();
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post shoutout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shoutout-section">
      <div className="card mb-3" style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg3))' }}>
        <h3 className="flex-gap mb-2"><Heart size={20} className="text-primary-light" /> Give a Shoutout</h3>
        <form onSubmit={handleSubmit} className="flex-column gap-3">
          <div className="grid-2 gap-2">
            <div className="form-group">
              <select 
                value={formData.toUserId} 
                onChange={(e) => setFormData({ ...formData, toUserId: e.target.value })}
              >
                <option value="">Select Colleague...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input 
                type="number" 
                placeholder="Gift Points (Optional)" 
                value={formData.points || ''}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Write something nice about your colleague..." 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="2"
            />
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} disabled={loading}>
            <Send size={16} /> Post Shoutout
          </button>
        </form>
      </div>

      <div className="shoutout-list flex-column gap-3">
        {shoutouts.length > 0 ? shoutouts.map((s) => (
          <div key={s._id} className="card shoutout-card">
            <div className="flex-between mb-2">
              <div className="flex-gap">
                <div className="avatar-sm">{s.fromUser?.name?.charAt(0)}</div>
                <div>
                  <span className="font-bold text-sm">{s.fromUser?.name}</span>
                  <span className="text-muted text-xs ml-1">shouted out</span>
                  <span className="font-bold text-sm ml-1">{s.toUser?.name}</span>
                </div>
              </div>
              {s.pointsGifted > 0 && (
                <div className="points-badge flex-gap">
                  <Star size={12} className="text-gold" />
                  <span>+{s.pointsGifted} PTS</span>
                </div>
              )}
            </div>
            <p className="text-sm italic" style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem', margin: '0.5rem 0' }}>
              "{s.message}"
            </p>
            <div className="text-muted text-xs text-right">
              {new Date(s.createdAt).toLocaleDateString()} at {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )) : (
          <div className="text-muted text-center py-4">No shoutouts yet. Be the first!</div>
        )}
      </div>
    </div>
  );
}
