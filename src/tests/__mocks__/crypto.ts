import { CryptoData, State, Notification } from '@/types/crypto';

export const mockCryptoData: CryptoData = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 50000,
    logo: 'bitcoin.png',
    market_cap: 1000000000000,
    volume: 50000000000,
    change: 5.5,
    sparkline: Array(24).fill(50000),
  }
};

export const mockState: State = {
  cryptoData: mockCryptoData,
  loading: false,
  error: null,
  autoUpdateInterval: null,
  selectedPeriod: '24h',
  lastUpdate: Date.now(),
  notifications: []
};

export const mockNotification: Notification = {
  id: '1',
  type: 'info',
  message: 'Test notification',
  timestamp: Date.now(),
  read: false
};
