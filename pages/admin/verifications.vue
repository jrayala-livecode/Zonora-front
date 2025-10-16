<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ClientOnly>
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Organizer <span class="text-orange-500">Verifications</span></h1>
            <p class="mt-2 text-gray-300">Review and approve organizer identity verifications</p>
          </div>
          <button
            @click="refreshVerifications"
            :disabled="isLoading"
            class="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg class="w-5 h-5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Reload</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-yellow-600">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-yellow-400">Pending Review</p>
                <p class="text-2xl font-bold text-yellow-300">{{ stats.pending }}</p>
                <p class="text-xs text-yellow-500 mt-1">Requires action</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-green-600">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-green-400">Approved</p>
                <p class="text-2xl font-bold text-green-300">{{ stats.approved }}</p>
                <p class="text-xs text-green-500 mt-1">All time</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-600">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-red-400">Rejected</p>
                <p class="text-2xl font-bold text-red-300">{{ stats.rejected }}</p>
                <p class="text-xs text-red-500 mt-1">All time</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && verifications.length === 0" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && verifications.length === 0" class="bg-gray-800 rounded-lg shadow-lg p-12 text-center border border-gray-700">
          <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">No Pending Verifications</h3>
          <p class="text-gray-400">All verifications have been reviewed!</p>
        </div>

        <!-- Verifications List -->
        <div v-else class="space-y-4">
          <div 
            v-for="verification in verifications" 
            :key="verification.id"
            class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden hover:border-orange-500 transition-colors"
          >
            <div class="p-6">
              <!-- Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">{{ verification.user.name }}</h3>
                    <p class="text-sm text-gray-400">{{ verification.user.email }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="inline-block px-3 py-1 bg-yellow-900 text-yellow-300 text-xs font-medium rounded-full border border-yellow-700">
                    Pending Review
                  </span>
                  <p class="text-xs text-gray-500 mt-1">
                    Submitted {{ formatDate(verification.created_at) }}
                  </p>
                </div>
              </div>

              <!-- Personal & Banking Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Personal Information -->
                <div class="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 class="text-sm font-semibold text-orange-400 mb-3">Personal Information</h4>
                  <div class="space-y-2">
                    <div>
                      <p class="text-xs text-gray-500">Full Name</p>
                      <p class="text-sm text-white">{{ verification.full_name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">RUT</p>
                      <p class="text-sm text-white">{{ verification.rut }}</p>
                    </div>
                  </div>
                </div>

                <!-- Banking Information -->
                <div class="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 class="text-sm font-semibold text-orange-400 mb-3">Banking Information</h4>
                  <div class="space-y-2">
                    <div>
                      <p class="text-xs text-gray-500">Bank Name</p>
                      <p class="text-sm text-white">{{ verification.bank_name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Account Type</p>
                      <p class="text-sm text-white">{{ formatAccountType(verification.account_type) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Account Number</p>
                      <p class="text-sm text-white font-mono">{{ verification.bank_account }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  @click="openDocumentsModal(verification)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Documents</span>
                </button>
                <button
                  @click="openRejectModal(verification)"
                  class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Reject</span>
                </button>
                <button
                  @click="handleApprove(verification)"
                  class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Approve</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="mt-8 flex justify-center">
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div class="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </div>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Documents Modal -->
        <div v-if="showDocumentsModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-700 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">Identity Documents</h3>
              <button 
                @click="closeDocumentsModal"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <div v-if="loadingDocuments" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
              <div v-else-if="currentDocuments" class="space-y-6">
                <div>
                  <h4 class="text-sm font-semibold text-orange-400 mb-3">ID Card - Front</h4>
                  <img :src="`data:image/jpeg;base64,${currentDocuments.id_front}`" alt="ID Front" class="w-full rounded-lg border border-gray-700" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-orange-400 mb-3">ID Card - Back</h4>
                  <img :src="`data:image/jpeg;base64,${currentDocuments.id_back}`" alt="ID Back" class="w-full rounded-lg border border-gray-700" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-orange-400 mb-3">Face Photo</h4>
                  <img :src="`data:image/jpeg;base64,${currentDocuments.face_photo}`" alt="Face Photo" class="w-full rounded-lg border border-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reject Modal -->
        <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div class="bg-gray-800 rounded-lg max-w-md w-full">
            <div class="p-6 border-b border-gray-700">
              <h3 class="text-xl font-bold text-white">Reject Verification</h3>
            </div>
            <div class="p-6">
              <p class="text-gray-300 mb-4">Please provide a reason for rejecting this verification:</p>
              <textarea
                v-model="rejectionReason"
                rows="4"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="e.g., Documents are not clear, information doesn't match..."
              ></textarea>
            </div>
            <div class="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                @click="closeRejectModal"
                class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmReject"
                :disabled="!rejectionReason.trim()"
                class="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Reject Verification
              </button>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminVerifications, type PendingVerification } from '~/composables/useAdminVerifications'
import { useModal } from '~/composables/useModal'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { 
  verifications, 
  currentDocuments, 
  isLoading, 
  stats, 
  pagination,
  fetchPendingVerifications, 
  fetchDocuments, 
  approveVerification, 
  rejectVerification 
} = useAdminVerifications()

const { showSuccess, showError } = useModal()

const showDocumentsModal = ref(false)
const showRejectModal = ref(false)
const loadingDocuments = ref(false)
const selectedVerification = ref<PendingVerification | null>(null)
const rejectionReason = ref('')

onMounted(() => {
  fetchPendingVerifications()
})

const refreshVerifications = async () => {
  await fetchPendingVerifications(pagination.value?.current_page || 1)
}

const changePage = async (page: number) => {
  await fetchPendingVerifications(page)
}

const openDocumentsModal = async (verification: PendingVerification) => {
  selectedVerification.value = verification
  showDocumentsModal.value = true
  loadingDocuments.value = true
  
  try {
    await fetchDocuments(verification.id)
  } catch (error) {
    showError('Error', 'Failed to load documents')
    closeDocumentsModal()
  } finally {
    loadingDocuments.value = false
  }
}

const closeDocumentsModal = () => {
  showDocumentsModal.value = false
  selectedVerification.value = null
}

const openRejectModal = (verification: PendingVerification) => {
  selectedVerification.value = verification
  rejectionReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedVerification.value = null
  rejectionReason.value = ''
}

const handleApprove = async (verification: PendingVerification) => {
  if (!confirm(`Are you sure you want to approve ${verification.user.name}'s verification?`)) {
    return
  }

  try {
    await approveVerification(verification.id)
    showSuccess('Verification Approved', `${verification.user.name} can now create in-app purchase events`)
  } catch (error) {
    showError('Error', 'Failed to approve verification')
  }
}

const confirmReject = async () => {
  if (!selectedVerification.value || !rejectionReason.value.trim()) {
    return
  }

  try {
    await rejectVerification(selectedVerification.value.id, rejectionReason.value)
    showSuccess('Verification Rejected', `${selectedVerification.value.user.name} has been notified`)
    closeRejectModal()
  } catch (error) {
    showError('Error', 'Failed to reject verification')
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

const formatAccountType = (type: string) => {
  const types: Record<string, string> = {
    'cuenta_vista': 'Cuenta Vista',
    'cuenta_rut': 'Cuenta RUT',
    'cuenta_corriente': 'Cuenta Corriente'
  }
  return types[type] || type
}
</script>

