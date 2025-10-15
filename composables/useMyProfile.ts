import { ref } from 'vue';

// Singleton state
const profileData = ref<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export const useMyProfile = () => {
  /**
   * Fetch current user's profile data
   */
  const fetchMyProfile = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/profile');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const result = await response.json();
      profileData.value = result.data || result;
      return profileData.value;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch profile';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update profile (name, description, password)
   */
  const updateMyProfile = async (data: {
    name?: string;
    description?: string;
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }) => {
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      profileData.value = result.data || result;
      return result;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    profileData,
    isLoading,
    error,
    fetchMyProfile,
    updateMyProfile,
  };
};

