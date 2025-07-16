export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side
  if (process.server) return;
  
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});