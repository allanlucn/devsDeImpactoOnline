import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import NewsPage from './pages/NewsPage';
import ProfilePage from './pages/ProfilePage';
import FeedbacksPage from './pages/FeedbacksPage';
import ChatInterfacePage from './pages/ChatInterfacePage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feedbacks" element={<FeedbacksPage />} />
        <Route path="/chat" element={<ChatInterfacePage />} />
      </Routes>
    </Router>
  );
}

export default App;
