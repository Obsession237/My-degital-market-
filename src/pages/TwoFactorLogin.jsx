import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../auth.css';

export default function TwoFactorLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const loginTicket = sessionStorage.getItem('loginTicket');
    if (!loginTicket) {
      setError('Your login session expired. Please sign in again.');
      return;
    }
    if (!/^\d{6}$/.test(token)) {
      setError('Enter the six-digit code from your authenticator app.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.post('/auth/2fa/verify-login', { loginTicket, token });
      const data = response.data;
      localStorage.setItem('accessToken', data.token);
      if (data.sessionId) localStorage.setItem('sessionId', data.sessionId);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.removeItem('loginTicket');
      sessionStorage.removeItem('loginEmail');
      navigate('/redeem', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The verification code was not accepted.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">GIFTPRO SECURITY</p>
        <h1>Verify your sign-in</h1>
        <p>Enter the six-digit code from your authenticator app.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="two-factor-token">Authentication code</label>
          <input
            id="two-factor-token"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={token}
            onChange={(event) => setToken(event.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify and continue'}
          </button>
        </form>
      </section>
    </main>
  );
}
