import { useUserStore } from '~/store/user';

export const useArtists = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  // Get all public artists
  const getArtists = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/artists`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch artists');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  };

  // Get artist by ID
  const getArtist = async (id: string) => {
    console.log('getArtist called with ID:', id);
    console.log('API Base URL:', apiBaseUrl);
    console.log('Full URL:', `${apiBaseUrl}/artists/${id}`);
    
    try {
      const response = await fetch(`${apiBaseUrl}/artists/${id}`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch artist');
      }
      
      return data.data || data;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  };

  // Search artists
  const searchArtists = async (query: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/artists/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search artists');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  };

  // Get current user's artists
  const getMyArtists = async () => {
    const userStore = useUserStore();
    
    if (!userStore.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/artists/me`, {
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch my artists');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching my artists:', error);
      throw error;
    }
  };

  // Create new artist profile
  const createArtist = async (artistData: any) => {
    const userStore = useUserStore();
    
    if (!userStore.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/artists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create artist');
      }
      
      return data.data || data;
    } catch (error) {
      console.error('Error creating artist:', error);
      throw error;
    }
  };

  // Update artist profile
  const updateArtist = async (id: string, artistData: any) => {
    const userStore = useUserStore();
    
    if (!userStore.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/artists/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update artist');
      }
      
      return data.data || data;
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  };

  // Toggle artist visibility
  const toggleArtistVisibility = async (id: string) => {
    const userStore = useUserStore();
    
    if (!userStore.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/artists/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle artist visibility');
      }
      
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
