import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServiceVisual from './ServiceVisual';
import './LandingHero.css';

const HERO_SLIDES = [
  {
    id: 'gift-cards',
    title: 'Trade Gift Cards Instantly',
    description: 'Redeem top brand gift cards for cash at the best market rates. Fast, secure, and reliable payouts.',
    link: '/redeem',
    bgClass: 'slide-green',
    visual: 'giftcards'
  },
  {
    id: 'fb-growth',
    title: 'Explode Your Facebook Group',
    description: 'Real engagement and targeted members delivered safely to your community. Grow your audience today.',
    link: '/facebook-growth',
    bgClass: 'slide-blue',
    visual: 'facebook'
  },
  {
    id: 'virtual-numbers',
    title: 'Virtual Numbers',
    description: 'Secure SMS verification for any platform. Get instant delivery and bypass restrictions easily.',
    link: '/virtual-numbers',
    bgClass: 'slide-purple',
    visual: 'numbers'
  },
  {
    id: 'app-subs',
    title: 'App Subscriptions',
    description: 'Netflix, Spotify, and premium tools at heavily discounted rates. Upgrade your accounts instantly.',
    link: '/subscriptions',
    bgClass: 'slide-orange',
    visual: 'subscriptions'
  }
];

export default function LandingHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchDistance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(touchDistance) >= 50) {
      setCurrentSlide((slide) => (
        touchDistance < 0
          ? (slide + 1) % HERO_SLIDES.length
          : (slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
      ));
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % HERO_SLIDES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider-section">
      <div className="slider-wrapper" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {HERO_SLIDES.map((slide, index) => (
          <div key={slide.id} className={`slide-item ${index === currentSlide ? 'active' : ''} ${slide.bgClass} ${slide.visual === 'subscriptions' ? 'slide-subscriptions' : ''}`}>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
            <div className="slide-visual-column">
              <ServiceVisual type={slide.visual} />
              <Link to={slide.link} className="btn-slide-action">
                Explore Service <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-pagination">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
