<template>
  <div class="venue-card bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200">
    <!-- Venue Profile Picture -->
    <div class="h-48 relative overflow-hidden">
      <img
        v-if="venue.profile_picture"
        :src="venue.profile_picture"
        :alt="`Imagen de ${venue.name}`"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <!-- Fallback when no image or image fails to load -->
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
      >
        <div class="text-center">
          <MapPin class="w-12 h-12 text-white opacity-70 mx-auto mb-2" />
          <p class="text-white text-sm opacity-70">Sin Imagen</p>
        </div>
      </div>
    </div>

    <!-- Venue Content -->
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-white mb-1 line-clamp-1">
            {{ venue.name }}
          </h3>
          <div class="flex items-center text-gray-400 text-sm mb-2">
            <MapPin class="w-4 h-4 mr-1" />
            <span class="line-clamp-1">{{ venue.address }}</span>
          </div>
        </div>
        
        <!-- Visibility Badge -->
        <div class="flex-shrink-0 ml-2">
          <span 
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              venue.is_visible 
                ? 'bg-green-900 text-green-300' 
                : 'bg-gray-700 text-gray-400'
            ]"
          >
            {{ venue.is_visible ? 'Visible' : 'Hidden' }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p v-if="venue.description" class="text-gray-300 text-sm mb-4 line-clamp-2">
        {{ venue.description }}
      </p>

      <!-- Location Info -->
      <div v-if="venue.comuna" class="flex items-center text-gray-400 text-sm mb-4">
        <Globe class="w-4 h-4 mr-1" />
        <span>{{ venue.comuna.nombre }}</span>
      </div>

      <!-- Hashtags -->
      <div v-if="venue.hashtags && venue.hashtags.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="hashtag in venue.hashtags.slice(0, 3)" 
            :key="hashtag"
            class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
          >
            {{ hashtag }}
          </span>
          <span 
            v-if="venue.hashtags.length > 3"
            class="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full"
          >
            +{{ venue.hashtags.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Owner Info -->
      <div v-if="venue.user" class="flex items-center text-gray-400 text-sm mb-4">
        <User class="w-4 h-4 mr-1" />
        <span>by {{ venue.user.name }}</span>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div class="flex items-center">
          <Calendar class="w-4 h-4 mr-1" />
          <span>{{ formatDate(venue.created_at) }}</span>
        </div>
        <div v-if="venue.events && venue.events.length > 0" class="flex items-center">
          <span>{{ venue.events.length }} event{{ venue.events.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <NuxtLink 
          :to="`/venues/${venue.id}`"
          class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
        >
          Ver Detalles
        </NuxtLink>
        
        <button
          v-if="venue.events && venue.events.length > 0"
          @click="$emit('viewEvents', venue)"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          :title="`Ver ${venue.events.length} eventos`"
        >
          <Calendar class="w-4 h-4" />
        </button>
      </div>

      <!-- Links -->
      <div v-if="venue.interest_links && venue.interest_links.length > 0" class="mt-4 pt-4 border-t border-gray-700">
        <div class="flex flex-wrap gap-2">
          <a
            v-for="(link, index) in venue.interest_links.slice(0, 2)"
            :key="index"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-purple-400 hover:text-purple-300 text-xs underline"
          >
            {{ getDomainFromUrl(link) }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Globe, User, Calendar } from 'lucide-vue-next'

interface Venue {
  id: number
  name: string
  address: string
  description?: string
  profile_picture?: string
  latitude?: number
  longitude?: number
  interest_links?: string[]
  hashtags?: string[]
  commune_id?: number
  user_id: number
  venue_admin_id?: number
  is_visible: boolean
  subscription_required: boolean
  created_at: string
  updated_at: string
  comuna?: {
    id: number
    nombre: string
  }
  user?: {
    id: number
    name: string
    email: string
  }
  events?: any[]
}

interface Props {
  venue: Venue
}

defineProps<Props>()
defineEmits<{
  viewEvents: [venue: Venue]
}>()

// Image error handling
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // The fallback div will show automatically since v-else will trigger
}

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}
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

.venue-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>
