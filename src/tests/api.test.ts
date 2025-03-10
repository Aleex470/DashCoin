import axios from "axios";
import store from "../store";
import { CryptoData } from "../types/crypto";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Vuex Store", () => {
  beforeEach(() => {
    store.commit("setCryptoData", {});
    store.commit("setLoading", false);
    store.commit("setError", null);
    store.commit("setAutoUpdateInterval", null);
    store.commit("setSelectedPeriod", "1h");
    jest.clearAllMocks();
  });

  describe("Mutations", () => {
    test("setSelectedPeriod met à jour correctement la période", () => {
      store.commit("setSelectedPeriod", "24h");
      expect(store.state.selectedPeriod).toBe("24h");
    });

    test("setCryptoData met à jour correctement les données", () => {
      const testData: CryptoData = {
        bitcoin: {
          name: "Bitcoin",
          symbol: "BTC",
          price: 50000,
          logo: "test-url",
          market_cap: 1000000,
          volume: 500000,
          change: 1.5,
          sparkline: [45000, 46000, 47000]
        }
      };

      store.commit("setCryptoData", testData);
      expect(store.state.cryptoData).toEqual(testData);
    });

  });

  describe("Actions", () => {
    test("fetchCryptoData récupère et formate correctement les données", async () => {
      const mockResponse = {
        data: [{
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "btc",
          current_price: 50000,
          image: "test-url",
          market_cap: 1000000,
          total_volume: 500000,
          price_change_percentage_1h_in_currency: 1.5,
          price_change_percentage_24h: 2.5,
          price_change_percentage_7d_in_currency: 3.5,
          price_change_percentage_30d_in_currency: 4.5,
          sparkline_in_7d: { price: [45000, 46000, 47000] }
        }]
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch("fetchCryptoData", { period: "24h", force: true });

      const changeMap = {
        '1h': 1.5,
        '24h': 2.5,
        '7d': 3.5,
        '30d': 4.5
      };

      expect(store.state.cryptoData.bitcoin).toBeDefined();
      expect(store.state.cryptoData.bitcoin.price).toBe(50000);
      expect(store.state.cryptoData.bitcoin.change).toBe(changeMap['24h']); 
      expect(store.state.loading).toBe(false);
      expect(store.state.error).toBeNull();
    });

    test("fetchCryptoData gère correctement les erreurs", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

      await store.dispatch("fetchCryptoData", { force: true });

      expect(store.state.error).toBeTruthy();
      expect(store.state.loading).toBe(false);
    });

  });

  describe("Getters", () => {
    test("getCryptoList retourne la liste des cryptos", () => {
      const testData: CryptoData = {
        bitcoin: {
          name: "Bitcoin",
          symbol: "BTC",
          price: 50000,
          logo: "test-url",
          market_cap: 1000000,
          volume: 500000,
          change: 1.5,
          sparkline: [45000, 46000, 47000]
        }
      };

      store.commit("setCryptoData", testData);
      const cryptoList = store.getters.getCryptoList;
      expect(cryptoList).toHaveLength(1);
      expect(cryptoList[0]).toEqual(testData.bitcoin);
    });

    test("getCryptoById retourne la bonne crypto", () => {
      const testData: CryptoData = {
        bitcoin: {
          name: "Bitcoin",
          symbol: "BTC",
          price: 50000,
          logo: "test-url",
          market_cap: 1000000,
          volume: 500000,
          change: 1.5,
          sparkline: [45000, 46000, 47000]
        }
      };

      store.commit("setCryptoData", testData);
      const bitcoin = store.getters.getCryptoById("bitcoin");
      expect(bitcoin).toEqual(testData.bitcoin);
      expect(store.getters.getCryptoById("invalid")).toBeNull();
    });
  });
});

