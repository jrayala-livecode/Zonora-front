import { ref } from 'vue'

export interface PendingVerification {
  id: number
  user_id: number
  rut: string
  full_name: string
  bank_account: string
  account_type: 'cuenta_vista' | 'cuenta_rut' | 'cuenta_corriente'
  bank_name: string
  verification_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  reviewed_at?: string
  reviewed_by?: number
  rejection_reason?: string
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
}

export interface VerificationDocuments {
  id_front: string
  id_back: string
  face_photo: string
}

export interface VerificationStats {
  total: number
  pending: number
  approved: number
  rejected: number
  pending_percentage: number
  approved_percentage: number
  rejected_percentage: number
}

const verifications = ref<PendingVerification[]>([])
const currentDocuments = ref<VerificationDocuments | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const stats = ref<VerificationStats | null>(null)
const pagination = ref<any>(null)

export const useAdminVerifications = () => {
  const { apiRequest } = useApiClient()

  const fetchPendingVerifications = async (page = 1) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRequest(`/verifications/pending?page=${page}`)
      const data = await response.json()
      
      verifications.value = data.data.data
      pagination.value = {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total
      }
      
      // Calculate stats
      calculateStats()
      
      return data.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch verifications'
      console.error('Error fetching verifications:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchDocuments = async (verificationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRequest(`/verifications/${verificationId}/documents`)
      const data = await response.json()
      
      currentDocuments.value = data.documents
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch documents'
      console.error('Error fetching documents:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const approveVerification = async (verificationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRequest(`/verifications/${verificationId}/approve`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      // Remove from pending list
      verifications.value = verifications.value.filter(v => v.id !== verificationId)
      
      // Recalculate stats
      calculateStats()
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to approve verification'
      console.error('Error approving verification:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const rejectVerification = async (verificationId: number, reason: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiRequest(`/verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
      
      const data = await response.json()
      
      // Remove from pending list
      verifications.value = verifications.value.filter(v => v.id !== verificationId)
      
      // Recalculate stats
      calculateStats()
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Failed to reject verification'
      console.error('Error rejecting verification:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const calculateStats = () => {
    const total = pagination.value?.total || verifications.value.length
    const pending = verifications.value.length
    
    stats.value = {
      total,
      pending,
      approved: 0, // These would come from a separate API endpoint
      rejected: 0,
      pending_percentage: total > 0 ? Math.round((pending / total) * 100) : 0,
      approved_percentage: 0,
      rejected_percentage: 0
    }
  }

  return {
    verifications,
    currentDocuments,
    isLoading,
    error,
    stats,
    pagination,
    fetchPendingVerifications,
    fetchDocuments,
    approveVerification,
    rejectVerification
  }
}



