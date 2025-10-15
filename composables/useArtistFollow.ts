import { useUserStore } from '~/store/user';

export const useArtistFollow = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const userStore = useUserStore();

  const makeRequest = async (artistId: number, method: 'POST' | 'DELETE') => {
    if (!userStore.token) throw new Error('Not authenticated');

    const response = await fetch(`${apiBaseUrl}/artists/${artistId}/follow`, {
      method,
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Failed to ${method === 'POST' ? 'follow' : 'unfollow'} artist`);
    
    return data.data;
  };

  const followArtist = (artistId: number) => makeRequest(artistId, 'POST');
  const unfollowArtist = (artistId: number) => makeRequest(artistId, 'DELETE');

  const checkFollowStatus = async (artistId: number) => {
    if (!userStore.token) throw new Error('Not authenticated');

    const response = await fetch(`${apiBaseUrl}/artists/${artistId}/follow/check`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to check follow status');
    
    return data.data;
  };

  return { followArtist, unfollowArtist, checkFollowStatus };
};


