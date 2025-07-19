
import { defineStore } from 'pinia'



export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      id: number;
      name: string;
      email: string;
      avatar?: string;
      joinedAt?: string;
    },
    token: null as string | null,
  }),
  actions: {
    setUser(user: any) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
  },
});

