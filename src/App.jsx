import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Page Imports
import Landing from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import VerifyOtpPage from './pages/VerifyOtp';
import RedeemPage from './pages/RedeemPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SearchPage from './pages/SearchPage';
import UserDashboard from './pages/UserDashboard';
import FloatingConcierge from './components/FloatingConcierge';
import TwoFactorLogin from './pages/TwoFactorLogin';
import VirtualNumbers from './pages/VirtualNumbers';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/2fa-login" element={<TwoFactorLogin />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/virtual-numbers" element={<VirtualNumbers />} />
        <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/redeem/:cardId" element={<RedeemPage />} />
        <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}><h2>404 Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
      </Routes>
      <FloatingConcierge />
    </>
  );
}