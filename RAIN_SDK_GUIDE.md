// Documentation on Rain SDK integration for AfrikaBets
# AfrikaBets + Rain SDK Integration Guide

## Overview

AfrikaBets is now fully integrated with the **Rain Prediction Markets SDK** v2.0.0. This document explains how to use the SDK to interact with real prediction markets on **Arbitrum One** (Chain ID: 42161).

## Reference

- **Source**: `node_modules/@buidlrrr/rain-sdk/AGENTS.md`
- **Chain**: Arbitrum One (42161)
- **Token**: USDT (6 decimals) - `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9`
- **Environments**: 
  - Production: `https://prod-api.rain.one`
  - Stage: `https://stg-api.rain.one`
  - Development: `https://dev-api.rain.one`

## Key Features

### 1. Market Queries

```typescript
import { rainService } from '@/services/rainService';

// Fetch public markets
const markets = await rainService.getPublicMarkets({
  limit: 12,
  sortBy: 'Liquidity', // or 'Volumn', 'latest'
  status: 'Live',
});

// Get detailed market data
const details = await rainService.getMarketDetails(marketId);

// Get current option prices
const prices = await rainService.getMarketPrices(marketId);

// Get market volume
const volume = await rainService.getMarketVolume(marketId);

// Get protocol stats
const stats = await rainService.getProtocolStats();
```

### 2. Market Creation

```typescript
const txs = await rainService.buildCreateMarketTx({
  marketQuestion: 'Will Bitcoin reach $100k by 2025?',
  marketOptions: ['Yes', 'No'], // 3-26 options required
  marketTags: ['crypto', 'bitcoin'], // 1-3 tags
  marketDescription: 'Detailed description here...',
  isPublic: true,
  creator: '0x...',
  startTime: BigInt(Math.floor(Date.now() / 1000)),
  endTime: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
  no_of_options: 2n,
  inputAmountWei: 100_000_000n, // 100 USDT (6 decimals)
  barValues: [50, 50], // Initial probability distribution %
  baseToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
  tokenDecimals: 6,
});

// Execute transactions sequentially
for (const tx of txs) {
  await provider.sendTransaction(tx);
}
```

### 3. Voting/Trading

```typescript
// Buy shares of an option (market buy)
const buyTx = rainService.buildBuyOptionRawTx({
  marketContractAddress: '0x...',
  selectedOption: 1n, // 0-indexed
  buyAmountInWei: 10_000_000n, // 10 USDT
});

// Place limit buy order
const limitBuyTx = rainService.buildLimitBuyOptionTx({
  marketContractAddress: '0x...',
  selectedOption: 1,
  pricePerShare: 500000000000000000n, // 0.50 in 1e18 scale
  buyAmountInWei: 10_000_000n,
});

// Sell shares
const sellTx = rainService.buildSellOptionTx({
  marketContractAddress: '0x...',
  selectedOption: 1,
  pricePerShare: 0.75,
  shares: 5_000_000n,
});
```

### 4. Claims & Resolution

```typescript
// Claim winnings after market resolves
const claimTx = await rainService.buildClaimTx({
  marketId: '698c8f116e985bbfacc7fc01',
  walletAddress: '0x...',
});

// Resolve market (admin only)
const resolveTxs = await rainService.buildResolveMarketTx({
  marketId: '698c8f116e985bbfacc7fc01',
  winningOption: 1, // 1-indexed
});
```

## React Hooks

### useWallet

```typescript
import { useWallet } from '@/hooks/useWallet';

export const MyComponent = () => {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <button onClick={connectWallet}>
      {isConnected ? address : 'Connect Wallet'}
    </button>
  );
};
```

Features:
- Auto-connects to Arbitrum One
- Prompts to switch chain if needed
- Handles MetaMask chain add if required

### useRainMarkets

