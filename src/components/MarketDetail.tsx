import React, { useState, useEffect } from 'react';
import { Market, TimeRemaining } from '../types/market';

interface MarketDetailProps {
  market: Market;
  onVote: (optionId: string, amount: number) => void;
  onClose: () => void;
}

const calculateTimeRemaining = (closesAt: Date): TimeRemaining => {
  const now = new Date();
  const diff = closesAt.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
};

export const MarketDetail: React.FC<MarketDetailProps> = ({ market, onVote, onClose }) => {
  const [voteAmount, setVoteAmount] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>(market.options[0]?.id || '');
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(market.closesAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(market.closesAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [market.closesAt]);

  const handleVote = () => {
    if (selectedOption && voteAmount > 0) {
      onVote(selectedOption, voteAmount);
      setVoteAmount(1);
    }
  };

  const totalVotes = market.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <>
      <style>{`
      .market-detail-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        overflow-y: auto;
      }

      .market-detail-panel {
        background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
        border: 1px solid var(--border-color);
        border-radius: 16px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .detail-header {
        position: relative;
        height: 250px;
        background-size: cover;
        background-position: center;
        background-color: var(--bg-tertiary);
        padding: 1.5rem;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .detail-header::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, transparent, rgba(10, 14, 39, 0.95));
      }

      .close-btn {
        position: relative;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        color: var(--text-primary);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .close-btn:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
      }

      .detail-info {
        padding: 2rem;
      }

      .detail-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }

      .detail-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.8;
      }

      .time-counter {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
      }

      .time-label {
        color: var(--accent-cyan);
        font-weight: 600;
        margin-bottom: 1rem;
        font-size: 0.95rem;
        text-transform: uppercase;
      }

      .time-display {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
      }

      .time-unit {
        background: var(--bg-tertiary);
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }

      .time-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent-green);
      }

      .time-unit-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-top: 0.25rem;
      }

      .voting-section {
        margin-bottom: 2rem;
      }

      .voting-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }

      .option-item {
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .option-item.selected {
        border-color: var(--accent-green);
        background: rgba(0, 255, 65, 0.1);
      }

      .option-item:hover {
        border-color: var(--accent-cyan);
      }

      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .option-label {
        font-weight: 600;
        color: var(--text-primary);
      }

      .option-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
      }

      .option-votes {
        color: var(--accent-green);
      }

      .option-percentage {
        color: var(--accent-cyan);
      }

      .option-bar {
        width: 100%;
        height: 6px;
        background: var(--bg-tertiary);
        border-radius: 3px;
        overflow: hidden;
      }

      .option-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-green), var(--accent-yellow));
        transition: width 0.5s ease;
      }

      .vote-input-section {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .vote-input-label {
        display: block;
        color: var(--text-secondary);
        margin-bottom: 0.75rem;
        font-weight: 500;
      }

      .vote-input {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 1rem;
        font-size: 1rem;
      }

      .vote-input:focus {
        outline: none;
        border-color: var(--accent-cyan);
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
      }

      .vote-preset {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .preset-btn {
        flex: 1;
        padding: 0.5rem;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .preset-btn:hover {
        border-color: var(--accent-cyan);
        color: var(--accent-cyan);
      }

      .btn-vote-submit {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, var(--accent-green), #00dd38);
        color: #000;
        font-weight: 700;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(0, 255, 65, 0.2);
      }

      .btn-vote-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(0, 255, 65, 0.3);
      }

      .btn-vote-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      @media (max-width: 768px) {
        .market-detail-panel {
          max-height: 100vh;
          border-radius: 16px 16px 0 0;
        }

        .detail-header {
          height: 180px;
        }

        .detail-title {
          font-size: 1.5rem;
        }

        .detail-info {
          padding: 1.5rem;
        }

        .time-display {
          grid-template-columns: repeat(2, 1fr);
        }

        .time-value {
          font-size: 1.25rem;
        }
      }
    `}</style>

    <div className="market-detail-overlay" onClick={onClose}>
      <div className="market-detail-panel" onClick={(e) => e.stopPropagation()}>
        <div
          className="detail-header"
          style={market.backgroundUrl ? { backgroundImage: `url(${market.backgroundUrl})` } : {}}
        >
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="detail-info">
          <h2 className="detail-title">{market.title}</h2>
          <p className="detail-description">{market.description}</p>

          <div className="time-counter">
            <div className="time-label">⏱️ Time Remaining</div>
            <div className="time-display">
              <div className="time-unit">
                <div className="time-value">{timeRemaining.days}</div>
                <div className="time-unit-label">Days</div>
              </div>
              <div className="time-unit">
                <div className="time-value">{timeRemaining.hours}</div>
                <div className="time-unit-label">Hours</div>
              </div>
              <div className="time-unit">
                <div className="time-value">{timeRemaining.minutes}</div>
                <div className="time-unit-label">Mins</div>
              </div>
              <div className="time-unit">
                <div className="time-value">{timeRemaining.seconds}</div>
                <div className="time-unit-label">Secs</div>
              </div>
            </div>
          </div>

          <div className="voting-section">
            <div className="voting-title">Market Options</div>
            {market.options.map(option => (
              <div
                key={option.id}
                className={`option-item ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="option-header">
                  <span className="option-label">{option.label}</span>
                  <div className="option-stats">
                    <span className="option-votes">{option.votes} votes</span>
                    <span className="option-percentage">
                      {totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <div className="option-bar">
                  <div
                    className="option-progress"
                    style={{
                      width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="vote-input-section">
            <label className="vote-input-label">Amount to Stake</label>
            <input
              type="number"
              className="vote-input"
              value={voteAmount}
              onChange={(e) => setVoteAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Enter amount"
              min="0"
              step="0.1"
            />
            <div className="vote-preset">
              {[1, 5, 10, 50].map(amount => (
                <button
                  key={amount}
                  className="preset-btn"
                  onClick={() => setVoteAmount(amount)}
                >
                  {amount}
                </button>
              ))}
            </div>

            <button
              className="btn-vote-submit"
              onClick={handleVote}
              disabled={!selectedOption || voteAmount <= 0 || market.status !== 'active'}
            >
              {market.status === 'active' ? '🎯 Cast Vote' : 'Market Closed'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
