export const useAuth = () => {
  const user = useState('auth.user', () => null as {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    joinedAt: string;
  } | null);

  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials: { email: string; password: string }) => {
    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    user.value = {
      id: '1',
      name: 'Olivia Bennett',
      email: credentials.email,
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
      joinedAt: '2021'
    };
    
    await navigateTo('/');
  };

  const logout = () => {
    user.value = null;
    navigateTo('/login');
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    user.value = {
      id: '1',
      name: userData.name,
      email: userData.email,
      joinedAt: new Date().getFullYear().toString()
    };
    
    await navigateTo('/');
  };

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    register
  };
};