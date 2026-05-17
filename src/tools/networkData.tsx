import { defineChain } from 'thirdweb/chains'

export interface NetworkConfig {
  name: string
  chainId: number
  rpc: string
  blockExplorer: string
  decimals: number
  symbol: string
  contractAddress?: `0x${string}`
  likeAmountNative?: string
}

export const ArbitrumNetwork: NetworkConfig = {
  name: 'Arbitrum',
  chainId: 42161,
  rpc: 'https://arbitrum.drpc.org',
  blockExplorer: 'https://arbiscan.io',
  decimals: 18,
  symbol: 'ETH',
}

export const Arbitrum = defineChain({
  id: ArbitrumNetwork.chainId,
  name: ArbitrumNetwork.name,
  rpc: ArbitrumNetwork.rpc,
  nativeCurrency: {
    name: 'Ether',
    symbol: ArbitrumNetwork.symbol,
    decimals: ArbitrumNetwork.decimals,
  },
  blockExplorers: [
    {
      name: 'Arbiscan',
      url: ArbitrumNetwork.blockExplorer,
    },
  ],
})

export const chains = [Arbitrum]
export const networks: NetworkConfig[] = [ArbitrumNetwork]
