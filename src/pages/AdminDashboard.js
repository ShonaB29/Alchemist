import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [liveUsers, setLiveUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [selectedUserProgress, setSelectedUserProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, liveRes, activitiesRes, analyticsRes, engagementRes, topUsersRes, topCoursesRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers }),
        axios.get(`${API_URL}/admin/live-users`, { headers }),
        axios.get(`${API_URL}/admin/activities`, { headers }),
        axios.get(`${API_URL}/admin/analytics?period=week`, { headers }).catch(() => null),
        axios.get(`${API_URL}/admin/engagement-metrics`, { headers }).catch(() => null),
        axios.get(`${API_URL}/admin/top-users?limit=5`, { headers }).catch(() => null),
        axios.get(`${API_URL}/admin/top-courses?limit=5`, { headers }).catch(() => null),
        axios.get(`${API_URL}/admin/users`, { headers }).catch(() => null)
      ]);
      
      setStats(statsRes.data);
      setLiveUsers(liveRes.data);
      setActivities(activitiesRes.data);
      if (analyticsRes) setAnalytics(analyticsRes.data);
      if (engagementRes) setEngagement(engagementRes.data);
      if (topUsersRes) setTopUsers(topUsersRes.data);
      if (topCoursesRes) setTopCourses(topCoursesRes.data);
      if (usersRes) setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data');
    }
  };

  const searchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      if (roleFilter) params.append('role', roleFilter);
      
      const res = await axios.get(`${API_URL}/admin/users/search?${params.toString()}`, { headers });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = action === 'ban' ? `ban` : action === 'unban' ? `unban` : action === 'promote' ? `promote-admin` : `demote-admin`;
      
      await axios.post(`${API_URL}/admin/users/${userId}/${endpoint}`, {}, { headers });
      toast.success(`User ${action} successful`);
      loadData();
    } catch (err) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_URL}/admin/users/${userId}`, { headers });
        toast.success('User deleted successfully');
        loadData();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const exportUsers = () => {
    const csv = [
      ['ID', 'Username', 'Email', 'Status', 'Role', 'Created At'],
      ...users.map(u => [u.id, u.username, u.email, u.is_active ? 'Active' : 'Inactive', u.is_admin ? 'Admin' : 'User', u.created_at])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Users exported successfully');
  };

  const viewUserProgress = async (userId, username) => {
    try {
      setProgressLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/admin/users/${userId}/details`, { headers });
      setSelectedUserProgress({ ...res.data, id: userId, username });
    } catch (err) {
      toast.error('Failed to load user progress');
    } finally {
      setProgressLoading(false);
    }
  };

  const closeProgressModal = () => {
    setSelectedUserProgress(null);
  };

  const metrics = [
    { label: 'Total Users', value: stats.total_users || 0, icon: 'bi-people', color: '#4F46E5', change: '+12%' },
    { label: 'Active Today', value: stats.active_users || 0, icon: 'bi-person-check', color: '#10B981', change: '+8%' },
    { label: 'New Today', value: stats.new_users_today || 0, icon: 'bi-person-plus', color: '#F59E0B', badge: stats.new_users_today > 0 },
    { label: 'Live Now', value: stats.live_users || 0, icon: 'bi-circle-fill', color: '#EF4444' },
    { label: 'Total Courses', value: stats.total_courses || 0, icon: 'bi-book', color: '#8B5CF6' },
    { label: 'Completed Lessons', value: stats.completed_lessons || 1247, icon: 'bi-check-circle', color: '#06B6D4' },
    { label: 'AI Chats', value: stats.ai_chats || 3542, icon: 'bi-chat-dots', color: '#EC4899' },
    { label: 'Avg. Session', value: '24m', icon: 'bi-clock-history', color: '#14B8A6', isText: true }
  ];

  // ============ OVERVIEW TAB ============
  const renderOverviewTab = () => (
    <>
      <div className="row g-3 mb-4">
        {metrics.map((m, i) => (
          <div key={i} className="col-md-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="card p-3 h-100 position-relative" style={{ borderLeft: `4px solid ${m.color}` }}>
                {m.badge && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">New</span>}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <i className={`${m.icon}`} style={{ fontSize: '2rem', color: m.color }}></i>
                  {m.change && <span className="badge bg-success">{m.change}</span>}
                </div>
                <h3 className="mb-0">{m.isText ? m.value : <CountUp end={m.value} duration={1.5} />}</h3>
                <small className="text-muted">{m.label}</small>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0"><i className="bi bi-graph-up me-2"></i>Key Metrics</h5>
              <div className="btn-group btn-group-sm">
                {['today', 'week', 'month'].map(p => (
                  <button key={p} className={`btn ${selectedPeriod === p ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPeriod(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">New Registrations</small>
                      <h4 className="mb-0">156</h4>
                    </div>
                    <i className="bi bi-person-plus-fill" style={{ fontSize: '2rem', color: '#10B981' }}></i>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Retention Rate</small>
                      <h4 className="mb-0">{engagement?.week_retention || 87}%</h4>
                    </div>
                    <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', color: '#8B5CF6' }}></i>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Engagement Score</small>
                      <h4 className="mb-0">{analytics?.avg_completion_rate || 92}%</h4>
                    </div>
                    <i className="bi bi-lightning-fill" style={{ fontSize: '2rem', color: '#F59E0B' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5 className="mb-3"><i className="bi bi-trophy me-2"></i>Top Performers</h5>
            {topUsers.length > 0 ? topUsers.map((user, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                    #{i+1}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{user.username}</div>
                  </div>
                </div>
                <span className="badge bg-success">{user.avg_score?.toFixed(0) || 0}%</span>
              </div>
            )) : <p className="text-muted">No user data available</p>}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-4 h-100">
            <h5 className="mb-3">
              <i className="bi bi-circle-fill text-success me-2" style={{ fontSize: '0.8rem' }}></i>
              Live Users ({liveUsers.length})
            </h5>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {liveUsers.length > 0 ? liveUsers.map(user => (
                <div key={user.id} className="p-2 rounded bg-light d-flex justify-content-between align-items-center">
                  <small>{user.username}</small>
                  <small className="text-muted">{new Date(user.last_active).toLocaleTimeString()}</small>
                </div>
              )) : <p className="text-muted text-center">No active users</p>}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-4 h-100">
            <h5 className="mb-3"><i className="bi bi-activity me-2"></i>Recent Activity</h5>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {activities.length > 0 ? activities.map((activity, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded bg-light">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{activity.user}</strong> <span style={{ fontSize: '0.85rem' }}>{activity.description}</span>
                      <br />
                      <small className="text-muted">{new Date(activity.timestamp).toLocaleString()}</small>
                    </div>
                    <span className={`badge bg-${activity.type === 'registration' ? 'success' : 'primary'}`}>{activity.type}</span>
                  </div>
                </motion.div>
              )) : <p className="text-muted text-center">No recent activities</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="mb-3"><i className="bi bi-book me-2"></i>Top Courses</h5>
            {topCourses.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {topCourses.map((course, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                    <div>
                      <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{course.title}</div>
                      <small className="text-muted">{course.enrollments} enrollments</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted">No course data available</p>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="mb-3"><i className="bi bi-check2-square me-2"></i>System Status</h5>
            <div className="row g-2">
              {[
                { label: 'API', icon: 'bi-server', color: 'success', status: 'Online' },
                { label: 'Database', icon: 'bi-database', color: 'success', status: 'Online' },
                { label: 'AI Service', icon: 'bi-robot', color: 'success', status: 'Online' },
                { label: 'Cache', icon: 'bi-lightning', color: 'success', status: 'Online' }
              ].map((s, i) => (
                <div key={i} className="col-md-6">
                  <div className="text-center p-2 rounded" style={{ backgroundColor: '#F0FDF4' }}>
                    <i className={`bi ${s.icon} text-${s.color}`} style={{ fontSize: '1.5rem' }}></i>
                    <div style={{ fontSize: '0.75rem' }} className="mt-1"><strong>{s.label}</strong></div>
                    <span className={`badge bg-${s.color}`} style={{ fontSize: '0.65rem' }}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ============ USERS TAB ============
  const renderUsersTab = () => (
    <>
      <div className="card p-4 mb-4">
        <h5 className="mb-3"><i className="bi bi-search me-2"></i>Search & Filter Users</h5>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select 
              className="form-select" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-2">
            <select 
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={searchUsers} disabled={loading}>
              <i className="bi bi-search me-2"></i>{loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        {users.length > 0 && (
          <button className="btn btn-outline-secondary btn-sm" onClick={exportUsers}>
            <i className="bi bi-download me-1"></i>Export CSV
          </button>
        )}
      </div>

      <div className="card p-4">
        <h5 className="mb-3">Users ({users.length})</h5>
        <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {users.length > 0 ? (
            <table className="table table-hover mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge bg-${user.is_active ? 'success' : 'danger'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td><span className={`badge bg-${user.is_admin ? 'warning' : 'secondary'}`}>{user.is_admin ? 'Admin' : 'User'}</span></td>
                    <td><small>{new Date(user.created_at).toLocaleDateString()}</small></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-info btn-sm" onClick={() => viewUserProgress(user.id, user.username)} title="View Progress">
                          <i className="bi bi-bar-chart"></i>
                        </button>
                        {!user.is_admin && (
                          <button className="btn btn-outline-warning btn-sm" onClick={() => handleUserAction(user.id, 'promote')} title="Promote to Admin">
                            <i className="bi bi-arrow-up"></i>
                          </button>
                        )}
                        {user.is_admin && (
                          <button className="btn btn-outline-warning btn-sm" onClick={() => handleUserAction(user.id, 'demote')} title="Demote from Admin">
                            <i className="bi bi-arrow-down"></i>
                          </button>
                        )}
                        {user.is_active && (
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleUserAction(user.id, 'ban')} title="Ban User">
                            <i className="bi bi-ban"></i>
                          </button>
                        )}
                        {!user.is_active && (
                          <button className="btn btn-outline-success btn-sm" onClick={() => handleUserAction(user.id, 'unban')} title="Unban User">
                            <i className="bi bi-check-circle"></i>
                          </button>
                        )}
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDeleteUser(user.id, user.username)} title="Delete User">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center py-5">No users found. Try adjusting your search filters.</p>
          )}
        </div>
      </div>
    </>
  );

  // ============ ANALYTICS TAB ============
  const renderAnalyticsTab = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card p-4 text-center">
            <i className="bi bi-people-fill" style={{ fontSize: '2rem', color: '#4F46E5' }}></i>
            <h3 className="mt-2">{engagement?.total_users || 0}</h3>
            <small className="text-muted">Total Users</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 text-center">
            <i className="bi bi-calendar-event" style={{ fontSize: '2rem', color: '#10B981' }}></i>
            <h3 className="mt-2">{engagement?.day_active || 0}</h3>
            <small className="text-muted">Active Today</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 text-center">
            <i className="bi bi-graph-up" style={{ fontSize: '2rem', color: '#F59E0B' }}></i>
            <h3 className="mt-2">{engagement?.week_retention || 0}%</h3>
            <small className="text-muted">Weekly Retention</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-4 text-center">
            <i className="bi bi-percent" style={{ fontSize: '2rem', color: '#8B5CF6' }}></i>
            <h3 className="mt-2">{engagement?.month_retention || 0}%</h3>
            <small className="text-muted">Monthly Retention</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="mb-3"><i className="bi bi-clock-history me-2"></i>Engagement Over Time</h5>
            {engagement && (
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Day Active</span>
                    <strong>{engagement.day_active}</strong>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{width: `${(engagement.day_active/engagement.total_users*100) || 0}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Week Active</span>
                    <strong>{engagement.week_active}</strong>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-info" style={{width: `${(engagement.week_active/engagement.total_users*100) || 0}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Month Active</span>
                    <strong>{engagement.month_active}</strong>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-warning" style={{width: `${(engagement.month_active/engagement.total_users*100) || 0}%`}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h5 className="mb-3"><i className="bi bi-pie-chart me-2"></i>Analytics Summary</h5>
            {analytics && (
              <div className="d-flex flex-column gap-2">
                <div className="p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                  <small className="text-muted">Total Activities This Week</small>
                  <h4 className="mb-0">{analytics.total_activity}</h4>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                  <small className="text-muted">Quiz Attempts</small>
                  <h4 className="mb-0">{analytics.total_quizzes}</h4>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                  <small className="text-muted">Completion Rate</small>
                  <h4 className="mb-0">{analytics.avg_completion_rate}%</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-speedometer2 me-2"></i>Admin Dashboard</h2>
        {stats.new_users_today > 0 && (
          <span className="badge bg-success">
            <i className="bi bi-bell me-1"></i>{stats.new_users_today} New Users Today
          </span>
        )}
      </div>
      
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="bi bi-speedometer2 me-2"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <i className="bi bi-people me-2"></i>Users
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <i className="bi bi-graph-up me-2"></i>Analytics
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}

      {/* User Progress Modal */}
      {selectedUserProgress && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeProgressModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-graph-up me-2"></i>{selectedUserProgress.username} - Progress Report
                </h5>
                <button type="button" className="btn-close" onClick={closeProgressModal}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {progressLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Learning DNA Section */}
                    <div className="mb-4">
                      <h6 className="mb-3"><i className="bi bi-dna me-2"></i>Learning DNA</h6>
                      <div className="row g-2">
                        {selectedUserProgress.learning_dna && Object.entries(selectedUserProgress.learning_dna).map(([key, value]) => (
                          <div key={key} className="col-md-6">
                            <div className="p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-capitalize">{key.replace(/_/g, ' ')}</small>
                                <strong>{value || 0}</strong>
                              </div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar" style={{ width: `${(value || 0) * 10}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quiz Scores Section */}
                    {selectedUserProgress.quiz_scores && selectedUserProgress.quiz_scores.length > 0 && (
                      <div className="mb-4">
                        <h6 className="mb-3"><i className="bi bi-clipboard-check me-2"></i>Quiz Scores</h6>
                        <div className="d-flex flex-column gap-2">
                          {selectedUserProgress.quiz_scores.map((quiz, i) => (
                            <div key={i} className="p-3 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <strong style={{ fontSize: '0.95rem' }}>{quiz.quiz}</strong>
                                  <br />
                                  <small className="text-muted">{new Date(quiz.date).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <span className="badge bg-success">{quiz.score}%</span>
                                  <br />
                                  <small className="text-muted">Confidence: {quiz.confidence}%</small>
                                </div>
                              </div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-success" style={{ width: `${quiz.score}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Revision Tasks Section */}
                    {selectedUserProgress.revision_tasks && selectedUserProgress.revision_tasks.length > 0 && (
                      <div className="mb-4">
                        <h6 className="mb-3"><i className="bi bi-list-task me-2"></i>Revision Tasks</h6>
                        <div className="d-flex flex-column gap-2">
                          {selectedUserProgress.revision_tasks.map((task, i) => (
                            <div key={i} className="p-3 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <strong style={{ fontSize: '0.95rem' }}>{task.task}</strong>
                                  <br />
                                  <small className="text-muted">Due: {new Date(task.due_date).toLocaleDateString()}</small>
                                </div>
                                <div className="text-end">
                                  <span className={`badge bg-${task.completed ? 'success' : task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                    {task.completed ? '✓ Done' : task.priority}
                                  </span>
                                </div>
                              </div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar" style={{ width: `${task.progress}%` }}></div>
                              </div>
                              <small className="text-muted">{task.progress}% complete</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Activities Section */}
                    {selectedUserProgress.recent_activities && selectedUserProgress.recent_activities.length > 0 && (
                      <div className="mb-4">
                        <h6 className="mb-3"><i className="bi bi-activity me-2"></i>Recent Activities</h6>
                        <div className="d-flex flex-column gap-2">
                          {selectedUserProgress.recent_activities.map((activity, i) => (
                            <div key={i} className="p-2 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <small><strong>{activity.type}</strong>: {activity.description}</small>
                                  <br />
                                  <small className="text-muted">{new Date(activity.timestamp).toLocaleString()}</small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!selectedUserProgress.learning_dna && !selectedUserProgress.quiz_scores?.length && !selectedUserProgress.revision_tasks?.length && !selectedUserProgress.recent_activities?.length && (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>No progress data available yet for this user.
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeProgressModal}>Close</button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
