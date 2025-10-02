<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Invitar Artistas</h1>
            <p class="text-gray-400 mt-2">Invita artistas a participar en tu evento</p>
          </div>
          <NuxtLink
            :to="`/events/${eventId}`"
            class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ver Evento
          </NuxtLink>
        </div>
      </div>

      <!-- Event Info -->
      <div v-if="event" class="bg-gray-800 rounded-lg p-6 mb-8">
        <div class="flex items-start space-x-4">
          <img
            :src="$convertImageUrl(event.image_url) || 'https://via.placeholder.com/150x150/374151/FFFFFF?text=Event'"
            :alt="event.name"
            class="w-20 h-20 rounded-lg object-cover"
          />
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-white">{{ event.name }}</h2>
            <p class="text-gray-400 mt-1">{{ formatDate(event.date) }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ event.description }}</p>
            <div class="flex items-center mt-3 space-x-4 text-sm text-gray-400">
              <span>Capacidad: {{ event.max_artists }} artistas</span>
              <span>Invitaciones: {{ event.allow_invitations ? 'Permitidas' : 'No permitidas' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingEvent" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="eventError" class="bg-red-900 border border-red-700 rounded-lg p-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-200">{{ eventError }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="event" class="space-y-8">
        <!-- Invitation Selector -->
        <ArtistInviteSelector
          :event-id="eventId"
          @invitations-sent="handleInvitationsSent"
        />

        <!-- Current Invitations -->
        <InvitationManager
          :event-id="eventId"
          @invitation-cancelled="handleInvitationCancelled"
        />
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="fixed top-4 right-4 bg-green-900 border border-green-700 rounded-lg p-4 z-50">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-green-200">Invitaciones enviadas exitosamente</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEvents } from '~/composables/useEvents'

const route = useRoute()
const eventId = parseInt(route.params.id as string)

const { getEventById, isLoading: isLoadingEvent } = useEvents()
const event = ref<any>(null)
const eventError = ref<string | null>(null)
const showSuccessMessage = ref(false)

const loadEvent = async () => {
  try {
    eventError.value = null
    const data = await getEventById(eventId.toString())
    event.value = data
  } catch (err: any) {
    eventError.value = err.message || 'Error al cargar el evento'
  }
}

const handleInvitationsSent = () => {
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const handleInvitationCancelled = () => {
  // Refresh invitations if needed
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadEvent()
})

// Set page title
useHead({
  title: 'Invitar Artistas - Underground Venues'
})
</script>
