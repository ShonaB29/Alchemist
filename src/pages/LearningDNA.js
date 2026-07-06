import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LearningDNA() {
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skills = [
    { name: 'Math', level: 45, color: '#f87171', strength: 'Weak', topics: ['Algebra', 'Geometry', 'Calculus'], lastPracticed: '2 days ago' },
    { name: 'Python', level: 78, color: '#4ade80', strength: 'Strong', topics: ['Functions', 'OOP', 'Data Structures'], lastPracticed: 'Today' },
    { name: 'SQL', level: 62, color: '#fbbf24', strength: 'Good', topics: ['Joins', 'Subqueries', 'Indexes'], lastPracticed: 'Yesterday' },
    { name: 'Data Analysis', level: 35, color: '#f87171', strength: 'Weak', topics: ['Pandas', 'NumPy', 'Visualization'], lastPracticed: '5 days ago' },
    { name: 'Web Development', level: 55, color: '#fbbf24', strength: 'Good', topics: ['HTML', 'CSS', 'JavaScript'], lastPracticed: '3 days ago' },
    { name: 'Machine Learning', level: 28, color: '#f87171', strength: 'Weak', topics: ['Regression', 'Classification', 'Neural Networks'], lastPracticed: '1 week ago' }
  ];

  const todos = [
    { task: 'Algebra Basics', due: 'Tomorrow', priority: 'High', color: 'danger', progress: 60, estimatedTime: '2 hours' },
    { task: 'SQL Joins Practice', due: 'In 3 days', priority: 'Medium', color: 'warning', progress: 40, estimatedTime: '1.5 hours' },
    { task: 'Python Challenge', due: 'Next week', priority: 'Low', color: 'success', progress: 20, estimatedTime: '3 hours' },
    { task: 'Data Visualization Project', due: 'In 5 days', priority: 'Medium', color: 'warning', progress: 10, estimatedTime: '4 hours' }
  ];

  const strengths = skills.filter(s => s.level >= 70);
  const weaknesses = skills.filter(s => s.level < 50);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-heart-pulse me-2"></i>Learning DNA Profile</h2>
        <button className="btn btn-primary"><i className="bi bi-download me-2"></i>Export Report</button>
      </div>
      
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center" style={{ backgroundColor: 'var(--primary)' }}>
            <h3 className="mb-0">{strengths.length}</h3>
            <small>Strong Skills</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center" style={{ backgroundColor: 'var(--secondary)' }}>
            <h3 className="mb-0">{weaknesses.length}</h3>
            <small>Need Improvement</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center" style={{ backgroundColor: 'var(--accent-lavender)' }}>
            <h3 className="mb-0">{Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)}%</h3>
            <small>Overall Mastery</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card p-4">
            <h5 className="mb-4">Skill Mastery Overview</h5>
            {skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <span className="fw-bold">{skill.name}</span>
                    <small className="text-muted ms-2">Last practiced: {skill.lastPracticed}</small>
                  </div>
                  <span className="text-muted">{skill.level}%</span>
                </div>
                <div className="progress" style={{ height: '12px', cursor: 'pointer' }} onClick={() => setSelectedSkill(skill)}>
                  <div className="progress-bar" style={{ width: `${skill.level}%`, backgroundColor: skill.color }}></div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <small className="text-muted">{skill.strength}</small>
                  <button className="btn btn-sm btn-link p-0" onClick={() => setSelectedSkill(skill)}>View Details</button>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedSkill && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-4 mt-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5>{selectedSkill.name} - Detailed Breakdown</h5>
                <button className="btn-close" onClick={() => setSelectedSkill(null)}></button>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h6>Topics Covered:</h6>
                  <ul>
                    {selectedSkill.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Recommendations:</h6>
                  <p className="text-muted">Practice more {selectedSkill.topics[0]} to improve your {selectedSkill.name} skills.</p>
                  <button className="btn btn-primary btn-sm">Start Practice</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card p-4 mb-3">
            <h5 className="mb-3">SMART Revision TODO</h5>
            {todos.map((todo, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="mb-3 p-3 rounded" style={{ backgroundColor: 'var(--background)' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{todo.task}</h6>
                  <span className={`badge bg-${todo.color}`}>{todo.priority}</span>
                </div>
                <small className="text-muted d-block mb-2"><i className="bi bi-calendar me-1"></i>{todo.due}</small>
                <small className="text-muted d-block mb-2"><i className="bi bi-clock me-1"></i>{todo.estimatedTime}</small>
                <div className="progress" style={{ height: '6px' }}>
                  <div className={`progress-bar bg-${todo.color}`} style={{ width: `${todo.progress}%` }}></div>
                </div>
                <small className="text-muted">{todo.progress}% complete</small>
              </motion.div>
            ))}
          </div>

          <div className="card p-3 border-warning mb-3">
            <h6 className="text-warning mb-2"><i className="bi bi-exclamation-triangle me-2"></i>Revise Soon</h6>
            <small>Algebra Basics needs attention before tomorrow's deadline</small>
          </div>

          <div className="card p-3" style={{ backgroundColor: 'var(--accent-vanilla)' }}>
            <h6 className="mb-2"><i className="bi bi-lightbulb me-2"></i>Quick Tip</h6>
            <small>Focus on your weak areas (Math, Data Analysis, ML) to improve overall mastery by 15%</small>
          </div>
        </div>
      </div>
    </div>
  );
}
