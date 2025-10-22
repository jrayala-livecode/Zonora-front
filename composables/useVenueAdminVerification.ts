import { ref } from 'vue'
import type { VenueAdminVerification } from './types/types'

const verification = ref<VenueAdminVerification | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useVenueAdminVerification = () => {
  const { apiRequest } = useApiClient()

  /**
   * Submit venue admin verification
   */
  const submitVerification = async (formData: FormData) => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest('/venue-admin/verify', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al enviar la verificación')
      }

      const data = await response.json()
      verification.value = data.data
      return { success: true, data: data.data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get verification status
   */
  const getVerificationStatus = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { apiRequest } = useApiClient()
      const response = await apiRequest('/venue-admin/verification-status')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener el estado de verificación')
      }

      const data = await response.json()
      verification.value = data.data
      return data.data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if user is verified
   */
  const isVerified = computed(() => {
    return verification.value?.verification_status === 'approved'
  })

  /**
   * Check if verification is pending
   */
  const isPending = computed(() => {
    return verification.value?.verification_status === 'pending'
  })

  /**
   * Check if verification is rejected
   */
  const isRejected = computed(() => {
    return verification.value?.verification_status === 'rejected'
  })

  return {
    verification,
    isLoading,
    error,
    isVerified,
    isPending,
    isRejected,
    submitVerification,
    getVerificationStatus
  }
}


