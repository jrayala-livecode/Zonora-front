import { ref, computed } from 'vue';
import type { ArtistMetrics, ArtistStats, Artist } from '~/composables/types/types';
import { useUserStore } from '~/store/user';

export const useArtistMetrics = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl || 'http://127.0.0.1:8000/api';
  const userStore = useUserStore();
  
  const metrics = ref<ArtistMetrics | null>(null);
  const stats = ref<ArtistStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchArtistMetrics = async (artistId: number) => {
    if (!userStore.token) {
      error.value = 'Not authenticated';
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${apiBaseUrl}/artists/${artistId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch metrics');
      }
      
      metrics.value = data.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch metrics';
      console.error('Error fetching artist metrics:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchMyArtistStats = async () => {
    if (!userStore.token) {
      error.value = 'Not authenticated';
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${apiBaseUrl}/artists/my-stats`, {
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }
      
      stats.value = data.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch stats';
      console.error('Error fetching artist stats:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchPopularArtists = async (limit = 10): Promise<{ data: Artist[]; count: number } | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${apiBaseUrl}/artists/popular?limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch popular artists');
      }
      
      return data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch popular artists';
      console.error('Error fetching popular artists:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties for easy access
  const totalViews = computed(() => metrics.value?.total_views || 0);
  const totalFollows = computed(() => metrics.value?.total_follows || 0);
  const viewsToday = computed(() => metrics.value?.current_metrics.views_today || 0);
  const uniqueViewersToday = computed(() => metrics.value?.current_metrics.unique_viewers_today || 0);

  return {
    metrics,
    stats,
    loading,
    error,
    fetchArtistMetrics,
    fetchMyArtistStats,
    fetchPopularArtists,
    totalViews,
    totalFollows,
    viewsToday,
    uniqueViewersToday
  };
};
