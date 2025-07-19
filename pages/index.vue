<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Descubre Eventos
          <span class="text-orange-500">Increíbles</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/events" class="btn-primary text-lg px-8 py-4 animate-pulse">
            Explorar Eventos
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/create" class="btn-secondary text-lg px-8 py-4">
            Crear Evento
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Events -->
    <section class="py-16 bg-gray-900 animate-fade-in">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-white">Eventos Destacados</h2>
          <NuxtLink to="/events" class="text-orange-500 hover:text-orange-400 font-medium">
            Ver todos →
          </NuxtLink>
        </div>
        <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="text-orange-400 text-lg animate-pulse">Cargando eventos...</div>
    </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
          <NuxtLink
            v-for="event in featuredEvents"
            :key="event.id"
            :to="`/events/${event.id}`"
            class="group transform transition-all duration-300 hover:scale-105"
          >
            <div class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:shadow-2xl">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="p-6">
                <h3 class="font-semibold text-white group-hover:text-orange-400 transition-colors duration-300 mb-2">
                  {{ event.title }}
                </h3>
                <p class="text-sm text-gray-400 mb-3">
                  {{ formatDate(event.date) }} • {{ event.time }}
                </p>
                <p class="text-gray-300 text-sm line-clamp-2">
                  {{ event.description }}
                </p>
                <div class="flex items-center mt-4 text-sm text-gray-400 transform group-hover:translate-x-2 transition-transform duration-300">
                  <MapPin class="w-4 h-4 mr-1" />
                  {{ event.location }}
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <!-- Categories Section Commented Out - Only Music Events for now -->
    <!-- 
    <section class="py-16 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-8 text-center">
          Explora por Categorías
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
            <div class="text-4xl mb-4">🎵</div>
            <h3 class="font-semibold text-white">Música</h3>
            <p class="text-sm text-gray-400 mt-1">{{ events.length }} eventos</p>
          </div>
        </div>
      </div>
    </section>
    -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { MapPin } from 'lucide-vue-next';

const { events, fetchEventsFromApi, isLoading } = useEvents();
const { isAuthenticated } = useAuth();

onMounted(() => {
  fetchEventsFromApi();
});

const featuredEvents = computed(() => events.value.slice(0, 6));

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    month: 'long',
    day: 'numeric'
  });
};

useHead({
  title: 'Zonora - Descubre Eventos Increíbles',
  meta: [
    {
      name: 'description',
      content:
        'Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses.',
    },
  ],
});
</script>
