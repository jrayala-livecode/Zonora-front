export const useAuth = () => {
  const config = useRuntimeConfig();

  const user = useState('auth.user', () => null as {
    id: string;
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
        password: credentials.password,
      };
      if (credentials.hcaptchaToken) {
        body['h-captcha-response'] = credentials.hcaptchaToken;
      }

      // Enviar login al backend
      await $fetch('/login', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body,
      });

      // Simulacion: seteamos usuario localmente
      
      user.value = {
        id: '1',
        name: 'Olivia Bennett',
        email: credentials.email,
        avatar:
          'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
        joinedAt: '2021',
      };

      await navigateTo('/');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
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
        baseURL: config.public.apiBaseUrl as string,

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
    logout,
    register
  };
};
