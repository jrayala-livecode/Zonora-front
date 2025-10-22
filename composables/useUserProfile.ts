import { ref } from 'vue';
import type { UserProfile, UserActivity, SocialLink } from './types/types';

// Singleton state (outside composable function)
const userProfile = ref<UserProfile | null>(null);
const userActivity = ref<UserActivity | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export const useUserProfile = () => {
  const config = useRuntimeConfig();

  /**
   * Fetch user profile by ID or username
   */
  const fetchUserProfile = async (idOrUsername: string | number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(
        `${config.public.apiBaseUrl}/users/${idOrUsername}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }
      
      userProfile.value = await response.json();
      return userProfile.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user profile';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch user activity
   */
  const fetchUserActivity = async (idOrUsername: string | number) => {
    try {
      const response = await fetch(
        `${config.public.apiBaseUrl}/users/${idOrUsername}/activity`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user activity');
      }
      
      userActivity.value = await response.json();
      return userActivity.value;
    } catch (err: any) {
      console.error('Error fetching user activity:', err);
      throw err;
    }
  };

  /**
   * Fetch user's artists
   */
  const fetchUserArtists = async (idOrUsername: string | number) => {
    try {
      const response = await fetch(
        `${config.public.apiBaseUrl}/users/${idOrUsername}/artists`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user artists');
      }
      
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching user artists:', err);
      throw err;
    }
  };

  /**
   * Fetch user's events
   */
  const fetchUserEvents = async (idOrUsername: string | number) => {
    try {
      const response = await fetch(
        `${config.public.apiBaseUrl}/users/${idOrUsername}/events`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user events');
      }
      
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching user events:', err);
      throw err;
    }
  };

  /**
   * Fetch events user is interested in
   */
  const fetchInterestedEvents = async (idOrUsername: string | number) => {
    try {
      const response = await fetch(
        `${config.public.apiBaseUrl}/users/${idOrUsername}/interested-events`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch interested events');
      }
      
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching interested events:', err);
      throw err;
    }
  };

  /**
   * Update social links (authenticated)
   */
  const updateSocialLinks = async (socialLinks: SocialLink[]) => {
    try {
      const { apiRequest } = useApiClient();
      
      const response = await apiRequest('/profile/social-links', {
        method: 'PUT',
        body: JSON.stringify({ social_links: socialLinks }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update social links');
      }
      
      return await response.json();
    } catch (err: any) {
      throw err;
    }
  };

  /**
   * Update profile settings (authenticated)
   */
  const updateProfileSettings = async (settings: {
    bio?: string;
    location?: string;
    profile_public?: boolean;
    username?: string;
  }) => {
    try {
      const { apiRequest } = useApiClient();
      
      const response = await apiRequest('/profile/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile settings');
      }
      
      return await response.json();
    } catch (err: any) {
      throw err;
    }
  };

  /**
   * Clear state
   */
  const clearProfile = () => {
    userProfile.value = null;
    userActivity.value = null;
    error.value = null;
  };

  return {
    userProfile,
    userActivity,
    isLoading,
    error,
    fetchUserProfile,
    fetchUserActivity,
    fetchUserArtists,
    fetchUserEvents,
    fetchInterestedEvents,
    updateSocialLinks,
    updateProfileSettings,
    clearProfile,
  };
};

