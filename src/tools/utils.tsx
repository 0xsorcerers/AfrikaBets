import { createWallet, walletConnect, inAppWallet } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { ConnectButton, darkTheme } from 'thirdweb/react'
import type { ReactElement, ReactNode } from 'react'
import { Arbitrum, chains } from './networkData'

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
        description: 'Prediction markets on Arbitrum One',
      }}
      connectButton={{ label, className }}
      connectModal={{
        size: 'wide',
        title: 'Connect to AfrikaBets',
        welcomeScreen: {
          title: 'Afrika Bets',
          subtitle: 'Bet on Africa',
        },
      }}
      onConnect={() => onConnect?.()}
    />
  )
}
