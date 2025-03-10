<script setup lang="ts">

import TrendingCryptos from '@/components/TrendingCryptos.vue';
import CardCryptoList from "@/components/CardCryptoList.vue";

</script>

<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <CardCryptoList />
      <TrendingCryptos />
    </div>
  </div>
</template>


<style>
.buttons {
  margin-bottom: 20px;
}
button {
  margin: 5px;
  padding: 10px 15px;
  font-size: 14px;
  background: #42a5f5;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background: #1e88e5;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.card {
  background: #282c34;
  padding: 20px;
  border-radius: 10px;
  width: 220px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}
.crypto-logo {
  width: 50px;
  height: 50px;
}
.positive {
  color: #4caf50;
}
.negative {
  color: #ff5252;
}
</style>
