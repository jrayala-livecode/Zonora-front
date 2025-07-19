import { useCookie, useRuntimeConfig } from '#app';
import { useUserStore } from '~/store/user';


export const useAuth = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl as string;
  const token = useCookie('token');
  const userStore = useUserStore();
  const user = useState('auth.user', () => null as {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    joinedAt: string;
  } | null);

 const isAuthenticated = computed(() => !!userStore.user && !!token.value);;

  const login = async (credentials: { email: string; password: string; hcaptchaToken?: string }) => {
    try {
      const body: Record<string, any> = {
        email: credentials.email,
        password: credentials.password
      };
      if (credentials.hcaptchaToken) {
        body['h-captcha-response'] = credentials.hcaptchaToken;
      }

      const response = await $fetch<{ access_token: string; user: any }>('/login', {
        baseURL: apiBaseUrl,
        method: 'POST',
        body,
      });

      if (!response.user || !response.access_token) {
        throw new Error("Respuesta incompleta del servidor");
      }

      const loggedInUser = Array.isArray(response.user) ? response.user[0] : response.user;

      user.value = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        avatar: loggedInUser.avatar_url ?? '',
        joinedAt: loggedInUser.created_at ?? '',
      };

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

 const loginWithGoogle = async (code: string) => {
    const config = useRuntimeConfig();

    const response = await $fetch<{ access_token: string; user: any }>(
      '/auth/google/callback',
      {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { code },
      }
    );

    if (!response.user || !response.access_token) {
      throw new Error('Error de autenticación');
    }

    token.value = response.access_token;
    userStore.setToken(response.access_token);
    userStore.setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      avatar: response.user.avatar_url ?? '',
      joinedAt: response.user.created_at ?? '',
    });
  };

  const logout = () => {
    token.value = null;
    userStore.setUser(null);
    userStore.setToken('');
    navigateTo('/login');
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
    login,
    loginWithGoogle, 
    logout,
    register
  };
};
