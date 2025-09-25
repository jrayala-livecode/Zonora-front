<template>
  <div class="card hover:bg-gray-700 transition-all duration-100 cursor-pointer group transform hover:scale-100 hover:shadow-xl h-full">
    <div class="flex space-x-4 h-full">
      <!-- Image with fallback -->
      <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
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
        <h3 class="font-semibold text-white group-hover:text-orange-400 transition-colors duration-300 truncate">
          {{ event.title }}
        </h3>
        <p class="text-sm text-gray-400 mt-1">
          {{ formatDate(event.date) }}  {{ event.time ? `- ${event.time}` : '' }}
        </p>
        <p class="text-sm text-gray-300 mt-2 line-clamp-2 flex-1">
          {{ event.description }}
        </p>
        <div class="flex items-center mt-2 space-x-4 transform transition-transform duration-300">
          <div class="flex items-center text-sm text-gray-400">
            <MapPin class="w-4 h-4 mr-1" />
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
          <span v-if="event.attendees" class="flex items-center text-sm text-gray-400">
            <Users class="w-4 h-4 mr-1" />
            {{ event.attendees }} asistentes
          </span>
        </div>
        
        <!-- Price Information -->
        <div v-if="event.price_range || event.active_price" class="mt-3 flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-sm font-medium text-orange-400">
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