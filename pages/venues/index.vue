<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Venues</h1>
        <p class="text-gray-400 text-lg">
          Descubre los mejores espacios para eventos en tu ciudad
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar venues..."
              class="input-field w-full pl-10"
              v-model="searchQuery"
              @input="handleSearch"
            />
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          <!-- View Mode Toggle -->
          <div class="flex bg-gray-700 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              <Grid3X3 class="w-4 h-4 mr-1" />
              Grid
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              <List class="w-4 h-4 mr-1" />
              Lista
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
          <p class="text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Venues Grid -->
      <div v-else-if="hasVenues">
        <div 
          :class="[
            'grid gap-6',
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          ]"
        >
          <VenueCard
            v-for="venue in venues"
            :key="venue.id"
            :venue="venue"
            @view-events="handleViewEvents"
          />
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            
            <span class="px-4 py-2 text-gray-300">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <MapPin class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-400 mb-2">No se encontraron venues</h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery ? 'No hay venues que coincidan con tu búsqueda.' : 'No hay venues disponibles en este momento.' }}
        </p>
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200"
        >
          Limpiar búsqueda
        </button>
      </div>
    </div>

    <!-- Events Modal -->
    <AppModal
      v-model="showEventsModal"
      title="Eventos del Venue"
      size="lg"
    >
      <div v-if="selectedVenue">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-white mb-2">{{ selectedVenue.name }}</h3>
          <p class="text-gray-400">{{ selectedVenue.address }}</p>
        </div>
        
        <div v-if="venueEvents.length > 0" class="space-y-4">
          <div
            v-for="event in venueEvents"
            :key="event.id"
            class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-white font-medium">{{ event.name }}</h4>
                <p class="text-gray-400 text-sm">{{ formatEventDate(event.date) }}</p>
              </div>
              <NuxtLink
                :to="`/events/${event.id}`"
                class="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                Ver evento
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <Calendar class="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400">No hay eventos programados para este venue</p>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { Search, Grid3X3, List, AlertCircle, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-vue-next'

// Meta
definePageMeta({
  title: 'Venues'
})

// Composables
const { venues, loading, error, pagination, fetchVenues, searchVenues, getVenueEvents, hasVenues, totalPages, currentPage, totalVenues } = useVenues()

// State
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const showEventsModal = ref(false)
const selectedVenue = ref(null)
const venueEvents = ref([])
const searchTimeout = ref(null)

// Fetch venues on mount
onMounted(() => {
  fetchVenues({ per_page: 12 })
})

// Search handling with debounce
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim()) {
      await searchVenues(searchQuery.value, { per_page: 12 })
    } else {
      await fetchVenues({ per_page: 12 })
    }
  }, 500)
}

// Pagination
const changePage = async (page: number) => {
  if (searchQuery.value.trim()) {
    await searchVenues(searchQuery.value, { page, per_page: 12 })
  } else {
    await fetchVenues({ page, per_page: 12 })
  }
}

// View events for venue
const handleViewEvents = async (venue) => {
  selectedVenue.value = venue
  showEventsModal.value = true
  
  try {
    const response = await getVenueEvents(venue.id)
    if (response) {
      venueEvents.value = response.data
    }
  } catch (err) {
    console.error('Error fetching venue events:', err)
    venueEvents.value = []
  }
}

// Clear search
const clearSearch = async () => {
  searchQuery.value = ''
  await fetchVenues({ per_page: 12 })
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
</script>

<style scoped>
.input-field {
  @apply bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-200;
}
</style>
