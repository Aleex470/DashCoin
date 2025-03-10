<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted, watchEffect } from "vue";
import { useStore } from "vuex";
import CardComponent from "@/components/CardComponent.vue";


const store = useStore();
const isLoading = ref<boolean>(true);
const errorMessage = ref<string | null>(null);
let refreshInterval: ReturnType<typeof setInterval> | null = null;

const cryptoList = computed(() => store.getters.getCryptoList);
const selectedPeriod = computed(() => store.getters.getSelectedPeriod);

const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    await store.dispatch("fetchCryptoData", { period: selectedPeriod.value });


  } catch (err: any) {
    console.error('Erreur lors de la récupération des données:', err);
    errorMessage.value = "Erreur de chargement des données.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
  refreshInterval = setInterval(fetchData, 20000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});

interface CryptoData {
  name: string;
  symbol: string;
  price: number;
  market_cap: number;
  volume: number;
  change: number;
  logo: string;
  sparkline: number[];
}

const cryptoListFormatted = computed(() => {
  return cryptoList.value.map((crypto: CryptoData) => {
    const sparklineData = crypto.sparkline || [];
    let priceChange: number[] = [];
    
    if (sparklineData.length >= 2) {
      const validPrices = sparklineData.filter((price: number) => typeof price === 'number' && !isNaN(price) && price > 0);

      if (validPrices.length >= 2) {
        const minPrice = Math.min(...validPrices);
        const maxPrice = Math.max(...validPrices);
        
        priceChange = validPrices.map((price: number) => {
          const normalizedValue = ((price - minPrice) / (maxPrice - minPrice) * 100);
          return Number(normalizedValue.toFixed(2));
        });
      }
    }

    return {
      name: crypto.name || "Nom inconnu",
      logo: crypto.logo || "default-logo.png",
      price: Number(crypto.price) || 0,
      market_cap: Number(crypto.market_cap) || 0,
      volume: Number(crypto.volume) || 0,
      change: Number(crypto.change) || 0,
      symbol: crypto.symbol || Math.random().toString(),
      priceChange,
    };
  });
});

watchEffect(() => {
  console.log("cryptoList mis à jour :", cryptoListFormatted.value);
});
</script>

<template>
  <div class="card-crypto-container">
    <div class="card-crypto-header">
        <h2>⭐️ Favorites Crypto</h2>
        <button class="add-button">+ Add</button>
    </div>
    <div class="card-crypto-list" v-if="!errorMessage">
        <CardComponent v-for="crypto in cryptoListFormatted" :key="crypto.symbol">
        <template #logo>
            <img :src="crypto.logo" :alt="crypto.name" />
        </template>
        <template #header>
            <h2>{{ crypto.name }}</h2>
        </template>
        <template #content>
            <p><strong>Prix:</strong> ${{ crypto.price.toLocaleString() }}</p>
            <p :class="{ 'positive': crypto.change > 0, 'negative': crypto.change < 0 }">
              <strong>{{ selectedPeriod.toUpperCase() }}:</strong> {{ crypto.change.toFixed(2) }}%
            </p>
        </template>
        </CardComponent>
    </div>
    <div v-else>
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="fetchData" class="retry-button">Réessayer</button>
    </div>
  </div>
</template>

<style>
.card-crypto-container {
    margin-bottom: 20px;
    background-color: #14171b;
    border-radius: 12px;
}

.card-crypto-header {
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-button {
    background-color: transparent;
    border: 2px solid #4caf50;
    color: #4caf50;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.add-button:hover {
    background-color: #4caf50;
    color: white;
}

.card-crypto-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 12px;
    width: 100%;
    padding: 30px;
}

.retry-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 16px;
}

.error-message {
    color: #e74c3c;
    text-align: center;
    margin-top: 16px;
}

.positive {
    color: #2ecc71;
    font-weight: bold;
}

.negative {
    color: #e74c3c;
    font-weight: bold;
}

</style>
