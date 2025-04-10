import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ WalletConnect Project ID
const projectId = '21abe9266852ecc1be188bb52b64fd17';

// ✅ Correct metadata to prevent WalletConnect warnings
const config = getDefaultConfig({
  appName: 'My Dapp',
  projectId,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/de33a7c80a8440c1af194b088cee7714'),
  },
  ssr: false,
  metadata: {
    name: 'My Dapp',
    description: 'A cool dapp using WalletConnect + RainbowKit',
    url: 'http://localhost:5173', // ✅ Make sure this matches your dev URL
    icons: ['https://walletconnect.com/walletconnect-logo.png'],
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={config.chains}
          theme={lightTheme({
            accentColor: '#0B453A',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);
