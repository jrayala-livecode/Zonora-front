<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">Mis Invitaciones</h1>
        <p class="text-gray-400 mt-2">Gestiona las invitaciones que has recibido</p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700 mb-6">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'events'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'events'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            ]"
          >
            Event Invitations ({{ invitations.length }})
          </button>
          <button
            @click="activeTab = 'proposals'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'proposals'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            ]"
          >
            Proposal Invitations ({{ proposalInvitations.length }})
          </button>
        </nav>
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

      <!-- Event Invitations List -->
      <div v-else-if="activeTab === 'events' && invitations.length > 0" class="space-y-6">
        <div
          v-for="invitation in invitations"
          :key="`${invitation.id}-${forceUpdate}`"
          :id="`invitation-${invitation.id}`"
          :class="[
            'bg-gray-800 rounded-lg p-6 transition-all duration-2000 ease-in-out',
            {
              'opacity-0 transform -translate-y-4 scale-95': removingInvitations.has(invitation.id),
              'opacity-100 transform translate-y-0 scale-100': !removingInvitations.has(invitation.id),
              'ring-4 ring-orange-500 bg-orange-900/20 shadow-lg shadow-orange-500/25': highlightedInvitationId === invitation.id
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

      <!-- Event Invitations Empty State -->
      <div v-else-if="activeTab === 'events'" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-300 mb-2">No tienes invitaciones</h3>
        <p class="text-gray-400">Aún no has recibido invitaciones para eventos.</p>
      </div>

      <!-- Proposal Invitations Tab -->
      <div v-else-if="activeTab === 'proposals'">
        <div v-if="proposalInvitations.length > 0" class="space-y-6">
          <div
            v-for="invitation in proposalInvitations"
            :key="`proposal-${invitation.id}`"
            :id="`proposal-${invitation.id}`"
            class="bg-gray-800 rounded-lg p-6 transition-all"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white mb-2">{{ invitation.proposal_name }}</h3>
                <p class="text-gray-400 text-sm mb-2">
                  Organized by: <span class="text-orange-500 font-semibold">{{ invitation.organizer?.name }}</span>
                </p>
                <p v-if="invitation.proposal_description" class="text-gray-400 text-sm">
                  {{ invitation.proposal_description }}
                </p>
              </div>
              <span class="bg-blue-600 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase ml-4">
                Proposal
              </span>
            </div>

            <div v-if="invitation.message" class="mb-4 p-4 bg-gray-900 rounded-lg border-l-4 border-orange-500">
              <p class="text-sm text-gray-300 italic">"{{ invitation.message }}"</p>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-700">
              <p class="text-sm text-gray-500">
                Invited {{ formatDate(invitation.invited_at!) }}
              </p>
              <div class="flex space-x-3">
                <button
                  @click="acceptProposalInvitation(invitation.id, invitation.proposal_id)"
                  :disabled="isProcessing === invitation.id"
                  class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
                >
                  {{ isProcessing === invitation.id ? 'Accepting...' : '✓ Accept & Join Chat' }}
                </button>
                <button
                  @click="declineProposalInvitation(invitation.id)"
                  :disabled="isProcessing === invitation.id"
                  class="border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-400 px-6 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16">
          <div class="text-gray-500 mb-4 text-6xl">🤝</div>
          <h3 class="text-lg font-medium text-gray-300 mb-2">No proposal invitations</h3>
          <p class="text-gray-400">You haven't been invited to any event proposals yet.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useInvitations } from '~/composables/useInvitations'
import { useEventProposals } from '~/composables/useEventProposals'
import { useRouter } from 'vue-router'
import type { ProposalInvitation } from '~/composables/types/types'

const { getMyInvitations, isLoading, error } = useInvitations()
const { fetchProposalInvitations, acceptInvitation, declineInvitation } = useEventProposals()
const router = useRouter()

const invitations = ref<any[]>([])
const proposalInvitations = ref<ProposalInvitation[]>([])
const activeTab = ref<'events' | 'proposals'>('events')
const isProcessing = ref<number | null>(null)
const forceUpdate = ref(0)
const removingInvitations = ref<Set<number>>(new Set())
const highlightedInvitationId = ref<number | null>(null)

// Get route and query parameters
const route = useRoute()
const highlightId = route.query.highlight ? parseInt(route.query.highlight as string) : null

// Check if highlight is for a proposal
if (route.query.highlight && (route.query.highlight as string).startsWith('proposal_')) {
  activeTab.value = 'proposals'
}

const loadInvitations = async () => {
  try {
    const data = await getMyInvitations()
    // Ensure data is an array and filter out any null/undefined invitations
    invitations.value = Array.isArray(data) ? data.filter(inv => inv && inv.id) : []
    
    // Check if we need to highlight a specific invitation
    if (highlightId && invitations.value.length > 0) {
      const invitationExists = invitations.value.some(inv => inv.id === highlightId)
      if (invitationExists) {
        highlightedInvitationId.value = highlightId
        // Scroll to the highlighted invitation slowly after a delay
        await nextTick()
        setTimeout(() => {
          const element = document.getElementById(`invitation-${highlightId}`)
          if (element) {
            // Custom slow scroll implementation
            const targetPosition = element.offsetTop - (window.innerHeight / 2) + (element.offsetHeight / 2)
            const startPosition = window.pageYOffset
            const distance = targetPosition - startPosition
            const duration = 2000 // 2 seconds for slow scroll
            let start = null

            const slowScroll = (timestamp) => {
              if (!start) start = timestamp
              const progress = timestamp - start
              const progressRatio = Math.min(progress / duration, 1)
              
              // Easing function for smooth deceleration
              const easeOutCubic = 1 - Math.pow(1 - progressRatio, 3)
              const currentPosition = startPosition + (distance * easeOutCubic)
              
              window.scrollTo(0, currentPosition)
              
              if (progress < duration) {
                requestAnimationFrame(slowScroll)
              }
            }
            
            requestAnimationFrame(slowScroll)
          }
        }, 1000) // Initial delay before starting scroll
      }
    }
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

// Watch for route changes to handle highlight parameter
watch(() => route.query.highlight, (newHighlight) => {
  if (newHighlight) {
    const newHighlightId = parseInt(newHighlight as string)
    if (newHighlightId && invitations.value.length > 0) {
      const invitationExists = invitations.value.some(inv => inv.id === newHighlightId)
      if (invitationExists) {
        highlightedInvitationId.value = newHighlightId
        // Scroll to the highlighted invitation slowly
        nextTick(() => {
          setTimeout(() => {
            const element = document.getElementById(`invitation-${newHighlightId}`)
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              })
            }
          }, 800) // Slower scroll for route changes too
        })
      }
    }
  }
}, { immediate: true })

