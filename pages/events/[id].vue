<template>
  <div class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink to="/events" class="text-gray-400 hover:text-white">Eventos</NuxtLink>
        </li>
        <li class="text-gray-400">/</li>
        <li class="text-white">{{ event?.category || 'Evento' }}</li>
      </ol>
    </nav>

    <div v-if="isLoading" class="text-center text-gray-400 py-12">
      Cargando evento...
    </div>

    <div v-else-if="event" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Aquí va todo tu contenido actual para mostrar el detalle, usando "event" -->
      <!-- Puedes pegar el template que ya tienes para mostrar el evento aquí -->
      <div class="lg:col-span-2">
        <div class="bg-gray-800 rounded-lg overflow-hidden mb-6">
          <img
            :src="event.image_url"
            :alt="event.title"
            class="w-full h-64 md:h-96 object-cover"
          />
        </div>

        <div class="card mb-6">
          <h1 class="text-3xl font-bold text-white mb-4">{{ event.title }}</h1>
          <div class="flex flex-wrap gap-4 mb-6 text-sm">
            <div class="flex items-center space-x-2">
              <Calendar class="w-4 h-4 text-gray-400" />
              <span class="text-gray-300">{{ formatDate(event.date) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Clock class="w-4 h-4 text-gray-400" />
              <span class="text-gray-300">{{ event.time }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <MapPin class="w-4 h-4 text-gray-400" />
              <span class="text-gray-300">{{ event.location }}</span>
            </div>
            <div v-if="event.attendees" class="flex items-center space-x-2">
              <Users class="w-4 h-4 text-gray-400" />
              <span class="text-gray-300">{{ event.attendees }} asistentes</span>
            </div>
          </div>

          <div class="prose prose-invert max-w-none">
            <h2 class="text-xl font-semibold text-white mb-4">Acerca del Evento</h2>
            <p class="text-gray-300 leading-relaxed">{{ event.description }}</p>
          </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold text-white mb-4">Ubicación</h2>
          <div class="mb-4">
            <div class="flex items-center space-x-2 mb-2">
              <MapPin class="w-5 h-5 text-orange-500" />
              <span class="text-white font-medium">{{ event.location }}</span>
            </div>
            <p class="text-gray-300 ml-7">{{ event.address }}</p>
          </div>
         <div class="rounded-lg overflow-hidden h-64">
  <MapLeaflet v-if="event.lat && event.lng" :lat="event.lat" :lng="event.lng" />
  <div v-else class="bg-gray-700 text-center text-gray-400 py-10 rounded-lg">
    Ubicación no disponible
  </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card">
          <!--
          <button class="btn-primary w-full mb-4">
            <Ticket class="w-5 h-5 mr-2" />
            Obtener Boletos
          </button>
          -->
          <div class="flex space-x-2">
            <!--
            <button class="btn-secondary flex-1 flex items-center justify-center">
              <Heart class="w-4 h-4 mr-2" />
              Favorito
            </button>
             -->
            <button class="btn-secondary flex-1 flex items-center justify-center">
              <Share2 class="w-4 h-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-4">Información del Evento</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-400">Fecha:</span>
              <span class="text-white">{{ formatDate(event.date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Hora:</span>
              <span class="text-white">{{ event.time }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Ubicación:</span>
              <span class="text-white">{{ event.location }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Categoría:</span>
              <span class="text-white">{{ event.category }}</span>
            </div>
            <div v-if="event.attendees" class="flex justify-between">
              <span class="text-gray-400">Asistentes:</span>
              <span class="text-white">{{ event.attendees }}</span>
            </div>
          </div>
        </div>

     <div v-if="event.organizer" class="card">
  <h3 class="text-lg font-semibold text-white mb-4">Organizador</h3>
  <div class="flex items-center space-x-3">
    <img
      :src="event.organizer.avatar_url"
      :alt="event.organizer.name"
      class="w-12 h-12 rounded-full object-cover"
    />
    <div>
      <h4 class="font-medium text-white">{{ event.organizer.name }}</h4>
      <p class="text-sm text-gray-400">
        Miembro desde {{ event.organizer.member_since }}
      </p>
    </div>
  </div>
</div>


      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-lg">Evento no encontrado</div>
      <NuxtLink to="/events" class="text-orange-500 hover:text-orange-400 mt-2 inline-block">
        Volver a eventos
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/composables/useEvents'; // ajusta según ruta real
import { ref, computed, watch, onMounted } from 'vue';
import { Calendar, Clock, MapPin, Users, Ticket, Heart, Share2 } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import MapLeaflet from '~/components/MapLeaflet.vue';


const event = ref<Event | null | undefined>(null);
const route = useRoute();
const { events, fetchEventsFromApi, getEventById, isLoading } = useEvents();

const eventId = route.params.id as string;



onMounted(async () => {
  if (events.value.length === 0) {
    await fetchEventsFromApi();
  }
  event.value = getEventById(eventId);
  
});

watch(events, () => {
  event.value = getEventById(eventId);
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

useHead(() => ({
  title: event.value ? `${event.value.title} - Zonora` : 'Evento - Zonora',
  meta: [
    { name: 'description', content: event.value?.description || 'Detalles del evento' }
  ]
}));
</script>
