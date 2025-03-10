import { createStore } from "vuex";
import axios, { AxiosResponse } from "axios";
import { CryptoData, State, CRYPTO_ID_MAP, CRYPTO_FALLBACK_IDS, CryptoSymbol, Notification } from "@/types/crypto";



interface CoinMarketResponse {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export default createStore<State>({
  state: {
    cryptoData: {},
    loading: false,
    error: null,
    autoUpdateInterval: null,
    selectedPeriod: '1h',
    lastUpdate: 0,
    notifications: [],
  },

  mutations: {
    addNotification(state, notification: Notification) {
      state.notifications.unshift(notification);
      // 20 notifications maximum
      if (state.notifications.length > 20) {
        state.notifications.pop();
      }
    },
    markAllNotificationsAsRead(state) {
      state.notifications.forEach(notif => notif.read = true);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    setLastUpdate(state, timestamp: number) {
      state.lastUpdate = timestamp;
    },

    setSelectedPeriod(state, period: string) {
      state.selectedPeriod = period;
    },
    setCryptoData(state, data: CryptoData) {
      state.cryptoData = data;
    },

    setLoading(state, status: boolean) {
      state.loading = status;
    },
    setError(state, error: string | null) {
      state.error = error;
    },
    setAutoUpdateInterval(state, intervalId: number | null) {
      state.autoUpdateInterval = intervalId;
    },
  },

  actions: {
    async fetchCryptoData({ commit, state, dispatch }, { period = '1h', force = false } = {}) {
      const now = Date.now();
      const updateInterval = 30000; // 30 secondes 
      
      if (!force && now - state.lastUpdate < updateInterval) {
        console.log('Données encore fraîches, pas besoin de mise à jour');
        return;
      }

      if (state.loading) {
        console.log('Une requête est déjà en cours, ignorant la nouvelle requête...');
        return;
      }

      commit("setLoading", true);
      commit("setError", null);

      const fetchWithRetry = async (retryCount = 0, maxRetries = 3) => {
      try {
          const mainIds = Object.values(CRYPTO_ID_MAP);
          const fallbackIds = Object.entries(CRYPTO_FALLBACK_IDS)
            .flatMap(([_, ids]) => ids);
          const allIds = [...new Set([...mainIds, ...fallbackIds])];
          
          const ids = allIds.join(',');
          console.log('Tentative de récupération des cryptos:', ids);
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout de la requête')), 10000);
        });

        const response = await Promise.race([
          axios.get<CoinMarketResponse[]>("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            ids,
            order: "market_cap_desc",
            sparkline: true,
            price_change_percentage: "1h,24h,7d,30d",
          },
          }),
          timeoutPromise
        ]) as AxiosResponse<CoinMarketResponse[]>;

          console.log('Réponse reçue:', {
            status: response.status,
            cryptoCount: response.data?.length,
            cryptoIds: response.data?.map(c => c.id)
          });
          return response;
        } catch (error: any) {
          if (error?.response?.status === 429 && retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; 
            console.log(`Limite d'API atteinte, nouvelle tentative dans ${delay/1000} secondes...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(retryCount + 1, maxRetries);
          }
          throw error;
        }
      };

      try {
        const response = await fetchWithRetry();

        if (!response?.data || !Array.isArray(response.data)) {
          console.error('Format de réponse invalide:', response?.data);
          throw new Error('Format de réponse invalide');
        }

        let formattedData: CryptoData = {};

        response.data.forEach((crypto: CoinMarketResponse) => {
          if (!crypto?.id || !crypto?.symbol) {
            console.error('Données de crypto invalides:', crypto);
            return;
          }

          const changeMap: Record<string, number> = {
            '1h': Number(crypto.price_change_percentage_1h_in_currency) || 0,
            '24h': Number(crypto.price_change_percentage_24h) || 0,
            '7d': Number(crypto.price_change_percentage_7d_in_currency) || 0,
            '30d': Number(crypto.price_change_percentage_30d_in_currency) || 0
          };

          const currentPrice = Number(crypto.current_price) || 0;
          const priceChange = changeMap[period] || 0;

          const priceChangeThreshold = 5; // 5%
          if (Math.abs(priceChange) >= priceChangeThreshold) {
            const notifType = priceChange > 0 ? 'success' : 'warning';
            const direction = priceChange > 0 ? 'augmenté' : 'diminué';
            commit('addNotification', {
              id: `${crypto.id}_${Date.now()}`,
              type: notifType,
              message: `${crypto.symbol.toUpperCase()} a ${direction} de ${Math.abs(priceChange).toFixed(2)}% sur la période ${period}`,
              timestamp: Date.now(),
              read: false
            });
          }

          const mainSymbol = Object.entries(CRYPTO_ID_MAP)
            .find(([_, id]) => id === crypto.id)?.[0] as CryptoSymbol | undefined;
          
          const fallbackSymbol = Object.entries(CRYPTO_FALLBACK_IDS)
            .find(([symbol, ids]) => ids.includes(crypto.id))?.[0] as CryptoSymbol | undefined;
          
          const symbol = mainSymbol || fallbackSymbol;
          
          if (!symbol) {
            console.log('ID non reconnu, ignorant:', crypto.id);
            return;
          }

          const mainId = CRYPTO_ID_MAP[symbol];
          formattedData[mainId] = {
            id: crypto.id,
            name: crypto.name || 'Inconnu',
            symbol: crypto.symbol.toUpperCase(),
            price: currentPrice,
            logo: crypto.image || '',
            market_cap: Number(crypto.market_cap) || 0,
            volume: Number(crypto.total_volume) || 0,
            change: priceChange,
            sparkline: Array.isArray(crypto.sparkline_in_7d?.price) && crypto.sparkline_in_7d.price.length > 0
              ? crypto.sparkline_in_7d.price
              : Array(24).fill(currentPrice),
          };


        });

        const missingCryptos = Object.entries(CRYPTO_ID_MAP).filter(([_, id]) => !formattedData[id]);
        if (missingCryptos.length > 0) {
          console.log('Cryptos manquantes:', missingCryptos.map(([symbol, id]) => `${symbol} (${id})`));
          
          missingCryptos.forEach(([symbol, mainId]) => {
            const fallbackIds = CRYPTO_FALLBACK_IDS[symbol as CryptoSymbol];
            const foundInResponse = response.data.find(crypto => 
              fallbackIds.includes(crypto.id)
            );

            if (foundInResponse && !formattedData[mainId]) {
              console.log(`Crypto ${symbol} trouvée avec l'ID alternatif:`, foundInResponse.id);
              formattedData[mainId] = {
                id: foundInResponse.id,
                name: foundInResponse.name || 'Inconnu',
                symbol: foundInResponse.symbol.toUpperCase(),
                price: Number(foundInResponse.current_price) || 0,
                logo: foundInResponse.image || '',
                market_cap: Number(foundInResponse.market_cap) || 0,
                volume: Number(foundInResponse.total_volume) || 0,
                change: ({
                  '1h': Number(foundInResponse.price_change_percentage_1h_in_currency) || 0,
                  '24h': Number(foundInResponse.price_change_percentage_24h) || 0,
                  '7d': Number(foundInResponse.price_change_percentage_7d_in_currency) || 0,
                  '30d': Number(foundInResponse.price_change_percentage_30d_in_currency) || 0
                } as Record<string, number>)[period] || 0,
                sparkline: Array.isArray(foundInResponse.sparkline_in_7d?.price) && foundInResponse.sparkline_in_7d.price.length > 0
                  ? foundInResponse.sparkline_in_7d.price
                  : Array(24).fill(Number(foundInResponse.current_price) || 0), 
              };
            } else {
              console.log(`Aucun ID alternatif trouvé pour ${symbol}`);
            }
          });
        }

        commit("setCryptoData", formattedData);
        commit("setLastUpdate", now);


      } catch (error: any) {
        let errorMessage: string;
        
        if (error?.response?.status === 429) {
          errorMessage = "Limite d'API atteinte. Veuillez réessayer dans quelques minutes.";
        } else if (error?.response?.status === 404) {
          errorMessage = "Certaines cryptos n'ont pas été trouvées. Vérifiez les IDs utilisés.";
        } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
          errorMessage = "La requête a pris trop de temps. Vérifiez votre connexion.";
        } else {
          errorMessage = error?.message || "Erreur de récupération des données.";
        }

