import { ref } from 'vue';
import type { Notification } from './types/types';
import { useUserStore } from '~/store/user';

// Singleton state (outside the function)
const notifications = ref<Notification[]>([]);
const unreadCount = ref(0);
const isLoading = ref(false);
const isListenerSetup = ref(false);

export const useNotifications = () => {
  const fetchNotifications = async (page = 1, perPage = 15) => {
    isLoading.value = true;
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/notifications?page=${page}&per_page=${perPage}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      
      // Handle paginated response
      if (data.data) {
        notifications.value = data.data;
      } else {
        notifications.value = data;
      }
      
      // Update unread count
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/notifications/unread-count');
      
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      
      const data = await response.json();
      unreadCount.value = data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/notifications/${notificationId}/mark-as-read`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification && !notification.read_at) {
        notification.read_at = new Date().toISOString();
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/notifications/mark-all-read', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }
      
      // Update local state
      notifications.value.forEach(n => {
        n.read_at = new Date().toISOString();
      });
      unreadCount.value = 0;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      
      // Update local state
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const wasUnread = !notifications.value[index].read_at;
        notifications.value.splice(index, 1);
        if (wasUnread) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const setupRealtimeListener = () => {
    if (isListenerSetup.value) {
      return; // Already setup
    }

    try {
      const { user } = useUserStore();
      if (!user?.id) {
        return;
      }

      const { $echo } = useNuxtApp() as any;
      if (!$echo) {
        console.warn('Echo not available for notifications');
        return;
      }

      // Listen to user's private channel for notifications
      $echo
        .private(`App.Models.User.${user.id}`)
        .notification((notification: Notification) => {
          // Add new notification to the beginning of the list
          notifications.value.unshift(notification);
          unreadCount.value++;
        });

      isListenerSetup.value = true;
    } catch (error) {
      console.error('Error setting up notification listener:', error);
    }
  };

  const cleanupRealtimeListener = () => {
    if (!isListenerSetup.value) {
      return;
    }

    try {
      const { user } = useUserStore();
      if (!user?.id) {
        return;
      }

      const { $echo } = useNuxtApp() as any;
      if ($echo) {
        $echo.leave(`App.Models.User.${user.id}`);
      }

      isListenerSetup.value = false;
    } catch (error) {
      console.error('Error cleaning up notification listener:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setupRealtimeListener,
    cleanupRealtimeListener
  };
};

