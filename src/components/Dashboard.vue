<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import LineChart from "./LineChart.vue";
import Button from 'primevue/button';

export default {
  components: { LineChart },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("fetchCryptoData");
      store.dispatch("fetchHistoricalData");
    });

    return {
      cryptoData: computed(() => store.state.cryptoData),
      chartData: computed(() => ({
        labels: store.state.historicalData.map(data => new Date(data[0]).toLocaleDateString()),
        datasets: [{
          label: "Prix Bitcoin",
          data: store.state.historicalData.map(data => data[1]),
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false
        }]
      }))
    };
  }
};
</script>

<template>
  <div class="dashboard">
    <h1>Crypto Dashboard</h1>

    <div class="cards">
      <div v-for="(price, coin) in cryptoData" :key="coin" class="card">
        <h2>{{ coin.toUpperCase() }}</h2>
        <p>${{ price.usd }}</p>
      </div>
    </div>

    <Button label="Test"></Button>

    <h2>Évolution du Bitcoin</h2>
    <LineChart :chart-data="chartData" />
  </div>
</template>

<style>
.dashboard {
  text-align: center;
}
.cards {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.card {
  background: #282c34;
  padding: 20px;
  border-radius: 10px;
  color: white;
}
</style>