```typescript
import { useRainMarkets } from '@/hooks/useRainMarkets';

export const MarketsList = () => {
  const { markets, loading, error, refetch } = useRainMarkets({
    limit: 20,
    sortBy: 'Liquidity',
    status: 'Live',
  });

  if (loading) return <div>Loading markets...</div>;
  if (error) return <div>Error: {error}</div>;

  return markets.map(market => (
    <div key={market.id}>
      <h3>{market.title}</h3>
      <p>Volume: {market.formattedVolume}</p>
    </div>
  ));
};
```

### useRainMarketDetails

```typescript
import { useRainMarketDetails } from '@/hooks/useRainMarkets';

export const MarketDetail = ({ marketId }: { marketId: string }) => {
  const { details, loading, error } = useRainMarketDetails(marketId);

  if (!details) return <div>No market data</div>;

  return (
    <div>
      <h2>{details.title}</h2>
      <p>Status: {details.status}</p>
      <p>Total Volume: {details.allVotes}</p>
      <div>
        {details.options.map((option: any) => (
          <div key={option.choiceIndex}>
            <span>{option.optionName}</span>
            <span>{Number(option.currentPrice) / 1e18 * 100}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### useProtocolStats

```typescript
import { useProtocolStats } from '@/hooks/useRainMarkets';

export const Stats = () => {
  const { stats } = useProtocolStats(); // Refreshes every 30s

  return (
    <div>
      <p>TVL: ${stats?.tvl || 0}</p>
      <p>Total Volume: ${stats?.totalVolume || 0}</p>
      <p>Active Markets: {stats?.activeMarkets || 0}</p>
    </div>
  );
};
```

## Components

### WalletButton

```typescript
import { WalletButton } from '@/components/WalletButton';

export const App = () => (
  <div>
    <WalletButton />
  </div>
);
```

Features:
- Shows connection status
- Connects to Arbitrum One automatically
- Displays shortened wallet address when connected
- Pulsing indicator (green = connected, red = disconnected)

## Important Notes

### Price Scale

Rain SDK uses **1e18 scale** for prices:
- 0.50 (50%) = `500000000000000000n`
- 0.75 (75%) = `750000000000000000n`
- Convert to percentage: `(price / 1e18) * 100`

### Token Amounts

Base token is USDT with **6 decimals**:
- 1 USDT = `1_000_000` wei
- 10 USDT = `10_000_000` wei
- 100 USDT = `100_000_000` wei

### Market Status Values

- `Live` - Active market, can vote
- `New` - Recently created
- `ClosingSoon` - About to close
- `WaitingForResult` - Closed, awaiting resolution
- `UnderDispute` - Result disputed
- `Closed` - Market resolved and finished

### Required Approvals

Before voting, you must approve USDT spending:
```typescript
const approveTx = rainService.buildApprovalTx({
  tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  spender: marketContractAddress,
  amount: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), // Max uint256
});
```

## Arbitrum One Details

- **Chain ID**: 42161
- **RPC**: https://arb1.arbitrum.io/rpc
- **Block Explorer**: https://arbiscan.io
- **Network Token**: ETH (Ether)
- **Base Token for Markets**: USDT

## Troubleshooting

### "No subgraph configured"
If you need transaction history or PnL data, you must configure the subgraph URL:
```typescript
const rain = new Rain({
  environment: 'production',
  subgraphUrl: 'https://gateway.thegraph.com/api/subgraphs/id/...',
  subgraphApiKey: 'your-api-key',
});
```

### "RPC URL not responding"
The SDK auto-selects from multiple public RPCs. If all fail, provide your own:
```typescript
const rain = new Rain({
  rpcUrl: 'https://your-custom-rpc.com',
});
```

### Transaction Failed
- Ensure sufficient ETH for gas
- Ensure sufficient USDT for market operations
- Approve token before spending
- Check market status (must be 'Live' to vote)

## Next Steps

1. ✅ Import hooks and services
2. ✅ Add WalletButton to your layout
3. ✅ Fetch and display markets with useRainMarkets
4. ✅ Build buy/sell/create transactions
5. ✅ Connect to user's ethers provider and send transactions
6. ✅ Handle transaction confirmations and errors

---

**Reference Documentation**: [Rain SDK AGENTS.md](../node_modules/@buidlrrr/rain-sdk/AGENTS.md)
