import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { learningAPI } from '../services/api';
import { toast } from 'react-toastify';

const SUBJECTS = ['All', 'Web Development', 'Business Finance', 'Graphic Design', 'Musical Instruments'];
const LEVELS = ['all', 'beginner', 'intermediate', 'advanced', 'all-levels'];

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyCourseId, setBusyCourseId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    difficulty: 'all',
    isPaid: 'all',
  });

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const params = { limit: 120 };
        if (filters.search.trim()) params.search = filters.search.trim();
        if (filters.category !== 'All') params.category = filters.category;
        if (filters.difficulty !== 'all') params.difficulty = filters.difficulty;
        if (filters.isPaid !== 'all') params.is_paid = filters.isPaid === 'paid';

        const response = await learningAPI.getCourses(params);
        setCourses(response.data);
      } catch (error) {
        toast.error('Failed to load course catalog');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [filters]);

  const handleCompleteCourse = async (courseId) => {
    setBusyCourseId(courseId);
    try {
      await learningAPI.completeCourse(courseId);
      setCourses((current) => current.map((course) => (
        course.id === courseId ? { ...course, completed: true } : course
      )));
      toast.success('Course completion added to progress');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to mark course complete');
    } finally {
      setBusyCourseId(null);
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="mb-4">
        <h2 className="mb-1">Course Catalog</h2>
        <p className="text-muted mb-0">This catalog now syncs with your progress. Finish a course here and it immediately counts in your learning path.</p>
      </div>

      <div className="card p-4 mb-4">
        <div className="row g-3">
          <div className="col-lg-5">
            <input
              className="form-control"
              placeholder="Search by course title"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </div>
          <div className="col-lg-3">
            <select className="form-select" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
              {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>
          <div className="col-lg-2">
            <select className="form-select text-capitalize" value={filters.difficulty} onChange={(event) => setFilters((current) => ({ ...current, difficulty: event.target.value }))}>
              {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          <div className="col-lg-2">
            <select className="form-select" value={filters.isPaid} onChange={(event) => setFilters((current) => ({ ...current, isPaid: event.target.value }))}>
              <option value="all">All pricing</option>
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-5 text-center">
          <div className="spinner-border text-secondary" role="status" />
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course, index) => (
            <div key={course.id} className="col-12 col-xl-6">
              <motion.div className="card h-100 p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className="badge rounded-pill text-bg-light border">{course.category || 'General'}</span>
                      <span className="badge rounded-pill bg-primary-custom text-dark text-capitalize">{course.difficulty}</span>
                      <span className={`badge rounded-pill ${course.completed ? 'bg-success' : course.is_paid ? 'text-bg-warning' : 'text-bg-success'}`}>
                        {course.completed ? 'Completed' : course.is_paid ? `Paid${course.price ? ` $${course.price}` : ''}` : 'Free'}
                      </span>
                    </div>
                    <h5 className="mb-1">{course.title}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{course.description}</p>
                  </div>
                  <div className="course-score-chip">
                    <div className="small text-muted">Learners</div>
                    <div className="fw-bold">{course.subscriber_count?.toLocaleString?.() || 0}</div>
                  </div>
                </div>

                <div className="row g-3 text-muted small mb-3">
                  <div className="col-sm-4"><i className="bi bi-collection-play me-2"></i>{course.lecture_count || 0} lectures</div>
                  <div className="col-sm-4"><i className="bi bi-clock me-2"></i>{course.duration_hours || 0} hours</div>
                  <div className="col-sm-4"><i className="bi bi-chat-square-text me-2"></i>{course.review_count || 0} reviews</div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                  {course.url ? (
                    <a className="btn btn-sm btn-outline-secondary" href={course.url} target="_blank" rel="noreferrer">Open Course</a>
                  ) : <span className="small text-muted">No direct link</span>}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleCompleteCourse(course.id)}
                    disabled={course.completed || busyCourseId === course.id}
                  >
                    {course.completed ? 'Completed' : busyCourseId === course.id ? 'Saving...' : 'Mark Completed'}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
