import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { brandAssets } from '../assets/brandAssets';
import './Redeem.css';
import Header from '../components/Header';
import MarketplaceGrid from '../components/redeem/MarketplaceGrid';
import RedeemFlow from '../components/redeem/RedeemFlow';

// --- CUSTOM BRAND LOGOS ---
const AppleLogo = ({ size = 48, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const NikeLogo = ({ size = 48, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 8.5c-4.4 0-9.2 1.4-13.3 4C6.2 15.3 2 19 2 23c0 2.5 1.5 4.5 4.2 4.5 4.8 0 10.5-5.5 15.3-9.5 4-3.3 8.3-6.5 12.5-6.5 2.2 0 4 .5 4 2.5 0 2.8-4.5 6.5-9 9l2 1.5c5.5-3 11-7.5 11-12 0-3.5-3-4-6-4-4.5 0-9 2-12 4.5z"/>
  </svg>
);

const SteamLogo = ({ size = 48 }) => (
  <img src={brandAssets.steam} width={size} height={size} alt="Steam" style={{ objectFit: 'contain' }} />
);

const AmazonLogo = ({ size = 48 }) => (
  <img src={brandAssets.amazon} width={size * 2} height={size} alt="Amazon" style={{ objectFit: 'contain' }} />
);

const XboxLogo = ({ size = 48 }) => (
  <img src={brandAssets.xbox} width={size} height={size} alt="Xbox" style={{ objectFit: 'contain' }} />
);

const PaypalLogo = ({ size = 60 }) => (
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" width={size} height={size} alt="PayPal" style={{ objectFit: 'contain' }} />
);

const McdonaldsLogo = ({ size = 48 }) => (
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg" width={size} height={size} alt="McDonalds" style={{ objectFit: 'contain' }} />
);

const StarbucksLogo = ({ size = 48 }) => (
  <img src="https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg" width={size} height={size} alt="Starbucks" style={{ objectFit: 'contain' }} />
);

// --- SPREAD CONFIGURATION ---
export const CARDS_DATA = [
  { id: 'apple', brand: 'Apple', title: 'Apple Gift Card', text: 'App Store, iTunes, iPhone, iPad, AirPods, and more.', colorClass: 'bg-apple', Icon: AppleLogo },
  { id: 'steam', brand: 'Steam', title: 'Steam Gift Card', text: 'Wallet funds for games, software, hardware, and more.', colorClass: 'bg-steam', Icon: SteamLogo },
  { id: 'amazon', brand: 'Amazon', title: 'Amazon Gift Card', text: 'Shop millions of items storewide on Amazon.', colorClass: 'bg-amazon', Icon: AmazonLogo },
  { id: 'xbox', brand: 'Xbox', title: 'Xbox Gift Card', text: 'Games, add-ons, map packs, and Xbox Live Gold.', colorClass: 'bg-xbox', Icon: XboxLogo },
  { id: 'visa', brand: 'Visa', title: 'Visa Prepaid Card', text: 'Use everywhere Visa debit cards are accepted online.', colorClass: 'bg-visa', 
    Icon: ({ size, color }) => (<span style={{ fontSize: size * 0.8, fontWeight: 900, fontStyle: 'italic', color, letterSpacing: '-1px' }}>VISA</span>) 
  },
];

export default function DashboardPage() {
  const { cardId } = useParams();
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const [heroVisible, setHeroVisible] = useState(false);
  const [archVisible, setArchVisible] = useState(false);
  const [volumeTotal, setVolumeTotal] = useState(0);
  const heroSectionRef = useRef(null);
  const archSectionRef = useRef(null);
  const heroTouchStartX = useRef(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const selectedCard = CARDS_DATA.find((card) => card.id === cardId);

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    if (!heroSection) return undefined;

    setHeroVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHeroVisible(true);
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, [cardId]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) {
        setHeaderHidden(false);
      } else {
        setHeaderHidden(currentScrollY > lastScrollY.current);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroTouchStart = (event) => {
    heroTouchStartX.current = event.touches[0].clientX;
  };

  const handleHeroTouchEnd = (event) => {
    if (heroTouchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - heroTouchStartX.current;
    if (Math.abs(distance) >= 50) {
      setActiveCardIndex((current) => (
        distance < 0
          ? (current + 1) % CARDS_DATA.length
          : (current - 1 + CARDS_DATA.length) % CARDS_DATA.length
      ));
    }
    heroTouchStartX.current = null;
  };

  useEffect(() => {
    const archSection = archSectionRef.current;
    if (!archSection) return undefined;

    setArchVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setArchVisible(true);
      observer.disconnect();
    }, { threshold: 0.25 });

    observer.observe(archSection);
    return () => observer.disconnect();
  }, [cardId]);

  useEffect(() => {
    if (!archVisible) return undefined;

    const target = 10005789;
    const duration = 1600;
    const startedAt = performance.now();
    let frameId;

    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setVolumeTotal(Math.floor(progress * target));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [archVisible]);

  // --- AUTOMATIC 10 SECOND SLIDER FOR SPREAD ---
  useEffect(() => {
    if (selectedCard) return undefined;

    const interval = setInterval(() => {
      setActiveCardIndex((current) => (current + 1) % CARDS_DATA.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, [selectedCard]);

  const getPositionClass = (index) => {
    const total = CARDS_DATA.length;
    const diff = (index - activeCardIndex + total) % total;
    if (diff === 0) return 'pos-center';
    if (diff === 1) return 'pos-mid-right';
    if (diff === 2) return 'pos-far-right';
    if (diff === 3) return 'pos-far-left';
    if (diff === 4) return 'pos-mid-left';
    return '';
  };

  return (
    <div className="site dashboard-page">
      
      <Header />

      <main className="dashboard-container fade-in">
        {selectedCard ? (
          <RedeemFlow
            card={selectedCard}
            onBack={() => navigate('/redeem')}
            onNavigate={navigate}
          />
        ) : (
          <>
        {/* =========================================
            SECTION 1: THE GIFT CARD SPREAD 
            ========================================= */}
        <section
          ref={heroSectionRef}
          className={`hero-spread-section ${heroVisible ? 'hero-visible' : ''}`}
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
        >
          
          <div className="card-spread-container">
            {CARDS_DATA.map((card, index) => (
              <div 
                key={card.id} 
                className={`spread-card ${getPositionClass(index)}`}
              >
                <div className={`card-color-bg ${card.colorClass}`}>
                  <div className="card-icon-wrapper">
                    <card.Icon size={56} color="#ffffff" />
                    {card.id !== 'amazon' && card.id !== 'visa' && (
                      <span className="card-brand">{card.brand}</span>
                    )}
                  </div>
                </div>
                
                <div className="card-glass-black-details">
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-footer">
            <a href="#marketplace" className="btn-redeem-black">
              Redeem Gift Card
            </a>
            <p className="hero-subtitle">

              Get instant payouts and the best rates when it matters most with personalized guidance.
            </p>
          </div>
        </section>

        <MarketplaceGrid
          cards={CARDS_DATA}
          onCardSelect={(id) => navigate(`/redeem/${id}`)}
        />

        {/* =========================================
            SECTION 3: THE $10M ARCH 
            ========================================= */}
        <section ref={archSectionRef} className={`arch-view-section ${archVisible ? 'arch-visible' : ''}`}>
          <div className="arch-container">
            
            <div className="arch-card arch-xbox bg-xbox-light">
              <XboxLogo size={40} />
            </div>
            
            <div className="arch-card arch-nike bg-nike">
              <AppleLogo size={48} color="#fff" />
            </div>

            <div className="arch-card arch-visa bg-visa">
              <span className="arch-visa-text">VISA</span>
              <span className="arch-visa-sub">VISA</span>
            </div>
            
            <div className="arch-card arch-mcd bg-mcd">
              <McdonaldsLogo size={56} />
              <span style={{ fontSize: '13px', marginTop: '12px', fontWeight: 'bold' }}>McDonald's</span>
            </div>
            
            <div className="arch-card arch-starbucks bg-starbucks">
              <StarbucksLogo size={56} />
              <span style={{ fontSize: '11px', marginTop: '12px', letterSpacing: '1px' }}>STARBUCKS</span>
            </div>

            <div className="arch-card arch-amazon bg-amazon-black">
              <AmazonLogo size={40} />
            </div>

            <div className="arch-card arch-paypal bg-paypal">
              <PaypalLogo size={70} />
            </div>

            <div className="arch-center-content">
              <h1 className="volume-number">${volumeTotal.toLocaleString('en-US')}</h1>
              <p className="volume-text">
                Once a user reaches the minimum cashout threshold, they can select their preferred payout method and complete the cashout process by following the instructions in the app.
              </p>
            </div>

          </div>
        </section>

          </>
        )}
      </main>
    </div>
  );
}