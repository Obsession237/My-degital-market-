import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Zap, User, Home, Search } from 'lucide-react';
import './Header.css';

export default function Header({ landing = false, dockHidden = false, points = null }) {
  const [open, setOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  
  const lastScrollY = useRef(0);
  const headerHiddenRef = useRef(false);
  const scrollFrame = useRef(null);
  
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  const handleMobileSearch = () => {
    navigate('/search');
  };

  const closeMenu = () => {
    setOpen(false);
  };

  // --- DISABLE BACKGROUND SCROLLING WHEN MENU IS OPEN ---
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const nextHidden = currentScrollY > 10 && currentScrollY > lastScrollY.current;
        if (currentScrollY <= 10 || nextHidden !== headerHiddenRef.current) {
          headerHiddenRef.current = nextHidden;
          setHeaderHidden(nextHidden);
        }
        lastScrollY.current = currentScrollY;
        scrollFrame.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  return (
    <>
      <header className={`header-wrapper site-header ${headerHidden ? 'header-hidden' : ''}`}>
        <div className="header-pill">

          {points !== null && (
            <div className="header-points-pill mobile-only">
              <Zap size={15} color="#fff" fill="#fff" />
              <span>{points.toLocaleString()} pts</span>
              <button className="btn-add-points" onClick={() => navigate('/buy-points')} aria-label="Add Points">
                <span aria-hidden="true">+</span>
              </button>
            </div>
          )}
          
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon"><Zap size={22} fill="currentColor" /></span>
            <span className="logo-text">GIFTPRO</span>
          </Link>

          <nav className={`nav ${open ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-home" onClick={closeMenu}>Home</Link>
            
            <a href="/#about" onClick={closeMenu}>About Us</a>
            
            {/* =======================================
                PC ONLY: MEGA MENU 
                ======================================= */}
            <div className="pc-services-wrapper pc-only">
              <button className="nav-dropdown" type="button">
                Services <ChevronDown size={14} strokeWidth={3} className="chevron-icon" />
              </button>
              
              <div className="pc-mega-menu">
                <div className="services-menu-heading">Explore GIFTPRO</div>
                <Link to="/redeem" onClick={closeMenu}>
                  <strong>Gift Cards</strong><span>Trade cards for fast payouts.</span>
                </Link>
                <Link to="/virtual-numbers" onClick={closeMenu}>
                  <strong>Virtual Numbers</strong><span>Private SMS verification.</span>
                </Link>
                <Link to="/subscriptions" onClick={closeMenu}>
                  <strong>Subscriptions</strong><span>Premium apps and cloud plans.</span>
                </Link>
                <Link to="/facebook-growth" onClick={closeMenu}>
                  <strong>Facebook Growth</strong><span>Build your community.</span>
                </Link>
                <Link to="/receive-payments" onClick={closeMenu}>
                  <strong>Receive Payments</strong><span>Collect payments securely.</span>
                </Link>
                <Link to="/social-boosting" onClick={closeMenu}>
                  <strong>Social Boosting</strong><span>Grow your social presence.</span>
                </Link>
              </div>
            </div>

            {/* =======================================
                MOBILE ONLY: ALL FLAT LINKS RETURNED
                ======================================= */}
            <Link to="/redeem" className="mobile-only" onClick={closeMenu}>Gift Cards</Link>
            <Link to="/virtual-numbers" className="mobile-only" onClick={closeMenu}>Virtual Numbers</Link>
            <Link to="/subscriptions" className="mobile-only" onClick={closeMenu}>Subscriptions</Link>
            <Link to="/facebook-growth" className="mobile-only" onClick={closeMenu}>Facebook Growth</Link>
            <Link to="/receive-payments" className="mobile-only" onClick={closeMenu}>Receive Payments</Link>
            <Link to="/social-boosting" className="mobile-only" onClick={closeMenu}>Social Boosting</Link>

            {/* Contact Us */}
            <a href="mailto:support@giftpro.app" className="nav-contact" onClick={closeMenu}>Contact Us</a>

            {!isLoggedIn && <Link to="/login" className="mobile-login-btn mobile-only" onClick={closeMenu}>Login</Link>}
          </nav>

          <div className="header-actions">
            {isLoggedIn ? (
              <>
                {points !== null && (
                  <div className="header-points-pill pc-only">
                    <Zap size={15} color="#fff" fill="#fff" />
                    <span>{points.toLocaleString()} pts</span>
                    <button className="btn-add-points" onClick={() => navigate('/buy-points')} aria-label="Add Points">
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                )}
                <div className="user-avatar-circle" onClick={() => navigate('/user-dashboard')} role="button" tabIndex={0}>
                  <User size={18} color="#fff" />
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-login-transparent">Login</Link>
            )}
          </div>

          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
          
        </div>
      </header>

      {/* MOBILE FLOATING DOCK */}
      <nav className={`mobile-dock ${dockHidden ? 'mobile-dock-hidden' : ''}`} aria-label="Mobile navigation">
        <button className="dock-item active" onClick={() => navigate('/')} aria-label="Home"><Home size={22} /></button>
        <button className="dock-item" onClick={handleMobileSearch} aria-label="Search"><Search size={22} /></button>
        <button className="dock-item" onClick={() => navigate(isLoggedIn ? '/user-dashboard' : '/login')} aria-label="Account"><User size={22} /></button>
      </nav>
    </>
  );
}