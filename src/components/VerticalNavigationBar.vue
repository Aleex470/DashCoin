<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeItem = ref('dashboard');

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-chart-line', route: '/' },
  { id: 'portfolio', label: 'Portfolio', icon: 'pi pi-wallet', route: '/portfolio' },
  { id: 'alerts', label: 'Alertes', icon: 'pi pi-bell', route: '/alerts' },
  { id: 'news', label: 'Actualités', icon: 'pi pi-globe', route: '/news' },
  { id: 'settings', label: 'Paramètres', icon: 'pi pi-cog', route: '/settings' }
];

const navigateTo = (route: string, itemId: string) => {
  activeItem.value = itemId;
  router.push(route);
};
</script>

<template>
  <div class="vertical-navbar-container">
    <div class="vertical-navbar-header">
      <img src="../assets/logo.svg" alt="DashCoin" class="vertical-navbar-logo">
      <h1 class="app-title">DashCoin</h1>
    </div>

    <div class="vertical-navbar-items">
      <div 
        v-for="item in menuItems" 
        :key="item.id"
        class="vertical-navbar-item"
        :class="{ 'active': activeItem === item.id }"
        @click="navigateTo(item.route, item.id)"
      >
        <i :class="item.icon"></i>
        <span class="item-label">{{ item.label }}</span>
      </div>
    </div>

    <div class="vertical-navbar-footer">
      <div class="vertical-navbar-item">
        <i class="pi pi-power-off"></i>
        <span class="item-label">Déconnexion</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vertical-navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  display: flex;
  flex-direction: column;
  background-color: #1a1d21;
  color: #e1e1e1;
  border-right: 1px solid #2c2f33;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.vertical-navbar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #2c2f33;
}

.vertical-navbar-logo {
  width: 32px;
  height: 32px;
}

.app-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #4caf50;
}

.vertical-navbar-items {
  flex: 1;
  padding: 16px 0;
  width: 100%;
}

.vertical-navbar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #a1a1a1;
}

.vertical-navbar-item:hover {
  background-color: #2c2f33;
  color: #ffffff;
}

.vertical-navbar-item.active {
  background-color: #2c2f33;
  color: #4caf50;
  border-left: 3px solid #4caf50;
}

.vertical-navbar-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.item-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.vertical-navbar-footer {
  padding: 16px 0;
  width: 100%;
  border-top: 1px solid #2c2f33;
}

.vertical-navbar-footer .vertical-navbar-item {
  color: #ff5252;
}

.vertical-navbar-footer .vertical-navbar-item:hover {
  background-color: rgba(255, 82, 82, 0.1);
}
</style>