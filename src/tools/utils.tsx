import { createThirdwebClient } from 'thirdweb'
import { ConnectButton, darkTheme, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from 'thirdweb/react'
import { createWallet, inAppWallet, walletConnect } from 'thirdweb/wallets'
import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { Arbitrum, chains, getChainById, getNetworkByChainId, networks } from './networkData'

export const thirdwebClientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID

export const client = thirdwebClientId
  ? createThirdwebClient({
      clientId: thirdwebClientId,
    })
  : undefined

export const wallets = [
  createWallet('io.metamask'),
  createWallet('com.binance.wallet'),
  createWallet('com.coinbase.wallet'),
  walletConnect(),
  inAppWallet({
    auth: {
      options: ['google', 'x', 'discord', 'email'],
      mode: 'redirect',
    },
  }),
]

interface ConnectorProps {
  label?: ReactNode
  className?: string
  onConnect?: () => void
}

export function Connector({ label = 'Connect Wallet', className, onConnect }: ConnectorProps): ReactElement {
  if (!client) {
    return (
      <button className={className} type="button" disabled title="Set VITE_THIRDWEB_CLIENT_ID to enable wallet connection">
        {label}
      </button>
    )
  }

  return (
    <ConnectButton
      client={client}
      chain={Arbitrum}
      chains={chains}
      wallets={wallets}
      autoConnect={{ timeout: 15000 }}
      theme={darkTheme({
        colors: {
          primaryText: '#ff4d79',
          secondaryText: '#f8f8ff',
          connectedButtonBg: '#271525',
          connectedButtonBgHover: '#1a0f19',
          separatorLine: '#46233f',
          primaryButtonBg: '#ff4d79',
        },
      })}
      appMetadata={{
        name: 'AfrikaBets',
        url: window.location.origin,
        description: 'Cross-network prediction markets anchored by Rain on Arbitrum One',
      }}
      connectButton={{ label, className }}
      switchButton={{ label: 'Switch to Arbitrum', className }}
      connectModal={{
        size: 'wide',
        title: 'Log in to AfrikaBets',
        welcomeScreen: {
          title: 'Afrika Bets',
          subtitle: 'Bet on Africa across supported networks',
        },
      }}
      onConnect={() => onConnect?.()}
    />
  )
}

export function WalletNetworkPanel(): ReactElement {
  const account = useActiveAccount()
  const activeChain = useActiveWalletChain()
  const switchChain = useSwitchActiveWalletChain()
  const activeNetwork = getNetworkByChainId(activeChain?.id)
  const shortAddress = account?.address ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : 'Guest mode'

  return (
    <section className="network-panel glass-panel" aria-label="Wallet and network status">
      <div>
        <span className="eyebrow">Cross-network access</span>
        <h2>{account ? `Logged in as ${shortAddress}` : 'Log in to unlock trading tools'}</h2>
        <p>
          {account
            ? `Connected on ${activeNetwork?.shortName || activeChain?.name || 'an unsupported network'}. Rain settlement remains optimized for Arbitrum while discovery can expand across every configured chain.`
            : 'Use email, social login, WalletConnect, MetaMask, Coinbase Wallet, or Binance Wallet to enter AfrikaBets.'}
        </p>
      </div>
      <div className="network-actions">
        <Connector label={account ? 'Manage wallet' : 'Log in to trade'} className="wallet-button hero-wallet-button" />
        <div className="network-grid">
          {networks.map((network) => {
            const active = activeChain?.id === network.chainId
            return (
              <button
                className={active ? 'network-chip active' : 'network-chip'}
                key={network.key}
                disabled={!account}
                onClick={() => switchChain(getChainById(network.chainId) || Arbitrum)}
                style={{ '--network-accent': network.accent } as CSSProperties}
                title={account ? `Switch to ${network.shortName}` : 'Log in before switching networks'}
                type="button"
              >
                <strong>{network.shortName}</strong>
                <span>{network.settlement === 'rain' ? 'Rain settlement' : `Chain ${network.chainId}`}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
