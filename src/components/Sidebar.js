import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';

export default function Sidebar({ user }) {
  const location = useLocation();
  const [notifications, setNotifications] = useState({ unread_messages: 0, new_followers: [] });
  
  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/learning/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };
  
  const menuItems = [
    { path: '/dashboard/roadmap', icon: 'bi-map', label: 'My Roadmap' },
    { path: '/dashboard/courses', icon: 'bi-journal-richtext', label: 'Course Catalog' },
    { path: '/dashboard/learning-dna', icon: 'bi-heart-pulse', label: 'Learning DNA' },
    { path: '/dashboard/time-path', icon: 'bi-clock', label: 'Time-Adaptive Path' },
    { path: '/dashboard/ai-chat', icon: 'bi-chat-dots', label: 'AI Mentor Chat' },
    { path: '/dashboard/peer-twins', icon: 'bi-people', label: 'Peer Twins', badge: notifications.unread_messages + notifications.new_followers.length },
    { path: '/dashboard/quiz', icon: 'bi-patch-check', label: 'Confidence Quiz' },
    { path: '/dashboard/progress', icon: 'bi-graph-up', label: 'My Progress' },
    { path: '/dashboard/settings', icon: 'bi-gear', label: 'Settings' }
  ];

  const adminItems = [
    { path: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Admin Dashboard' },
    { path: '/admin/users', icon: 'bi-people-fill', label: 'User Manager' },
    { path: '/admin/customizer', icon: 'bi-palette', label: 'Website Customizer' }
  ];

  const items = user?.is_admin ? adminItems : menuItems;

  return (
    <div className="d-flex flex-column bg-white shadow-sm" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="p-3 border-bottom">
        <Link to="/" className="text-decoration-none">
          <h5 className="accent-font mb-0"><i className="bi bi-cpu me-2 text-primary-custom"></i>Alchemist</h5>
        </Link>
      </div>
      <div className="flex-grow-1 p-3">
        <nav>
          {items.map((item) => (
            <Link key={item.path} to={item.path} className={`d-block p-2 mb-2 rounded text-decoration-none position-relative ${location.pathname === item.path ? 'bg-primary-custom text-dark' : 'text-muted'}`} style={{ transition: 'all 0.2s' }}>
              <i className={`${item.icon} me-2`}></i>{item.label}
              {item.badge > 0 && (
                <span className="badge bg-danger position-absolute" style={{ top: '5px', right: '10px', fontSize: '0.7rem' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
