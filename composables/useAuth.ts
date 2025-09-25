import { useCookie, useRuntimeConfig } from '#app';
import { useUserStore } from '~/store/user';

export const useAuth = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl as string;
  const token = useCookie('token');
  const userStore = useUserStore();
  const isLoading = ref(true);
  
  // Use store's computed authentication state
  const isAuthenticated = computed(() => userStore.isAuthenticated);

  // Check if user is authenticated and restore session
  const checkAuth = async () => {
    isLoading.value = true;
    try {
      // Initialize from localStorage first
      userStore.initializeFromStorage();
      
      // If no token in store, user is not authenticated
      if (!userStore.token) {
        isLoading.value = false;
        userStore.setInitialized(true);
        return false;
      }

      // Verify token is still valid by calling /me endpoint
      try {
        const userData = await $fetch('/me', {
          baseURL: apiBaseUrl,
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        });

        // Update user data with fresh data from server
        const user = userData.user || userData; // Handle both response formats
        const normalizedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar_url || user.avatar || '',
          description: user.description ?? '',
          joinedAt: user.created_at ?? '',
        };

        userStore.setUser(normalizedUser);
        isLoading.value = false;
        userStore.setInitialized(true);
        return true;
      } catch (error) {
        console.error('Token validation failed:', error);
        // Token is invalid, clear everything
        userStore.clearAuth();
        isLoading.value = false;
        userStore.setInitialized(true);
        return false;
      }
    } catch (error: any) {
      console.error('Error checking authentication:', error);
      // Clear invalid session
      userStore.clearAuth();
      isLoading.value = false;
      userStore.setInitialized(true);
      return false;
    }
  };

  // Initialize authentication state
  const initAuth = async () => {
    if (!userStore.initialized) {
      await checkAuth();
    } else {
      isLoading.value = false;
    }
  };

  const login = async (credentials: { email: string; password: string; hcaptchaToken?: string }) => {
    try {
      const body: Record<string, any> = {
        email: credentials.email,
        password: credentials.password
      };
      if (credentials.hcaptchaToken) {
        body['h-captcha-response'] = credentials.hcaptchaToken;
      }

      console.log('Login request body:', body);
      console.log('API Base URL:', apiBaseUrl);

      const response = await $fetch<{ access_token: string; user: any }>('/login', {
        baseURL: apiBaseUrl,
        method: 'POST',
        body,
      });

      console.log('Login response:', response);

      if (!response.user || !response.access_token) {
        throw new Error("Respuesta incompleta del servidor");
      }

      const loggedInUser = Array.isArray(response.user) ? response.user[0] : response.user;

      // Update store and localStorage
      const normalizedUser = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        avatar: loggedInUser.avatar_url ?? '',
        description: loggedInUser.description ?? '',
        joinedAt: loggedInUser.created_at ?? '',
      };

      userStore.setUser(normalizedUser);
      userStore.setToken(response.access_token);
      userStore.setInitialized(true);

      // Also set cookie for compatibility
      token.value = response.access_token;

      await navigateTo('/');
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error?.statusCode === 401 || error?.response?.status === 401) {
        throw createError({ statusCode: 401, statusMessage: 'Credenciales incorrectas' });
      } else {
        throw error;
      }
    }
  };

  const loginWithGoogle = async (googleToken: string) => {
    try {
      const response = await $fetch<{ access_token: string; user: any }>(
        '/auth/google/callback',
        {
          baseURL: apiBaseUrl,
          method: 'POST',
          body: { token: googleToken },
        }
      );

      if (!response.access_token) {
        throw new Error("No se recibió el token de acceso de Google.");
      }

      // Get full user data
      const userData = await $fetch('/me', {
        baseURL: apiBaseUrl,
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });

      const user = userData.user || userData; // Handle both response formats
      const normalizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url || user.avatar || '',
        description: user.description ?? '',
        joinedAt: user.created_at ?? '',
      };

      userStore.setUser(normalizedUser);
      userStore.setToken(response.access_token);
      userStore.setInitialized(true);

      // Also set cookie for compatibility
      token.value = response.access_token;

      await navigateTo('/');
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Optionally call logout endpoint on server
      if (userStore.token) {
        await $fetch('/logout', {
          baseURL: apiBaseUrl,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        }).catch(() => {
          // Ignore errors on logout endpoint
        });
      }
    } finally {
      // Always clear local state
      userStore.clearAuth();
      token.value = null;
      await navigateTo('/login');
    }
  };

  const register = async ({
    name,
    email,
    password,
    passwordConfirmation,
    hcaptchaToken
  }: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    hcaptchaToken: string;
  }) => {
    try {
      const body = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        'h-captcha-response': hcaptchaToken
      };

      await $fetch('/register', {
        baseURL: apiBaseUrl,
        method: 'POST',
        body
      });

      await navigateTo('/login');
    } catch (error: any) {
      console.error('Error en el registro:', error);
      throw error;
    }
  };

  return {
    user: computed(() => userStore.user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    loginWithGoogle, 
    logout,
    register,
    checkAuth,
    initAuth
  };
};