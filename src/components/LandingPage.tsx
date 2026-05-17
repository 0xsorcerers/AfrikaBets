import React from 'react';
import { WalletButton } from './WalletButton';
import { Connector } from '../tools/utils';
import '../styles/globals.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <style>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
          position: relative;
          overflow: hidden;
        }

        .landing-page::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          top: -100px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }

        .landing-page::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          bottom: -50px;
          left: -50px;
          animation: float 25s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        .landing-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }

        .landing-logo {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .landing-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ffffff, #00d9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .landing-subtitle {
          font-size: 1.5rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-style: italic;
        }

        .landing-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .feature-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid var(--accent-cyan);
          border-radius: 20px;
          color: var(--accent-cyan);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .feature-tag:hover {
          background: rgba(0, 217, 255, 0.2);
          transform: translateY(-2px);
        }

        .landing-cta {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .btn-large {
          padding: 1rem 3rem;
          font-size: 1.125rem;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 32px rgba(0, 255, 65, 0.2);
          transition: all 0.3s ease;
        }

        .btn-large:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 255, 65, 0.3);
        }

        .get-started-wallet {
          padding: 1rem 3rem !important;
          min-width: 190px !important;
          min-height: 56px !important;
          border-radius: 8px !important;
          background: linear-gradient(135deg, var(--accent-green), #00dd38) !important;
          color: #000 !important;
          border: none !important;
          font-size: 1.125rem !important;
          font-weight: 700 !important;
          box-shadow: 0 8px 32px rgba(0, 255, 65, 0.2) !important;
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }

        .get-started-wallet:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 255, 65, 0.3) !important;
        }

        .get-started-wallet:disabled {
          cursor: not-allowed;
          opacity: 0.65;
          transform: none;
        }

        .landing-description {
          color: var(--text-muted);
          margin-top: 1rem;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .landing-title {
            font-size: 2.5rem;
          }

          .landing-subtitle {
            font-size: 1.125rem;
          }

          .landing-features {
            gap: 1rem;
          }

          .feature-tag {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div className="landing-content">
        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
          <WalletButton />
        </div>
        
        <div className="landing-logo">🌍</div>
        <h1 className="landing-title">AfrikaBets</h1>
        <p className="landing-subtitle">"Where prediction becomes reality."</p>

        <div className="landing-features">
          <span className="feature-tag">📊 Trade Predictions</span>
          <span className="feature-tag">🌍 Real-time Markets</span>
          <span className="feature-tag">💰 Any Topic</span>
        </div>

        <div className="landing-cta">
          <Connector label="Get Started" className="get-started-wallet" onConnect={onGetStarted} />
          <p className="landing-description">Connect your wallet to begin making predictions on Arbitrum One</p>
        </div>
      </div>
    </div>
  );
};
