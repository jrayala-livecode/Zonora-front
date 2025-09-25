export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const { isAuthenticated, isLoading } = useAuth();
  const userStore = useUserStore();

  // Wait for initialization to complete
  while (isLoading.value || !userStore.initialized) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
