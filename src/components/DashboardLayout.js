import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div className="flex-grow-1" style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <nav className="navbar navbar-expand-lg bg-white shadow-sm">
          <div className="container-fluid px-4">
            <span className="navbar-text">Welcome, {user.username}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>
        </nav>
        <div className="px-4 py-3 border-bottom bg-white">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="small text-muted me-2">Today Focus:</span>
            <Link to="/dashboard/roadmap" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-map me-1"></i>Roadmap
            </Link>
            <Link to="/dashboard/courses" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-journal-richtext me-1"></i>Course
            </Link>
            <Link to="/dashboard/ai-chat" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-chat-dots me-1"></i>Ask Mentor
            </Link>
            <Link to="/dashboard/quiz" className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-patch-check me-1"></i>Quick Quiz
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
