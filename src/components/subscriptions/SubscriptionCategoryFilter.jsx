import './SubscriptionCategoryFilter.css';

export default function SubscriptionCategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <section className="filter-section">
      <div className="filter-scroll-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}