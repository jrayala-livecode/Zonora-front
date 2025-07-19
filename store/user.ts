
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      id: number
      name: string
      email: string
      avatar?: string
      joinedAt?: string
    },
    token: null as null | string
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    setToken(token: string) {
      this.token = token
    },
    logout() {
      this.user = null
      this.token = null
    }
  }
})
