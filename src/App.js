import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './components/DashboardLayout';
import LearningDNA from './pages/LearningDNA';
import TimeAdaptivePath from './pages/TimeAdaptivePath';
import AIMentorChat from './pages/AIMentorChat';
import PeerTwins from './pages/PeerTwins';
import ConfidenceQuiz from './pages/ConfidenceQuiz';
import MyProgress from './pages/MyProgress';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import UserManager from './pages/UserManager';
import WebsiteCustomizer from './pages/WebsiteCustomizer';
import PersonalizedRoadmap from './pages/PersonalizedRoadmap';
import CourseCatalog from './pages/CourseCatalog';

function App() {
  const [user, setUser] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      const userGoal = localStorage.getItem('userGoal');
      // Only need onboarding if no goal AND user has no career_goal in database
      if (!userGoal && !userData.career_goal) {
        setNeedsOnboarding(true);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Check if user has completed onboarding before
    const userGoal = localStorage.getItem('userGoal');
    if (!userGoal && !userData.career_goal) {
      setNeedsOnboarding(true);
    } else {
      setNeedsOnboarding(false);
    }
  };
  
  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={needsOnboarding ? "/onboarding" : "/dashboard/roadmap"} /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to={needsOnboarding ? "/onboarding" : "/dashboard/roadmap"} /> : <Register onLogin={handleLogin} />} />
        <Route path="/onboarding" element={user ? <Onboarding user={user} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard/roadmap" />} />
          <Route path="roadmap" element={<PersonalizedRoadmap />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="learning-dna" element={<LearningDNA />} />
          <Route path="time-path" element={<TimeAdaptivePath />} />
          <Route path="ai-chat" element={<AIMentorChat />} />
          <Route path="peer-twins" element={<PeerTwins />} />
          <Route path="quiz" element={<ConfidenceQuiz />} />
          <Route path="progress" element={<MyProgress />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/admin" element={user?.is_admin ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManager />} />
          <Route path="customizer" element={<WebsiteCustomizer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
