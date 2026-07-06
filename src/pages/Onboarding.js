import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../services/api';

export default function Onboarding({ user }) {
  const navigate = useNavigate();

  // Skip onboarding for admin users
  React.useEffect(() => {
    if (user?.is_admin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');

  const careerGoals = [
    { id: 'ai-engineer', title: 'AI Engineer', icon: 'bi-cpu', desc: 'Build intelligent systems and ML models' },
    { id: 'data-analyst', title: 'Data Analyst', icon: 'bi-graph-up', desc: 'Analyze data and create insights' },
    { id: 'web-developer', title: 'Web Developer', icon: 'bi-code-slash', desc: 'Build websites and web applications' },
    { id: 'data-scientist', title: 'Data Scientist', icon: 'bi-bar-chart', desc: 'Extract insights from complex data' },
    { id: 'mobile-developer', title: 'Mobile Developer', icon: 'bi-phone', desc: 'Create iOS and Android apps' },
    { id: 'devops-engineer', title: 'DevOps Engineer', icon: 'bi-gear', desc: 'Automate and optimize infrastructure' }
  ];

  const handleComplete = async () => {
    if (!careerGoal || !experience || !timeCommitment) {
      toast.error('Please complete all steps');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }
      const response = await axios.post(
        `${API_URL}/learning/complete-onboarding`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { career_goal: careerGoal, experience_level: experience, time_commitment: timeCommitment }
        }
      );
      
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userGoal', JSON.stringify({ careerGoal, experience, timeCommitment }));
      
      toast.success('Your personalized learning path is ready!');
      navigate('/dashboard/roadmap');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to save onboarding data');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', padding: '2rem' }}>
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="text-white mb-2">Welcome to Alchemist, {user.username}! 🎉</h2>
          <p className="text-white">Let's personalize your learning journey</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-4">
              {/* Progress Steps */}
              <div className="d-flex justify-content-between mb-4">
                {[1, 2, 3].map(s => (
                  <div key={s} className="d-flex align-items-center flex-grow-1">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${step >= s ? 'bg-primary text-white' : 'bg-light'}`} style={{ width: '40px', height: '40px' }}>
                      {s}
                    </div>
                    {s < 3 && <div className={`flex-grow-1 mx-2 ${step > s ? 'bg-primary' : 'bg-light'}`} style={{ height: '2px' }}></div>}
                  </div>
                ))}
              </div>

              {/* Step 1: Career Goal */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h4 className="mb-3">What do you want to become?</h4>
                  <p className="text-muted mb-4">Choose your career goal and we'll create a personalized roadmap</p>
                  <div className="row g-3">
                    {careerGoals.map(goal => (
                      <div key={goal.id} className="col-md-6">
                        <div className={`card p-3 h-100 ${careerGoal === goal.id ? 'border-primary bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCareerGoal(goal.id)}>
                          <div className="d-flex align-items-start">
                            <i className={`${goal.icon} me-3`} style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                            <div>
                              <h6 className="mb-1">{goal.title}</h6>
                              <small className="text-muted">{goal.desc}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary mt-4 w-100" onClick={() => setStep(2)} disabled={!careerGoal}>
                    Next <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </motion.div>
              )}

              {/* Step 2: Experience Level */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h4 className="mb-3">What's your experience level?</h4>
                  <p className="text-muted mb-4">This helps us customize the difficulty</p>
                  <div className="d-flex flex-column gap-3">
                    {[
                      { id: 'beginner', title: 'Complete Beginner', desc: 'No prior experience' },
                      { id: 'intermediate', title: 'Some Experience', desc: 'Know the basics' },
                      { id: 'advanced', title: 'Advanced', desc: 'Looking to specialize' }
                    ].map(exp => (
                      <div key={exp.id} className={`card p-3 ${experience === exp.id ? 'border-primary bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setExperience(exp.id)}>
                        <h6 className="mb-1">{exp.title}</h6>
                        <small className="text-muted">{exp.desc}</small>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-outline-secondary flex-grow-1" onClick={() => setStep(1)}>
                      <i className="bi bi-arrow-left me-2"></i>Back
                    </button>
                    <button className="btn btn-primary flex-grow-1" onClick={() => setStep(3)} disabled={!experience}>
                      Next <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Time Commitment */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h4 className="mb-3">How much time can you dedicate?</h4>
                  <p className="text-muted mb-4">Be realistic - consistency matters more than hours</p>
                  <div className="d-flex flex-column gap-3">
                    {[
                      { id: '1-2', title: '1-2 hours/day', desc: 'Perfect for busy schedules' },
                      { id: '3-4', title: '3-4 hours/day', desc: 'Balanced approach' },
                      { id: '5+', title: '5+ hours/day', desc: 'Intensive learning' }
                    ].map(time => (
                      <div key={time.id} className={`card p-3 ${timeCommitment === time.id ? 'border-primary bg-light' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setTimeCommitment(time.id)}>
                        <h6 className="mb-1">{time.title}</h6>
                        <small className="text-muted">{time.desc}</small>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-outline-secondary flex-grow-1" onClick={() => setStep(2)}>
                      <i className="bi bi-arrow-left me-2"></i>Back
                    </button>
                    <button className="btn btn-primary flex-grow-1" onClick={handleComplete} disabled={!timeCommitment}>
                      Complete Setup <i className="bi bi-check-circle ms-2"></i>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
