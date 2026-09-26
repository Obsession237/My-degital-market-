import './SmsAppPicker.css';

export default function SmsAppPicker({ apps, selectedApp, onSelectApp }) {
  return (
    <section className="vn-wizard-step vn-app-picker">
      <h3 className="vn-step-label"><span>1</span> Select App</h3>
      <div className="vn-app-grid">
        {apps.map((app) => (
          <button
            key={app.id}
            className={`vn-app-select-card ${selectedApp?.id === app.id ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectApp(app)}
          >
            <img className="vn-app-logo" src={app.logo} alt="" />
            <span className="vn-app-name">{app.name}</span>
            <span className="vn-app-price">{app.price} pts</span>
          </button>
        ))}
      </div>
    </section>
  );
}