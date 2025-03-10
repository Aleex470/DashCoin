<script setup lang="ts">
import { computed, onMounted, ref, Transition } from "vue";
import { useStore } from "vuex";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TableActionBar from "./TableActionBar.vue";

const store = useStore();
const mounted = ref(false);

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img) {
    img.src = 'https://cryptologos.cc/logos/question-mark.png';
  }
};

const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toLocaleString();
};

const isLoading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
const selectedPeriod = computed(() => store.getters.getSelectedPeriod);

const trendingCryptos = computed(() => {
  if (!mounted.value) return [];
  const cryptos = Object.values(store.state.cryptoData || {});
  return cryptos;
});

const updateData = async () => {
  if (!mounted.value) return;
  try {
    await store.dispatch("fetchCryptoData", { 
      period: selectedPeriod.value,
      force: true 
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour des données:', err);
  }
};

const updatePeriod = (period: string) => {
  if (!mounted.value) return;
  store.commit("setSelectedPeriod", period);
  updateData();
};

onMounted(() => {
  mounted.value = true;
  updateData();
});
</script>

<template>
  <div class="trending-crypto-container">
    <div class="trending-crypto-header">
      <h2>📈 Trending Cryptos</h2>
      <TableActionBar 
        :timePeriod="selectedPeriod"
        @update:timePeriod="updatePeriod"
      />
    </div>

    <div v-if="store.state.error" class="error-message">
      {{ store.state.error }}
    </div>

    <div v-else-if="store.state.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-message">Chargement des cryptos...</div>
    </div>

    <div v-else-if="trendingCryptos.length === 0" class="error-message">
      Aucune crypto n'a été chargée. Veuillez réessayer.
      <button @click="updateData" class="retry-button">Réessayer</button>
    </div>

    <div v-else class="table-container">
      <Transition name="fade" mode="out-in">
        <DataTable :value="trendingCryptos" responsiveLayout="scroll" class="custom-table" :key="selectedPeriod">
        <Column header="Logo">
          <template #body="slotProps">
            <Transition name="logo" mode="out-in">
              <img 
                :key="slotProps.data.logo"
                :src="slotProps.data.logo" 
                :alt="slotProps.data.name" 
                class="crypto-logo"
                @error="handleImageError"
              />
            </Transition>
          </template>
        </Column>

        <Column field="name" header="Nom" sortable>
          <template #body="slotProps">
            <div class="crypto-name">
              {{ slotProps.data.name }} 
              <span class="crypto-symbol">({{ slotProps.data.symbol.toUpperCase() }})</span>
            </div>
          </template>
        </Column>

        <Column field="price" header="Prix ($)" sortable>
          <template #body="slotProps">
            <div class="crypto-price" :key="slotProps.data.price">
              <Transition name="price" mode="out-in">
                <span :key="slotProps.data.price">${{ slotProps.data.price.toFixed(2) }}</span>
              </Transition>
            </div>
          </template>
        </Column>

        <Column field="volume" header="Volume" sortable>
          <template #body="slotProps">
            <div class="crypto-volume" :key="slotProps.data.volume">
              <Transition name="volume" mode="out-in">
                <span :key="slotProps.data.volume">
                  ${{ formatVolume(slotProps.data.volume) }}
                </span>
              </Transition>
            </div>
          </template>
        </Column>

        <Column :field="'change'" :header="`${selectedPeriod.toUpperCase()} %`" sortable>
          <template #body="slotProps">
            <Transition name="change" mode="out-in">
              <span
                :key="slotProps.data.change"
                :class="{
                  'positive': slotProps.data.change > 0,
                  'negative': slotProps.data.change < 0,
                }"
              >
                {{ slotProps.data.change.toFixed(2) }}%
              </span>
            </Transition>
          </template>
        </Column>

        <Column field="chart" header="Chart">
          <template #body="slotProps">
            <CryptoChart :coinId="slotProps.data.symbol.toUpperCase()" :period="selectedPeriod" />
          </template>
        </Column>
      </DataTable>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.trending-crypto-container {
  margin-bottom: 20px;
  background-color: #14171b;
  border-radius: 12px;
  padding: 20px;
}

.trending-crypto-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  background-color: #1a1f24;
  border-radius: 8px;
  padding: 16px;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #fff;
}

:deep(.p-datatable) {
  background-color: transparent !important;
}

:deep(.p-datatable-header) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #14171b !important;
  color: #fff !important;
  border: none !important;
  padding: 12px 16px;
  font-weight: 600;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

:deep(.p-datatable-thead > tr > th:hover) {
  background-color: #1a1f24 !important;
}

:deep(.p-datatable-thead > tr > th.p-sortable-column) {
  position: relative;
}

:deep(.p-datatable-thead > tr > th.p-sortable-column:after) {
  content: '⌃';
  position: absolute;
  right: 8px;
  opacity: 0.5;
  transform: translateY(2px);
  transition: all 0.2s ease;
}

:deep(.p-datatable-thead > tr > th.p-sortable-column.p-highlight:after) {
  opacity: 1;
  color: #2ecc71;
}

:deep(.p-datatable-thead > tr > th.p-sortable-column.p-highlight) {
  color: #2ecc71 !important;
}

:deep(.p-datatable-tbody > tr) {
  background-color: transparent !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #1e242a !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.p-datatable-tbody > tr > td) {
  border: none !important;
  padding: 12px 16px;
  border-bottom: 1px solid #2a2f35 !important;
}

.crypto-logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
  transition: transform 0.3s ease;
}

.crypto-logo:hover {
  transform: scale(1.2);
}

.logo-enter-active,
.logo-leave-active {
  transition: all 0.3s ease;
}

.logo-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.logo-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.logo-enter-to,
.logo-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0);
}

.crypto-name {
  font-weight: 500;
}

.crypto-symbol {
  color: #6c757d;
  font-size: 0.9em;
}

.crypto-price {
  font-weight: 600;
  color: #fff;
  transition: color 0.3s ease;
}

:deep(.p-datatable-tbody > tr:hover) .crypto-price {
  color: #2ecc71;
}

.crypto-volume {
  color: #6c757d;
}

.positive {
  color: #2ecc71;
  font-weight: bold;
}

.negative {
  color: #e74c3c;
  font-weight: bold;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin: 20px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #1a1f24;
  border-radius: 50%;
  border-top-color: #2ecc71;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.price-enter-active,
.price-leave-active {
  transition: all 0.3s ease;
}

.price-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.price-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.price-enter-to,
.price-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.change-enter-active,
.change-leave-active {
  transition: all 0.3s ease;
}

.change-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.change-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.change-enter-to,
.change-leave-from {
  opacity: 1;
  transform: scale(1);
}

.volume-enter-active,
.volume-leave-active {
  transition: all 0.3s ease;
}

.volume-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.volume-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.volume-enter-to,
.volume-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.loading-message {
  text-align: center;
  color: #6c757d;
  font-size: 1.1em;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #27ae60;
}
</style>
