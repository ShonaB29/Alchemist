import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { learningAPI } from '../services/api';

export default function PersonalizedRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const response = await learningAPI.getActiveRoadmap();
      setRoadmap(response.data);
    } catch (error) {
      toast.error('Failed to load your roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteResource = async (resourceId) => {
    setBusyKey(`resource-${resourceId}`);
    try {
      await learningAPI.completeResource(resourceId);
      toast.success('Roadmap resource marked complete');
      await loadRoadmap();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save resource progress');
    } finally {
      setBusyKey('');
    }
  };

  const handleCompleteCourse = async (courseId) => {
    setBusyKey(`course-${courseId}`);
    try {
      await learningAPI.completeCourse(courseId);
      toast.success('Course completion added to your progress');
      await loadRoadmap();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save course completion');
    } finally {
      setBusyKey('');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!roadmap?.path) {
    return (
      <div className="p-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          {roadmap?.message || 'Complete onboarding to unlock your personalized learning path.'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="card p-4 mb-4" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 text-dark">
          <div>
            <h2 className="mb-2">
              <i className="bi bi-map me-2"></i>
              {roadmap.path.title}
            </h2>
            <p className="mb-2">{roadmap.path.description}</p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge text-bg-light">{roadmap.path.estimated_duration}</span>
              <span className="badge text-bg-light text-capitalize">{roadmap.path.difficulty}</span>
              <span className="badge text-bg-light">{roadmap.career_goal_label}</span>
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-semibold">Overall Progress</span>
              <span className="fw-bold">{roadmap.overall_progress}%</span>
            </div>
            <div className="progress" style={{ height: '12px' }}>
              <div className="progress-bar" style={{ width: `${roadmap.overall_progress}%`, backgroundColor: '#4A4A4A' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3"><i className="bi bi-diagram-3 me-2"></i>Core Skills</h5>
        <div className="d-flex flex-wrap gap-2">
          {roadmap.skills.map((skill) => (
            <span key={skill.id} className="badge rounded-pill text-bg-light border px-3 py-2">{skill.name}</span>
          ))}
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        {roadmap.steps.map((step) => (
          <motion.div
            key={step.id}
            className="card p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-primary-custom text-dark">Step {step.step_number}</span>
                  <span className={`badge ${step.completed ? 'bg-success' : 'text-bg-light'}`}>
                    {step.completed ? 'Completed' : `${step.completion_percent}% done`}
                  </span>
                </div>
                <h4 className="mb-1">{step.title}</h4>
                <p className="text-muted mb-2">{step.description}</p>
                <div className="small text-muted">
                  <i className="bi bi-clock me-2"></i>{step.estimated_weeks} week plan
                </div>
              </div>
              <div style={{ minWidth: '180px' }}>
                <div className="progress" style={{ height: '10px' }}>
                  <div className="progress-bar" style={{ width: `${step.completion_percent}%`, backgroundColor: 'var(--primary)' }}></div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="mb-2">Topics</h6>
              <div className="d-flex flex-wrap gap-2">
                {step.topics.map((topic) => (
                  <span key={topic.id} className="badge rounded-pill text-bg-light border">
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="row g-4">
              <div className="col-xl-6">
                <h6 className="mb-3">Roadmap Resources</h6>
                <div className="d-flex flex-column gap-3">
                  {step.resources.map((resource) => (
                    <div key={resource.id} className="border rounded-4 p-3">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">{resource.title}</div>
                          <div className="small text-muted">
                            {resource.provider || 'Curated Resource'} | {resource.estimated_minutes || 0} mins
                          </div>
                        </div>
                        <span className={`badge ${resource.completed ? 'bg-success' : 'text-bg-light'}`}>
                          {resource.completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        {resource.url && (
                          <a className="btn btn-sm btn-outline-secondary" href={resource.url} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        )}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleCompleteResource(resource.id)}
                          disabled={resource.completed || busyKey === `resource-${resource.id}`}
                        >
                          {resource.completed ? 'Completed' : busyKey === `resource-${resource.id}` ? 'Saving...' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-xl-6">
                <h6 className="mb-3">Suggested Courses To Reinforce This Step</h6>
                <div className="d-flex flex-column gap-3">
                  {step.suggested_courses.map((course) => (
                    <div key={course.id} className="border rounded-4 p-3">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">{course.title}</div>
                          <div className="small text-muted">
                            {course.category || 'General'} | {course.duration_hours || 0} hrs | {course.difficulty}
                          </div>
                        </div>
                        <span className={`badge ${course.completed ? 'bg-success' : 'text-bg-light'}`}>
                          {course.completed ? 'Completed' : 'Recommended'}
                        </span>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        {course.url && (
                          <a className="btn btn-sm btn-outline-secondary" href={course.url} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        )}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleCompleteCourse(course.id)}
                          disabled={course.completed || busyKey === `course-${course.id}`}
                        >
                          {course.completed ? 'Completed' : busyKey === `course-${course.id}` ? 'Saving...' : 'Complete Course'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {step.project_prompt && (
              <div className="mt-4 rounded-4 p-3" style={{ backgroundColor: 'rgba(180, 214, 211, 0.18)' }}>
                <h6 className="mb-2"><i className="bi bi-lightbulb me-2"></i>Hands-on Project</h6>
                <p className="mb-0">{step.project_prompt}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
