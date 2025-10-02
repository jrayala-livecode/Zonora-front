import { useUserStore } from '~/store/user';
import { useRuntimeConfig } from '#app';

export const useApiClient = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl as string;
  const userStore = useUserStore();

  // Track token expiration
  let tokenExpirationTime: number | null = null;
  let expirationCheckInterval: NodeJS.Timeout | null = null;

  // Set token expiration time
  const setTokenExpiration = (expiresIn: number) => {
    tokenExpirationTime = Date.now() + (expiresIn * 1000);
    
    // Clear existing interval
    if (expirationCheckInterval) {
      clearInterval(expirationCheckInterval);
    }
    
    // Check for expiration every 30 seconds
    expirationCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 30000);
  };

  // Check if token has expired
  const checkTokenExpiration = () => {
    if (!tokenExpirationTime || !userStore.token) {
      return;
    }

    const now = Date.now();
    const timeUntilExpiry = tokenExpirationTime - now;

    if (timeUntilExpiry <= 0) {
      handleTokenExpiration();
    } else if (timeUntilExpiry <= 300000) { // 5 minutes warning
      // You could show a warning notification here
    }
  };

  // Handle token expiration
  const handleTokenExpiration = () => {
    // Clear the interval
    if (expirationCheckInterval) {
      clearInterval(expirationCheckInterval);
      expirationCheckInterval = null;
    }
    
    // Clear token expiration time
    tokenExpirationTime = null;
    
    // Clear user authentication
    userStore.clearAuth();
    
    // Show notification to user
    if (process.client) {
      // Show user-friendly notification
      
      // You can integrate with your modal system here
      // For now, we'll use a simple alert
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      
      // Redirect to login page
      navigateTo('/login');
    }
  };

  // Make authenticated API request
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    if (!userStore.token) {
      throw new Error('No authentication token available');
    }

    // Check if token is expired before making request
    if (tokenExpirationTime && Date.now() >= tokenExpirationTime) {
      handleTokenExpiration();
      throw new Error('Token has expired');
    }

    const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Check for 401 Unauthorized response
    if (response.status === 401) {
      handleTokenExpiration();
      throw new Error('Authentication failed - please log in again');
    }

    return response;
  };

  // Make authenticated API request and return JSON
  const apiRequestJson = async (url: string, options: RequestInit = {}) => {
    const response = await apiRequest(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Use the text response as error message
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  };

  // Clean up on unmount
  const cleanup = () => {
    if (expirationCheckInterval) {
      clearInterval(expirationCheckInterval);
      expirationCheckInterval = null;
    }
  };

  return {
    setTokenExpiration,
    checkTokenExpiration,
    apiRequest,
    apiRequestJson,
    cleanup,
  };
};