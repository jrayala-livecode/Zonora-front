<template>
  <div class="card hover:bg-gray-700 transition-all duration-100 cursor-pointer group transform hover:scale-100 hover:shadow-xl h-full">
    <div class="flex space-x-3 h-full">
      <!-- Image with fallback -->
      <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <img
          v-if="!imageLoadFailed"
          :src="event.image_url"
          :alt="event.title"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <!-- Fallback when image fails -->
        <div
          v-else
          class="w-full h-full bg-gray-600 flex items-center justify-center"
        >
          <span class="text-gray-400 text-xs text-center">Sin imagen</span>
        </div>
      </div>
      
      <div class="flex-1 min-w-0 flex flex-col">
        <h3 class="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors duration-300 truncate">
          {{ event.title }}
        </h3>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ formatDate(event.date) }}  {{ event.time ? `- ${event.time}` : '' }}
        </p>
        <p class="text-xs text-gray-300 mt-1 line-clamp-2 flex-1">
          {{ event.description }}
        </p>
        <div class="flex items-center mt-1.5 space-x-3 transform transition-transform duration-300">
          <div class="flex items-center text-xs text-gray-400">
            <MapPin class="w-3 h-3 mr-1" />
            <span v-if="event.venue">
              <NuxtLink 
                :to="`/venues/${event.venue.id}`"
                @click.stop
                class="text-orange-400 hover:text-orange-300 transition-colors duration-200 underline decoration-dotted underline-offset-2"
              >
                {{ event.venue.name }}
              </NuxtLink>
            </span>
            <span v-else class="text-gray-400">
              {{ event.latitude + ", " + event.longitude }}
            </span>
          </div>
          <span v-if="event.attendees" class="flex items-center text-xs text-gray-400">
            <Users class="w-3 h-3 mr-1" />
            {{ event.attendees }} asistentes
          </span>
        </div>
        
        <!-- Associated Artists -->
        <div v-if="event.artists && event.artists.length > 0" class="mt-2">
          <div class="flex items-center text-xs text-gray-400 mb-1.5">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span class="font-medium">Artistas:</span>
          </div>
          <div class="flex flex-wrap gap-1">
            <div 
              v-for="artist in event.artists.slice(0, 2)" 
              :key="artist.id"
              class="flex items-center space-x-1.5 bg-gray-700 rounded px-1.5 py-0.5"
            >
              <img 
                v-if="artist.profile_picture_url"
                :src="$convertImageUrl(artist.profile_picture_url)"
                :alt="artist.stage_name"
                class="w-4 h-4 rounded-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                <svg class="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span class="text-xs text-white font-medium">{{ artist.stage_name }}</span>
            </div>
            <div v-if="event.artists.length > 2" class="flex items-center text-xs text-gray-400 bg-gray-700 rounded px-1.5 py-0.5">
              +{{ event.artists.length - 2 }}
            </div>
          </div>
        </div>
        
        <!-- Price Information -->
        <div v-if="event.price_range || event.active_price" class="mt-2 flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-xs font-medium text-orange-400">
              {{ formatPrice(event) }}
            </span>
          </div>
          <div v-if="event.formatted_prices && event.formatted_prices.length > 1" class="text-xs text-gray-500">
            {{ event.formatted_prices.length }} opciones
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MapPin, Users } from 'lucide-vue-next';
import type { Event } from '~/composables/useEvents';

interface Props {
  event: Event;
}

defineProps<Props>();

const imageLoadFailed = ref(false);

const handleImageError = () => {
  imageLoadFailed.value = true;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatPrice = (event: Event) => {
  // If there's a price range, show it
  if (event.price_range) {
    return event.price_range;
  }
  
  // If there's an active price, show it
  if (event.active_price) {
    if (event.active_price.price === 0) {
      return 'Gratis';
    }
    return `$${event.active_price.price.toLocaleString('es-CL')}`;
  }
  
  // If there are formatted prices, show the first one
  if (event.formatted_prices && event.formatted_prices.length > 0) {
    const firstPrice = event.formatted_prices[0];
    return firstPrice.formatted_price;
  }
  
  // If there are raw prices, show the first one
  if (event.prices && event.prices.length > 0) {
    const firstPrice = event.prices[0];
    if (firstPrice.price === 0) {
      return 'Gratis';
    }
    return `$${firstPrice.price.toLocaleString('es-CL')}`;
  }
  
  return 'Precio no disponible';
};
</script>