<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{
  timePeriod: string;
}>();

const emit = defineEmits(["update:timePeriod"]);

const changeTimePeriod = (period: string) => {
  emit("update:timePeriod", period);
};
</script>

<template>
  <div class="mb-3">
    <div class="mt-3">
      <button @click="changeTimePeriod('1h')" class="p-button p-button-outlined" :class="{ active: timePeriod === '1h' }">
        Dernière Heure
      </button>
      <button @click="changeTimePeriod('24h')" class="p-button p-button-outlined ml-2" :class="{ active: timePeriod === '24h' }">
        Dernières 24h
      </button>
      <button @click="changeTimePeriod('7d')" class="p-button p-button-outlined ml-2" :class="{ active: timePeriod === '7d' }">
        Dernière Semaine
      </button>
      <button @click="changeTimePeriod('30d')" class="p-button p-button-outlined ml-2" :class="{ active: timePeriod === '30d' }">
        Dernier Mois
      </button>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: #007bff;
  color: white;
}
</style>
