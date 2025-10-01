import { useUserStore } from '~/store/user';
import { useApiClient } from '~/composables/useApiClient';

export const useArtists = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl || 'http://127.0.0.1:8000/api';
  const { apiRequestJson } = useApiClient();

  // Get all public artists with pagination
  const getArtists = async (params: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    genre?: string;
  } = {}) => {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.sort_by) searchParams.append('sort_by', params.sort_by);
      if (params.genre) searchParams.append('genre', params.genre);
      
      const url = `${apiBaseUrl}/artists${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch artists');
      }
      
      return {
        data: data.data || [],
        pagination: data.pagination || null
      };
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  };

  // Get artist by ID
  const getArtist = async (id: string) => {
    try {
      const userStore = useUserStore();
      const headers: HeadersInit = {};
      
      // Add authentication header if user is logged in
      if (userStore.token) {
        headers['Authorization'] = `Bearer ${userStore.token}`;
      }
      
      const response = await fetch(`${apiBaseUrl}/artists/${id}`, {
        headers
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch artist');
      }
      
      return data.data || data;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  };

  // Search artists with pagination
  const searchArtists = async (query: string, params: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    genre?: string;
  } = {}) => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.sort_by) searchParams.append('sort_by', params.sort_by);
      if (params.genre) searchParams.append('genre', params.genre);
      
      const url = `${apiBaseUrl}/artists/search?${searchParams.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search artists');
      }
      
      return {
        data: data.data || [],
        pagination: data.pagination || null
      };
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  };

  // Get current user's artists
  const getMyArtists = async () => {
    try {
      const data = await apiRequestJson('/artists/me');
      const artists = data.data || [];
      return artists;
    } catch (error) {
      console.error('useArtists: Error fetching my artists:', error);
      throw error;
    }
  };

  // Create new artist profile
  const createArtist = async (artistData: any) => {
    try {
      const data = await apiRequestJson('/artists', {
        method: 'POST',
        body: JSON.stringify(artistData),
      });
      
      return data.data || data;
    } catch (error) {
      console.error('Error creating artist:', error);
      throw error;
    }
  };

  // Update artist profile
  const updateArtist = async (id: string, artistData: any) => {
    try {
      const data = await apiRequestJson(`/artists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(artistData),
      });
      
      return data.data || data;
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  };

  // Toggle artist visibility
  const toggleArtistVisibility = async (id: string) => {
    try {
      const data = await apiRequestJson(`/artists/${id}/visibility`, {
        method: 'PATCH',
      });
      
      return data.data || data;
    } catch (error) {
      console.error('Error toggling artist visibility:', error);
      throw error;
    }
  };

  return {
    getArtists,
    getArtist,
    searchArtists,
    getMyArtists,
    createArtist,
    updateArtist,
    toggleArtistVisibility,
  };
};
