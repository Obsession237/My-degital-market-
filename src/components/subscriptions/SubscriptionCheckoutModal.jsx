import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './SubscriptionCheckoutModal.css';

const COUNTRIES = [
  {
    code: 'CM',
    name: 'Cameroon',
    dialCode: '+237',
    phoneDigits: 9,
    currency: 'XAF',
    networks: [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'orange_money', name: 'Orange Money' },
    ],
  },
  {
    code: 'CI',
    name: "Cote d'Ivoire",
    dialCode: '+225',
    phoneDigits: 10,
    currency: 'XOF',
    networks: [
      { id: 'orange_money', name: 'Orange Money' },
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'moov_money', name: 'Moov Money' },
      { id: 'wave', name: 'Wave' },
    ],
  },
  {
    code: 'GA',
    name: 'Gabon',
    dialCode: '+241',
    phoneDigits: 8,
    currency: 'XAF',
    networks: [
      { id: 'airtel_money', name: 'Airtel Money' },
      { id: 'moov_money', name: 'Moov Money' },
    ],
  },
];

const CHECKOUT_STEPS = ['plan', 'details', 'confirm', 'status'];

function normalizePhone(phone, country) {
  const digits = phone.replace(/\D/g, '');
  const countryCode = country.dialCode.replace(/\D/g, '');
  return digits.startsWith(countryCode) ? `+${digits}` : `${country.dialCode}${digits}`;
}

