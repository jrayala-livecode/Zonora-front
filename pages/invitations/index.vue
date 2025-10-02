<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">Mis Invitaciones</h1>
        <p class="text-gray-400 mt-2">Gestiona las invitaciones que has recibido para eventos</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900 border border-red-700 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-200">{{ error }}</p>
        </div>
      </div>

      <!-- Invitations List -->
      <div v-else-if="invitations.length > 0" class="space-y-6">
        <div
          v-for="invitation in invitations"
          :key="`${invitation.id}-${forceUpdate}`"
          :class="[
            'bg-gray-800 rounded-lg p-6 transition-all duration-2000 ease-in-out',
            {
              'opacity-0 transform -translate-y-4 scale-95': removingInvitations.has(invitation.id),
              'opacity-100 transform translate-y-0 scale-100': !removingInvitations.has(invitation.id)
            }
          ]"
        >
          <div class="flex items-start space-x-4">
            <!-- Event Image -->
            <img
              :src="$convertImageUrl(invitation.event?.image_url) || 'https://via.placeholder.com/120x120/374151/FFFFFF?text=Event'"
              :alt="invitation.event?.name || 'Evento'"
              class="w-24 h-24 rounded-lg object-cover"
            />
            
            <!-- Event Info -->
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-xl font-semibold text-white">{{ invitation.event?.name || 'Evento sin título' }}</h3>
                  <p class="text-gray-400 mt-1">{{ formatDate(invitation.event?.date || '') }}</p>
                  <p class="text-sm text-gray-500 mt-2">{{ invitation.event?.description || 'Sin descripción' }}</p>
                  
                  <!-- Invitation Details -->
                  <div class="mt-4 p-4 bg-gray-700 rounded-lg">
                    <div class="flex items-center space-x-4 text-sm">
                      <span class="text-gray-400">Invitado por:</span>
                      <span class="text-white font-medium">{{ invitation.invitedBy?.name || 'Usuario desconocido' }}</span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm mt-2">
                      <span class="text-gray-400">Artista:</span>
                      <span class="text-white font-medium">{{ invitation.artist?.stage_name || 'Artista desconocido' }}</span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm mt-2">
                      <span class="text-gray-400">Fecha de invitación:</span>
                      <span class="text-white">{{ formatDate(invitation.invited_at || '') }}</span>
                    </div>
                    <p v-if="invitation.message" class="text-sm text-gray-300 mt-3 italic">
                      "{{ invitation.message }}"
                    </p>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex flex-col space-y-2 ml-4">
                  <button
                    @click="showAcceptConfirm(invitation.id)"
                    :disabled="isProcessing === invitation.id || removingInvitations.has(invitation.id)"
                    class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {{ isProcessing === invitation.id ? 'Procesando...' : (removingInvitations.has(invitation.id) ? 'Eliminando...' : 'Aceptar') }}
                  </button>
                  <button
                    @click="showRejectConfirm(invitation.id)"
                    :disabled="isProcessing === invitation.id || removingInvitations.has(invitation.id)"
                    class="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {{ removingInvitations.has(invitation.id) ? 'Eliminando...' : 'Rechazar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-300 mb-2">No tienes invitaciones</h3>
        <p class="text-gray-400">Aún no has recibido invitaciones para eventos.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useInvitations } from '~/composables/useInvitations'

const { getMyInvitations, isLoading, error } = useInvitations()
const invitations = ref([])
const isProcessing = ref<number | null>(null)
const forceUpdate = ref(0)
const removingInvitations = ref<Set<number>>(new Set())

const loadInvitations = async () => {
  try {
    const data = await getMyInvitations()
    // Ensure data is an array and filter out any null/undefined invitations
    invitations.value = Array.isArray(data) ? data.filter(inv => inv && inv.id) : []
  } catch (err) {
    console.error('Error loading invitations:', err)
    invitations.value = []
  }
}

const showAcceptConfirm = (invitationId: number) => {
  const { showModal } = useModal()
  showModal({
    title: '¿Aceptar Invitación?',
    message: '¿Estás seguro de que quieres aceptar esta invitación?',
    type: 'info',
    showCancel: true,
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    onConfirm: () => {
      acceptInvitationHandler(invitationId)
    }
  })
}

const acceptInvitationHandler = async (invitationId: number) => {
  try {
    isProcessing.value = invitationId
    
    // Remove from local list immediately
    const index = invitations.value.findIndex(inv => inv.id === invitationId)
    
    if (index > -1) {
      // Start animation
      removingInvitations.value.add(invitationId)
      
      // Wait for animation to complete (2 seconds)
      setTimeout(() => {
        const actualIndex = invitations.value.findIndex(inv => inv.id === invitationId)
        if (actualIndex > -1) {
          invitations.value.splice(actualIndex, 1)
          // Force re-render
          forceUpdate.value++
        }
        // Remove from animation set
        removingInvitations.value.delete(invitationId)
      }, 2000)
      
      // Show success modal immediately
      const { showSuccess } = useModal()
      showSuccess('¡Invitación Aceptada!', 'Has aceptado la invitación exitosamente.')
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        const modal = document.querySelector('.modal-overlay')
        if (modal) {
          modal.remove()
        }
      }, 2000)
    } else {
      console.error('Invitation not found in local array!')
      const { showError } = useModal()
      showError('Error', 'Invitación no encontrada en la lista local.')
    }
  } catch (err: any) {
    console.error('Error accepting invitation:', err)
    const { showError } = useModal()
    showError('Error', 'Ocurrió un error inesperado.')
  } finally {
    isProcessing.value = null
  }
}

const showRejectConfirm = (invitationId: number) => {
  const { showModal } = useModal()
  showModal({
    title: '¿Rechazar Invitación?',
    message: '¿Estás seguro de que quieres rechazar esta invitación?',
    type: 'warning',
    showCancel: true,
    confirmText: 'Rechazar',
    cancelText: 'Cancelar',
    onConfirm: () => {
      rejectInvitationHandler(invitationId)
    }
  })
}

const rejectInvitationHandler = async (invitationId: number) => {
  try {
    isProcessing.value = invitationId
    
    // Remove from local list immediately
    const index = invitations.value.findIndex(inv => inv.id === invitationId)
    
    if (index > -1) {
      // Start animation
      removingInvitations.value.add(invitationId)
      
      // Wait for animation to complete (2 seconds)
      setTimeout(() => {
        const actualIndex = invitations.value.findIndex(inv => inv.id === invitationId)
        if (actualIndex > -1) {
          invitations.value.splice(actualIndex, 1)
          // Force re-render
          forceUpdate.value++
        }
        // Remove from animation set
        removingInvitations.value.delete(invitationId)
      }, 2000)
      
      // Show success modal immediately
      const { showSuccess } = useModal()
      showSuccess('Invitación Rechazada', 'Has rechazado la invitación.')
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        const modal = document.querySelector('.modal-overlay')
        if (modal) {
          modal.remove()
        }
      }, 2000)
    } else {
      console.error('Invitation not found in local array!')
      const { showError } = useModal()
      showError('Error', 'Invitación no encontrada en la lista local.')
    }
  } catch (err: any) {
    console.error('Error rejecting invitation:', err)
    const { showError } = useModal()
    showError('Error', 'Ocurrió un error inesperado.')
  } finally {
    isProcessing.value = null
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha no disponible'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

onMounted(() => {
  loadInvitations()
})

// Set page title
useHead({
  title: 'Mis Invitaciones - Underground Venues'
})
</script>
