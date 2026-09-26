import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Tag
} from 'lucide-react';
import '../styles/Subscriptions.css';
import Header from '../components/Header';
import SubscriptionCategoryFilter from '../components/subscriptions/SubscriptionCategoryFilter';
import SubscriptionList from '../components/subscriptions/SubscriptionList';
import SubscriptionCheckoutModal from '../components/subscriptions/SubscriptionCheckoutModal';
import { brandAssets } from '../assets/brandAssets';
import api from '../services/api';

// --- CUSTOM SVG LOGOS ---
const AppleLogo = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const NetflixLogo = ({ size = 40 }) => (
  <img className="subscription-logo-svg" style={{ width: size, height: size }} src={brandAssets.netflix} alt="Netflix" />
);

const YoutubeLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 120 85" fill="#FF0000">
    <path d="M117.8 13.2c-1.4-5.2-5.5-9.3-10.7-10.7C97.6 0 60 0 60 0s-37.6 0-47.1 2.5C7.7 3.9 3.6 8 2.2 13.2 0 22.7 0 42.5 0 42.5s0 19.8 2.2 29.3c1.4 5.2 5.5 9.3 10.7 10.7C22.4 85 60 85 60 85s37.6 0 47.1-2.5c5.2-1.4 9.3-5.5 10.7-10.7 2.2-9.5 2.2-29.3 2.2-29.3s0-19.8-2.2-29.3z"/>
    <path fill="#FFF" d="M48 60.5l31.5-18L48 24.5v36z"/>
  </svg>
);

const ChatGptLogo = ({ size = 40 }) => (
  <img className="subscription-logo-svg promo-chatgpt-logo" style={{ width: size, height: size }} src={brandAssets.chatgpt} alt="ChatGPT" />
);

const CanvaLogo = ({ size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #00C4CC, #7D2AE8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: size * 0.6, fontStyle: 'italic' }}>C</div>
);

const GenericTextLogo = ({ text, color, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: size * 0.5 }}>{text}</div>
);

// --- APP DATABASE (UPDATED FOR LIST VIEW) ---
const CATEGORIES = ['All', 'Entertainment', 'Pro VPN', 'Editing Tools', 'AIs', 'Cloud Space'];
const SUBSCRIPTIONS_PER_PAGE = 5;

