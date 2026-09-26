import { AlertCircle, CheckCircle2, Clock, Copy } from 'lucide-react';
import './ActiveNumberTerminal.css';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainder = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export default function ActiveNumberTerminal({ activeOrder, selectedApp, onSimulateSms, onDone }) {
  return (
    <section className="vn-terminal fade-in">
      <header className="vn-terminal-header">
        <h2>Active Number</h2>
        <span className="vn-timer-badge"><Clock size={16} /> {formatTime(activeOrder.timeLeft)}</span>
      </header>

      <div className="vn-terminal-card">
        <div className="vn-terminal-app-info">
          <img className="vn-terminal-app-logo" src={selectedApp?.logo} alt="" />
          <span>Waiting for <strong>{selectedApp?.name}</strong> verification...</span>
        </div>

        <div className="vn-terminal-number-box">
          <span className="vn-the-number">{activeOrder.number}</span>
          <button className="vn-copy-number" type="button" onClick={() => navigator.clipboard?.writeText(activeOrder.number)} aria-label="Copy number">
            <Copy size={19} />
          </button>
        </div>

        <div className={`vn-terminal-otp-box ${activeOrder.code ? 'otp-success' : ''}`}>
          {activeOrder.code ? (
            <>
              <span className="vn-otp-label">Your Code</span>
              <span className="vn-otp-code fade-in">{activeOrder.code}</span>
            </>
          ) : (
            <div className="vn-otp-waiting pulse">
              <span className="vn-spinner" />
              <span>Listening for incoming SMS...</span>
            </div>
          )}
        </div>

        <footer className="vn-terminal-footer">
          {!activeOrder.code ? (
            <>
              <p className="vn-terminal-trust"><AlertCircle size={15} /> Send the code to this number. {selectedApp?.price} pts will be deducted automatically when received.</p>
              <button className="vn-simulate-sms" type="button" onClick={onSimulateSms}>[Dev Mock]: Trigger SMS Arrival</button>
            </>
          ) : (
            <p className="vn-success-note fade-in"><CheckCircle2 size={15} /> -{selectedApp?.price} Points Deducted. Code also sent to email.</p>
          )}
        </footer>
      </div>

      {activeOrder.code && (
        <button className="vn-generate-number vn-terminal-done fade-in" type="button" onClick={onDone}>
          Done / Get Another Number
        </button>
      )}
    </section>
  );
}