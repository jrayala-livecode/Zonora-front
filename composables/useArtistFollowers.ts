import { useUserStore } from '~/store/user';

export const useArtistFollowers = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const userStore = useUserStore();

  const getFollowers = async (artistId: number, page = 1) => {
    if (!userStore.token) throw new Error('Not authenticated');

    const response = await fetch(`${apiBaseUrl}/artists/${artistId}/followers?page=${page}`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch followers');
    
    return data;
  };

  return { getFollowers };
};

