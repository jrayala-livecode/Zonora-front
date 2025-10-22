<template>
  <div class="relative">
    <!-- Bell Icon Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-300 hover:text-orange-400 transition-colors rounded-lg hover:bg-gray-700"
      :aria-label="`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`"
    >
      <!-- Bell Icon (Heroicons) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>

      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-[600px] flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllAsRead"
            class="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        <!-- Notifications List -->
        <div class="overflow-y-auto flex-1">
          <!-- Loading State -->
          <div v-if="isLoading" class="p-8 text-center">
            <div class="text-orange-400 animate-pulse">Loading notifications...</div>
          </div>

          <!-- Empty State -->
          <div v-else-if="notifications.length === 0" class="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 mx-auto text-gray-600 mb-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.286m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
              />
            </svg>
            <p class="text-gray-400">No notifications yet</p>
          </div>

          <!-- Notifications -->
          <div v-else class="divide-y divide-gray-700">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              class="p-4 hover:bg-gray-750 transition-colors cursor-pointer"
              :class="{ 'bg-gray-750': !notification.read_at }"
            >
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div class="flex-shrink-0 mt-1">
                  <NotificationIcon :icon="notification.data.icon" />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
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
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useNotifications } from '~/composables/useNotifications';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);

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

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value && notifications.value.length === 0) {
    await fetchNotifications();
  }
};

const handleNotificationClick = async (notification: any) => {
  // Mark as read if not already
  if (!notification.read_at) {
    await markAsRead(notification.id);
  }
  
  // Navigate to action URL if provided
  if (notification.data.action_url) {
    isOpen.value = false;
    router.push(notification.data.action_url);
  }
};

const handleMarkAllAsRead = async () => {
  await markAllAsRead();
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

onMounted(async () => {
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
  template: `
    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="iconBgClass">
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
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
        <path
          v-else-if="icon === 'mail'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
        <path
          v-else-if="icon === 'calendar'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
        <path
          v-else-if="icon === 'music'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    </div>
  `,
  computed: {
    iconBgClass() {
      const iconMap: Record<string, string> = {
        'check-circle': 'bg-green-900',
        'x-circle': 'bg-red-900',
        'user-plus': 'bg-blue-900',
        'star': 'bg-yellow-900',
        'message-circle': 'bg-purple-900',
        'mail': 'bg-indigo-900',
        'calendar': 'bg-orange-900',
        'music': 'bg-pink-900'
      };
      return iconMap[this.icon] || 'bg-gray-700';
    },
    iconColorClass() {
      const iconMap: Record<string, string> = {
        'check-circle': 'text-green-400',
        'x-circle': 'text-red-400',
        'user-plus': 'text-blue-400',
        'star': 'text-yellow-400',
        'message-circle': 'text-purple-400',
        'mail': 'text-indigo-400',
        'calendar': 'text-orange-400',
        'music': 'text-pink-400'
      };
      return iconMap[this.icon] || 'text-gray-400';
    }
  }
});

export { NotificationIcon };
</script>

