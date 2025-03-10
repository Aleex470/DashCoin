<script setup lang="ts">
import VerticalNavigationBar from '@/components/VerticalNavigationBar.vue';
import HorizontalNavigationBar from './components/HorizontalNavigationBar.vue';
import Dashboard from './components/Dashboard.vue';
</script>

<template>
  <div class="app">
    <VerticalNavigationBar />
    <HorizontalNavigationBar />
    <div class="app-content">
      <Dashboard />
    </div>
  </div>
</template>

<style>
.app {
  width: 100%;
  min-height: 100vh;
  background-color: #121212;
  color: #e1e1e1;
  overflow: hidden;
}

.app-content {
  margin-left: 240px;
  margin-top: 80px;
  min-height: 100vh;
  width: calc(100% - 240px);
  padding: 2rem;
  overflow: auto;
}
</style>