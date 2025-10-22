import { ref } from 'vue'
import type { VenueClaim } from './types/types'

const claims = ref<VenueClaim[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useVenueClaims = () => {
  /**
   * Submit a venue claim
   */
  const submitClaim = async (venueId: number, documents: File[], notes?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('venue_id', venueId.toString())
      
      documents.forEach((document) => {
        formData.append('documents[]', document)
      })

      if (notes) {
        formData.append('notes', notes)
      }

      const { apiRequest } = useApiClient()
      const response = await apiRequest('/venue-claims', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al enviar el reclamo')
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
   * Get user's venue claims
   */
  const getMyClaims = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest('/venue-claims/my-claims')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener reclamos')
      }

      const data = await response.json()
      claims.value = data.data
      return data.data
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get a specific claim
   */
  const getClaim = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`/venue-claims/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener el reclamo')
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

  /**
   * Cancel a pending claim
   */
  const cancelClaim = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest(`/venue-claims/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cancelar el reclamo')
      }

      // Remove from claims array
      claims.value = claims.value.filter(c => c.id !== id)

      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    claims,
    isLoading,
    error,
    submitClaim,
    getMyClaims,
    getClaim,
    cancelClaim
  }
}