const loadProposalInvitations = async () => {
  try {
    const data = await fetchProposalInvitations()
    proposalInvitations.value = data || []
  } catch (err) {
    console.error('Failed to load proposal invitations:', err)
  }
}

const acceptProposalInvitation = async (invitationId: number, proposalId: number) => {
  isProcessing.value = invitationId
  try {
    await acceptInvitation(invitationId)
    proposalInvitations.value = proposalInvitations.value.filter(inv => inv.id !== invitationId)
    
    // Redirect to the proposal
    router.push(`/event-proposals/${proposalId}`)
  } catch (err: any) {
    console.error('Error accepting proposal invitation:', err)
    const { showError } = useModal()
    showError('Error', 'Failed to accept proposal invitation')
  } finally {
    isProcessing.value = null
  }
}

const declineProposalInvitation = async (invitationId: number) => {
  isProcessing.value = invitationId
  try {
    await declineInvitation(invitationId)
    proposalInvitations.value = proposalInvitations.value.filter(inv => inv.id !== invitationId)
    
    const { showSuccess } = useModal()
    showSuccess('Invitation Declined', 'The proposal invitation has been declined.')
  } catch (err: any) {
    console.error('Error declining proposal invitation:', err)
    const { showError } = useModal()
    showError('Error', 'Failed to decline proposal invitation')
  } finally {
    isProcessing.value = null
  }
}

onMounted(async () => {
  await Promise.all([
    loadInvitations(),
    loadProposalInvitations()
  ])
})

// Set page title
useHead({
  title: 'Mis Invitaciones - Underground Venues'
})
</script>
