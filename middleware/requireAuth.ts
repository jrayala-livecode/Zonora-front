/**
 * Route guard middleware to protect pages that require authentication
 * 
 * Usage:
 * definePageMeta({
 *   middleware: 'requireAuth'
 * });
 * 
 * This middleware will:
 * 1. Check if user is authenticated
 * 2. Redirect to login if not authenticated
 * 3. Wait for auth initialization to complete
 * 4. Handle server-side rendering properly
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip on server-side rendering
  if (process.server) return;

  const { isAuthenticated, isLoading } = useAuth();

  // Wait for authentication initialization to complete
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    // Store the intended destination for redirect after login
    const redirectTo = to.fullPath;
    
    // Navigate to login with redirect parameter
    return navigateTo({
      path: '/login',
      query: { redirect: redirectTo }
    });
  }
});


