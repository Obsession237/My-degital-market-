import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleUserRound, CreditCard, LogOut, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import './SearchPage.css';

export default function UserDashboard() {
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  return (
    <div className="search-page user-dashboard-page">
      <Header />
      <main className="search-page-content">
        <div className="account-heading">
          <CircleUserRound size={42} />
          <div>
            <p className="search-eyebrow">YOUR ACCOUNT</p>
            <h1>User dashboard</h1>
          </div>
        </div>
        {!isLoggedIn ? (
          <section className="account-panel">
            <ShieldCheck size={28} />
            <h2>Sign in to continue</h2>
            <p>Access your redemption history, account details, and security settings.</p>
            <Link className="account-action" to="/login">Log in <ArrowRight size={17} /></Link>
          </section>
        ) : (
          <div className="account-grid">
            <Link className="account-panel" to="/redeem"><CreditCard size={28} /><h2>Redeem a gift card</h2><p>Trade another card at the current rate.</p><ArrowRight size={17} /></Link>
            <button className="account-panel account-logout" onClick={() => { localStorage.removeItem('accessToken'); window.location.href = '/'; }}><LogOut size={28} /><h2>Log out</h2><p>End this session on this device.</p></button>
          </div>
        )}
      </main>
    </div>
  );
}
