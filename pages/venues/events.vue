<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Eventos por Venue</h1>
        <p class="text-gray-400">Explora todos los eventos organizados por venue</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-400 mb-4">{{ error }}</div>
        <button 
          @click="fetchAllVenueEvents" 
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Reintentar
        </button>
      </div>

      <!-- Content -->
      <div v-else-if="venueEvents.length > 0" class="space-y-8">
        <div
          v-for="venue in venueEvents"
          :key="venue.id"
          class="bg-gray-800 rounded-lg overflow-hidden"
        >
          <!-- Venue Header -->
          <div class="p-6 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold text-white mb-2">{{ venue.name }}</h2>
                <div class="flex items-center text-gray-400 text-sm mb-2">
                  <MapPin class="w-4 h-4 mr-1" />
                  <span>{{ venue.address }}</span>
                </div>
                <div class="flex items-center text-gray-400 text-sm">
                  <Calendar class="w-4 h-4 mr-1" />
                  <span>{{ venue.events_count }} evento{{ venue.events_count !== 1 ? 's' : '' }}</span>
                </div>
              </div>
              <NuxtLink
                :to="`/venues/${venue.id}`"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Ver Venue
              </NuxtLink>
            </div>
          </div>

          <!-- Events List -->
          <div class="p-6">
            <div v-if="venue.events && venue.events.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="event in venue.events"
                :key="event.id"
                class="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors duration-200"
              >
                <!-- Event Image Placeholder -->
                <div class="h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                  <Calendar class="w-8 h-8 text-white opacity-70" />
                </div>

                <!-- Event Info -->
                <div>
                  <h3 class="text-white font-medium mb-2 line-clamp-1">{{ event.name }}</h3>
                  <p class="text-gray-400 text-sm mb-2 line-clamp-2">{{ event.description }}</p>
                  
                  <!-- Event Date -->
                  <div class="flex items-center text-gray-400 text-sm mb-2">
                    <Calendar class="w-4 h-4 mr-1" />
                    <span>{{ formatEventDate(event.date) }}</span>
                  </div>

                  <!-- Event Price -->
                  <div v-if="event.price_range" class="flex items-center text-gray-400 text-sm mb-3">
                    <span class="text-green-400 font-medium">{{ event.price_range }}</span>
                  </div>

                  <!-- Event Actions -->
                  <div class="flex gap-2">
                    <NuxtLink
                      :to="`/events/${event.id}`"
                      class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                    >
                      Ver Evento
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Events -->
            <div v-else class="text-center py-8">
              <Calendar class="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p class="text-gray-400">No hay eventos programados para este venue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Calendar class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-400 mb-2">No se encontraron eventos</h2>
        <p class="text-gray-500">No hay eventos disponibles en este momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Calendar } from 'lucide-vue-next'

// Meta
definePageMeta({
  title: 'Eventos por Venue'
})

// Composables
const { fetchVenues } = useVenues()

// State
const loading = ref(true)
const error = ref(null)
const venueEvents = ref([])

// Fetch all venue events
const fetchAllVenueEvents = async () => {
  loading.value = true
  error.value = null
  
  try {
    // First get all venues
    const venuesResponse = await fetchVenues({ per_page: 50 })
    
    if (venuesResponse && venuesResponse.data) {
      const venuesWithEvents = []
      
      // Fetch events for each venue
      for (const venue of venuesResponse.data) {
        try {
          const eventsResponse = await $fetch(`/venues/${venue.id}/events`, {
            baseURL: 'http://127.0.0.1:8000/api'
          })
          
          if (eventsResponse && eventsResponse.data && eventsResponse.data.length > 0) {
            venuesWithEvents.push({
              id: venue.id,
              name: venue.name,
              address: venue.address,
              events: eventsResponse.data,
              events_count: eventsResponse.events_count
            })
          }
        } catch (err) {
          console.warn(`Could not fetch events for venue ${venue.id}:`, err)
        }
      }
      
      venueEvents.value = venuesWithEvents
    }
  } catch (err) {
    error.value = 'Error al cargar los eventos'
    console.error('Error fetching venue events:', err)
  } finally {
    loading.value = false
  }
}

// Utility functions
const formatEventDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch data on mount
onMounted(() => {
  fetchAllVenueEvents()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
