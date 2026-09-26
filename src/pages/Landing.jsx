import React from 'react';
import './Landing.css';
import Header from '../components/Header';
import LandingHero from '../components/landing/LandingHero';


export default function LandingPage() {
  return (
    <div className="site landing-page">
      
      <Header landing />

      <main className="landing-container fade-in">
        <LandingHero />
      </main>
    </div>
  );
}