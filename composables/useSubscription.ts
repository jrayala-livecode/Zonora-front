import { ref } from 'vue'

export const useSubscription = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Subscribe user to platform (no payment - temporary)
   */
  const subscribe = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest('/subscription/subscribe', {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al suscribirse')
      }

      const data = await response.json()
      return { success: true, data: data.data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Unsubscribe user from platform
   */
  const unsubscribe = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest('/subscription/unsubscribe', {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cancelar suscripción')
      }

      const data = await response.json()
      return { success: true, data: data.data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get subscription status
   */
  const getStatus = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest('/subscription/status')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener estado de suscripción')
      }

      const data = await response.json()
      return data.data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    subscribe,
    unsubscribe,
    getStatus
  }
}

