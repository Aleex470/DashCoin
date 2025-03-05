import axios from "axios";
import store from "@/store/index";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Vuex Store", () => {
  test("fetchCryptoData récupère les prix des cryptos et met à jour le store", async () => {
    mockedAxios.get.mockResolvedValue({ data: { bitcoin: { usd: 50000 } } });

    await store.dispatch("fetchCryptoData");

    expect(store.state.cryptoData.bitcoin.usd).toBe(50000);
  });
});
