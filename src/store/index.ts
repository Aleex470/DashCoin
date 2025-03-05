import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    cryptoData: {},      // Données des prix des cryptomonnaies
    historicalData: []   // Données historiques pour le graphique
  },
  mutations: {
    setCryptoData(state, data) {
      state.cryptoData = data;
    },
    setHistoricalData(state, data) {
      state.historicalData = data;
    }
  },
  actions: {
    async fetchCryptoData({ commit }) {
      try {
        // Appel à l'API pour récupérer les prix des cryptos
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd"
        );
        commit("setCryptoData", response.data); // Commit les données dans le store
      } catch (error) {
        console.error("Erreur lors de la récupération des données des cryptos:", error);
      }
    },
    async fetchHistoricalData({ commit }) {
      try {
        // Appel à l'API pour récupérer les données historiques de Bitcoin
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
        );
        commit("setHistoricalData", response.data.prices); // Commit les données historiques dans le store
      } catch (error) {
        console.error("Erreur lors de la récupération des données historiques:", error);
      }
    }
  }
});
