import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import './styles/global.css';

// Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoadingScreen from './components/LoadingScreen';
import AgentChatbot from './components/AgentChatbot';

// Page Components
import Home from './pages/Home';
import Movies from './pages/Movies';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import Reviews from './pages/Reviews';
import MovieDetails from './pages/MovieDetails';
import PageNotFound from './pages/PageNotFound';
import About from './pages/About';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Component
const App = () => {
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  const [hasSeenLoading, setHasSeenLoading] = useState(false);

  useEffect(() => {
    // Check if user has seen the loading screen before
    const hasSeen = localStorage.getItem('hasSeenLoading');
    console.log('Loading screen check:', { hasSeen, showLoading });
    if (hasSeen) {
      setShowLoading(false);
      setHasSeenLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setHasSeenLoading(true);
    localStorage.setItem('hasSeenLoading', 'true');
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  return (
    <div className="app">
      <Navigation />
      
      <main className="main-content">
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/booking" element={
              <ProtectedRoute><Booking /></ProtectedRoute>
            } />
            <Route path="/confirmation" element={
              <ProtectedRoute><Confirmation /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute><EditProfile /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute><Admin /></AdminRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
      <AgentChatbot />
    </div>
  );
};

// Wrapper component to provide router context
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
