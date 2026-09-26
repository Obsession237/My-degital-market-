import { ChevronRight, Mail, MessageSquare, Phone } from 'lucide-react';
import './VirtualNumbersServiceHub.css';

const SERVICES = [
  {
    id: 'gv',
    title: 'Google Voice Accounts',
    description: 'Permanent US numbers. Credentials delivered instantly to your email.',
    startingPrice: '500 pts',
    Icon: Mail,
    color: 'blue',
  },
  {
    id: 'sms',
    title: 'Quick SMS Verifications',
    description: 'One-time OTP numbers for WhatsApp, Facebook, Telegram, and more.',
    startingPrice: '40 pts',
    Icon: MessageSquare,
    color: 'purple',
  },
  {
    id: 'dedicated',
    title: 'Dedicated App Numbers',
    description: 'Rent a number for 30+ days. Perfect for long-term WhatsApp business accounts.',
    startingPrice: '1200 pts',
    Icon: Phone,
    color: 'green',
  },
];

export default function VirtualNumbersServiceHub({ onChooseService }) {
  return (
    <section className="vn-service-hub">
      <header className="vn-hero-text">
        <h1>Global Communication,<br />Unlocked.</h1>
        <p>Select a service below. Points are only deducted when you successfully receive your code.</p>
      </header>

      <div className="vn-service-cards">
        {SERVICES.map(({ id, title, description, startingPrice, Icon, color }) => (
          <button
            key={id}
            className="vn-service-card"
            type="button"
            onClick={() => onChooseService(id)}
          >
            <span className={`vn-service-icon vn-service-icon-${color}`}><Icon size={26} /></span>
            <span className="vn-service-title">{title}</span>
            <span className="vn-service-description">{description}</span>
            <span className="vn-service-footer">Starting at {startingPrice}<ChevronRight size={16} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}