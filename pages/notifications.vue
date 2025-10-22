<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">Notificaciones</h1>
        <button
          v-if="unreadCount > 0"
          @click="handleMarkAllAsRead"
          class="px-4 py-2 text-sm text-orange-400 hover:text-orange-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          Marcar todas como leídas
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="text-orange-400 animate-pulse text-lg">Cargando notificaciones...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 text-gray-600 mx-auto mb-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <p class="text-gray-400 text-lg">No tienes notificaciones</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          class="bg-gray-800 border rounded-lg p-4 transition-all cursor-pointer"
          :class="notification.read_at ? 'border-gray-700 hover:border-gray-600' : 'border-orange-500/30 bg-gray-800/80 hover:border-orange-500/50'"
        >
          <div class="flex items-start space-x-4">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <NotificationIcon :icon="notification.data.icon" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">
                    {{ notification.data.title }}
                  </p>
                  <p class="text-sm text-gray-300 mt-1">
                    {{ notification.data.message }}
                  </p>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ formatTimeAgo(notification.created_at) }}
                  </p>
                </div>

                <!-- Unread Indicator -->
                <div v-if="!notification.read_at" class="flex-shrink-0">
                  <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
              </div>

              <!-- Action Button (if applicable) -->
              <div v-if="notification.data.action_url" class="mt-3">
                <NuxtLink 
                  :to="notification.data.action_url"
                  class="inline-flex items-center text-sm text-orange-400 hover:text-orange-300"
                >
                  Ver detalles
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useNotifications } from '~/composables/useNotifications';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth'
});

const router = useRouter();

const {
  notifications,
  unreadCount,
  isLoading,
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  setupRealtimeListener,
  cleanupRealtimeListener
} = useNotifications();

const handleNotificationClick = async (notification: any) => {
  // Mark as read if not already
  if (!notification.read_at) {
    await markAsRead(notification.id);
  }
  
  // Navigate to action URL if provided
  if (notification.data.action_url) {
    router.push(notification.data.action_url);
  }
};

const handleMarkAllAsRead = async () => {
  await markAllAsRead();
};

const formatTimeAgo = (date: string) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  
  return notificationDate.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

onMounted(async () => {
  await fetchNotifications();
  await fetchUnreadCount();
  setupRealtimeListener();
});

onUnmounted(() => {
  cleanupRealtimeListener();
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';

// NotificationIcon Component
const NotificationIcon = defineComponent({
  name: 'NotificationIcon',
  props: {
    icon: {
      type: String,
      default: 'bell'
    }
  },
  computed: {
    iconBgClass() {
      switch (this.icon) {
        case 'check-circle': return 'bg-green-900 text-green-300';
        case 'x-circle': return 'bg-red-900 text-red-300';
        case 'user-plus': return 'bg-blue-900 text-blue-300';
        case 'star': return 'bg-yellow-900 text-yellow-300';
        case 'ticket': return 'bg-purple-900 text-purple-300';
        case 'calendar': return 'bg-indigo-900 text-indigo-300';
        case 'message-circle': return 'bg-cyan-900 text-cyan-300';
        default: return 'bg-gray-700 text-gray-300';
      }
    },
    iconColorClass() {
      return 'currentColor';
    }
  },
  template: `
    <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconBgClass">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5"
        :class="iconColorClass"
      >
        <path
          v-if="icon === 'check-circle'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          v-else-if="icon === 'x-circle'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          v-else-if="icon === 'user-plus'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
        />
        <path
          v-else-if="icon === 'star'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
        <path
          v-else-if="icon === 'message-circle'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
        <path
          v-else-if="icon === 'ticket'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
        />
        <path
          v-else-if="icon === 'calendar'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    </div>
  `
});
</script>

