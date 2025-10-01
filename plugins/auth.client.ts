import { useUserStore } from '~/store/user';

export default defineNuxtPlugin({
  name: 'auth-init',
  parallel: false, // Run this plugin before others
  async setup() {
    const { initAuth } = useAuth();
    const userStore = useUserStore();
    
    // Only run on client side after hydration
    if (process.client) {
      // Initialize from localStorage first
      userStore.initializeFromStorage();
      
      // Then validate with server
      await initAuth();
    }
  }
});
