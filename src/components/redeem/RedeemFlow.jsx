import React, { useEffect, useState } from 'react';
import { ArrowLeft, Camera, CheckCircle2, Clock } from 'lucide-react';
import './RedeemFlow.css';

export default function RedeemFlow({ card, onBack, onNavigate }) {
  const [redeemStep, setRedeemStep] = useState('details');
  const [formData, setFormData] = useState({ cardNumber: '', pin: '', value: '' });

  useEffect(() => {
    if (redeemStep !== 'review') return undefined;

    const approvalTimer = setTimeout(() => setRedeemStep('approved'), 4000);
    return () => clearTimeout(approvalTimer);
  }, [redeemStep]);

  const updateFormData = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRedeemStep('review');
  };

  const resetFlow = () => {
    setRedeemStep('details');
    setFormData({ cardNumber: '', pin: '', value: '' });
  };

  const Icon = card.Icon;

  return (
    <section className="redemption-flow-section fade-in">
      <div className="flow-card glass-panel">
        <button className="flow-back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> Back
        </button>

        {redeemStep === 'details' && (
          <div className="flow-step fade-in">
            <div className={`flow-brand-header ${card.colorClass}`}>
              <Icon size={48} color="#fff" />
              <h2>{card.title}</h2>
            </div>

            <form className="flow-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  required
                  value={formData.cardNumber}
                  onChange={(event) => updateFormData('cardNumber', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card-pin">PIN / Code</label>
                <input
                  id="card-pin"
                  type="text"
                  placeholder="Enter code"
                  required
                  value={formData.pin}
                  onChange={(event) => updateFormData('pin', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card-value">Card Value (USD)</label>
                <div className="input-with-prefix">
                  <span className="prefix">$</span>
                  <input
                    id="card-value"
                    type="number"
                    placeholder="50"
                    required
                    value={formData.value}
                    onChange={(event) => updateFormData('value', event.target.value)}
                  />
                </div>
              </div>

              <div className="form-group photo-upload-group">
                <label>Upload Photo (Optional)</label>
                <button type="button" className="btn-upload-photo">
                  <Camera size={18} /> Take or upload photo
                </button>
              </div>

              <button type="submit" className="btn-submit-flow">Submit Card</button>
            </form>
          </div>
        )}

        {redeemStep === 'review' && (
          <div className="flow-step status-step fade-in">
            <div className="status-icon-wrap pending pulse">
              <Clock size={40} color="#fff" />
            </div>
            <h2>Card Submitted</h2>
            <p className="status-subtitle">Your gift card has been submitted and is under review.</p>

            <div className="status-details-box">
              <div className="detail-row"><span>Reference</span><strong>#GC987654</strong></div>
              <div className="detail-row"><span>Status</span><strong className="text-orange">Under Review</strong></div>
              <div className="detail-row"><span>Submitted</span><strong>12 Dec 2024, 10:45 AM</strong></div>
              <div className="detail-row"><span>Estimated Time</span><strong>5 - 30 minutes</strong></div>
            </div>

            <div className="flow-actions">
              <button className="btn-submit-flow" onClick={() => onNavigate('/user-dashboard')}>View Status</button>
              <button className="btn-secondary-flow" onClick={resetFlow}>Submit Another Card</button>
            </div>
          </div>
        )}

        {redeemStep === 'approved' && (
          <div className="flow-step status-step fade-in">
            <div className="status-icon-wrap success fade-in">
              <CheckCircle2 size={40} color="#fff" />
            </div>
            <h2>Card Approved</h2>
            <p className="status-subtitle">F50,000 has been added to your wallet.</p>

            <div className="status-details-box">
              <div className="detail-row"><span>Reference</span><strong>#GC987654</strong></div>
              <div className="detail-row"><span>Amount</span><strong>F50,000</strong></div>
              <div className="detail-row"><span>Date</span><strong>12 Dec 2024, 10:45 AM</strong></div>
            </div>

            <div className="flow-actions">
              <button className="btn-submit-flow" onClick={() => onNavigate('/user-dashboard')}>View Wallet</button>
              <button className="btn-secondary-flow" onClick={resetFlow}>Submit Another Card</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
