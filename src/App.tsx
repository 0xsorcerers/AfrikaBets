import { useEffect, useMemo, useState } from 'react'
import { Connector, WalletNetworkPanel } from './tools/utils'
import {
  buildBuyTx,
  buildCreateMarketTransactions,
  buildSellTx,
  fallbackMedia,
  fetchLiveMarkets,
  fetchMarketDetails,
  formatTokenAmount,
  getMarketMeta,
  getStoredComments,
  optionShare,
  saveMarketMeta,
  saveStoredComment,
  validateMarketMedia,
  type LocalMarketMeta,
  type MarketComment,
  type MarketDraft,
  type RainMarket,
  type RainMarketDetails,
  type RainRawTransaction,
} from './lib/rain'
import './styles/globals.css'

type Page = { name: 'home' } | { name: 'market'; id: string }
type TradeMode = 'buy' | 'sell'

const categories = ['All', 'Africa', 'Football', 'Politics', 'Crypto', 'Culture', 'Economy', 'Food', 'AI', 'Climate']
const blankDraft: MarketDraft = {
  question: '',
  description: '',
  options: ['Yes', 'No'],
  tags: ['Africa'],
  mediaUrl: '',
  mediaType: 'image',
  endDate: '',
  liquidity: '10',
}

function App() {
  const [page, setPage] = useState<Page>({ name: 'home' })
  const [markets, setMarkets] = useState<RainMarket[]>([])
  const [details, setDetails] = useState<Record<string, RainMarketDetails>>({})
  const [meta, setMeta] = useState<Record<string, LocalMarketMeta>>({})
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    setMeta(getMarketMeta())
    fetchLiveMarkets()
      .then(setMarkets)
      .catch((eventError: Error) => {
        setError(eventError.message)
        setMarkets(sampleMarkets)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const local = meta[market.id]
      const haystack = `${market.title} ${local?.description || ''} ${local?.tags.join(' ') || ''}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      const matchesCategory = category === 'All' || local?.tags.some((tag) => tag.toLowerCase() === category.toLowerCase()) || haystack.includes(category.toLowerCase())
      return matchesQuery && matchesCategory
    })
  }, [category, markets, meta, query])

  const selectedMarket = page.name === 'market' ? markets.find((market) => market.id === page.id) : undefined

  function handleCreated(draft: MarketDraft) {
    const optimisticId = `local-${crypto.randomUUID()}`
    const localMarket: RainMarket = {
      id: optimisticId,
      title: draft.question,
      totalVolume: draft.liquidity,
      status: 'New',
    }
    const localMeta: LocalMarketMeta = {
      id: optimisticId,
      description: draft.description,
      tags: draft.tags,
      mediaUrl: draft.mediaUrl,
      mediaType: draft.mediaType,
      createdAt: Date.now(),
      comments: [],
    }
    saveMarketMeta(localMeta)
    setMarkets((current) => [localMarket, ...current])
    setMeta((current) => ({ ...current, [optimisticId]: localMeta }))
    setCreateOpen(false)
  }

  if (page.name === 'market' && selectedMarket) {
    return (
      <MarketPage
        market={selectedMarket}
        details={details[selectedMarket.id]}
        localMeta={meta[selectedMarket.id]}
        onBack={() => setPage({ name: 'home' })}
        onNeedDetails={async () => {
          if (!details[selectedMarket.id] && !selectedMarket.id.startsWith('local-')) {
            const marketDetails = await fetchMarketDetails(selectedMarket.id)
            setDetails((current) => ({ ...current, [selectedMarket.id]: marketDetails }))
          }
        }}
      />
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar glass-panel">
        <button className="brand" onClick={() => setPage({ name: 'home' })} type="button">
          <span className="brand-mark">AB</span>
          <span>AfrikaBets</span>
        </button>
        <nav className="desktop-nav">
          <a href="#markets">Markets</a>
          <a href="#create">Create</a>
          <a href="#learn">Rain SDK</a>
        </nav>
        <Connector className="wallet-button" />
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Arbitrum prediction markets for African stories</span>
          <h1>Trade the outcomes everyone is already debating.</h1>
          <p>
            AfrikaBets uses Rain SDK market primitives, Arbitrum settlement, and expressive media-backed cards so every market feels like a story worth watching.
          </p>
          <div className="hero-actions">
            <Connector label="Log in to trade" className="primary-action hero-login" />
            <button className="secondary-action" onClick={() => setCreateOpen(true)} type="button">Create a market</button>
            <a className="secondary-action" href="#markets">Explore live markets</a>
          </div>
        </div>
        <div className="hero-card glass-panel">
          <span className="live-dot">Live market pulse</span>
          <h2>AFCON, currencies, elections, music, food, crypto—priced by the crowd.</h2>
          <div className="pulse-grid">
            <strong>24</strong><span>featured markets</span>
            <strong>$2.4M</strong><span>sample volume</span>
            <strong>5MB</strong><span>media cap</span>
          </div>
        </div>
      </section>

      <WalletNetworkPanel />

      <section className="market-toolbar glass-panel" id="markets">
        <label className="search-box">
          <span>⌕</span>
          <input placeholder="Search markets, tags, countries..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button className="create-pill" onClick={() => setCreateOpen(true)} type="button">+ New market</button>
      </section>

      <div className="category-row" aria-label="Market categories">
        {categories.map((item) => (
          <button className={item === category ? 'chip active' : 'chip'} key={item} onClick={() => setCategory(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      {error && <p className="status-note">Rain API fallback active: {error}</p>}
      {loading ? <p className="status-note">Loading Rain markets…</p> : null}

      <section className="market-grid">
        {filteredMarkets.map((market, index) => (
          <MarketCard key={market.id} market={market} localMeta={meta[market.id]} index={index} onOpen={() => setPage({ name: 'market', id: market.id })} />
        ))}
      </section>

      <section className="learn-panel glass-panel" id="learn">
        <div>
          <span className="eyebrow">Built from scratch</span>
          <h2>Rain SDK inside, AfrikaBets interface outside.</h2>
        </div>
        <p>
          The app fetches public markets, builds create/buy/sell raw transactions, and keeps user-provided market media metadata locally for a fast prototype experience. Thirdweb now handles login plus Arbitrum, Base, Optimism, Polygon, and Celo network switching from the shared networkData structure.
        </p>
      </section>

      {createOpen && <CreateMarketDialog onClose={() => setCreateOpen(false)} onCreated={handleCreated} />}
    </main>
  )
}

function MarketCard({ market, localMeta, index, onOpen }: { market: RainMarket; localMeta?: LocalMarketMeta; index: number; onOpen: () => void }) {
  const media = localMeta ? { url: localMeta.mediaUrl, type: localMeta.mediaType } : fallbackMedia(index)
  const tags = localMeta?.tags || ['Africa', market.status, index % 2 ? 'Culture' : 'Markets']
  const yes = 34 + ((index * 13) % 45)

  return (
    <article className="market-card" onClick={onOpen} tabIndex={0} role="button" onKeyDown={(event) => event.key === 'Enter' && onOpen()}>
      <MediaBackdrop media={media} />
      <div className="card-overlay" />
      <div className="card-content">
        <div className="tag-row">{tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h3>{market.title}</h3>
        <p>{localMeta?.description || 'Open this market to inspect prices, trade outcomes, and join the conversation.'}</p>
        <div className="odds-row"><span>Yes {yes}%</span><span>No {100 - yes}%</span></div>
        <div className="probability"><span style={{ width: `${yes}%` }} /></div>
        <div className="card-footer">
          <span>👥 {2 + (index % 9)} votes</span>
          <span>◎ {formatTokenAmount(market.totalVolume)} USDT staked</span>
        </div>
        <button type="button">Trade</button>
      </div>
    </article>
  )
}

function MarketPage({ market, details, localMeta, onBack, onNeedDetails }: { market: RainMarket; details?: RainMarketDetails; localMeta?: LocalMarketMeta; onBack: () => void; onNeedDetails: () => Promise<void> }) {
  const [comments, setComments] = useState<MarketComment[]>([])
  const [comment, setComment] = useState('')
  const [activeMode, setActiveMode] = useState<TradeMode>('buy')
  const [tx, setTx] = useState<RainRawTransaction | null>(null)
  const [tradeError, setTradeError] = useState('')
  const media = localMeta ? { url: localMeta.mediaUrl, type: localMeta.mediaType } : fallbackMedia(market.title.length)
  const tags = localMeta?.tags || ['Africa', market.status, 'Rain']

  useEffect(() => {
    setComments(getStoredComments(market.id))
    onNeedDetails().catch((eventError: Error) => setTradeError(eventError.message))
  }, [market.id])

  function addComment() {
    if (!comment.trim()) return
    const next = saveStoredComment(market.id, {
      id: crypto.randomUUID(),
      author: 'Guest trader',
      body: comment.trim(),
      createdAt: Date.now(),
    })
    setComments(next)
    setComment('')
  }

  return (
    <main className="detail-page">
      <MediaBackdrop media={media} />
      <div className="detail-scrim" />
      <button className="back-button" onClick={onBack} type="button">← Back</button>
      <button className="share-button" type="button">⌘</button>

      <section className="detail-hero">
        <div className="tag-row centered">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h1>{market.title}</h1>
        <p>{localMeta?.description || 'Trade this Rain-powered prediction market and compare crowd conviction before the outcome resolves.'}</p>
        <div className="stake-bar">◎ {details ? formatTokenAmount(details.allFunds, Number(details.baseTokenDecimals)) : formatTokenAmount(market.totalVolume)} staked.</div>
        <div className="market-meta-row"><span>◷ Created {new Date(localMeta?.createdAt || Date.now()).toLocaleDateString()}</span><span>👥 {details ? details.allVotes.toString() : comments.length + 1} votes</span><span className="live-badge">● {market.status}</span></div>
      </section>

      <section className="detail-layout">
        <div className="outcome-panel glass-panel">
          <h2>Outcomes</h2>
          {(details?.options || [{ optionName: 'Yes' }, { optionName: 'No' }]).map((option, index) => {
            const share = optionShare(index === 0 ? 56 : 44, 'currentPrice' in option ? option : undefined)
            return (
              <div className="outcome-row" key={option.optionName}>
                <div><strong>{option.optionName}</strong><span>{share}% implied</span></div>
                <div className="probability"><span style={{ width: `${share}%` }} /></div>
              </div>
            )
          })}
        </div>
        <TradePanel market={market} details={details} activeMode={activeMode} onMode={setActiveMode} onTx={setTx} onError={setTradeError} />
        <CommentPanel comments={comments} comment={comment} setComment={setComment} addComment={addComment} />
      </section>

      {(tx || tradeError) && (
        <aside className="tx-drawer glass-panel">
          <button type="button" onClick={() => { setTx(null); setTradeError('') }}>×</button>
          {tradeError ? <p className="error-text">{tradeError}</p> : <pre>{JSON.stringify(tx, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)}</pre>}
        </aside>
      )}
    </main>
  )
}

function TradePanel({ market, details, activeMode, onMode, onTx, onError }: { market: RainMarket; details?: RainMarketDetails; activeMode: TradeMode; onMode: (mode: TradeMode) => void; onTx: (tx: RainRawTransaction) => void; onError: (error: string) => void }) {
  const [option, setOption] = useState(0)
  const [amount, setAmount] = useState('5')
  const [price, setPrice] = useState('0.5')
  const options = details?.options || [{ choiceIndex: 0, optionName: 'Yes' }, { choiceIndex: 1, optionName: 'No' }]

  function previewTrade() {
    onError('')
    const contractAddress = details?.contractAddress || market.contractAddress
    if (!contractAddress) {
      onError('Open a live Rain market with a contract address before building trade transactions.')
      return
    }
    const rawTx = activeMode === 'buy' ? buildBuyTx(contractAddress as `0x${string}`, option, amount) : buildSellTx(contractAddress as `0x${string}`, option, price, amount)
    onTx(rawTx)
  }

  return (
    <section className="trade-panel glass-panel">
      <div className="mode-toggle"><button className={activeMode === 'buy' ? 'active' : ''} onClick={() => onMode('buy')} type="button">Buy</button><button className={activeMode === 'sell' ? 'active' : ''} onClick={() => onMode('sell')} type="button">Sell</button></div>
      <label>Outcome<select value={option} onChange={(event) => setOption(Number(event.target.value))}>{options.map((item: { optionName: string }, index: number) => <option value={index} key={item.optionName}>{item.optionName}</option>)}</select></label>
      <label>{activeMode === 'buy' ? 'USDT amount' : 'Shares'}<input value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
      {activeMode === 'sell' && <label>Price per share<input value={price} onChange={(event) => setPrice(event.target.value)} /></label>}
      <button className="primary-action full" onClick={previewTrade} type="button">Preview {activeMode} transaction</button>
    </section>
  )
}

function CommentPanel({ comments, comment, setComment, addComment }: { comments: MarketComment[]; comment: string; setComment: (value: string) => void; addComment: () => void }) {
  return (
    <section className="comment-panel glass-panel">
      <h2>Market conversation</h2>
      <textarea placeholder="Add a thoughtful comment or source…" value={comment} onChange={(event) => setComment(event.target.value)} />
      <button onClick={addComment} type="button">Post comment</button>
      <div className="comments-list">
        {comments.length === 0 ? <p>No comments yet. Start the debate.</p> : comments.map((item) => <article key={item.id}><strong>{item.author}</strong><span>{new Date(item.createdAt).toLocaleString()}</span><p>{item.body}</p></article>)}
      </div>
    </section>
  )
}

function CreateMarketDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (draft: MarketDraft) => void }) {
  const [draft, setDraft] = useState(blankDraft)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  function update(field: keyof MarketDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  async function submit() {
    setBusy(true)
    setNotice('')
    try {
      const media = await validateMarketMedia(draft.mediaUrl)
      const normalizedDraft = { ...draft, mediaType: media.mediaType, tags: draft.tags.map(String).filter(Boolean), options: draft.options.filter(Boolean) }
      if (normalizedDraft.question.length < 8) throw new Error('Write a market question with at least 8 characters.')
      if (normalizedDraft.options.length < 2) throw new Error('Add at least two outcomes.')
      setNotice('Media validated. Connect a wallet to build and send Rain create-market transactions; saving this market locally now.')
      onCreated(normalizedDraft)
    } catch (eventError) {
      setNotice(eventError instanceof Error ? eventError.message : 'Unable to create market.')
    } finally {
      setBusy(false)
    }
  }

  async function previewCreateTx() {
    setBusy(true)
    try {
      await validateMarketMedia(draft.mediaUrl)
      const ethereum = (window as Window & { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum
      const [address] = ethereum ? await ethereum.request({ method: 'eth_requestAccounts' }) : []
      if (!address) throw new Error('Connect a browser wallet to preview create-market transactions.')
      const txs = await buildCreateMarketTransactions(draft, address as `0x${string}`)
      setNotice(JSON.stringify(txs, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2))
    } catch (eventError) {
      setNotice(eventError instanceof Error ? eventError.message : 'Unable to preview transactions.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <section className="create-modal glass-panel" id="create">
        <button className="close-modal" onClick={onClose} type="button">×</button>
        <span className="eyebrow">New Rain market</span>
        <h2>Create an AfrikaBets market</h2>
        <label>Market question<input value={draft.question} onChange={(event) => update('question', event.target.value)} placeholder="Will Nigeria win the next AFCON?" /></label>
        <label>Description<textarea value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="Context, resolution criteria, and sources." /></label>
        <label>Image, GIF, or MP4 URL (max 5MB)<input value={draft.mediaUrl} onChange={(event) => update('mediaUrl', event.target.value)} placeholder="https://…" /></label>
        <div className="split-fields"><label>Tags<input value={draft.tags.join(', ')} onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value.split(',').map((tag) => tag.trim()) }))} /></label><label>End date<input type="datetime-local" value={draft.endDate} onChange={(event) => update('endDate', event.target.value)} /></label></div>
        <div className="split-fields"><label>Outcomes<input value={draft.options.join(', ')} onChange={(event) => setDraft((current) => ({ ...current, options: event.target.value.split(',').map((tag) => tag.trim()) }))} /></label><label>Initial USDT<input value={draft.liquidity} onChange={(event) => update('liquidity', event.target.value)} /></label></div>
        <div className="modal-actions"><button onClick={submit} disabled={busy} type="button">Save local market</button><button onClick={previewCreateTx} disabled={busy} type="button">Preview Rain txs</button></div>
        {notice && <pre className="notice-box">{notice}</pre>}
      </section>
    </div>
  )
}

function MediaBackdrop({ media }: { media: { url: string; type: 'image' | 'video' } }) {
  return media.type === 'video' ? <video className="media-backdrop" src={media.url} autoPlay muted loop playsInline /> : <img className="media-backdrop" src={media.url} alt="Market media" />
}

const sampleMarkets: RainMarket[] = [
  { id: 'sample-afcon', title: 'Can a Nigeria win next AFCON cup?', totalVolume: '15469', status: 'Live' },
  { id: 'sample-jollof', title: "What's the world's preference, Nigerian or Ghanaian Jollof Rice?", totalVolume: '4690', status: 'Live' },
  { id: 'sample-currency', title: 'Will the naira strengthen against USD before December?', totalVolume: '9821', status: 'Trading' },
  { id: 'sample-ai', title: 'Will an African AI startup reach unicorn status this year?', totalVolume: '12500', status: 'Live' },
  { id: 'sample-music', title: 'Will an Afrobeats artist top Billboard Global 200?', totalVolume: '7380', status: 'Live' },
  { id: 'sample-election', title: 'Will voter turnout rise in the next Ghana election?', totalVolume: '18800', status: 'Live' },
]

export default App