export default function SubscriptionCheckoutModal({
  checkoutApp,
  selectedPlan,
  accountEmail,
  isLoggedIn,
  isSubmitting,
  submitError,
  onClose,
  onSelectPlan,
  onSubmit,
}) {
  const [step, setStep] = useState('plan');
  const [countryCode, setCountryCode] = useState('CM');
  const [paymentMethod, setPaymentMethod] = useState('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activationEmailChoice, setActivationEmailChoice] = useState('account');
  const [customEmail, setCustomEmail] = useState('');
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    setStep('plan');
    setCountryCode('CM');
    setPaymentMethod('mtn_momo');
    setPhoneNumber('');
    setActivationEmailChoice('account');
    setCustomEmail('');
    setPaymentRequest(null);
  }, [checkoutApp?.id]);

  if (!checkoutApp) return null;

  const country = COUNTRIES.find((item) => item.code === countryCode) || COUNTRIES[0];
  const activationEmail = activationEmailChoice === 'account' ? accountEmail : customEmail.trim();
  const normalizedPhone = normalizePhone(phoneNumber, country);
  const phoneIsValid = /^\+\d{8,15}$/.test(normalizedPhone)
    && normalizedPhone.length - country.dialCode.length === country.phoneDigits;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(activationEmail);

  const changeCountry = (nextCountryCode) => {
    const nextCountry = COUNTRIES.find((item) => item.code === nextCountryCode);
    if (!nextCountry) return;
    setCountryCode(nextCountry.code);
    setPaymentMethod(nextCountry.networks[0].id);
    setPhoneNumber('');
  };

  const requestPayment = async () => {
    const result = await onSubmit({
      countryCode: country.code,
      currency: country.currency,
      paymentMethod,
      phoneNumber: normalizedPhone,
      activationEmail,
    });
    if (result) {
      setPaymentRequest(result);
      setStep('status');
    }
  };

  const stepIndex = CHECKOUT_STEPS.indexOf(step);

  return (
    <div className="checkout-modal-overlay fade-in" onClick={onClose}>
      <div className="checkout-modal-card slide-up" onClick={(event) => event.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose} aria-label="Close checkout">
          <X size={20} />
        </button>

        <div className="checkout-header">
          <div className={`checkout-icon-box ${checkoutApp.colorClass}`}>
            <checkoutApp.Icon size={36} />
          </div>
          <div className="checkout-title-box">
            <h3>{checkoutApp.name}</h3>
            <p>{selectedPlan?.duration}{selectedPlan?.storage ? ` · ${selectedPlan.storage}` : ''} · {selectedPlan?.price.toLocaleString()} FCFA</p>
          </div>
        </div>

        <div className="checkout-progress" aria-label={`Checkout step ${stepIndex + 1} of ${CHECKOUT_STEPS.length}`}>
          {['Plan', 'Payment', 'Review', 'Status'].map((label, index) => (
            <span key={label} className={index <= stepIndex ? 'active' : ''}>{label}</span>
          ))}
        </div>

        {step === 'plan' && (
          <>
            <h4 className="checkout-step-title">Choose a plan</h4>
            <div className="checkout-plans">
              {checkoutApp.plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={`plan-selection-card ${selectedPlan?.id === plan.id ? 'active' : ''}`}
                  onClick={() => onSelectPlan(plan)}
                >
                  <span className="plan-radio"><span className="radio-inner" /></span>
                  <span className="plan-details">
                    <span className="plan-duration">{plan.duration}{plan.storage ? ` · ${plan.storage}` : ''}</span>
                    <span className="plan-price">{plan.price.toLocaleString()} FCFA</span>
                  </span>
                  <span className="plan-badge-wrapper">
                    {plan.isPopular && <span className="badge-popular">Best Value</span>}
                    <span className={`badge-discount ${plan.isPopular ? 'highlight' : ''}`}>{plan.label}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="checkout-actions">
              <button className="btn-pay-now" type="button" onClick={() => setStep('details')} disabled={!selectedPlan}>
                Continue <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <h4 className="checkout-step-title">Payment and activation</h4>
            <label className="checkout-field">
              <span>Country</span>
              <select value={countryCode} onChange={(event) => changeCountry(event.target.value)}>
                {COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.name} ({item.dialCode})</option>)}
              </select>
            </label>

            <fieldset className="checkout-field checkout-network-field">
              <legend>Mobile money network</legend>
              <div className="checkout-network-options">
                {country.networks.map((network) => (
                  <label key={network.id} className={`checkout-network-option ${paymentMethod === network.id ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={network.id}
                      checked={paymentMethod === network.id}
                      onChange={() => setPaymentMethod(network.id)}
                    />
                    <span>{network.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="checkout-field">
              <span>Mobile money number</span>
              <span className="checkout-phone-input">
                <span>{country.dialCode}</span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder={country.code === 'CM' ? '6XX XXX XXX' : 'Mobile number'}
                  aria-invalid={phoneNumber.length > 0 && !phoneIsValid}
                />
              </span>
              {phoneNumber.length > 0 && !phoneIsValid && <small>Enter a valid {country.name} mobile number.</small>}
            </label>

            <fieldset className="checkout-field checkout-email-field">
              <legend>Activation email</legend>
              <label className="checkout-email-option">
                <input type="radio" name="activationEmail" checked={activationEmailChoice === 'account'} onChange={() => setActivationEmailChoice('account')} />
                <span>Use account email{accountEmail ? ` (${accountEmail})` : ''}</span>
              </label>
              <label className="checkout-email-option">
                <input type="radio" name="activationEmail" checked={activationEmailChoice === 'custom'} onChange={() => setActivationEmailChoice('custom')} />
                <span>Use another email</span>
              </label>
              {activationEmailChoice === 'custom' && (
                <input className="checkout-email-input" type="email" autoComplete="email" value={customEmail} onChange={(event) => setCustomEmail(event.target.value)} placeholder="name@example.com" />
              )}
              {activationEmailChoice === 'account' && !accountEmail && (
                <small>{isLoggedIn ? 'Could not load your account email. Choose another email.' : 'Sign in to use your account email, or choose another email.'}</small>
              )}
            </fieldset>

            <p className="checkout-security-note"><ShieldCheck size={16} /> Never enter or share your mobile money PIN or OTP here.</p>
            <div className="checkout-actions checkout-actions-split">
              <button className="btn-checkout-back" type="button" onClick={() => setStep('plan')}><ArrowLeft size={17} /> Back</button>
              <button className="btn-pay-now" type="button" onClick={() => setStep('confirm')} disabled={!phoneIsValid || !emailIsValid}>
                Review <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <>
            <h4 className="checkout-step-title">Confirm checkout</h4>
            <dl className="checkout-summary">
              <div><dt>Subscription</dt><dd>{checkoutApp.name} · {selectedPlan?.duration}</dd></div>
              <div><dt>Total</dt><dd>{selectedPlan?.price.toLocaleString()} FCFA</dd></div>
              <div><dt>Payment</dt><dd>{country.name} · {country.networks.find((item) => item.id === paymentMethod)?.name}</dd></div>
              <div><dt>Number</dt><dd>{normalizedPhone}</dd></div>
              <div><dt>Activation email</dt><dd>{activationEmail}</dd></div>
            </dl>
            <p className="checkout-security-note"><ShieldCheck size={16} /> Payment is confirmed only by the provider. Do not send money or share your PIN until official instructions appear.</p>
            <p className="checkout-provider-notice">Payment instructions are sent only after the mobile-money provider is connected. Do not send money based on an unverified request.</p>
            {!isLoggedIn && <p className="checkout-auth-notice">Sign in to request a subscription payment.</p>}
            {submitError && <p className="checkout-error" role="alert">{submitError}</p>}
            <div className="checkout-actions checkout-actions-split">
              <button className="btn-checkout-back" type="button" onClick={() => setStep('details')} disabled={isSubmitting}><ArrowLeft size={17} /> Back</button>
              <button className="btn-pay-now" type="button" onClick={requestPayment} disabled={!isLoggedIn || isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? 'Requesting…' : 'Request payment'} <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {step === 'status' && (
          <div className="checkout-status">
            <CheckCircle2 size={36} color="#059669" />
            <h4>Payment request status</h4>
            <p>Order reference: <strong>{paymentRequest.order?.id || paymentRequest.reference}</strong></p>
            <p>{paymentRequest.instructions || 'Waiting for the mobile-money provider to confirm this payment.'}</p>
            {paymentRequest.confirmationToken && <p>Provider confirmation token: <strong>{paymentRequest.confirmationToken}</strong></p>}
            <button className="btn-pay-now" type="button" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}