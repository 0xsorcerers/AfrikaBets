import React, { useState, useEffect } from 'react';
import { Market, CreateMarketInput } from './types/market';
import { LandingPage } from './components/LandingPage';
import { MarketGrid } from './components/MarketGrid';
import { MarketDetail } from './components/MarketDetail';
import { CreateMarketModal } from './components/CreateMarketModal';
import './styles/globals.css';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'markets'>('landing');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load sample markets from localStorage or create defaults
  useEffect(() => {
    const savedMarkets = localStorage.getItem('affrika-bets-markets');
    if (savedMarkets) {
      try {
        const parsed = JSON.parse(savedMarkets);
        setMarkets(parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          closesAt: new Date(m.closesAt)
        })));
      } catch (e) {
        // Initialize with sample markets if loading fails
        setMarkets(generateSampleMarkets());
      }
    } else {
      setMarkets(generateSampleMarkets());
    }
  }, []);

  // Save markets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('affrika-bets-markets', JSON.stringify(markets));
  }, [markets]);

  const generateSampleMarkets = (): Market[] => {
    return [
      {
        id: '1',
        title: 'Will Bitcoin reach $100k by end of 2025?',
        description: 'Predict whether Bitcoin will breach the $100,000 mark before December 31, 2025.',
        category: 'Crypto',
        backgroundUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62b337ad?w=500&h=300&fit=crop',
        backgroundType: 'image',
        createdAt: new Date(),
        closesAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        tags: ['Bitcoin', 'Price', 'Year End'],
        stakes: 15469.9,
        votes: [],
        options: [
          { id: 'opt1', label: 'Yes, $100k+', votes: 45, percentage: 60 },
          { id: 'opt2', label: 'No, below $100k', votes: 30, percentage: 40 }
        ],
        status: 'active',
        creator: '0x1234...'
      },
      {
        id: '2',
        title: 'Will Argentina win the 2026 World Cup?',
        description: 'Predict if Argentina will become champions of the 2026 FIFA World Cup.',
        category: 'Sports',
        backgroundUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
        backgroundType: 'image',
        createdAt: new Date(),
        closesAt: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
        tags: ['Football', 'World Cup', 'Argentina'],
        stakes: 8756.3,
        votes: [],
        options: [
          { id: 'opt1', label: 'Yes, Argentina wins', votes: 35, percentage: 45 },
          { id: 'opt2', label: 'No, another team', votes: 43, percentage: 55 }
        ],
        status: 'active',
        creator: '0x5678...'
      },
      {
        id: '3',
        title: 'Will Ethereum replace Bitcoin as #1 by market cap?',
        description: 'Predict whether Ethereum will surpass Bitcoin in total market capitalization.',
        category: 'Crypto',
        backgroundUrl: 'https://images.unsplash.com/photo-1516398957847-ed0a59c46d75?w=500&h=300&fit=crop',
        backgroundType: 'image',
        createdAt: new Date(),
        closesAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        tags: ['Ethereum', 'Market Cap', 'Crypto'],
        stakes: 52340.8,
        votes: [],
        options: [
          { id: 'opt1', label: 'Yes, ETH #1', votes: 28, percentage: 35 },
          { id: 'opt2', label: 'No, Bitcoin stays #1', votes: 52, percentage: 65 }
        ],
        status: 'active',
        creator: '0x9abc...'
      },
      {
        id: '4',
        title: 'African Union Peace Accord by June 2026?',
        description: 'Will the AU successfully broker a lasting peace agreement in key conflict regions?',
        category: 'Politics',
        backgroundUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop',
        backgroundType: 'image',
        createdAt: new Date(),
        closesAt: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        tags: ['Peace', 'Africa', 'Geopolitics'],
        stakes: 3210.5,
        votes: [],
        options: [
          { id: 'opt1', label: 'Yes, accord reached', votes: 22, percentage: 40 },
          { id: 'opt2', label: 'No, efforts continue', votes: 33, percentage: 60 }
        ],
        status: 'active',
        creator: '0xdef0...'
      }
    ];
  };

  const handleGetStarted = () => {
    setCurrentPage('markets');
  };

  const handleCreateMarket = (marketData: CreateMarketInput) => {
    const newMarket: Market = {
      id: Date.now().toString(),
      ...marketData,
      createdAt: new Date(),
      stakes: 0,
      votes: [],
      status: 'active',
      creator: '0xConnectedWallet...',
      options: marketData.options.map((label, idx) => ({
        id: `opt-${idx}`,
        label,
        votes: 0,
        percentage: 0
      }))
    };

    setMarkets(prev => [newMarket, ...prev]);
    setShowCreateModal(false);
  };

  const handleVote = (marketId: string, optionId?: string, amount?: number) => {
    setMarkets(prev =>
      prev.map(market => {
        if (market.id === marketId && optionId && amount) {
          const newOptions = market.options.map(opt => ({
            ...opt,
            votes: opt.id === optionId ? opt.votes + 1 : opt.votes,
            percentage: opt.id === optionId
              ? ((opt.votes + 1) / (market.options.reduce((s, o) => s + o.votes, 0) + 1)) * 100
              : (opt.votes / (market.options.reduce((s, o) => s + o.votes, 0) + 1)) * 100
          }));

          return {
            ...market,
            stakes: market.stakes + amount,
            votes: [
              ...market.votes,
              {
                id: Date.now().toString(),
                optionId,
                voter: '0xUser...',
                amount,
                timestamp: new Date()
              }
            ],
            options: newOptions
          };
        }
        return market;
      })
    );
  };

  return (
    <div className="app">
      {currentPage === 'landing' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <>
          <MarketGrid
            markets={markets}
            onVote={(marketId) => {
              const market = markets.find(m => m.id === marketId);
              if (market) setSelectedMarket(market);
            }}
            onSelectMarket={setSelectedMarket}
            onCreateMarket={() => setShowCreateModal(true)}
          />

          {selectedMarket && (
            <MarketDetail
              market={selectedMarket}
              onVote={(optionId, amount) => {
                handleVote(selectedMarket.id, optionId, amount);
                setMarkets(prev =>
                  prev.map(m =>
                    m.id === selectedMarket.id
                      ? {
                          ...m,
                          options: m.options.map(opt => ({
                            ...opt,
                            votes: opt.id === optionId ? opt.votes + 1 : opt.votes
                          })),
                          votes: [
                            ...m.votes,
                            {
                              id: Date.now().toString(),
                              optionId,
                              voter: '0xUser...',
                              amount,
                              timestamp: new Date()
                            }
                          ],
                          stakes: m.stakes + amount
                        }
                      : m
                  )
                );
              }}
              onClose={() => setSelectedMarket(null)}
            />
          )}

          {showCreateModal && (
            <CreateMarketModal
              onCreate={handleCreateMarket}
              onClose={() => setShowCreateModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};
