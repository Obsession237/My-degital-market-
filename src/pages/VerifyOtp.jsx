import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, KeyRound } from 'lucide-react';
import api from '../services/api';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  
  // Form State
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend Logic State
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Retrieve the email saved during the registration/login step
  const email = sessionStorage.getItem('registrationEmail') || sessionStorage.getItem('loginEmail') || '';
  const registrationResponse = JSON.parse(sessionStorage.getItem('registrationResponse') || '{}');
  const otpId = registrationResponse?.otpId || null;
  const userId = registrationResponse?.user?.id || null;

  useEffect(() => {
    if (!email) {
      setError('Your verification session has expired. Please sign in or register again.');
    }
  }, [email]);

  // --- TIMER EFFECT ---
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Helper to format seconds into M:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- SUBMIT VERIFICATION CODE ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = otp.trim();

    if (!email || !otpId || !userId) {
      setError('Your registration session has expired. Please register again.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/auth/verify-email', {
        otpId,
        code,
        userId,
      });

      const data = response.data || {};
      
      if (data.token) localStorage.setItem('accessToken', data.token);
      if (data.sessionId) localStorage.setItem('sessionId', data.sessionId);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      
      sessionStorage.removeItem('registrationEmail');
      sessionStorage.removeItem('registrationResponse');
      
      navigate('/redeem');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to verify the code. Please check and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --- RESEND OTP LOGIC ---
  const handleResend = async () => {
    if (resendCount >= 3) return; // Hard stop after 3 attempts
    if (timer > 0) return; // Prevent clicking while timer is active

    if (!email) {
      setError('No email was found for this verification session. Please log in again.');
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Backend endpoint: /auth/resend-verification-email
      const response = await api.post('/auth/resend-verification-email', { email });
      const nextRegistrationResponse = {
        ...registrationResponse,
        otpId: response.data?.otpId || registrationResponse.otpId,
      };
      sessionStorage.setItem('registrationResponse', JSON.stringify(nextRegistrationResponse));
      
      setResendCount((prev) => prev + 1);
      setTimer(180); // 3 minutes countdown (180 seconds)
      setSuccessMsg('A new verification code has been sent to your email.');
      
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to resend code. Please try again later.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      
      {/* Top Left Brand Logo - Navigates Home */}
      <Link to="/" className="brand-logo-top" style={{ textDecoration: 'none' }}>
        <div className="brand-icon">
          <span>$</span>
        </div>
        <span>Marketplace</span>
      </Link>

      {/* Card with Glass Properties */}
      <div className="auth-card auth-card--compact">
        
        {/* Header - Icon perfectly centered via margin: 0 auto */}
        <div className="auth-header">
          <div className="auth-icon-box" style={{ margin: "0 auto 20px auto" }}>
            <ShieldCheck size={22} color="#111" />
          </div>
          <h1>Verify your email</h1>
          <p>
            Enter the 6-digit code we sent to <br />
            <strong>{email || "your email address"}</strong>
          </p>
        </div>

        {/* Feedback Messages */}
        {error && <div className="auth-error">{error}</div>}
        {successMsg && (
          <div style={{
            background: "#dcfce3", 
            color: "#166534", 
            padding: "12px", 
            borderRadius: "8px", 
            fontSize: "13px", 
            marginBottom: "20px", 
            textAlign: "left"
          }}>
            {successMsg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <KeyRound className="input-icon" size={18} />
            <input
              type="text"
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
                setSuccessMsg('');
              }}
              placeholder="123456"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              style={{ letterSpacing: "4px", fontSize: "16px", fontWeight: "600" }} 
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading || otp.length < 6}
            style={{ marginTop: "8px" }}
          >
            {loading ? <Loader2 className="spin" size={18} /> : 'Verify Code'}
          </button>
        </form>

        {/* Resend Logic UI */}
        <div className="auth-switch" style={{ marginTop: "24px" }}>
          {resendCount >= 3 ? (
            <span style={{ color: "#b91c1c", fontWeight: "500" }}>
              Maximum resend attempts reached.
            </span>
          ) : (
            <>
              Didn't receive a code?{" "}
              {timer > 0 ? (
                <span style={{ color: "#71717a", fontWeight: "500" }}>
                  Resend in {formatTime(timer)}
                </span>
              ) : (
                <button 
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {resendLoading ? 'Sending...' : 'Resend'}
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}