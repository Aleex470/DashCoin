export interface Crypto {
    id?: string; 
    name: string;
    symbol: string;
    price: number;
    logo: string;
    market_cap: number;
    volume: number;
    change: number;
    sparkline: number[];
  }

  export const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL'] as const;
  export type CryptoSymbol = typeof CRYPTO_SYMBOLS[number];
  
  export const CRYPTO_ID_MAP: Record<CryptoSymbol, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    XRP: 'xrp',
    ADA: 'cardano',
    SOL: 'solana'
  };
  
  export const CRYPTO_FALLBACK_IDS: Record<CryptoSymbol, string[]> = {
    BTC: [],
    ETH: [],
    XRP: ['ripple'],
    ADA: [],
    SOL: []
  };
  
  export interface CryptoData {
    [key: string]: Crypto;
  }
  

  
  export interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info';
    message: string;
    timestamp: number;
    read: boolean;
  }

  export interface State {
    cryptoData: CryptoData;
    loading: boolean;
    error: string | null;
    autoUpdateInterval: number | null;
    selectedPeriod: string;
    lastUpdate: number;
    notifications: Notification[];
  }
  