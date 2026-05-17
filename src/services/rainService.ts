// Rain SDK integration service
// Reference: node_modules/@buidlrrr/rain-sdk/AGENTS.md

import { Rain } from '@buidlrrr/rain-sdk';

class RainService {
  private rain: Rain;

  constructor(environment: 'development' | 'stage' | 'production' = 'production') {
    this.rain = new Rain({
      environment,
      // rpcUrl and subgraphUrl will auto-configure based on environment
    });
  }

  /**
   * Fetch public markets from Rain API
   * Reference: getPublicMarkets(params)
   */
  async getPublicMarkets(params: {
    limit?: number;
    offset?: number;
    sortBy?: 'Liquidity' | 'Volumn' | 'latest';
    status?: 'Live' | 'New' | 'WaitingForResult' | 'UnderDispute' | 'Closed';
    creator?: string;
  }) {
    return await this.rain.getPublicMarkets(params);
  }

  /**
   * Get detailed market data including options and prices
   * Reference: getMarketDetails(marketId)
   */
  async getMarketDetails(marketId: string) {
    return await this.rain.getMarketDetails(marketId);
  }

  /**
   * Get current option prices from on-chain AMM
   * Reference: getMarketPrices(marketId)
   */
  async getMarketPrices(marketId: string) {
    return await this.rain.getMarketPrices(marketId);
  }

  /**
   * Get market volume data
   * Reference: getMarketVolume(marketId)
   */
  async getMarketVolume(marketId: string) {
    return await this.rain.getMarketVolume(marketId);
  }

  /**
   * Get market liquidity information
   * Reference: getMarketLiquidity(marketId)
   */
  async getMarketLiquidity(marketId: string) {
    return await this.rain.getMarketLiquidity(marketId);
  }

  /**
   * Get protocol-wide statistics
   * Reference: getProtocolStats()
   */
  async getProtocolStats() {
    return await this.rain.getProtocolStats();
  }

  /**
   * Build create market transaction
   * Reference: buildCreateMarketTx(params)
   *
   * @example
   * const txs = await rain.buildCreateMarketTx({
   *   marketQuestion: 'Will BTC hit 100k?',
   *   marketOptions: ['Yes', 'No'],
   *   marketTags: ['crypto', 'bitcoin'],
   *   marketDescription: 'Bitcoin price prediction',
   *   isPublic: true,
   *   creator: '0x...',
   *   startTime: BigInt(Math.floor(Date.now() / 1000)),
   *   endTime: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60),
   *   no_of_options: 2n,
   *   inputAmountWei: 100_000_000n, // 100 USDT (6 decimals)
   *   barValues: [50, 50],
   *   baseToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
   *   tokenDecimals: 6,
   * });
   */
  async buildCreateMarketTx(params: {
    marketQuestion: string;
    marketOptions: string[];
    marketTags: string[];
    marketDescription: string;
    isPublic: boolean;
    isPublicPoolResolverAi?: boolean;
    creator: string;
    startTime: bigint;
    endTime: bigint;
    no_of_options: bigint;
    inputAmountWei: bigint;
    barValues: number[];
    baseToken: string;
    tokenDecimals?: number;
  }) {
    return await this.rain.buildCreateMarketTx(params as any);
  }

  /**
   * Build approval transaction for token spending
   * Reference: buildApprovalTx(params)
   */
  buildApprovalTx(params: {
    tokenAddress: string;
    spender: string;
    amount?: bigint;
  }) {
    return this.rain.buildApprovalTx(params as any);
  }

  /**
   * Build buy option transaction (market buy)
   * Reference: buildBuyOptionRawTx(params)
   *
   * @example
   * const tx = rain.buildBuyOptionRawTx({
   *   marketContractAddress: '0x...',
   *   selectedOption: 1n,
   *   buyAmountInWei: 10_000_000n, // 10 USDT
   * });
   */
  buildBuyOptionRawTx(params: {
    marketContractAddress: string;
    selectedOption: bigint;
    buyAmountInWei: bigint;
  }) {
    return this.rain.buildBuyOptionRawTx(params as any);
  }

  /**
   * Build limit buy order transaction
   * Reference: buildLimitBuyOptionTx(params)
   */
  buildLimitBuyOptionTx(params: {
    marketContractAddress: string;
    selectedOption: number;
    pricePerShare: bigint;
    buyAmountInWei: bigint;
    tokenDecimals?: number;
  }) {
    return this.rain.buildLimitBuyOptionTx(params as any);
  }

  /**
   * Build sell option transaction
   * Reference: buildSellOptionTx(params)
   */
  buildSellOptionTx(params: {
    marketContractAddress: string;
    selectedOption: number;
    pricePerShare: number;
    shares: bigint;
    tokenDecimals?: number;
  }) {
    return this.rain.buildSellOptionTx(params as any);
  }

  /**
   * Build claim winnings transaction
   * Reference: buildClaimTx(params)
   */
  async buildClaimTx(params: {
    marketId: string;
    walletAddress: string;
  }) {
    return await this.rain.buildClaimTx(params as any);
  }

  /**
   * Build resolve market transaction
   * Reference: buildResolveMarketTx(params)
   */
  async buildResolveMarketTx(params: {
    marketId: string;
    winningOption: number;
  }) {
    return await this.rain.buildResolveMarketTx(params as any);
  }

  /**
   * Get market ID from contract address
   */
  async getMarketId(contractAddress: string) {
    return await this.rain.getMarketId(contractAddress as `0x${string}`);
  }

  /**
   * Get contract address from market ID
   */
  async getMarketAddress(marketId: string) {
    return await this.rain.getMarketAddress(marketId);
  }
}

// Export singleton instance
export const rainService = new RainService('production');

// USDT token on Arbitrum One
export const USDT_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
export const USDT_DECIMALS = 6;

// Chain config
export const ARBITRUM_ONE = {
  chainId: 42161,
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  blockExplorerUrl: 'https://arbiscan.io',
};

export type { Rain } from '@buidlrrr/rain-sdk';
