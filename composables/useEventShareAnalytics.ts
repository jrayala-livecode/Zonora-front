import { ref } from 'vue';
import type { ShareAnalytics } from './types/types';

export const useEventShareAnalytics = () => {
  const analytics = ref<ShareAnalytics | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAnalytics = async (eventId: number): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const apiBaseUrl = config.public.apiBaseUrl as string;
      const token = localStorage.getItem('zonora_token');

      const response = await fetch(`${apiBaseUrl}/events/${eventId}/share-analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las analíticas');
      }

      const data: ShareAnalytics = await response.json();
      analytics.value = data;
    } catch (e: any) {
      error.value = e.message || 'Error al cargar las analíticas';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const refreshAnalytics = async (eventId: number): Promise<void> => {
    await fetchAnalytics(eventId);
  };

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refreshAnalytics,
  };
};

