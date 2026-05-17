import React from 'react';
import { Market } from '../types/market';
import { MarketCard } from './MarketCard';

interface MarketGridProps {
  markets: Market[];
  onVote: (marketId: string) => void;
  onSelectMarket: (market: Market) => void;
  onCreateMarket: () => void;
}

export const MarketGrid: React.FC<MarketGridProps> = ({
  markets,
  onVote,
  onSelectMarket,
  onCreateMarket
}) => {
  const categories = Array.from(new Set(markets.map(m => m.category)));
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const filteredMarkets = selectedCategory === 'All'
    ? markets
    : markets.filter(m => m.category === selectedCategory);

  return (
    <>
      <style>{`
      .market-grid-container {
        width: 100%;
        min-height: 100vh;
        background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
        padding: 2rem 1rem;
      }

      .grid-header {
        max-width: 1400px;
        margin: 0 auto 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .grid-title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #ffffff, #00d9ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .btn-create {
        padding: 0.75rem 1.75rem;
        background: linear-gradient(135deg, var(--accent-green), #00dd38);
        color: #000;
        font-weight: 600;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 255, 65, 0.2);
        transition: all 0.3s ease;
      }

      .btn-create:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(0, 255, 65, 0.3);
      }

      .category-filters {
        max-width: 1400px;
        margin: 0 auto 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        overflow-x: auto;
        padding-bottom: 1rem;
      }

      .filter-btn {
        padding: 0.5rem 1.25rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        border-radius: 20px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.3s ease;
      }

      .filter-btn.active {
        background: var(--accent-yellow);
        color: #000;
        border-color: var(--accent-yellow);
      }

      .filter-btn:hover {
        border-color: var(--accent-cyan);
        color: var(--accent-cyan);
      }

      .markets-grid {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-muted);
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .empty-title {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
      }

      @media (max-width: 768px) {
        .market-grid-container {
          padding: 1rem;
        }

        .grid-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .grid-title {
          font-size: 2rem;
        }

        .markets-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .category-filters {
          margin-bottom: 1.5rem;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.4rem 1rem;
          font-size: 0.875rem;
        }
      }
    `}</style>

    <div className="market-grid-container">
      <div className="grid-header">
        <h1 className="grid-title">Markets</h1>
        <button className="btn-create" onClick={onCreateMarket}>
          + Create Market
        </button>
      </div>

      <div className="category-filters">
        <button
          className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All Markets
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="markets-grid">
        {filteredMarkets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-title">No markets found</div>
            <p>Create a new market to get started</p>
          </div>
        ) : (
          filteredMarkets.map(market => (
            <MarketCard
              key={market.id}
              market={market}
              onVote={onVote}
              onSelectMarket={onSelectMarket}
            />
          ))
        )}
      </div>
      </div>
    </>
  );
};
