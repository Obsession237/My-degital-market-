import { CheckCircle2 } from 'lucide-react';
import './SmsDeliverySettings.css';

export default function SmsDeliverySettings({
  selectedApp,
  forwardToEmail,
  emailType,
  customEmail,
  onForwardChange,
  onEmailTypeChange,
  onCustomEmailChange,
  onGenerate,
}) {
  return (
    <section className="vn-wizard-step vn-delivery-step fade-in">
      <h3 className="vn-step-label"><span>3</span> Delivery Settings</h3>

      <label className="vn-toggle-row">
        <span className="vn-toggle-text">
          <strong>Forward OTP to Email</strong>
          <span>Receive the code here and in your inbox.</span>
        </span>
        <input type="checkbox" checked={forwardToEmail} onChange={(event) => onForwardChange(event.target.checked)} />
        <span className="vn-toggle-switch" />
      </label>

      {forwardToEmail && (
        <div className="vn-email-options fade-in">
          <label>
            <input type="radio" name="emailType" checked={emailType === 'account'} onChange={() => onEmailTypeChange('account')} />
            Account Email (user@example.com)
          </label>
          <label>
            <input type="radio" name="emailType" checked={emailType === 'custom'} onChange={() => onEmailTypeChange('custom')} />
            Custom Email (For Resellers)
          </label>
          {emailType === 'custom' && (
            <input
              type="email"
              className="vn-custom-email"
              placeholder="client@example.com"
              value={customEmail}
              onChange={(event) => onCustomEmailChange(event.target.value)}
            />
          )}
        </div>
      )}

      <button className="vn-generate-number" type="button" onClick={onGenerate}>
        Generate {selectedApp.name} Number · {selectedApp.price} pts
      </button>
      <p className="vn-trust-note"><CheckCircle2 size={14} /> Points are only deducted if the code arrives.</p>
    </section>
  );
}