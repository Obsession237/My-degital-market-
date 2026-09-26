import { Globe, Lock } from 'lucide-react';
import './SmsLocationSelector.css';

export default function SmsLocationSelector({
  countries,
  states,
  selectedCountry,
  selectedState,
  onCountryChange,
  onStateChange,
}) {
  return (
    <section className="vn-wizard-step vn-location-step fade-in">
      <h3 className="vn-step-label"><span>2</span> Select Location</h3>
      <label className="vn-input-group">
        <Globe size={18} className="vn-input-icon" />
        <select value={selectedCountry} onChange={(event) => onCountryChange(event.target.value)}>
          <option value="" disabled>Choose a country...</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </select>
      </label>

      {selectedCountry === 'US' && (
        <label className="vn-input-group vn-state-select fade-in">
          <Lock size={18} className="vn-input-icon" />
          <select value={selectedState} onChange={(event) => onStateChange(event.target.value)}>
            <option value="">Select State / Area Code (Optional)</option>
            {states.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </label>
      )}
    </section>
  );
}