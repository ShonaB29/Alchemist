import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login successful!');
      onLogin(response.data.user);
      
      // Navigate based on whether user has completed onboarding
      if (response.data.user.career_goal) {
        navigate('/dashboard/roadmap');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="card p-4 shadow-lg">
                <div className="text-center mb-4">
                  <i className="bi bi-cpu" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
                  <h2 className="accent-font mt-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue learning</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember">Remember me</label>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                </form>
                <div className="text-center">
                  <Link to="/forgot-password" className="text-muted small">Forgot password?</Link>
                  <p className="mt-3">Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-outline-secondary flex-fill"><i className="bi bi-google me-2"></i>Google</button>
                  <button className="btn btn-outline-secondary flex-fill"><i className="bi bi-github me-2"></i>GitHub</button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
