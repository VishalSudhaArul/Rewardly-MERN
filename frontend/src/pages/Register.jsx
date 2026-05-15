import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Building2, Briefcase, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    role: 'employee'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-logo">REWARDLY</div>
        <h1 className="auth-title">Join the Ecosystem</h1>
        <p className="auth-sub">Create your account to start earning rewards</p>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="name" type="text" placeholder="John Doe" style={{ paddingLeft: '36px' }} value={formData.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="email" type="email" placeholder="john.doe@email.com" style={{ paddingLeft: '36px' }} value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="password" type="password" placeholder="••••••••" style={{ paddingLeft: '36px' }} value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Department</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select name="department" style={{ paddingLeft: '36px' }} value={formData.department} onChange={handleChange} required>
                  <option value="">Select Dept</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Designation</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="designation" type="text" placeholder="e.g. SDE-1" style={{ paddingLeft: '36px' }} value={formData.designation} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: '48px', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-muted mt-3" style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
