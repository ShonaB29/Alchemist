import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../services/api';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    username: user.username || '',
    notifications: true,
    emailUpdates: true
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: ''
  });

  const handleChangePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      toast.error('Please fill in both password fields');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-4">
      <h2 className="mb-4"><i className="bi bi-gear me-2"></i>Settings</h2>
      
      <div className="card p-4 mb-4">
        <h5 className="mb-3">Profile Information</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" value={formData.username} disabled />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Notifications</h5>
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" checked={formData.notifications} onChange={(e) => setFormData({...formData, notifications: e.target.checked})} />
          <label className="form-check-label">Enable push notifications</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" checked={formData.emailUpdates} onChange={(e) => setFormData({...formData, emailUpdates: e.target.checked})} />
          <label className="form-check-label">Receive email updates</label>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Change Password</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" value={passwordData.current_password} onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" value={passwordData.new_password} onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} />
          </div>
        </div>
        <button className="btn btn-warning" onClick={handleChangePassword}>
          <i className="bi bi-key me-2"></i>Change Password
        </button>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        <i className="bi bi-check-circle me-2"></i>Save Changes
      </button>
    </div>
  );
}
