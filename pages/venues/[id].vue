<template>
  <div class="min-h-screen bg-gray-900">
    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <!-- Venue Details -->
      <div v-else-if="venue" class="space-y-6">
        <!-- Back Button -->
        <div class="mb-6">
          <NuxtLink
            to="/venues"
            class="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            Volver a Venues
          </NuxtLink>
        </div>

        <!-- Header -->
        <div class="bg-gray-800 rounded-lg p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-white mb-2">{{ venue.name }}</h1>
              <div class="flex items-center text-gray-400 mb-2">
                <MapPin class="w-5 h-5 mr-2" />
                <span>{{ venue.address }}</span>
              </div>
              <div v-if="venue.comuna" class="flex items-center text-gray-400">
                <Globe class="w-4 h-4 mr-2" />
                <span>{{ venue.comuna.nombre }}</span>
              </div>
            </div>
            
            <!-- Status Badge -->
            <div class="flex-shrink-0">
              <span 
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-full',
                  venue.is_visible 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-gray-700 text-gray-400'
                ]"
              >
                {{ venue.is_visible ? 'Visible' : 'Oculto' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p v-if="venue.description" class="text-gray-300 text-lg leading-relaxed">
            {{ venue.description }}
          </p>
        </div>

        <!-- Profile Picture -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <div class="w-6 h-6 bg-purple-600 rounded-sm flex items-center justify-center mr-3" aria-hidden="true">
              <span class="text-white font-bold text-sm">📷</span>
            </div>
            Imagen del Venue
          </h2>
          
          <div class="max-w-2xl mx-auto">
            <div class="aspect-video bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                v-if="venue.profile_picture && !imageLoadFailed"
                :src="venue.profile_picture"
                :alt="`Imagen de ${venue.name}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <!-- Fallback when image fails or doesn't exist -->
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
              >
                <div class="text-center">
                  <MapPin class="w-16 h-16 text-white opacity-70 mx-auto mb-4" />
                  <p class="text-white text-lg opacity-70">Sin Imagen</p>
                  <p class="text-white text-sm opacity-50 mt-2">No hay imagen disponible para este venue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div v-if="venue.latitude && venue.longitude" class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <MapPin class="w-5 h-5 mr-2" />
            Ubicación
          </h2>
          <div class="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
            <MapLeaflet 
              :lat="venue.latitude" 
              :lng="venue.longitude"
            />
          </div>
        </div>

        <!-- Owner Information -->
        <div v-if="venue.user" class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <User class="w-5 h-5 mr-2" />
            Información del Propietario
          </h2>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
              <User class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-white font-medium">{{ venue.user.name }}</p>
              <p class="text-gray-400 text-sm">{{ venue.user.email }}</p>
            </div>
          </div>
        </div>

        <!-- Hashtags -->
        <div v-if="venue.hashtags && venue.hashtags.length > 0" class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <Hash class="w-5 h-5 mr-2" />
            Etiquetas
          </h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="hashtag in venue.hashtags" 
              :key="hashtag"
              class="px-3 py-1 bg-purple-900 text-purple-300 text-sm rounded-full"
            >
              {{ hashtag }}
            </span>
          </div>
        </div>

        <!-- Interest Links -->
        <div v-if="venue.interest_links && venue.interest_links.length > 0" class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <Link class="w-5 h-5 mr-2" />
            Enlaces de Interés
          </h2>
          <div class="space-y-2">
            <a
              v-for="(link, index) in venue.interest_links"
              :key="index"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <ExternalLink class="w-4 h-4 mr-2" />
              <span>{{ link }}</span>
            </a>
          </div>
        </div>

        <!-- Events -->
        <div class="bg-gray-800 rounded-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <Calendar class="w-5 h-5 mr-2" />
              Próximos Eventos
            </h2>
            <div class="text-sm text-gray-400">
              {{ upcomingEvents.length }} evento{{ upcomingEvents.length !== 1 ? 's' : '' }}
            </div>
          </div>
          
          <div v-if="eventsLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          
          <div v-else-if="upcomingEvents.length > 0" class="space-y-4">
            <NuxtLink
              v-for="event in upcomingEvents"
              :key="event.id"
              :to="`/events/${event.id}`"
              class="block"
            >
              <div class="card hover:bg-gray-700 transition-all duration-200 cursor-pointer group transform hover:scale-[1.02] hover:shadow-xl">
                <div class="flex space-x-4 h-full">
                  <!-- Event Image -->
                  <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <Calendar class="w-8 h-8 text-white opacity-70" />
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 class="font-semibold text-white group-hover:text-purple-400 transition-colors duration-300 truncate text-lg">
                        {{ event.name }}
                      </h3>
                      <p class="text-sm text-gray-400 mt-1 flex items-center">
                        <Calendar class="w-4 h-4 mr-1" />
                        {{ formatEventDate(event.date) }}
                      </p>
                      <p v-if="event.description" class="text-sm text-gray-300 mt-2 line-clamp-2">
                        {{ event.description }}
                      </p>
                    </div>
                    
                    <div class="flex items-center justify-between mt-3">
                      <div class="flex items-center space-x-4 text-sm text-gray-400">
                        <span v-if="event.prices && event.prices.length > 0" class="flex items-center">
                          <span class="font-medium text-green-400">
                            Desde ${{ Math.min(...event.prices.map((p: any) => p.price / 100)) }}
                          </span>
                        </span>
                        <span v-if="event.artists && event.artists.length > 0" class="flex items-center">
                          <Users class="w-4 h-4 mr-1" />
                          {{ event.artists.length }} artista{{ event.artists.length !== 1 ? 's' : '' }}
                        </span>
                      </div>
                      
                      <div class="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors duration-200">
                        Ver detalles
                        <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
          
          <div v-else class="text-center py-12">
            <Calendar class="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-400 mb-2">No hay eventos próximos</h3>
            <p class="text-gray-500">Este venue no tiene eventos programados en el futuro</p>
          </div>

          <!-- Past Events Section -->
          <div v-if="pastEvents.length > 0" class="mt-8 pt-6 border-t border-gray-700">
            <h3 class="text-lg font-semibold text-gray-400 mb-4 flex items-center">
              <Clock class="w-4 h-4 mr-2" />
              Eventos Pasados ({{ pastEvents.length }})
            </h3>
            <div class="space-y-3">
              <NuxtLink
                v-for="event in pastEvents.slice(0, 3)"
                :key="event.id"
                :to="`/events/${event.id}`"
                class="block"
              >
                <div class="card hover:bg-gray-700 transition-all duration-200 cursor-pointer group opacity-75">
                  <div class="flex space-x-3 h-full">
                    <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <div class="w-full h-full bg-gray-600 flex items-center justify-center">
                        <Calendar class="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 class="font-medium text-gray-300 group-hover:text-white transition-colors duration-300 truncate">
                        {{ event.name }}
                      </h4>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ formatEventDate(event.date) }}
                      </p>
                    </div>
                  </div>
                </div>
              </NuxtLink>
              
              <div v-if="pastEvents.length > 3" class="text-center pt-2">
                <button class="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
                  Ver {{ pastEvents.length - 3 }} eventos más
                </button>
              </div>
            </div>
          </div>
          
          <!-- View All Events Button -->
          <div class="mt-6 text-center">
            <NuxtLink
              to="/events"
              class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Calendar class="w-5 h-5 mr-2" />
              Ver Todos los Eventos
            </NuxtLink>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <Info class="w-5 h-5 mr-2" />
            Información Adicional
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Fecha de registro:</span>
              <span class="text-white ml-2">{{ formatDate(venue.created_at) }}</span>
            </div>
            <div>
              <span class="text-gray-400">Última actualización:</span>
              <span class="text-white ml-2">{{ formatDate(venue.updated_at) }}</span>
            </div>
            <div>
              <span class="text-gray-400">Requiere suscripción:</span>
              <span class="text-white ml-2">{{ venue.subscription_required ? 'Sí' : 'No' }}</span>
            </div>
            <div>
              <span class="text-gray-400">Total de eventos:</span>
              <span class="text-white ml-2">{{ events.length }}</span>
            </div>
            <div>
              <span class="text-gray-400">Próximos eventos:</span>
              <span class="text-white ml-2">{{ upcomingEvents.length }}</span>
            </div>
            <div>
              <span class="text-gray-400">Eventos pasados:</span>
              <span class="text-white ml-2">{{ pastEvents.length }}</span>
            </div>
          </div>
        </div>

        <!-- Posts Section -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comentarios
          </h2>
          <PostForm v-if="user" :postable-type="'venue'" :postable-id="venue.id" class="mb-4" />
          <div v-else class="mb-4 text-center py-4 bg-gray-700 rounded-lg border border-gray-600">
            <p class="text-gray-400 text-sm mb-2">Inicia sesión para dejar un comentario</p>
            <NuxtLink to="/login" class="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Iniciar Sesión
            </NuxtLink>
          </div>
          <PostList :postable-type="'venue'" :postable-id="venue.id" />
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <MapPin class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-400 mb-2">Venue no encontrado</h3>
        <p class="text-gray-500 mb-6">El venue que buscas no existe o no está disponible.</p>
        <NuxtLink
          to="/venues"
          class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200"
        >
          Ver todos los venues
        </NuxtLink>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, MapPin, Globe, User, Hash, Link, ExternalLink, Calendar, Info, AlertCircle, Users, ArrowRight, Clock } from 'lucide-vue-next'
