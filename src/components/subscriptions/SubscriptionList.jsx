import { ChevronRight } from 'lucide-react';
import './SubscriptionList.css';

export default function SubscriptionList({
  apps,
  categoryTransitioning,
  isVisible,
  currentPage,
  pageCount,
  onPageChange,
  onSelectApp,
  onTouchStart,
  onTouchEnd,
}) {
  return (
    <section
      className={`app-list-section ${isVisible ? 'subscription-list-visible' : ''}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="section-heading">Available Subscriptions</h2>

      <div className={`app-list-container ${categoryTransitioning ? 'category-transitioning' : ''}`}>
        {apps.map((app) => (
          <div key={app.id} className="app-list-row" onClick={() => onSelectApp(app)}>
            <div className="app-list-left">
              <div className={`list-icon-wrap ${app.colorClass}`}>
                <app.Icon size={26} />
              </div>
              <div className="list-app-info">
                <h3>{app.name}</h3>
                <span>{app.subtitle}</span>
              </div>
            </div>

            <div className="app-list-right">
              <div className="list-price-info">
                <span className="list-price-val">{app.priceDisplay}</span>
                <span className="list-billing-type">{app.billing}</span>
              </div>
              <ChevronRight size={20} className="list-chevron" />
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && <div className="no-results">No apps found in this category.</div>}

      {pageCount > 1 && (
        <nav className="subscription-pagination" aria-label="Subscription pages">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`subscription-page-button ${currentPage === page ? 'active' : ''}`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </nav>
      )}
    </section>
  );
}