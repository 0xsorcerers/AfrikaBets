// Wallet connection hook for Arbitrum One
import { useState, useCallback } from 'react';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}

const ARBITRUM_ONE_CHAIN_ID = 42161;

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
  });

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask or another Web3 wallet');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get current chain ID
      const chainIdHex = await window.ethereum.request({
        method: 'eth_chainId',
      });
      const chainId = parseInt(chainIdHex, 16);

      // If not on Arbitrum One, switch chain
      if (chainId !== ARBITRUM_ONE_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${ARBITRUM_ONE_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // If chain doesn't exist in MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${ARBITRUM_ONE_CHAIN_ID.toString(16)}`,
                  chainName: 'Arbitrum One',
                  rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                  blockExplorerUrls: ['https://arbiscan.io'],
                  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
                },
              ],
            });
          }
        }
      }

      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId: ARBITRUM_ONE_CHAIN_ID,
      });

      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
    });
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
  };
};

// Type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (params: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
