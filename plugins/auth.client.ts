import { useUserStore } from '~/store/user';

export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth();
  const userStore = useUserStore();
  
  // Only run on client side after hydration
  if (process.client) {
    // Wait for the app to be fully mounted to avoid hydration issues
    await nextTick();
    
    // Initialize from localStorage first
    userStore.initializeFromStorage();
    
    // Then validate with server
    await initAuth();
  }
});
