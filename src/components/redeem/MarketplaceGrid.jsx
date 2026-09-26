import React, { useEffect, useRef, useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import './MarketplaceGrid.css';

export default function MarketplaceGrid({ cards, onCardSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportedCards, setSupportedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const observer = new IntersectionObserver(([entry]) => {
      setHasEnteredViewport(entry.isIntersecting);
    }, {
      threshold: 0.05,
      rootMargin: isMobile ? '0px 0px -160px 0px' : '0px',
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setSupportedCards([
        { id: 'apple', name: 'Apple', currentRate: '620', currency: 'USD', trending: true },
        { id: 'steam', name: 'Steam', currentRate: '580', currency: 'USD', trending: false },
        { id: 'amazon', name: 'Amazon', currentRate: '600', currency: 'USD', trending: true },
        { id: 'xbox', name: 'Xbox', currentRate: '550', currency: 'USD', trending: false },
        { id: 'visa', name: 'Visa Prepaid', currentRate: '610', currency: 'USD', trending: false },
      ]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(loadTimer);
  }, []);

  const filteredCards = supportedCards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      id="marketplace"
      className={`redeem-marketplace ${hasEnteredViewport ? 'redeem-marketplace-visible' : ''}`}
    >
      <div className="marketplace-header">
        <div>
          <h2>Trade Gift Cards</h2>
          <p>Select a card below to start your secure transaction.</p>
        </div>

        <div className="glass-search-bar">
          <Search size={18} className="search-icon" />
          <input
            id="marketplace-search"
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Syncing live rates...</div>
      ) : (
        <div className="brand-cards-grid">
          {filteredCards.map((card) => {
            const config = cards.find((item) => item.id === card.id);
            if (!config) return null;
            const Icon = config.Icon;

            return (
              <div
                key={card.id}
                className={`brand-card ${config.colorClass}`}
                onClick={() => onCardSelect(card.id)}
              >
                {card.trending && (
                  <div className="trending-badge">
                    <TrendingUp size={12} /> High Demand
                  </div>
                )}

                <div className={`brand-card-icon brand-card-icon-${card.id}`}>
                  <Icon size={56} color="#fff" />
                </div>
                {card.id !== 'amazon' && card.id !== 'visa' && (
                  <span className="brand-card-name">{card.name}</span>
                )}

                <div className="live-rate-badge">
                  {card.currentRate} FCFA / {card.currency}
                </div>
              </div>
            );
          })}

          {filteredCards.length === 0 && (
            <div className="no-results">No gift cards found matching "{searchQuery}"</div>
          )}
        </div>
      )}
    </section>
  );
}
