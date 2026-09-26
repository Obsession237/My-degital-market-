import { useEffect, useState } from 'react';
import Header from '../components/Header';
import VirtualNumbersServiceHub from '../components/VirtualNumbersServiceHub';
import SmsAppPicker from '../components/SmsAppPicker';
import SmsLocationSelector from '../components/SmsLocationSelector';
import SmsDeliverySettings from '../components/SmsDeliverySettings';
import ActiveNumberTerminal from '../components/ActiveNumberTerminal';
import whatsappLogo from '../assets/whatsapp.svg';
import telegramLogo from '../assets/telegram.svg';
import facebookLogo from '../assets/facebook.svg';
import instagramLogo from '../assets/instagram.svg';
import './VirtualNumbers.css';

const SMS_APPS = [
  { id: 'whatsapp', name: 'WhatsApp', price: 60, logo: whatsappLogo },
  { id: 'telegram', name: 'Telegram', price: 55, logo: telegramLogo },
  { id: 'facebook', name: 'Facebook', price: 40, logo: facebookLogo },
  { id: 'instagram', name: 'Instagram', price: 40, logo: instagramLogo },
];

const COUNTRIES = [
  { code: 'US', name: 'United States (+1)' },
  { code: 'UK', name: 'United Kingdom (+44)' },
  { code: 'FR', name: 'France (+33)' },
  { code: 'CM', name: 'Cameroon (+237)' },
  { code: 'NG', name: 'Nigeria (+234)' },
];

const US_STATES = ['Texas', 'California', 'New York', 'Florida', 'Nevada'];

export default function VirtualNumbers({ dockHidden = false }) {
  const [points, setPoints] = useState(2450);
  const [servicePath, setServicePath] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [forwardToEmail, setForwardToEmail] = useState(false);
  const [emailType, setEmailType] = useState('account');
  const [customEmail, setCustomEmail] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    let timer;
    if (activeOrder && activeOrder.timeLeft > 0 && !activeOrder.code) {
      timer = setInterval(() => {
        setActiveOrder((previous) => ({ ...previous, timeLeft: previous.timeLeft - 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeOrder]);

  const handleGenerateNumber = () => {
    setActiveOrder({
      number: selectedCountry === 'US' ? '+1 (512) 482-1923' : '+44 7700 900077',
      timeLeft: 15 * 60,
      code: null,
    });
  };

  const simulateSmsArrival = () => {
    setActiveOrder((previous) => ({ ...previous, code: '849-201' }));
    setPoints((previous) => previous - selectedApp.price);
  };

  return (
    <div className="site vn-page">
      <Header points={points} dockHidden={dockHidden} />

      <main className="vn-container">
        {!servicePath && !activeOrder && (
          <VirtualNumbersServiceHub onChooseService={setServicePath} />
        )}

        {servicePath === 'sms' && !activeOrder && (
          <div className="vn-wizard-container fade-in">
            <div className="vn-wizard-header">
              <h2>One-Time SMS Verification</h2>
              <button className="vn-cancel" type="button" onClick={() => setServicePath(null)}>Cancel</button>
            </div>

            <SmsAppPicker apps={SMS_APPS} selectedApp={selectedApp} onSelectApp={setSelectedApp} />

            {selectedApp && (
              <SmsLocationSelector
                countries={COUNTRIES}
                states={US_STATES}
                selectedCountry={selectedCountry}
                selectedState={selectedState}
                onCountryChange={(country) => {
                  setSelectedCountry(country);
                  setSelectedState('');
                }}
                onStateChange={setSelectedState}
              />
            )}

            {selectedCountry && (
              <SmsDeliverySettings
                selectedApp={selectedApp}
                forwardToEmail={forwardToEmail}
                emailType={emailType}
                customEmail={customEmail}
                onForwardChange={setForwardToEmail}
                onEmailTypeChange={setEmailType}
                onCustomEmailChange={setCustomEmail}
                onGenerate={handleGenerateNumber}
              />
            )}
          </div>
        )}

        {activeOrder && (
          <ActiveNumberTerminal
            activeOrder={activeOrder}
            selectedApp={selectedApp}
            onSimulateSms={simulateSmsArrival}
            onDone={() => {
              setActiveOrder(null);
              setServicePath(null);
            }}
          />
        )}
      </main>
    </div>
  );
}