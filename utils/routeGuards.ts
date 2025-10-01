/**
 * Route guard utilities for managing protected pages
 * 
 * This file provides utilities for managing which pages require authentication
 * and makes it easy to add new protected routes in the future.
 */

/**
 * List of routes that require authentication
 * Add new routes here to protect them
 */
export const PROTECTED_ROUTES = [
  '/create',
  '/profile', 
  '/my-events',
  // Add more protected routes here as needed
  // '/dashboard',
  // '/settings',
  // '/admin',
] as const;

/**
 * Check if a route requires authentication
 * @param route - The route path to check
 * @returns true if the route requires authentication
 */
export const isProtectedRoute = (route: string): boolean => {
  return PROTECTED_ROUTES.some(protectedRoute => 
    route.startsWith(protectedRoute)
  );
};

/**
 * Get the redirect URL for a protected route
 * @param route - The route that was attempted to access
 * @returns The redirect URL with query parameters
 */
export const getRedirectUrl = (route: string): string => {
  return `/login?redirect=${encodeURIComponent(route)}`;
};

/**
 * Middleware configuration for protected pages
 * Use this in definePageMeta for consistent configuration
 */
export const PROTECTED_PAGE_META = {
  middleware: 'auth'
} as const;

/**
 * Example usage in a page:
 * 
 * definePageMeta({
 *   ...PROTECTED_PAGE_META,
 *   // Add other page-specific meta here
 * });
 */