const APPS_DATA = [
  { 
    id: 'netflix', name: 'Netflix', subtitle: 'Instant Delivery', category: 'Entertainment', priceDisplay: '7,500 FCFA', billing: 'MONTHLY', colorClass: 'bg-black', Icon: NetflixLogo,
    plans: [
      { id: 'n1', duration: '1 Month', price: 7500, label: 'Standard' },
      { id: 'n3', duration: '3 Months', price: 21000, label: 'Save 6%' },
      { id: 'n12', duration: '12 Months', price: 75000, label: 'Save 16%', isPopular: true }
    ]
  },
  { 
    id: 'apple-music', name: 'Apple Music', subtitle: 'Global Account', category: 'Entertainment', priceDisplay: '3,000 FCFA', billing: 'MONTHLY', colorClass: 'app-music-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.appleMusic} alt="Apple Music" />,
    plans: [
      { id: 'am1', duration: '1 Month', price: 3000, label: 'Standard' },
      { id: 'am12', duration: '12 Months', price: 30000, label: 'Save 16%', isPopular: true }
    ]
  },
  { 
    id: 'youtube', name: 'YouTube Premium', subtitle: 'No Ads', category: 'Entertainment', priceDisplay: '4,500 FCFA', billing: 'MONTHLY', colorClass: 'bg-white border-sub', Icon: YoutubeLogo,
    plans: [
      { id: 'yt1', duration: '1 Month', price: 4500, label: 'Standard' },
      { id: 'yt12', duration: '12 Months', price: 48000, label: 'Save 11%', isPopular: true }
    ]
  },
  { 
    id: 'chatgpt', name: 'ChatGPT Plus', subtitle: 'GPT-4 Access', category: 'AIs', priceDisplay: '13,500 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: ChatGptLogo,
    plans: [
      { id: 'g1', duration: '1 Month', price: 13500, label: 'Standard' },
      { id: 'g6', duration: '6 Months', price: 75000, label: 'Save 7%' },
      { id: 'g12', duration: '12 Months', price: 135000, label: 'Save 16%', isPopular: true }
    ]
  },
  { 
    id: 'nordvpn', name: 'NordVPN', subtitle: 'Secure Browsing', category: 'Pro VPN', priceDisplay: '4,000 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.nordvpn} alt="NordVPN" />,
    plans: [
      { id: 'nv1', duration: '1 Month', price: 4000, label: 'Standard' },
      { id: 'nv12', duration: '12 Months', price: 36000, label: 'Save 25%', isPopular: true }
    ]
  },
  { 
    id: 'canva', name: 'Canva Pro', subtitle: 'Premium Templates', category: 'Editing Tools', priceDisplay: '7,000 FCFA', billing: 'MONTHLY', colorClass: 'bg-indigo-50', Icon: CanvaLogo,
    plans: [
      { id: 'c1', duration: '1 Month', price: 7000, label: 'Standard' },
      { id: 'c12', duration: '12 Months', price: 65000, label: 'Save 22%', isPopular: true }
    ]
  },
  {
    id: 'claude', name: 'Claude Pro', subtitle: 'AI Assistant', category: 'AIs', priceDisplay: '13,500 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.claude} alt="Claude" />,
    plans: [{ id: 'cl1', duration: '1 Month', price: 13500, label: 'Standard' }, { id: 'cl12', duration: '12 Months', price: 135000, label: 'Save 16%', isPopular: true }]
  },
  {
    id: 'capcut', name: 'CapCut Pro', subtitle: 'Video Editing', category: 'Editing Tools', priceDisplay: '5,500 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.capcut} alt="CapCut" />,
    plans: [{ id: 'cc1', duration: '1 Month', price: 5500, label: 'Standard' }, { id: 'cc12', duration: '12 Months', price: 55000, label: 'Save 17%', isPopular: true }]
  },
  {
    id: 'prime', name: 'Amazon Prime', subtitle: 'Prime Video', category: 'Entertainment', priceDisplay: '5,000 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.amazonPrime} alt="Amazon Prime" />,
    plans: [{ id: 'pr1', duration: '1 Month', price: 5000, label: 'Standard' }, { id: 'pr12', duration: '12 Months', price: 50000, label: 'Save 17%', isPopular: true }]
  },
  {
    id: 'gemini', name: 'Gemini Pro', subtitle: 'Google AI', category: 'AIs', priceDisplay: '9,500 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.gemini2025} alt="Gemini Pro" />,
    plans: [{ id: 'gm1', duration: '1 Month', price: 9500, label: 'Standard' }, { id: 'gm12', duration: '12 Months', price: 95000, label: 'Save 16%', isPopular: true }]
  },
  {
    id: 'google-photos', name: 'Google Photos', subtitle: 'Cloud Storage', category: 'Cloud Space', priceDisplay: '4,000 FCFA', billing: 'YEARLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.googlePhotos} alt="Google Photos" />,
    plans: [
      { id: 'gp100', duration: '12 Months', storage: '100 GB', price: 4000, label: 'Starter' },
      { id: 'gp200', duration: '12 Months', storage: '200 GB', price: 6500, label: 'Popular', isPopular: true },
      { id: 'gp2tb', duration: '12 Months', storage: '2 TB', price: 12000, label: 'Best Value' }
    ]
  },
  {
    id: 'icloud-plus', name: 'iCloud+', subtitle: 'Cloud Storage', category: 'Cloud Space', priceDisplay: '3,500 FCFA', billing: 'YEARLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.icloud} alt="iCloud Plus" />,
    plans: [
      { id: 'ic50', duration: '12 Months', storage: '50 GB', price: 3500, label: 'Starter' },
      { id: 'ic200', duration: '12 Months', storage: '200 GB', price: 6500, label: 'Popular', isPopular: true },
      { id: 'ic2tb', duration: '12 Months', storage: '2 TB', price: 12000, label: 'Best Value' }
    ]
  },
  {
    id: 'google-pro', name: 'Google Pro', subtitle: 'Gemini AI, Flow, 2 TB', category: 'Cloud Space', priceDisplay: '18,000 FCFA', billing: '18 MONTHS', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg" src={brandAssets.google} alt="Google Pro" />,
    plans: [{ id: 'gpro18', duration: '18 Months', storage: '2 TB + Pro services', price: 18000, label: 'Complete plan', isPopular: true }]
  },
  {
    id: 'disney-plus', name: 'Disney+', subtitle: 'Premium Streaming', category: 'Entertainment', priceDisplay: '5,500 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg subscription-wide-logo" src={brandAssets.disneyPlus} alt="Disney Plus" />,
    plans: [{ id: 'dp1', duration: '1 Month', price: 5500, label: 'Standard' }, { id: 'dp12', duration: '12 Months', price: 55000, label: 'Save 17%', isPopular: true }]
  },
  {
    id: 'paramount-plus', name: 'Paramount+', subtitle: 'Premium Streaming', category: 'Entertainment', priceDisplay: '5,000 FCFA', billing: 'MONTHLY', colorClass: 'app-logo-box', Icon: () => <img className="subscription-logo-svg subscription-wide-logo" src={brandAssets.paramountPlus} alt="Paramount Plus" />,
    plans: [{ id: 'pp1', duration: '1 Month', price: 5000, label: 'Standard' }, { id: 'pp12', duration: '12 Months', price: 50000, label: 'Save 17%', isPopular: true }]
  },
];

