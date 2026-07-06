import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { learningAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, achievementsRes, recsRes] = await Promise.all([
        learningAPI.getStats(),
        learningAPI.getAchievements(),
        learningAPI.getRecommendations()
      ]);
      setStats(statsRes.data);
      setAchievements(achievementsRes.data);
      setRecommendations(recsRes.data.recommendations);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand accent-font"><i className="bi bi-cpu me-2"></i>Alchemist</span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">Welcome, {user.username}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          {[
            { label: 'Total Courses', value: stats.total_courses || 0, icon: 'bi-book', color: 'var(--primary)' },
            { label: 'Completed Lessons', value: stats.completed_lessons || 0, icon: 'bi-check-circle', color: 'var(--secondary)' },
            { label: 'Achievements', value: stats.total_achievements || 0, icon: 'bi-trophy', color: 'var(--accent-lavender)' },
            { label: 'Total Points', value: stats.total_points || 0, icon: 'bi-star', color: 'var(--accent-vanilla)' }
          ].map((stat, i) => (
            <div key={i} className="col-md-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="card h-100 p-4" style={{ backgroundColor: stat.color }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="mb-0"><CountUp end={stat.value} duration={2} /></h3>
                      <p className="text-muted mb-0">{stat.label}</p>
                    </div>
                    <i className={`${stat.icon}`} style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* AI Recommendations */}
          <div className="col-md-6">
            <div className="card p-4">
              <h5 className="mb-3"><i className="bi bi-lightbulb me-2"></i>AI Recommendations</h5>
              {recommendations.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="p-3 rounded" style={{ backgroundColor: 'var(--background)' }}>
                      <i className="bi bi-arrow-right-circle me-2 text-primary-custom"></i>{rec}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Start learning to get personalized recommendations</p>
              )}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="col-md-6">
            <div className="card p-4">
              <h5 className="mb-3"><i className="bi bi-trophy me-2"></i>Recent Achievements</h5>
              {achievements.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {achievements.slice(0, 3).map((ach, i) => (
                    <div key={i} className="p-3 rounded d-flex align-items-center gap-3" style={{ backgroundColor: 'var(--background)' }}>
                      <i className="bi bi-award" style={{ fontSize: '2rem', color: 'var(--accent-lavender)' }}></i>
                      <div>
                        <h6 className="mb-0">{ach.name}</h6>
                        <small className="text-muted">{ach.description}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Complete lessons to earn achievements</p>
              )}
            </div>
          </div>

          {/* Learning DNA Profile */}
          <div className="col-md-12">
            <div className="card p-4">
              <h5 className="mb-3"><i className="bi bi-dna me-2"></i>Learning DNA Profile</h5>
              <div className="row">
                {['Visual Learning', 'Problem Solving', 'Critical Thinking', 'Collaboration'].map((skill, i) => (
                  <div key={i} className="col-md-6 mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{skill}</span>
                      <span className="text-muted">{Math.floor(Math.random() * 40 + 60)}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar" style={{ width: `${Math.floor(Math.random() * 40 + 60)}%`, backgroundColor: 'var(--primary)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
