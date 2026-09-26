import React from 'react';
import { Link } from 'react-router-dom';
import { brandAssets } from '../../assets/brandAssets';
import phoneAsset from '../../assets/phone.PNG';
import facebookMarkAsset from '../../assets/facebook.svg';
import './ServiceVisual.css';

const AppleLogo = ({ size = 48, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const SteamLogo = ({ size = 48 }) => (
  <img src={brandAssets.steam} width={size} height={size} alt="Steam" style={{ objectFit: 'contain' }} />
);

const AmazonLogo = ({ size = 48 }) => (
  <img src={brandAssets.amazon} width={size * 2} height={size} alt="Amazon" style={{ objectFit: 'contain' }} />
);

const FacebookMark = () => (
  <>
    <img className="fb-main-icon fb-main-icon-desktop" src={brandAssets.facebook} alt="Facebook" />
    <img className="fb-main-icon fb-main-icon-mobile" src={facebookMarkAsset} alt="Facebook" />
  </>
);

export default function ServiceVisual({ type }) {
  if (type === 'facebook') {
    return (
      <div className="service-visual facebook-visual" aria-hidden="true">
        <div className="fb-center-blob"><FacebookMark /></div>
        <div className="floating-pill fb-pill-1">Facebook</div>
        <div className="floating-pill fb-pill-2">
          {brandAssets?.instagram && <img className="social-pill-logo" src={brandAssets.instagram} alt="Instagram" />}
          Instagram
        </div>
        <div className="floating-pill fb-pill-3">Members</div>
      </div>
    );
  }

  if (type === 'numbers') {
    return (
      <div className="service-visual numbers-visual" aria-hidden="true">
        {phoneAsset && <img className="phone-hero-image" src={phoneAsset} alt="" />}
        <div className="floating-pill num-pill-1"><span className="flag">CM</span> +237 6 90 24 18 42</div>
        <div className="floating-pill num-pill-2"><span className="flag">FR</span> +33 7 58 42 19 06</div>
        <div className="floating-pill num-pill-3"><span className="flag">US</span> +1 415 555 0198</div>
      </div>
    );
  }

  if (type === 'giftcards') {
    return (
      <div className="service-visual giftcards-visual" aria-hidden="true">
        <Link to="/redeem/apple" className="gc-card gc-apple" aria-label="Redeem Apple gift card"><AppleLogo size={40} /></Link>
        <Link to="/redeem/amazon" className="gc-card gc-amazon" aria-label="Redeem Amazon gift card"><AmazonLogo size={32} /></Link>
        <Link to="/redeem/steam" className="gc-card gc-steam" aria-label="Redeem Steam gift card"><SteamLogo size={40} /></Link>
      </div>
    );
  }

  return (
    <div className="service-visual subscriptions-visual" aria-hidden="true">
      <div className="app-window">
        <div className="app-item"><img className="app-logo" src={brandAssets.netflix} alt="Netflix" /><span className="app-name">Netflix</span></div>
        <div className="app-item"><img className="app-logo" src={brandAssets.spotify} alt="Spotify" /><span className="app-name">Spotify</span></div>
        <div className="app-item"><img className="app-logo" src={brandAssets.gemini} alt="Google Gemini" /><span className="app-name">Gemini Pro</span></div>
        <div className="app-item apple-music-item"><img className="app-logo" src={brandAssets.appleMusic} alt="Apple Music" /><span className="app-name">Apple Music</span></div>
      </div>
    </div>
  );
}