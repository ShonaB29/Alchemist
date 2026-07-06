import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { learningAPI } from '../services/api';

export default function MyProgress() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await learningAPI.getUserProgress();
        setProgressData(response.data);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!progressData) {
    return <div className="p-4">No progress data available.</div>;
  }

  const { stats, skills, recentActivity, achievements, careerGoal, completedCourses } = progressData;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-graph-up me-2"></i>My Progress</h2>
        {careerGoal && <span className="badge bg-primary">{careerGoal.replace('-', ' ').toUpperCase()}</span>}
      </div>

      <div className="row g-4 mb-4">
        {[
          { label: 'Hours Learned', value: stats.totalHours || 0, icon: 'bi-clock-history', color: 'var(--primary)' },
          { label: 'Completed Items', value: stats.completedTasks || 0, icon: 'bi-check-circle', color: 'var(--secondary)' },
          { label: 'Courses Finished', value: stats.completedCourses || 0, icon: 'bi-journal-check', color: 'var(--accent-lavender)' },
          { label: 'Roadmap Done', value: stats.roadmapCompletion || 0, icon: 'bi-signpost-2', color: 'var(--accent-vanilla)', suffix: '%' },
        ].map((card, index) => (
          <div key={card.label} className="col-md-3">
            <motion.div className="card p-3 text-center h-100" style={{ backgroundColor: card.color }} whileHover={{ scale: 1.03 }}>
              <i className={card.icon} style={{ fontSize: '2rem' }}></i>
              <h3 className="mb-0 mt-2">
                <CountUp end={card.value} duration={1.8} />
                {card.suffix || ''}
              </h3>
              <small>{card.label}</small>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card p-4 h-100">
            <h5 className="mb-4"><i className="bi bi-bar-chart-fill me-2"></i>Learning DNA</h5>
            {skills.map((skill, index) => (
              <div key={skill.name} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>{skill.name}</span>
                  <span className="fw-bold">{skill.progress}%</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <motion.div
                    className="progress-bar"
                    style={{ width: `${skill.progress}%`, backgroundColor: ['#3776AB', '#FF6B6B', '#4ECDC4', '#F7B731', '#5F27CD', '#00D2D3'][index] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card p-4 h-100">
            <h5 className="mb-3"><i className="bi bi-lightning-charge me-2"></i>Real Activity</h5>
            {recentActivity.length > 0 ? recentActivity.map((day) => (
              <div key={day.date} className="mb-3">
                <h6 className="text-primary mb-2">{day.date}</h6>
                {day.tasks.map((task) => (
                  <div key={task} className="small text-muted mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>{task}
                  </div>
                ))}
              </div>
            )) : <p className="text-muted mb-0">Complete resources or courses to build your timeline.</p>}
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card p-4 h-100">
            <h5 className="mb-3"><i className="bi bi-journal-richtext me-2"></i>Completed Courses</h5>
            {completedCourses.length > 0 ? completedCourses.map((course) => (
              <div key={course.id} className="border rounded-4 p-3 mb-3">
                <div className="fw-semibold">{course.title}</div>
                <div className="small text-muted">{course.category || 'General'} | {course.duration_hours || 0} hrs</div>
              </div>
            )) : <p className="text-muted mb-0">No completed courses yet. Finish one from the roadmap or catalog.</p>}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-4 h-100">
            <h5 className="mb-4"><i className="bi bi-trophy-fill me-2"></i>Achievements</h5>
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`border rounded-4 p-3 mb-3 ${achievement.unlocked ? '' : 'opacity-50'}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle p-3" style={{ backgroundColor: `${achievement.color}20` }}>
                    <i className={achievement.icon} style={{ color: achievement.color }}></i>
                  </div>
                  <div>
                    <div className="fw-semibold">{achievement.title}</div>
                    <div className="small text-muted">{achievement.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
