<template>
  <div class="card hover:bg-gray-750 transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-xl">
    <div class="flex space-x-4">
      <img
        :src="event.image_url"
        :alt="event.title"
        class="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
      />
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-white group-hover:text-orange-400 transition-colors duration-300 truncate">
          {{ event.title }}
        </h3>
        <p class="text-sm text-gray-400 mt-1">
          {{ formatDate(event.date) }} • {{ event.time }}
        </p>
        <p class="text-sm text-gray-300 mt-2 line-clamp-2">
          {{ event.description }}
        </p>
        <div class="flex items-center mt-2 space-x-4 transform group-hover:translate-x-2 transition-transform duration-300">
          <span class="flex items-center text-sm text-gray-400">
            <MapPin class="w-4 h-4 mr-1" />
            {{ event.location }}
          </span>
          <span v-if="event.attendees" class="flex items-center text-sm text-gray-400">
            <Users class="w-4 h-4 mr-1" />
            {{ event.attendees }} asistentes
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Users } from 'lucide-vue-next';
import type { Event } from '~/composables/useEvents';

interface Props {
  event: Event;
}

defineProps<Props>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>