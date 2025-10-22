import { ref } from 'vue';
import type { EventMedia } from './types/types';

export const useEventMedia = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Upload media (image or link) for a past event
   */
  const uploadEventMedia = async (
    eventId: number,
    type: 'image' | 'link',
    file?: File,
    link?: string
  ): Promise<EventMedia | null> => {
    loading.value = true;
    error.value = null;

    try {
      const apiClient = useApiClient();
      const formData = new FormData();
      formData.append('type', type);

      if (type === 'image' && file) {
        formData.append('image', file);
      } else if (type === 'link' && link) {
        formData.append('link', link);
      } else {
        throw new Error('Invalid media type or missing data');
      }

      const response = await apiClient(`/events/${eventId}/media`, {
        method: 'POST',
        body: formData,
      });

      return response.data;
    } catch (e: any) {
      console.error('Event media upload error:', e);
      error.value = e.response?.data?.message || e.message || 'Failed to upload media';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get all media for an event
   */
  const getEventMedia = async (eventId: number, page = 1): Promise<{ data: EventMedia[]; total: number } | null> => {
    loading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const response = await fetch(`${config.public.apiBaseUrl}/events/${eventId}/media?page=${page}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event media');
      }

      const result = await response.json();
      return {
        data: result.data || [],
        total: result.total || 0,
      };
    } catch (e: any) {
      console.error('Get event media error:', e);
      error.value = e.message || 'Failed to fetch media';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete media (own media or admin)
   */
  const deleteEventMedia = async (mediaId: number): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const apiClient = useApiClient();
      await apiClient(`/event-media/${mediaId}`, {
        method: 'DELETE',
      });
    } catch (e: any) {
      console.error('Delete event media error:', e);
      error.value = e.response?.data?.message || e.message || 'Failed to delete media';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    uploadEventMedia,
    getEventMedia,
    deleteEventMedia,
  };
};

