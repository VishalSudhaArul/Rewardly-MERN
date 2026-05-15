import React, { useState, useEffect } from 'react';
import { feedbackAPI, employeeAPI } from '../api';
import { toast } from 'react-hot-toast';
import { MessageCircle, Send, User, Star } from 'lucide-react';

export default function FeedbackPage() {
  const [employees, setEmployees] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [formData, setFormData] = useState({ recipientId: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, feedRes] = await Promise.all([
        employeeAPI.getAll(),
        feedbackAPI.getMine()
      ]);
      setEmployees(empRes.data);
      setFeedback(feedRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientId) return toast.error('Please select a recipient');
    setLoading(true);
    try {
      const payload = {
        toEmployee: formData.recipientId,
        comment: formData.message,
        rating: formData.rating,
        month: new Date().toISOString().slice(0, 7), // "YYYY-MM"
        type: 'peer'
      };
      await feedbackAPI.submit(payload);
      toast.success('Feedback sent!');
      setFormData({ recipientId: '', message: '', rating: 5 });
      fetchData();
    } catch (err) {
      toast.error('Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <header className="page-header">
        <h1>Peer Feedback</h1>
        <p>Recognize your colleagues' efforts or view your received feedback.</p>
      </header>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Send Appreciation</div>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="form-group">
              <label>Select Colleague</label>
              <select 
                value={formData.recipientId} 
                onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                required
              >
                <option value="">Choose someone...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Appreciation Message</label>
              <textarea 
                rows="4" 
                placeholder="What did they do well?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Rating (1-5 Stars)</label>
              <div className="flex-gap">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: star <= formData.rating ? 'var(--gold)' : 'var(--border)' }}
                  >
                    <Star size={24} fill={star <= formData.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              <Send size={18} />
              Send Recognition
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Received Feedback</div>
          <div className="feedback-list mt-2" style={{ maxHeight: '460px', overflowY: 'auto' }}>
            {feedback.length > 0 ? feedback.map((item) => (
              <div key={item._id} className="stat-card" style={{ marginBottom: '1rem' }}>
                <div className="flex-between">
                  <div className="flex-gap">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </div>
                    <div className="font-bold text-sm">Anonymous Peer</div>
                  </div>
                  <div className="flex-gap" style={{ color: 'var(--gold)' }}>
                    <Star size={12} fill="currentColor" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm" style={{ fontStyle: 'italic', color: 'var(--text)' }}>
                  "{item.comment}"
                </p>
                <div className="text-muted text-sm mt-2" style={{ fontSize: '0.7rem' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <div className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
                No feedback received yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
