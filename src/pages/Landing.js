import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Landing() {
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [quickStartRef, quickStartInView] = useInView({ triggerOnce: true });

  const features = [
    { icon: 'bi-fingerprint', title: 'Learning DNA Profile', desc: 'Personalized learning style analysis' },
    { icon: 'bi-bullseye', title: 'Goal-to-Skill Translator', desc: 'Break down goals into actionable skills' },
    { icon: 'bi-clock-history', title: 'Time-Adaptive Paths', desc: 'Adjust learning based on your schedule' },
    { icon: 'bi-chat-dots', title: 'AI Mentor Chat', desc: '24/7 intelligent learning assistant' },
    { icon: 'bi-people', title: 'Peer Twin Matching', desc: 'Connect with similar learners' },
    { icon: 'bi-patch-check', title: 'Confidence-Based Quizzes', desc: 'Adaptive assessments' }
  ];

  const steps = [
    { icon: 'bi-person-plus', title: 'Sign Up', desc: 'Create your account' },
    { icon: 'bi-flag', title: 'Set Goals', desc: 'Define learning objectives' },
    { icon: 'bi-map', title: 'Get Path', desc: 'Receive personalized plan' },
    { icon: 'bi-rocket-takeoff', title: 'Start Learning', desc: 'Begin your journey' }
  ];

  const quickStartItems = [
    {
      icon: 'bi-bullseye',
      title: 'Choose One Career Goal',
      desc: 'Start with one clear target role so your recommendations stay focused.',
      action: 'Set Goal',
      to: '/register'
    },
    {
      icon: 'bi-calendar-check',
      title: 'Block 30-60 Minutes Daily',
      desc: 'Consistency beats intensity. Small daily sessions produce faster results.',
      action: 'Build Schedule',
      to: '/register'
    },
    {
      icon: 'bi-chat-square-text',
      title: 'Ask the AI Mentor Daily',
      desc: 'Use targeted questions to unblock concepts and get next-step guidance.',
      action: 'Try Mentor',
      to: '/login'
    }
  ];

  return (
    <div>
      <Navbar />
      
      {/* Hero */}
      <section className="py-5" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="display-3 fw-bold mb-4">
                  Transform Your Learning with AI
                </h1>
                <p className="lead mb-4">AI-powered personalized learning pathways that adapt to your unique style, goals, and schedule</p>
                <div className="d-flex gap-3">
                  <Link to="/register" className="btn btn-primary btn-lg">Start Free</Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div className="float" animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <i className="bi bi-lightbulb" style={{ fontSize: '15rem', color: 'var(--accent-vanilla)', opacity: 0.8 }}></i>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-5" ref={featuresRef}>
        <div className="container">
          <h2 className="text-center mb-5 accent-font">Powerful Features</h2>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}>
                  <div className="card h-100 p-4">
                    <i className={`${f.icon} text-primary-custom`} style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3">{f.title}</h5>
                    <p className="text-muted">{f.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 accent-font">How It Works</h2>
          <div className="row">
            {steps.map((s, i) => (
              <div key={i} className="col-md-3 text-center">
                <div className="mb-3">
                  <div className="rounded-circle bg-primary-custom d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <i className={`${s.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
                <h5>{s.title}</h5>
                <p className="text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" className="py-5" ref={quickStartRef}>
        <div className="container">
          <h2 className="text-center mb-5 accent-font">What To Do First</h2>
          <div className="row g-4">
            {quickStartItems.map((item, i) => (
              <div key={i} className="col-md-4">
                <motion.div initial={{ opacity: 0, y: 35 }} animate={quickStartInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12 }}>
                  <div className="card h-100 p-4">
                    <i className={`${item.icon} text-primary-custom`} style={{ fontSize: '2.2rem' }}></i>
                    <h5 className="mt-3">{item.title}</h5>
                    <p className="text-muted">{item.desc}</p>
                    <Link to={item.to} className="btn btn-outline-dark btn-sm mt-auto">{item.action}</Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 accent-font">Popular Learning Paths</h2>
          <div className="row g-4">
            {[
              { name: 'Frontend Developer', icon: 'bi-palette', skills: ['HTML/CSS', 'JavaScript', 'React', 'UI/UX'], duration: '3-6 months', color: '#61DAFB' },
              { name: 'Backend Developer', icon: 'bi-server', skills: ['Python/Node.js', 'Databases', 'APIs', 'DevOps'], duration: '4-8 months', color: '#68A063', highlight: true },
              { name: 'Data Scientist', icon: 'bi-graph-up', skills: ['Python', 'Statistics', 'ML', 'Data Viz'], duration: '6-12 months', color: '#8E44AD' }
            ].map((path, i) => (
              <div key={i} className="col-md-4">
                <div className={`card h-100 p-4 ${path.highlight ? 'border-primary border-3' : ''}`}>
                  <div className="text-center mb-3">
                    <i className={`${path.icon}`} style={{ fontSize: '3rem', color: path.color }}></i>
                  </div>
                  <h4 className="text-center">{path.name}</h4>
                  <p className="text-center text-muted mb-3"><i className="bi bi-clock me-1"></i>{path.duration}</p>
                  <ul className="list-unstyled">
                    {path.skills.map((s, j) => <li key={j} className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>{s}</li>)}
                  </ul>
                  <Link to="/register" className="btn btn-primary mt-auto w-100">Start Learning</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <h2 className="accent-font mb-3">Built For Consistent Progress</h2>
              <p className="mb-2">Alchemist helps you move from confusion to clarity with guided paths, adaptive practice, and one place for your learning plan.</p>
              <p className="text-muted mb-0">Useful over flashy: every feature is designed to answer what to learn next, when to learn it, and how to stay on track.</p>
            </div>
            <div className="col-lg-5">
              <div className="card p-4">
                <h5 className="mb-3"><i className="bi bi-calendar3 me-2"></i>Weekly Learning Planner</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2"><i className="bi bi-check2 text-success me-2"></i>Monday: Goal review + 1 new concept</li>
                  <li className="mb-2"><i className="bi bi-check2 text-success me-2"></i>Tuesday to Thursday: Practice + mini project</li>
                  <li className="mb-2"><i className="bi bi-check2 text-success me-2"></i>Friday: Quiz and confidence check</li>
                  <li><i className="bi bi-check2 text-success me-2"></i>Weekend: Reflection and roadmap update</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h5>Product</h5>
              <ul className="list-unstyled">
                <li><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
                <li><a href="#quick-start" className="text-white-50 text-decoration-none">Quick Start</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Company</h5>
              <ul className="list-unstyled">
                <li><a href="#about" className="text-white-50 text-decoration-none">About</a></li>
                <li><Link to="/register" className="text-white-50 text-decoration-none">Join Us</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Resources</h5>
              <ul className="list-unstyled">
                <li><Link to="/login" className="text-white-50 text-decoration-none">AI Mentor</Link></li>
                <li><Link to="/register" className="text-white-50 text-decoration-none">Get Started</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li><span className="text-white-50">Privacy policy coming soon</span></li>
                <li><span className="text-white-50">Terms coming soon</span></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-white-50">&copy; {new Date().getFullYear()} Alchemist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
