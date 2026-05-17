import React from 'react';
import { Market, TimeRemaining } from '../types/market';

interface MarketCardProps {
  market: Market;
  onVote: (marketId: string) => void;
  onSelectMarket: (market: Market) => void;
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

export const MarketCard: React.FC<MarketCardProps> = ({ market, onVote, onSelectMarket }) => {
  const timeRemaining = calculateTimeRemaining(market.closesAt);
  const topVotedOption = market.options.reduce((prev, current) =>
    current.votes > prev.votes ? current : prev
  );

  return (
    <>
      <style>{`
      .market-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: var(--shadow-sm);
      }

      .market-card:hover {
        border-color: var(--accent-cyan);
        box-shadow: var(--shadow-md);
        transform: translateY(-4px);
      }

      .market-background {
        width: 100%;
        height: 200px;
        background-size: cover;
        background-position: center;
        background-color: var(--bg-tertiary);
        position: relative;
        overflow: hidden;
      }

      .market-background::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, transparent, rgba(10, 14, 39, 0.9));
      }

      .market-tags {
        position: absolute;
        top: 1rem;
        left: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        z-index: 2;
      }

      .market-tag {
        background: rgba(0, 0, 0, 0.6);
        color: var(--accent-yellow);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        backdrop-filter: blur(4px);
      }

      .market-content {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .market-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
        line-height: 1.4;
      }

      .market-description {
        color: var(--text-secondary);
        font-size: 0.95rem;
        margin-bottom: 1rem;
        flex: 1;
      }

      .market-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .stat {
        background: var(--bg-tertiary);
        padding: 0.75rem;
        border-radius: 8px;
        text-align: center;
      }

      .stat-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 0.25rem;
      }

      .stat-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .stat-votes {
        color: var(--accent-green);
      }

      .stat-stake {
        color: var(--accent-cyan);
      }

      .market-progress {
        width: 100%;
        height: 4px;
        background: var(--bg-tertiary);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-green), var(--accent-yellow));
        transition: width 0.3s ease;
      }

      .market-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .btn-vote {
        padding: 0.75rem;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 0.95rem;
      }

      .btn-vote:hover {
        background: var(--accent-green);
        color: #000;
        border-color: var(--accent-green);
        transform: translateY(-2px);
      }

      .time-remaining {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-align: center;
        margin-bottom: 0.75rem;
      }

      @media (max-width: 768px) {
        .market-title {
          font-size: 1.1rem;
        }

        .market-background {
          height: 150px;
        }

        .market-actions {
          grid-template-columns: 1fr;
        }
      }
    `}</style>

    <div
      className="market-card"
      onClick={() => onSelectMarket(market)}
    >
      <div
        className="market-background"
        style={market.backgroundUrl ? { backgroundImage: `url(${market.backgroundUrl})` } : {}}
      >
        <div className="market-tags">
          <span className="market-tag">{market.category}</span>
          {market.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="market-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="market-content">
        <h3 className="market-title">{market.title}</h3>
        <p className="market-description">{market.description}</p>

        <div className="market-stats">
          <div className="stat">
            <div className="stat-label">Votes</div>
            <div className="stat-value stat-votes">
              {market.votes.length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Staked</div>
            <div className="stat-value stat-stake">
              {market.stakes.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="market-progress">
          <div
            className="progress-bar"
            style={{
              width: `${
                market.options.length > 0
                  ? (topVotedOption.votes / Math.max(...market.options.map(o => o.votes), 1)) * 100
                  : 0
              }%`
            }}
          />
        </div>

        <div className="time-remaining">
          ⏱️ {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
        </div>

        <div className="market-actions">
          <button
            className="btn-vote"
            onClick={(e) => {
              e.stopPropagation();
              onVote(market.id);
            }}
          >
            Vote
          </button>
          <button
            className="btn-vote"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMarket(market);
            }}
          >
            Details
          </button>
        </div>
      </div>
      </div>
    </>
  );
};
