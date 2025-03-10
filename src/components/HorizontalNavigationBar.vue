<script setup lang="ts">
import { ref } from 'vue';

import NotificationsModal from './NotificationsModal.vue';

const isModalOpen = ref(false);
</script>

<template>
    <div class="horizontal-navbar-container">
        <div class="horizontal-navbar-title">
            Dashboard
        </div>
        
        <div class="horizontal-navbar-actions">
            <button class="notification-button" @click="isModalOpen = true">
                <i class="pi pi-bell"></i>
            </button>
            <button class="login-button">Connexion</button>
        </div>
    </div>
    <NotificationsModal v-model:isModalOpen="isModalOpen"/>
</template>

<style>
.horizontal-navbar-container {
    position: fixed;
    top: 0;
    left: 240px;
    width: calc(100% - 240px);
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #1a1d21;
    color: #e1e1e1;
    z-index: 1000;
    border-bottom: 1px solid #2c2f33;
}

.horizontal-navbar-title {
    font-size: 24px;
    font-weight: bold;
}

.horizontal-navbar-searchbar-container {
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: 600px;
    margin: 0 20px;
}

.horizontal-navbar-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.notification-button {
    background: none;
    border: none;
    color: #a1a1a1;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.notification-button:hover {
    background-color: #2c2f33;
    color: #e1e1e1;
}

.login-button {
    background-color: #4caf50;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.login-button:hover {
    background-color: #45a049;
}
</style>
