import React, { useEffect, useState } from 'react';
import { rainService } from '../services/rainService';
import type { Market } from '@buidlrrr/rain-sdk';

interface RainMarket extends Market {
  formattedVolume: string;
}

interface FetchMarketsProps {
  limit?: number;
  sortBy?: 'Liquidity' | 'Volumn' | 'latest';
  status?: 'Live' | 'New' | 'Closed';
}

export const useRainMarkets = (props: FetchMarketsProps = {}) => {
  const [markets, setMarkets] = useState<RainMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rainService.getPublicMarkets({
        limit: props.limit || 12,
        sortBy: props.sortBy || 'Liquidity',
        status: props.status,
      });

      const formattedMarkets = data.map((market: Market) => ({
        ...market,
        formattedVolume: formatVolume(market.totalVolume),
      }));

      setMarkets(formattedMarkets);
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch markets');
    } finally {
      setLoading(false);
    }
  }, [props.limit, props.sortBy, props.status]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  return { markets, loading, error, refetch: fetchMarkets };
};

/**
 * Hook to fetch market details from Rain SDK
 */
export const useRainMarketDetails = (marketId: string | null) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!marketId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await rainService.getMarketDetails(marketId);
        setDetails(data);
      } catch (err) {
        console.error('Failed to fetch market details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [marketId]);

  return { details, loading, error };
};

/**
 * Hook to fetch protocol statistics
 */
export const useProtocolStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await rainService.getProtocolStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch protocol stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
};

// Helper function to format volume
function formatVolume(volumeStr: string): string {
  try {
    const volume = parseFloat(volumeStr);
    if (volume >= 1_000_000) {
      return `$${(volume / 1_000_000).toFixed(1)}M`;
    }
    if (volume >= 1_000) {
      return `$${(volume / 1_000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  } catch {
    return volumeStr;
  }
}