import MapLeaflet from '~/components/MapLeaflet.vue'

// Get route params
const route = useRoute()
const venueId = computed(() => route.params.id as string)


// Composables
const { getVenue, getVenueEvents } = useVenues()
const { user } = useAuth()

// State
const venue = ref<any>(null)
const events = ref<any[]>([])
const loading = ref(true)
const eventsLoading = ref(false)
const error = ref<string | null>(null)
const imageLoadFailed = ref(false)

// Meta
definePageMeta({
  title: 'Detalles del Venue'
})

// Image error handling
const handleImageError = () => {
  imageLoadFailed.value = true
}

// Fetch venue details
const fetchVenue = async () => {
  loading.value = true
  error.value = null
  imageLoadFailed.value = false // Reset image error state
  
  try {
    const venueData = await getVenue(parseInt(venueId.value))
    
    if (venueData) {
      venue.value = venueData
      
      // Fetch venue events
      eventsLoading.value = true
      const eventsResponse = await getVenueEvents(venueData.id)
      
      if (eventsResponse) {
        events.value = eventsResponse.data
      }
    } else {
      error.value = 'Venue no encontrado'
    }
  } catch (err) {
    error.value = 'Error al cargar el venue'
    console.error('Error fetching venue:', err)
  } finally {
    loading.value = false
    eventsLoading.value = false
  }
}

// Watch for route changes
watch(() => route.params.id, () => {
  if (venueId.value) {
    fetchVenue()
  }
}, { immediate: true })

// Computed properties for event filtering
const upcomingEvents = computed(() => {
  if (!events.value) return []
  const now = new Date()
  return events.value
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const pastEvents = computed(() => {
  if (!events.value) return []
  const now = new Date()
  return events.value
    .filter(event => new Date(event.date) <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatEventDate = (dateString: string) => {
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
