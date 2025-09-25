
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      id: number;
      name: string;
      email: string;
      avatar?: string;
      description?: string;
      joinedAt?: string;
    },
    token: null as string | null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },
  actions: {
    setUser(user: any) {
      this.user = user;
      if (process.client) {
        localStorage.setItem('zonora_user', JSON.stringify(user));
      }
    },
    setToken(token: string | null) {
      this.token = token;
      if (process.client) {
        if (token) {
          localStorage.setItem('zonora_token', token);
        } else {
          localStorage.removeItem('zonora_token');
        }
      }
    },
    setInitialized(initialized: boolean) {
      this.initialized = initialized;
    },
    clearAuth() {
      this.user = null;
      this.token = null;
      this.initialized = false;
      if (process.client) {
        localStorage.removeItem('zonora_user');
        localStorage.removeItem('zonora_token');
      }
    },
    initializeFromStorage() {
      if (process.client) {
        try {
          const storedUser = localStorage.getItem('zonora_user');
          const storedToken = localStorage.getItem('zonora_token');
          
          if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            this.user = parsedUser;
            this.token = storedToken;
          }
        } catch (error) {
          console.error('Error loading auth data from storage:', error);
          this.clearAuth();
        }
      }
    },
  },
});

