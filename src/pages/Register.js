import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Register({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '', full_name: '', terms: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!formData.terms) {
      toast.error('Please accept terms and conditions');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ email: formData.email, username: formData.username, password: formData.password, full_name: formData.full_name });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, var(--accent-lavender) 0%, var(--accent-vanilla) 100%)', padding: '2rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="card p-4 shadow-lg">
                <div className="text-center mb-4">
                  <i className="bi bi-cpu" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
                  <h2 className="accent-font mt-2">Create Account</h2>
                  <p className="text-muted">Start your learning journey today</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="terms" checked={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.checked })} />
                    <label className="form-check-label" htmlFor="terms">I agree to the Terms and Conditions</label>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</button>
                </form>
                <div className="text-center">
                  <p className="small text-muted">A verification email will be sent to your inbox</p>
                  <p className="mt-3">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
