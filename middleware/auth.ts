export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const { isAuthenticated, isLoading } = useAuth();

  // Esperar a que termine de inicializar
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
