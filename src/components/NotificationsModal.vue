<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useStore } from 'vuex';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  timestamp: number;
  read: boolean;
}

const props = defineProps<{ isModalOpen: boolean }>();
const emit = defineEmits(["update:isModalOpen"]);

const store = useStore();
const notifications = computed(() => store.state.notifications as Notification[]);

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const markAllAsRead = () => {
  store.commit('markAllNotificationsAsRead');
};

const clearNotifications = () => {
  store.commit('clearNotifications');
};
</script>

<template>
    <Dialog 
        :visible="props.isModalOpen" 
        modal 
        header="Notifications" 
        :style="{ width: '400px' }"
        @update:visible="emit('update:isModalOpen', $event)"
    >
        <div class="notifications-content">
            <div v-if="notifications.length === 0" class="no-notifications">
            <p>Aucune nouvelle notification pour le moment.</p>
        </div>
            <div v-else class="notifications-list">
                <div v-for="notif in notifications" :key="notif.id" 
                     :class="['notification-item', notif.type, { 'unread': !notif.read }]">
                    <div class="notification-content">
                        <span class="notification-message">{{ notif.message }}</span>
                        <span class="notification-time">{{ formatTimestamp(notif.timestamp) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="notification-actions">
                <Button 
                    v-if="notifications.length > 0"
                    label="Tout marquer comme lu" 
                    icon="pi pi-check" 
                    @click="markAllAsRead"
                    class="p-button-text p-button-success" 
                />
                <Button 
                    v-if="notifications.length > 0"
                    label="Effacer tout" 
                    icon="pi pi-trash" 
                    @click="clearNotifications"
                    class="p-button-text p-button-danger" 
                />
            <Button 
                label="Fermer" 
                icon="pi pi-times" 
                @click="emit('update:isModalOpen', false)" 
                class="p-button-text" 
            />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.notifications-content {
    padding: 10px;
    font-size: 14px;
    color: #333;
    max-height: 400px;
    overflow-y: auto;
}

.notification-item {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    background-color: #f8f9fa;
    border-left: 4px solid #ddd;
    transition: all 0.2s ease;
}

.notification-item.unread {
    background-color: #e8f4fd;
}

.notification-item.success {
    border-left-color: #22c55e;
}

.notification-item.warning {
    border-left-color: #f59e0b;
}

.notification-item.info {
    border-left-color: #3b82f6;
}

.notification-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.notification-message {
    flex: 1;
    line-height: 1.4;
}

.notification-time {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
}

.notification-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.no-notifications {
    text-align: center;
    color: #666;
    padding: 20px;
}
</style>
