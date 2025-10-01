import { useUserStore } from '~/store/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) {
    return;
  }
  
  try {
    const { isAuthenticated, isLoading, initAuth } = useAuth();
    const userStore = useUserStore();

    // If not initialized, try to initialize auth
    if (!userStore.initialized) {
      await initAuth();
    }

    // Wait for initialization to complete
    let waitCount = 0;
    while (isLoading.value || !userStore.initialized) {
      waitCount++;
      await new Promise(resolve => setTimeout(resolve, 10));
      
      if (waitCount > 100) {
        break;
      }
    }

    if (!isAuthenticated.value) {
      // Store the intended destination for redirect after login
      const redirectTo = to.fullPath;
      
      // Navigate to login with redirect parameter
      return navigateTo({
        path: '/login',
        query: { redirect: redirectTo }
      });
    }
  } catch (error) {
    console.error('AUTH MIDDLEWARE ERROR:', error);
    return navigateTo('/login');
  }
});
