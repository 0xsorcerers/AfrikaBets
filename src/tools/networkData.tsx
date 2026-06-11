import { defineChain } from 'thirdweb/chains'
import type { Chain } from 'thirdweb/chains'

export interface NetworkConfig {
  key: string
  name: string
  shortName: string
  chainId: number
  rpc: string
  blockExplorer: string
  decimals: number
  symbol: string
  nativeCurrencyName: string
  settlement: 'rain' | 'cross-network'
  accent: string
  contractAddress?: `0x${string}`
  likeAmountNative?: string
}

export const ArbitrumNetwork: NetworkConfig = {
  key: 'arbitrum',
  name: 'Arbitrum One',
  shortName: 'Arbitrum',
  chainId: 42161,
  rpc: 'https://arbitrum.drpc.org',
  blockExplorer: 'https://arbiscan.io',
  decimals: 18,
  symbol: 'ETH',
  nativeCurrencyName: 'Ether',
  settlement: 'rain',
  accent: '#2ee7ff',
}

export const BaseNetwork: NetworkConfig = {
  key: 'base',
  name: 'Base',
  shortName: 'Base',
  chainId: 8453,
  rpc: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  decimals: 18,
  symbol: 'ETH',
  nativeCurrencyName: 'Ether',
  settlement: 'cross-network',
  accent: '#3861fb',
}

export const OptimismNetwork: NetworkConfig = {
  key: 'optimism',
  name: 'OP Mainnet',
  shortName: 'Optimism',
  chainId: 10,
  rpc: 'https://mainnet.optimism.io',
  blockExplorer: 'https://optimistic.etherscan.io',
  decimals: 18,
  symbol: 'ETH',
  nativeCurrencyName: 'Ether',
  settlement: 'cross-network',
  accent: '#ff0420',
}

export const PolygonNetwork: NetworkConfig = {
  key: 'polygon',
  name: 'Polygon PoS',
  shortName: 'Polygon',
  chainId: 137,
  rpc: 'https://polygon-rpc.com',
  blockExplorer: 'https://polygonscan.com',
  decimals: 18,
  symbol: 'POL',
  nativeCurrencyName: 'POL',
  settlement: 'cross-network',
  accent: '#8247e5',
}

export const CeloNetwork: NetworkConfig = {
  key: 'celo',
  name: 'Celo',
  shortName: 'Celo',
  chainId: 42220,
  rpc: 'https://forno.celo.org',
  blockExplorer: 'https://celoscan.io',
  decimals: 18,
  symbol: 'CELO',
  nativeCurrencyName: 'CELO',
  settlement: 'cross-network',
  accent: '#35d07f',
}

export function toThirdwebChain(network: NetworkConfig): Chain {
  return defineChain({
    id: network.chainId,
    name: network.name,
    rpc: network.rpc,
    nativeCurrency: {
      name: network.nativeCurrencyName,
      symbol: network.symbol,
      decimals: network.decimals,
    },
    blockExplorers: [
      {
        name: `${network.shortName} Explorer`,
        url: network.blockExplorer,
      },
    ],
  })
}

export const networks: NetworkConfig[] = [
  ArbitrumNetwork,
  BaseNetwork,
  OptimismNetwork,
  PolygonNetwork,
  CeloNetwork,
]

export const Arbitrum = toThirdwebChain(ArbitrumNetwork)
export const chains = networks.map(toThirdwebChain)

export function getNetworkByChainId(chainId?: number): NetworkConfig | undefined {
  return networks.find((network) => network.chainId === chainId)
}

export function getChainById(chainId: number): Chain | undefined {
  return chains.find((chain) => chain.id === chainId)
}

export function isRainSettlementNetwork(chainId?: number): boolean {
  return getNetworkByChainId(chainId)?.settlement === 'rain'
}
