import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../services/api';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({ email: '', username: '', password: '', full_name: '', is_admin: false });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDetails(response.data);
      setSelectedUser(response.data.user);
    } catch (err) {
      toast.error('Failed to load user details');
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User created successfully');
      setShowCreateModal(false);
      setFormData({ email: '', username: '', password: '', full_name: '', is_admin: false });
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/users/${selectedUser.id}`, {
        email: formData.email,
        full_name: formData.full_name,
        is_active: formData.is_active,
        is_admin: formData.is_admin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User updated successfully');
      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/users/${user.id}`, {
        is_active: !user.is_active
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`User ${!user.is_active ? 'activated' : 'suspended'}`);
      loadUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedUsers.length} users? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      await Promise.all(selectedUsers.map(id => 
        axios.delete(`${API_URL}/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      toast.success(`${selectedUsers.length} users deleted`);
      setSelectedUsers([]);
      loadUsers();
    } catch (err) {
      toast.error('Failed to delete users');
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || (filterRole === 'admin' ? u.is_admin : !u.is_admin);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? u.is_active : !u.is_active);
    return matchSearch && matchRole && matchStatus;
  });

  const isNewUser = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    return (now - created) < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-people-fill me-2"></i>User Manager</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Create User
        </button>
      </div>

      <div className="card p-4">
        <div className="row mb-3">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="col-md-4 text-end">
            {selectedUsers.length > 0 && (
              <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
                <i className="bi bi-trash me-2"></i>Delete {selectedUsers.length}
              </button>
            )}
            <span className="badge bg-primary me-2">{users.length} Total</span>
            <span className="badge bg-success">{users.filter(u => u.is_active).length} Active</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={(e) => setSelectedUsers(e.target.checked ? filteredUsers.map(u => u.id) : [])} checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} />
                </th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} />
                  </td>
                  <td onClick={() => loadUserDetails(user.id)} style={{ cursor: 'pointer' }}>
                    {user.username}
                    {isNewUser(user.created_at) && <span className="badge bg-success ms-2">New</span>}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge bg-${user.is_active ? 'success' : 'secondary'}`}>
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${user.is_admin ? 'danger' : 'info'}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setSelectedUser(user); setFormData({ email: user.email, full_name: user.full_name, is_active: user.is_active, is_admin: user.is_admin }); setShowEditModal(true); }}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleToggleStatus(user)}>
                      <i className={`bi bi-${user.is_active ? 'pause' : 'play'}-circle`}></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal with Tabs */}
      {userDetails && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details: {userDetails.user.username}</h5>
                <button className="btn-close" onClick={() => { setUserDetails(null); setSelectedUser(null); setActiveTab('profile'); }}></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile Info</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'dna' ? 'active' : ''}`} onClick={() => setActiveTab('dna')}>Learning DNA</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Revision Tasks</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>Goals</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>Quiz History</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>Activity Log</button>
                  </li>
                </ul>

                {activeTab === 'profile' && (
                  <div className="row g-3">
                    <div className="col-md-6"><strong>Email:</strong> {userDetails.user.email}</div>
                    <div className="col-md-6"><strong>Full Name:</strong> {userDetails.user.full_name || 'N/A'}</div>
                    <div className="col-md-6"><strong>Username:</strong> {userDetails.user.username}</div>
                    <div className="col-md-6"><strong>Role:</strong> {userDetails.user.is_admin ? 'Admin' : 'User'}</div>
                    <div className="col-md-6"><strong>Status:</strong> {userDetails.user.is_active ? 'Active' : 'Suspended'}</div>
                    <div className="col-md-6"><strong>Career Goal:</strong> {userDetails.user.career_goal || 'Not set'}</div>
                    <div className="col-md-6"><strong>Experience:</strong> {userDetails.user.experience_level || 'Not set'}</div>
                    <div className="col-md-6"><strong>Time Commitment:</strong> {userDetails.user.time_commitment || 'Not set'}</div>
                    <div className="col-md-6"><strong>Created:</strong> {new Date(userDetails.user.created_at).toLocaleString()}</div>
                    <div className="col-md-6"><strong>Last Active:</strong> {userDetails.user.last_active ? new Date(userDetails.user.last_active).toLocaleString() : 'Never'}</div>
                  </div>
                )}

                {activeTab === 'dna' && (
                  <div>
                    <h6 className="mb-3">Edit Learning DNA Percentages</h6>
                    {Object.entries(userDetails.learning_dna).map(([skill, level]) => (
                      <div key={skill} className="mb-3">
                        <label className="form-label text-capitalize">{skill.replace('_', ' ')}: {level}%</label>
                        <input type="range" className="form-range" min="0" max="100" value={level} onChange={(e) => setUserDetails({...userDetails, learning_dna: {...userDetails.learning_dna, [skill]: parseInt(e.target.value)}})} />
                        <div className="progress" style={{ height: '8px' }}>
                          <div className="progress-bar" style={{ width: `${level}%` }}></div>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-primary mt-2">Save Changes</button>
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div>
                    <div className="d-flex justify-content-between mb-3">
                      <h6>Revision Tasks ({userDetails.revision_tasks.length})</h6>
                      <button className="btn btn-sm btn-primary"><i className="bi bi-plus"></i> Add Task</button>
                    </div>
                    {userDetails.revision_tasks.map(task => (
                      <div key={task.id} className="p-3 mb-2 rounded bg-light">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <strong>{task.task}</strong>
                            <div className="mt-1">
                              <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'} me-2`}>{task.priority}</span>
                              <small className="text-muted">Due: {task.due_date} | Progress: {task.progress}%</small>
                            </div>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'goals' && (
                  <div>
                    <h6 className="mb-3">Learning Goals</h6>
                    <div className="p-3 bg-light rounded">
                      <p><strong>Career Goal:</strong> {userDetails.user.career_goal || 'Not set'}</p>
                      <p><strong>Experience Level:</strong> {userDetails.user.experience_level || 'Not set'}</p>
                      <p><strong>Time Commitment:</strong> {userDetails.user.time_commitment || 'Not set'}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div>
                    <h6 className="mb-3">Quiz History</h6>
                    {userDetails.quiz_scores.length > 0 ? userDetails.quiz_scores.map((quiz, i) => (
                      <div key={i} className="p-3 mb-2 rounded bg-light">
                        <div className="d-flex justify-content-between">
                          <strong>{quiz.quiz}</strong>
                          <span className="badge bg-primary">{quiz.score}%</span>
                        </div>
                        <small className="text-muted">Confidence: {quiz.confidence}% | {new Date(quiz.date).toLocaleString()}</small>
                      </div>
                    )) : <p className="text-muted">No quiz attempts yet</p>}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h6 className="mb-3">Activity Log</h6>
                    {userDetails.recent_activities.map((activity, i) => (
                      <div key={i} className="p-3 mb-2 rounded bg-light">
                        <div className="d-flex justify-content-between">
                          <strong className="text-capitalize">{activity.type}</strong>
                          <small className="text-muted">{new Date(activity.timestamp).toLocaleString()}</small>
                        </div>
                        <p className="mb-0 mt-1">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New User</h5>
                <button className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="text" className="form-control mb-3" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <input type="password" className="form-control mb-3" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <input type="text" className="form-control mb-3" placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isAdmin" checked={formData.is_admin} onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isAdmin">Admin User</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreate}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="text" className="form-control mb-3" placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
                <div className="form-check mb-2">
                  <input type="checkbox" className="form-check-input" id="isActive" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isActive">Active</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isAdminEdit" checked={formData.is_admin} onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isAdminEdit">Admin</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete user <strong>{selectedUser?.username}</strong>?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
