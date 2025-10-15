import { ref } from 'vue';
import type { Post } from './types/types';

// Singleton state (outside composable function)
const posts = ref<Post[]>([]);
const isLoading = ref(false);
const requiresCaptcha = ref(false);
const captchaToken = ref('');

export const usePosts = () => {
  const config = useRuntimeConfig();

  /**
   * Fetch posts for a specific resource
   */
  const fetchPosts = async (type: 'venue' | 'artist' | 'event', id: number) => {
    isLoading.value = true;
    
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/posts/${type}/${id}`);
      const data = await response.json();
      
      posts.value = data.data || [];
      return posts.value;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create a new post with captcha handling
   */
  const createPost = async (
    type: 'venue' | 'artist' | 'event',
    id: number,
    content: string,
    hcaptchaToken?: string
  ) => {
    try {
      const { apiRequest } = useApiClient();
      
      const payload: any = {
        postable_type: type,
        postable_id: id,
        content: content,
      };

      // Include captcha token if provided
      if (hcaptchaToken) {
        payload['h-captcha-response'] = hcaptchaToken;
      }

      const response = await apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if captcha is required
        if (errorData.requires_captcha) {
          requiresCaptcha.value = true;
          throw new Error(errorData.message || 'Please complete the captcha');
        }
        
        throw new Error(errorData.message || 'Failed to create post');
      }

      const data = await response.json();
      
      // Add new post to the beginning of the list
      if (data.post) {
        posts.value.unshift(data.post);
      }

      // Reset captcha state on success
      requiresCaptcha.value = false;
      captchaToken.value = '';

      return data.post;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Delete a post
   */
  const deletePost = async (postId: number) => {
    try {
      const { apiRequest } = useApiClient();
      const response = await apiRequest(`/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      // Remove post from local state
      posts.value = posts.value.filter(post => post.id !== postId);

      return true;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Reset captcha state
   */
  const resetCaptcha = () => {
    requiresCaptcha.value = false;
    captchaToken.value = '';
  };

  return {
    posts,
    isLoading,
    requiresCaptcha,
    captchaToken,
    fetchPosts,
    createPost,
    deletePost,
    resetCaptcha,
  };
};

