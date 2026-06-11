import { Rain } from '@buidlrrr/rain-sdk'
import { ArbitrumNetwork } from '../tools/networkData'

export const USDT_ARBITRUM = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as const
export const USDT_DECIMALS = 6
export const MAX_MARKET_MEDIA_BYTES = 5 * 1024 * 1024

export const rain = new Rain({
  environment: 'production',
  rpcUrl: ArbitrumNetwork.rpc,
})

export type MarketStatus = 'Live' | 'New' | 'WaitingForResult' | 'UnderDispute' | 'UnderAppeal' | 'ClosingSoon' | 'InReview' | 'InEvaluation' | 'Closed' | 'Trading'

export interface RainMarket {
  id: string
  title: string
  totalVolume: string
  status: MarketStatus
  poolOwnerWalletAddress?: string
  contractAddress?: string
}

export interface RainMarketOption {
  choiceIndex: number
  optionName: string
  currentPrice: bigint
  totalFunds: bigint
  totalVotes: bigint
}

export interface RainMarketDetails {
  id: string
  title: string
  status: MarketStatus
  contractAddress: `0x${string}`
  options: RainMarketOption[]
  poolState: number
  numberOfOptions: bigint
  startTime: bigint
  endTime: bigint
  oracleEndTime: bigint
  allFunds: bigint
  allVotes: bigint
  totalLiquidity: bigint
  winner: bigint
  poolFinalized: boolean
  isPublic: boolean
  baseToken: `0x${string}`
  baseTokenDecimals: bigint
  poolOwner: `0x${string}`
  resolver: `0x${string}`
  resolverIsAI: boolean
  isDisputed: boolean
  isAppealed: boolean
}

export interface RainRawTransaction {
  to: `0x${string}`
  data: `0x${string}`
  value?: bigint
}

export interface LocalMarketMeta {
  id: string
  description: string
  tags: string[]
  mediaUrl: string
  mediaType: 'image' | 'video'
  createdAt: number
  comments: MarketComment[]
}

export interface MarketComment {
  id: string
  author: string
  body: string
  createdAt: number
}

export interface MarketDraft {
  question: string
  description: string
  options: string[]
  tags: string[]
  mediaUrl: string
  mediaType: 'image' | 'video'
  endDate: string
  liquidity: string
}

const STORAGE_KEY = 'afrikabets.marketMeta.v1'
const COMMENTS_KEY = 'afrikabets.marketComments.v1'

export function formatTokenAmount(value?: bigint | string | number, decimals = USDT_DECIMALS): string {
  if (value === undefined || value === null) return '0'
  if (typeof value === 'string') {
    const numeric = Number(value)
    return Number.isFinite(numeric) ? compactNumber(numeric) : value
  }
  if (typeof value === 'number') return compactNumber(value)

  const base = 10n ** BigInt(decimals)
  const whole = value / base
  const fraction = value % base
  const padded = fraction.toString().padStart(decimals, '0').slice(0, 2)
  return `${whole.toString()}${padded === '00' ? '' : `.${padded}`}`
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function toTokenWei(amount: string, decimals = USDT_DECIMALS): bigint {
  const [whole = '0', fraction = ''] = amount.trim().replace(/,/g, '').split('.')
  const normalizedWhole = whole.replace(/\D/g, '') || '0'
  const normalizedFraction = fraction.replace(/\D/g, '').padEnd(decimals, '0').slice(0, decimals)
  return BigInt(normalizedWhole) * 10n ** BigInt(decimals) + BigInt(normalizedFraction || '0')
}

export function getMarketMeta(): Record<string, LocalMarketMeta> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveMarketMeta(meta: LocalMarketMeta): void {
  const current = getMarketMeta()
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [meta.id]: meta }))
}

export function getStoredComments(marketId: string): MarketComment[] {
  try {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}') as Record<string, MarketComment[]>
    return comments[marketId] || []
  } catch {
    return []
  }
}

