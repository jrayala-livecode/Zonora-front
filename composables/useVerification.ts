import { ref } from 'vue'

export interface VerificationStatus {
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  is_verified: boolean
  message?: string
  submitted_at?: string
  reviewed_at?: string
  rejection_reason?: string
}

export interface VerificationForm {
  rut: string
  full_name: string
  bank_account: string
  account_type: 'cuenta_vista' | 'cuenta_rut' | 'cuenta_corriente'
  bank_name: string
  id_front: File | null
  id_back: File | null
  face_photo: File | null
}

const verificationStatus = ref<VerificationStatus | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useVerification = () => {
  const { apiRequest } = useApiClient()

  const checkVerificationStatus = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRequest('/verification/status')
      verificationStatus.value = await response.json()
      return verificationStatus.value
    } catch (err) {
      error.value = 'Failed to check verification status'
      console.error('Verification status error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const submitVerification = async (formData: FormData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRequest('/verification/submit', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      // Refresh verification status
      await checkVerificationStatus()
      
      return result
    } catch (err) {
      error.value = 'Failed to submit verification'
      console.error('Verification submission error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const isVerificationRequired = () => {
    return verificationStatus.value?.status === 'not_submitted' || 
           verificationStatus.value?.status === 'rejected'
  }

  const isVerificationPending = () => {
    return verificationStatus.value?.status === 'pending'
  }

  const isVerificationApproved = () => {
    return verificationStatus.value?.status === 'approved' && 
           verificationStatus.value?.is_verified === true
  }

  return {
    verificationStatus,
    isLoading,
    error,
    checkVerificationStatus,
    submitVerification,
    isVerificationRequired,
    isVerificationPending,
    isVerificationApproved
  }
}
