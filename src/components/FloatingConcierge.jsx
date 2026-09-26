import React, { useEffect, useState } from 'react';
import { Search, MessageCircle, X, ChevronRight } from 'lucide-react';
import './FloatingConcierge.css';

// --- CUSTOM HOOK FOR TYPEWRITER TEXT ---
function useTypewriter(phrases) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const phrase = phrases[loopNum % phrases.length];
    const timer = setTimeout(() => {
      const nextText = isDeleting
        ? phrase.substring(0, text.length - 1)
        : phrase.substring(0, text.length + 1);

      setText(nextText);
      setTypingSpeed(isDeleting ? 40 : 80);

      if (!isDeleting && nextText === phrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && nextText === '') {
        setIsDeleting(false);
        setLoopNum((current) => current + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [isDeleting, loopNum, text, typingSpeed, phrases]);

  return text;
}

// --- MOCK SEARCH DATABASE ---
const SEARCH_INDEX = [
  'Gift Cards', 'Virtual Numbers', 'Subscriptions', 
  'Facebook Growth', 'Receive Payments', 'Social Boosting', 
  'Netflix Account', 'Apple Gift Card', 'Steam Wallet', 'WhatsApp Number'
];

// --- DEFAULT FAQ QUESTIONS (Can be overridden by parent) ---
const DEFAULT_FAQ_OPTIONS = [
  "How do I trade my Gift Card?",
  "What are today's exchange rates?",
  "How long does payout take?",
  "I have an issue with my transaction."
];

export default function FloatingConcierge({ 
  glowColor = 'transparent', 
  faqOptions = DEFAULT_FAQ_OPTIONS 
}) {
  const [isMobileScrolling, setIsMobileScrolling] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Unbolded Typewriter Text
  const placeholderText = useTypewriter([
    'Search for Gift Cards...',
    'Find Virtual Numbers...',
    'Need a Subscription?'
  ]);

  // --- BUBBLE SQUEEZE ANIMATION (Runs once per session) ---
  const [bubbleState, setBubbleState] = useState(() => {
    return sessionStorage.getItem('wa_bubble_shown') ? 'hidden' : 'visible';
  });

  useEffect(() => {
    if (bubbleState === 'visible') {
      const timer = setTimeout(() => {
        setBubbleState('squeezing'); // Triggers CSS squeeze animation
        setTimeout(() => {
          setBubbleState('hidden'); // Removes from DOM after animation
          sessionStorage.setItem('wa_bubble_shown', 'true');
        }, 500); // Wait for 0.5s CSS transition to finish
      }, 3000); // Stays visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [bubbleState]);

  // --- MOBILE ONLY: 2 SECOND SCROLL HIDE ---
  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      if (window.innerWidth <= 900) {
        setIsMobileScrolling(true);
        setIsFaqOpen(false); // Close FAQ on scroll
        clearTimeout(scrollTimer);
        
        // Slide back into view 2 seconds after scroll stops
        scrollTimer = setTimeout(() => {
          setIsMobileScrolling(false);
        }, 2000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Routing to search results for: ${searchQuery}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    alert(`Routing to search results for: ${suggestion}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleWaClick = (e) => {
    e.preventDefault();
    setIsFaqOpen(!isFaqOpen);
    setBubbleState('hidden'); // Immediately hide bubble if user clicks early
  };

  const sendToWhatsApp = (question) => {
    const waUrl = `https://wa.me/237681555737?text=${encodeURIComponent(question)}`;
    window.open(waUrl, '_blank');
    setIsFaqOpen(false);
  };

  const activeSuggestions = SEARCH_INDEX.filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* =========================================
          PC ONLY: LEFT-ALIGNED SEARCH PILL
          ========================================= */}
      <div 
        className="pc-left-search-pill pc-only-flex"
        style={{ 
          // Dynamic glow based on the active gift card passed from parent
          boxShadow: glowColor !== 'transparent' 
            ? `0 0 25px ${glowColor}60, 0 15px 40px rgba(15, 23, 42, 0.1)` 
            : '0 15px 40px rgba(15, 23, 42, 0.1)'
        }}
      >
        <form className="pill-search-form" onSubmit={handleSearchSubmit}>
          <Search size={18} strokeWidth={2} className="plain-search-icon" />
          <input 
            type="text" 
            className="pill-search-input" 
            placeholder={isSearchOpen ? "Search GiftPro..." : placeholderText + "|"} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          />
        </form>

        {isSearchOpen && (
          <div className="search-suggestions-dropdown fade-in">
            {searchQuery ? (
              activeSuggestions.length > 0 ? (
                activeSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="suggestion-item" onMouseDown={() => handleSuggestionClick(suggestion)}>
                    <Search size={14} className="suggestion-icon"/>
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="suggestion-item no-results">No results found for "{searchQuery}"</div>
              )
            ) : (
              <div className="suggestion-item no-results">Start typing to search...</div>
            )}
          </div>
        )}
      </div>

      {/* =========================================
          UNIVERSAL: WHATSAPP MESSENGER (RIGHT SIDE)
          ========================================= */}
      <div className={`whatsapp-floater ${isMobileScrolling ? 'mobile-hidden-right' : ''}`}>
        
        {/* THE CHAT CLOUD BUBBLE (Squeeze Animation) */}
        {bubbleState !== 'hidden' && (
          <div className={`chat-cloud-bubble ${bubbleState === 'squeezing' ? 'squeezing' : 'visible'}`}>
            Hi there <span className="waving-hand">👋</span>
          </div>
        )}

        {/* WhatsApp FAQ Popup Menu */}
        {isFaqOpen && (
          <div className="faq-popup-menu fade-in">
            <div className="faq-header">
              <span>How can we help?</span>
              <button onClick={() => setIsFaqOpen(false)}><X size={16}/></button>
            </div>
            <div className="faq-list">
              {faqOptions.map((q, idx) => (
                <button key={idx} className="faq-item" onClick={() => sendToWhatsApp(q)}>
                  <span>{q}</span>
                  <ChevronRight size={14} className="faq-arrow" />
                </button>
              ))}
            </div>
            <button className="faq-direct-btn" onClick={() => sendToWhatsApp("Hi, I need custom support.")}>
              <MessageCircle size={16} /> Chat Directly
            </button>
          </div>
        )}

        <button
          onClick={handleWaClick}
          className="concierge-whatsapp-btn"
          aria-label="Open WhatsApp Support"
        >
          {isFaqOpen ? <X size={24} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
        </button>
      </div>
    </>
  );
}