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

    // Actualizo user local (opcional)
    user.value = {
      id: loggedInUser.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      avatar: loggedInUser.avatar_url ?? '',
      joinedAt: loggedInUser.created_at ?? '',
    };

    // Actualizo el store global para que la UI reaccione
    userStore.setUser({
      id: loggedInUser.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      avatar: loggedInUser.avatar_url ?? '',
      joinedAt: loggedInUser.created_at ?? '',
    });

    // Guardo token cookie y en store
    token.value = response.access_token;
    userStore.setToken(response.access_token);

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
  try {
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

    const loggedInUser = Array.isArray(response.user) ? response.user[0] : response.user;

    // Guardar token en cookie
    token.value = response.access_token;

    // Setear usuario en store global
    userStore.setToken(response.access_token);
    userStore.setUser({
      id: loggedInUser.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      avatar: loggedInUser.avatar_url ?? '',
      joinedAt: loggedInUser.created_at ?? '',
    });

    // Setear también en variable local (opcional pero recomendable si usás `useState`)
    user.value = {
      id: loggedInUser.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      avatar: loggedInUser.avatar_url ?? '',
      joinedAt: loggedInUser.created_at ?? '',
    };

    // Redirigir al home
    await navigateTo('/');
  } catch (error: any) {
    console.error('Error en login con Google:', error);
    throw error;
  }
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
