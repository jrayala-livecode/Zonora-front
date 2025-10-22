<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Gestionar Evento</h1>
            <p class="text-gray-400 mt-2">Edita tu evento y gestiona las invitaciones</p>
          </div>
          <div class="flex space-x-3">
            <NuxtLink
              :to="`/events/${eventId}`"
              class="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Evento
            </NuxtLink>
            <NuxtLink
              :to="`/events/${eventId}/invite`"
              class="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Invitar Artistas
            </NuxtLink>
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
        <!-- Event Info Card -->
        <div class="bg-gray-800 rounded-lg p-6">
          <div class="flex items-start space-x-6">
            <img
              :src="$convertImageUrl(event.image_url) || 'https://via.placeholder.com/200x200/374151/FFFFFF?text=Event'"
              :alt="event.name"
              class="w-32 h-32 rounded-lg object-cover"
            />
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-white">{{ event.name }}</h2>
              <p class="text-gray-400 mt-2">{{ formatDate(event.date) }}</p>
              <p class="text-gray-300 mt-3">{{ event.description }}</p>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Capacidad</div>
                  <div class="text-lg font-semibold text-white">{{ event.max_artists }} artistas</div>
                </div>
                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Invitaciones</div>
                  <div class="text-lg font-semibold text-white">
                    {{ event.allow_invitations ? 'Permitidas' : 'No permitidas' }}
                  </div>
                </div>
                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Artistas Actuales</div>
                  <div class="text-lg font-semibold text-white">{{ event.artists?.length || 0 }}</div>
                </div>
                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Estado</div>
                  <div class="text-lg font-semibold text-white">
                    <span :class="event.hidden ? 'text-red-400' : 'text-green-400'">
                      {{ event.hidden ? 'Oculto' : 'Visible' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-gray-800 rounded-lg">
          <div class="border-b border-gray-700">
            <nav class="flex space-x-8 px-6">
              <button
                @click="activeTab = 'invitations'"
                :class="activeTab === 'invitations' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-300'"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              >
                Invitaciones
              </button>
              <button
                @click="activeTab = 'analytics'"
                :class="activeTab === 'analytics' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-300'"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              >
                Analíticas
              </button>
              <button
                @click="activeTab = 'edit'"
                :class="activeTab === 'edit' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-gray-300'"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              >
                Editar Evento
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- Invitations Tab -->
            <div v-if="activeTab === 'invitations'">
              <InvitationManager
                :event-id="eventId"
                @invitation-cancelled="handleInvitationCancelled"
              />
            </div>

            <!-- Analytics Tab -->
            <div v-else-if="activeTab === 'analytics'">
              <EventShareAnalytics :event-id="eventId" />
            </div>

            <!-- Edit Tab -->
            <div v-else-if="activeTab === 'edit'">
              <div class="text-center py-12">
                <div class="text-gray-400 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-300 mb-2">Edición de Eventos</h3>
                <p class="text-gray-400 mb-6">La funcionalidad de edición de eventos estará disponible próximamente.</p>
                <NuxtLink
                  to="/create"
                  class="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Crear Nuevo Evento
                </NuxtLink>
              </div>
            </div>
          </div>
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
const activeTab = ref('invitations')

const loadEvent = async () => {
  try {
    eventError.value = null
    const data = await getEventById(eventId.toString())
    event.value = data
  } catch (err: any) {
    eventError.value = err.message || 'Error al cargar el evento'
  }
}

const handleInvitationCancelled = () => {
  // Refresh event data if needed
  loadEvent()
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
  title: 'Gestionar Evento - Underground Venues'
})
</script>
