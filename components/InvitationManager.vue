<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-white">Gestionar Invitaciones</h3>
      <div class="text-sm text-gray-400">
        {{ invitations.length }} invitación{{ invitations.length !== 1 ? 'es' : '' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>

    <!-- Invitations List -->
    <div v-else-if="invitations.length > 0" class="space-y-4">
      <div
        v-for="invitation in invitations"
        :key="invitation.id"
        class="bg-gray-700 rounded-lg p-4"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-4">
            <img
              :src="$convertImageUrl(invitation.artist.profile_picture_url) || 'https://www.gravatar.com/avatar/default?d=identicon&s=64'"
              :alt="invitation.artist.stage_name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div class="flex-1">
              <h4 class="text-white font-medium">{{ invitation.artist.stage_name }}</h4>
              <p class="text-sm text-gray-400">{{ invitation.artist.genres?.join(', ') || 'Sin géneros' }}</p>
              <p class="text-xs text-gray-500 mt-1">
                Invitado el {{ formatDate(invitation.invited_at) }}
              </p>
              <p v-if="invitation.message" class="text-sm text-gray-300 mt-2 italic">
                "{{ invitation.message }}"
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Status Badge -->
            <span
              :class="getStatusBadgeClass(invitation.status)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ getStatusText(invitation.status) }}
            </span>
            
            <!-- Actions -->
            <div v-if="invitation.status === 'pending'" class="flex space-x-2">
              <button
                @click="cancelInvitation(invitation.id)"
                :disabled="isCancelling === invitation.id"
                class="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                title="Cancelar invitación"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div v-else-if="invitation.status === 'accepted'" class="text-green-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div v-else-if="invitation.status === 'rejected'" class="text-red-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-300 mb-2">No hay invitaciones</h4>
      <p class="text-gray-400">Aún no has enviado invitaciones para este evento.</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
      <p class="text-red-200 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInvitations } from '~/composables/useInvitations'

interface Artist {
  id: number
  stage_name: string
  genres: string[]
  profile_picture_url: string | null
}

interface Invitation {
  id: number
  event_id: number
  artist_id: number
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  invited_at: string
  responded_at: string | null
  message: string | null
  artist: Artist
}

interface Props {
  eventId: number
  onInvitationCancelled?: () => void
}

const props = defineProps<Props>()

const { getEventInvitations, cancelInvitation, isLoading, error } = useInvitations()
const invitations = ref<Invitation[]>([])
const isCancelling = ref<number | null>(null)

const loadInvitations = async () => {
  try {
    const data = await getEventInvitations(props.eventId)
    invitations.value = data
  } catch (err: any) {
    console.error('Error loading invitations:', err)
    
    // Show error modal that auto-closes after 2 seconds
    const { showError } = useModal()
    showError('Error al cargar invitaciones', err.message || 'Ocurrió un error inesperado')
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      const modal = document.querySelector('.modal-overlay')
      if (modal) {
        modal.remove()
      }
    }, 2000)
  }
}

const cancelInvitationHandler = async (invitationId: number) => {
  try {
    isCancelling.value = invitationId
    await cancelInvitation(invitationId)
    
    // Remove from local list
    invitations.value = invitations.value.filter(inv => inv.id !== invitationId)
    
    // Notify parent component
    if (props.onInvitationCancelled) {
      props.onInvitationCancelled()
    }
  } catch (err: any) {
    console.error('Error cancelling invitation:', err)
    
    // Show error modal that auto-closes after 2 seconds
    const { showError } = useModal()
    showError('Error al cancelar invitación', err.message || 'Ocurrió un error inesperado')
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      const modal = document.querySelector('.modal-overlay')
      if (modal) {
        modal.remove()
      }
    }, 2000)
  } finally {
    isCancelling.value = null
  }
}

const getStatusText = (status: string) => {
  const statusMap = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    cancelled: 'Cancelada'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getStatusBadgeClass = (status: string) => {
  const classMap = {
    pending: 'bg-yellow-900 text-yellow-200',
    accepted: 'bg-green-900 text-green-200',
    rejected: 'bg-red-900 text-red-200',
    cancelled: 'bg-gray-900 text-gray-200'
  }
  return classMap[status as keyof typeof classMap] || 'bg-gray-900 text-gray-200'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadInvitations()
})

// Expose refresh method for parent component
defineExpose({
  refresh: loadInvitations
})
</script>