        console.log('Erreur lors de la récupération des données:', {
          message: error?.message,
          code: error?.code,
          status: error?.response?.status,
          data: error?.response?.data,
          stack: error?.stack
        });

        commit("setError", errorMessage);

        setTimeout(() => {
          console.log('Nouvelle tentative après erreur...');
          dispatch("fetchCryptoData", { force: true });
        }, 30000);
      } finally {
        commit("setLoading", false);
      }
    },



    startAutoUpdate({ dispatch, commit, state }) {
      if (state.autoUpdateInterval) {
        clearInterval(state.autoUpdateInterval);
      }

      dispatch("fetchCryptoData", { force: true });
      
      const intervalId = setInterval(() => {
        dispatch("fetchCryptoData");
      }, 30000);

      commit("setAutoUpdateInterval", intervalId);
    },

    stopAutoUpdate({ commit, state }) {
      if (state.autoUpdateInterval) {
        clearInterval(state.autoUpdateInterval);
        commit("setAutoUpdateInterval", null);
      }
    },
  },

  getters: {
    getNotifications: (state) => state.notifications,
    getUnreadNotificationsCount: (state) => state.notifications.filter(n => !n.read).length,
    getSelectedPeriod: (state) => state.selectedPeriod,
    getCryptoList: (state) => Object.values(state.cryptoData),
    getCryptoById: (state) => (id: string) => state.cryptoData[id] || null,

    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