export function saveStoredComment(marketId: string, comment: MarketComment): MarketComment[] {
  const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}') as Record<string, MarketComment[]>
  const next = [comment, ...(allComments[marketId] || [])]
  localStorage.setItem(COMMENTS_KEY, JSON.stringify({ ...allComments, [marketId]: next }))
  return next
}

export async function validateMarketMedia(url: string): Promise<{ mediaType: 'image' | 'video'; size?: number }> {
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Media must be an http or https URL.')
  }

  const extension = parsed.pathname.split('.').pop()?.toLowerCase()
  const inferredType = extension === 'mp4' ? 'video' : extension === 'gif' || extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' ? 'image' : undefined

  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (response.ok) {
      const length = response.headers.get('content-length')
      const contentType = response.headers.get('content-type') || ''
      const size = length ? Number(length) : undefined
      if (size && size > MAX_MARKET_MEDIA_BYTES) {
        throw new Error('Media must be 5MB or less.')
      }
      if (contentType.startsWith('video/')) return { mediaType: 'video', size }
      if (contentType.startsWith('image/')) return { mediaType: 'image', size }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('5MB')) throw error
  }

  if (!inferredType) {
    throw new Error('Use an image, gif, or mp4 link no larger than 5MB.')
  }
  return { mediaType: inferredType }
}

export function optionShare(fallback: number, option?: { currentPrice?: bigint; totalFunds?: bigint }): number {
  if (!option?.currentPrice) return fallback
  return Math.max(1, Math.min(99, Number(option.currentPrice / 10_000_000_000_000_000n)))
}

export async function fetchLiveMarkets(): Promise<RainMarket[]> {
  return rain.getPublicMarkets({ limit: 24, sortBy: 'Liquidity', status: 'Live' }) as Promise<RainMarket[]>
}

export async function fetchMarketDetails(marketId: string): Promise<RainMarketDetails> {
  return rain.getMarketDetails(marketId) as Promise<RainMarketDetails>
}

export function buildBuyTx(marketContractAddress: `0x${string}`, selectedOption: number, amount: string): RainRawTransaction {
  return rain.buildBuyOptionRawTx({
    marketContractAddress,
    selectedOption: BigInt(selectedOption),
    buyAmountInWei: toTokenWei(amount),
  }) as RainRawTransaction
}

export function buildSellTx(marketContractAddress: `0x${string}`, selectedOption: number, pricePerShare: string, shares: string): RainRawTransaction {
  return rain.buildSellOptionTx({
    marketContractAddress,
    selectedOption,
    pricePerShare: Number(pricePerShare),
    shares: toTokenWei(shares),
    tokenDecimals: USDT_DECIMALS,
  }) as RainRawTransaction
}

export async function buildCreateMarketTransactions(draft: MarketDraft, creator: `0x${string}`): Promise<RainRawTransaction[]> {
  const startTime = BigInt(Math.floor(Date.now() / 1000) + 60)
  const endTime = BigInt(Math.floor(new Date(draft.endDate).getTime() / 1000))
  const barValue = Math.floor(100 / draft.options.length)
  const barValues = draft.options.map((_, index) => (index === draft.options.length - 1 ? 100 - barValue * (draft.options.length - 1) : barValue))

  return rain.buildCreateMarketTx({
    marketQuestion: draft.question,
    marketOptions: draft.options,
    marketTags: draft.tags,
    marketDescription: `${draft.description}\n\nMedia: ${draft.mediaUrl}`,
    isPublic: true,
    isPublicPoolResolverAi: false,
    creator,
    startTime,
    endTime,
    no_of_options: BigInt(draft.options.length),
    disputeTimer: 7200,
    inputAmountWei: toTokenWei(draft.liquidity),
    barValues,
    baseToken: USDT_ARBITRUM,
    tokenDecimals: USDT_DECIMALS,
  }) as Promise<RainRawTransaction[]>
}

export function fallbackMedia(index: number): { url: string; type: 'image' | 'video' } {
  const media = [
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  ]
  return { url: media[index % media.length], type: 'image' }
}
