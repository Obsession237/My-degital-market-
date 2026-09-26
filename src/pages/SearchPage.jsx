import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X, ArrowLeft, Home, ShoppingBag, User } from 'lucide-react';
import './SearchPage.css';

const results = [
  { type: 'Gift card', title: 'Apple Gift Card', description: 'Redeem Apple gift cards for cash.', link: '/redeem/apple' },
  { type: 'Gift card', title: 'Amazon Gift Card', description: 'Trade Amazon gift cards at current rates.', link: '/redeem/amazon' },
  { type: 'Gift card', title: 'Steam Gift Card', description: 'Redeem Steam wallet cards securely.', link: '/redeem/steam' },
  { type: 'Gift card', title: 'Xbox Gift Card', description: 'Redeem Xbox cards at current rates.', link: '/redeem/xbox' },
  { type: 'Gift card', title: 'Visa Prepaid', description: 'Trade Visa prepaid gift cards.', link: '/redeem/visa' },
  { type: 'Service', title: 'Virtual Numbers', description: 'Secure SMS verification numbers.', link: '/virtual-numbers' },
  { type: 'Service', title: 'Facebook Group Growth', description: 'Grow your community with targeted engagement.', link: '/facebook-growth' },
  { type: 'Service', title: 'App Subscriptions', description: 'Access premium apps and tools.', link: '/subscriptions' },
  { type: 'Service', title: 'Google Photos Storage', description: 'Yearly cloud storage plans.', link: '/subscriptions' },
  { type: 'Service', title: 'iCloud+', description: 'Yearly iCloud storage plans.', link: '/subscriptions' },
  { type: 'Service', title: 'All-in-One Package', description: 'Premium apps and services together.', link: '/subscriptions' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoggedIn] = useState(Boolean(localStorage.getItem('accessToken')));
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Focus the input when the dock search icon is tapped
  const focusSearch = () => {
    setIsFocused(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  // Robust Mobile Keyboard Detection
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const initialHeight = window.innerHeight;

    const handleViewportResize = () => {
      // If the viewport shrinks by more than 15%, the keyboard is open
      if (viewport.height < initialHeight * 0.85) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    viewport.addEventListener('resize', handleViewportResize);
    return () => viewport.removeEventListener('resize', handleViewportResize);
  }, []);

  const filteredResults = results.filter((result) =>
    `${result.title} ${result.description} ${result.type}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="site search-page">
      
      {/* --- STICKY SEARCH HEADER PILL --- */}
      <header className="header-wrapper">
        <div className="search-header-pill">
          <button className="btn-back" onClick={handleBack} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          
          <div className="search-input-container">
            <Search size={18} className="search-icon-left" />
            <input
              ref={searchInputRef}
              autoFocus
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Slight delay prevents flashing on clicks
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cards, numbers, subscriptions..."
            />
            {query && (
              <button className="btn-clear" onClick={() => setQuery('')} aria-label="Clear search">
                <X size={14} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="search-page-content fade-in">
        
        {/* Search Suggestions Pills */}
        {query && (
          <div className="search-suggestions">
            {filteredResults.slice(0, 5).map((result) => (
              <Link key={`suggestion-${result.link}`} to={result.link}>
                {result.title}
              </Link>
            ))}
          </div>
        )}
        
        {/* Results List */}
        <div className="search-results">
          {filteredResults.map((result) => (
            <Link className="search-result-card glass-panel" to={result.link} key={result.link}>
              <div className="result-info">
                <span className="search-result-type">{result.type}</span>
                <strong>{result.title}</strong>
                <span>{result.description}</span>
              </div>
              <ArrowRight size={20} className="result-arrow" />
            </Link>
          ))}
          
          {/* EMPTY STATE */}
          {!filteredResults.length && (
            <div className="search-empty">
              <Search size={48} strokeWidth={1.5} opacity={0.2} />
              <p>No cards or services match "{query}".</p>
            </div>
          )}
        </div>
      </main>

      {/* --- MOBILE FLOATING BOTTOM NAV (SQUIRCLE DOCK) --- */}
      <nav className={`mobile-dock ${isFocused ? 'mobile-dock-hidden' : ''}`} aria-label="Mobile navigation">
        <button className="dock-item" onClick={() => navigate('/')} aria-label="Home">
          <Home size={22} />
        </button>
        <button className="dock-item" onClick={() => navigate('/redeem')} aria-label="Marketplace">
          <ShoppingBag size={22} />
        </button>
        
        {/* Search Icon triggers the input focus */}
        <button className="dock-item active" onClick={focusSearch} aria-label="Search">
          <Search size={22} />
        </button>
        
        <button className="dock-item" onClick={() => navigate(isLoggedIn ? '/user-dashboard' : '/login')} aria-label="Account">
          <User size={22} />
        </button>
      </nav>

    </div>
  );
}