const PROMO_SLIDES = [
  {
    id: 'promo-gpt',
    app: 'ChatGPT Plus',
    tag: 'Yearly Promo - Save 25%',
    title: 'Unlock GPT-4 For A Full Year',
    desc: 'Subscribe annually and save big on the ultimate AI assistant.',
    bgClass: 'promo-green',
    Icon: ChatGptLogo
  },
  {
    id: 'promo-netflix',
    app: 'Netflix Premium',
    tag: 'Yearly Promo - Get 2 Months Free',
    title: 'Binge Without Limits',
    desc: 'Pay for 10 months, get a full year of 4K HDR entertainment.',
    bgClass: 'promo-dark',
    Icon: NetflixLogo
  },
  {
    id: 'promo-google',
    app: 'Google One 2TB',
    tag: 'Yearly Promo - Save 17%',
    title: 'Massive Cloud Space',
    desc: 'Secure all your photos and files with Google Pro annual billing.',
    bgClass: 'promo-blue',
    Icon: () => <img className="subscription-logo-svg promo-logo" src={brandAssets.gemini2025} alt="Gemini Pro" />
  }
];

export default function SubscriptionsPage() {
  const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  const isSafariMobile = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 900px)').matches
    && /Safari\//i.test(userAgent)
    && !/(Chrome|CriOS|Chromium|Edg|OPR|SamsungBrowser|YaBrowser|FxiOS|EdgiOS|OPiOS)\//i.test(userAgent);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categoryTransitioning, setCategoryTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [listVisible, setListVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Checkout Modal State
  const [checkoutApp, setCheckoutApp] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const categoryTouchStartX = useRef(null);
  const subscriptionRequestKey = useRef(null);
  const listTriggerRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
    if (!token) return;

    api.get('/auth/me')
      .then(({ data }) => setAccountEmail(data.user?.email || ''))
      .catch(() => setAccountEmail(''));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const trigger = listTriggerRef.current;
    if (!trigger) return undefined;

    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const userAgent = navigator.userAgent;
    const isChrome = /CriOS\//i.test(userAgent)
      || (/Chrome\//i.test(userAgent) && !/(Edg|OPR|SamsungBrowser|YaBrowser)\//i.test(userAgent));
    if (!isMobile || !isChrome) {
      setListVisible(false);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setListVisible(entry.isIntersecting);
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px -220px 0px',
    });

    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  const filteredApps = activeCategory === 'All' 
    ? APPS_DATA 
    : APPS_DATA.filter(app => app.category === activeCategory);
  const pageCount = Math.max(1, Math.ceil(filteredApps.length / SUBSCRIPTIONS_PER_PAGE));
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * SUBSCRIPTIONS_PER_PAGE,
    currentPage * SUBSCRIPTIONS_PER_PAGE
  );

  const openCheckout = (app) => {
    setCheckoutApp(app);
    setSelectedPlan(app.plans[0]);
    setSubmitError('');
    setIsSubmitting(false);
    subscriptionRequestKey.current = null;
  };

  const closeCheckout = () => {
    if (isSubmitting) return;
    setCheckoutApp(null);
    setSelectedPlan(null);
    setSubmitError('');
    setIsSubmitting(false);
    subscriptionRequestKey.current = null;
  };

  const handleSubscriptionSubmit = async (checkoutDetails) => {
    if (isSubmitting || !checkoutApp || !selectedPlan) return;
    setIsSubmitting(true);
    setSubmitError('');
    if (!subscriptionRequestKey.current) {
      subscriptionRequestKey.current = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}-subscription`;
    }

    try {
      const response = await api.post('/subscriptions/orders', {
        appId: checkoutApp.id,
        planId: selectedPlan.id,
        ...checkoutDetails
      }, {
        headers: { 'Idempotency-Key': subscriptionRequestKey.current }
      });
      setIsSubmitting(false);
      return response.data;
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Unable to create your subscription order. Please try again.');
      setIsSubmitting(false);
      return null;
    }
  };

  const handleMobileSearchClick = () => {
    // If you have a search bar, scroll to it. Or redirect.
    navigate('/redeem');
  };

  const handleCategoryTouchStart = (event) => {
    categoryTouchStartX.current = event.touches[0].clientX;
  };

  const handleCategoryTouchEnd = (event) => {
    if (categoryTouchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - categoryTouchStartX.current;
    if (Math.abs(distance) >= 50) {
      const currentIndex = CATEGORIES.indexOf(activeCategory);
      const nextIndex = distance < 0
        ? (currentIndex + 1) % CATEGORIES.length
        : (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
      changeCategory(CATEGORIES[nextIndex]);
    }
    categoryTouchStartX.current = null;
  };

  const changeCategory = (category) => {
    if (category === activeCategory) return;
    setCategoryTransitioning(true);
    setActiveCategory(category);
    setCurrentPage(1);
    window.setTimeout(() => setCategoryTransitioning(false), 360);
  };

  return (
    <div className={`site subs-page ${isSafariMobile ? 'safari-mobile' : ''}`}>
      
      <Header />

      <main className="subs-container fade-in">
        
        {/* --- FULL-WIDTH PROMO HERO SLIDER --- */}
        <section className="promo-hero-section">
          <div className="promo-slider-wrapper">
            {PROMO_SLIDES.map((slide, index) => (
              <div key={slide.id} className={`promo-slide ${index === currentSlide ? 'active' : ''} ${slide.bgClass}`}>
                <div className="promo-content">
                  <span className="promo-tag"><Tag size={14} /> {slide.tag}</span>
                  <h2>{slide.title}</h2>
                  <p>{slide.desc}</p>
                  <button className="btn-claim-promo">Claim Yearly Plan <ArrowRight size={16}/></button>
                </div>
                <div className="promo-visual">
                  <slide.Icon size={120} />
                </div>
              </div>
            ))}

          </div>
          <div className="promo-pagination">
            {PROMO_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        <div className="subscription-browse-section">
          <SubscriptionCategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={changeCategory}
          />

          <div ref={listTriggerRef} className="subscription-list-trigger" aria-hidden="true" />

          <SubscriptionList
            apps={paginatedApps}
            categoryTransitioning={categoryTransitioning}
            isVisible={listVisible}
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={setCurrentPage}
            onSelectApp={openCheckout}
            onTouchStart={handleCategoryTouchStart}
            onTouchEnd={handleCategoryTouchEnd}
          />
        </div>

      </main>

      <SubscriptionCheckoutModal
        checkoutApp={checkoutApp}
        selectedPlan={selectedPlan}
        accountEmail={accountEmail}
        isLoggedIn={isLoggedIn}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onClose={closeCheckout}
        onSelectPlan={setSelectedPlan}
        onSubmit={handleSubscriptionSubmit}
      />

    </div>
  );
}