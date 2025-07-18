export const useAuth = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl as string;
  const token = useCookie('token');
  const user = useState('auth.user', () => null as {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    joinedAt: string;
  } | null);

  const isAuthenticated = computed(() => !!user.value);

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
  try {
    const response = await $fetch<{ access_token: string; user: any }>(
      '/auth/google/callback',
      {
        baseURL: apiBaseUrl,
        method: 'POST',
        body: { code },
      }
    );

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

    token.value = response.access_token; 

    await navigateTo('/');
  } catch (error: any) {
    console.error('Error en login con Google:', error);
    throw createError({ statusCode: 500, statusMessage: 'Fallo al autenticar con Google' });
  }
};

  const logout = () => {
    user.value = null;
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
    user: readonly(user),
    isAuthenticated,
    login,
    loginWithGoogle, // 👈 lo exportamos también
    logout,
    register
  };
};
