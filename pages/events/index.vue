<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Todos los Eventos</h1>
        
        <!-- Search and Filters -->
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar eventos..."
                class="input-field w-full pl-10"
                v-model="searchQuery"
              />
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <div class="flex gap-4">
              <select v-model="selectedLocation" class="input-field">
                <option value="">Todas las ubicaciones</option>
                <option value="los angeles">Los Angeles</option>
                <option value="downtown">Downtown</option>
                <option value="central">Central</option>
              </select>
              
              <button class="btn-secondary flex items-center space-x-2">
                <Filter class="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="bg-gray-800 rounded-lg p-4 mb-6">
          <div class="bg-blue-200 rounded-lg h-64 flex items-center justify-center">
            <div class="text-gray-600 text-center">
              <MapPin class="w-8 h-8 mx-auto mb-2" />
              <p>Mapa de eventos (Los Angeles)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Events -->
        <!-- Events -->
<div class="lg:col-span-2">
  <h2 class="text-2xl font-bold text-white mb-6">Próximos Eventos</h2>

  <div v-if="isLoading" class="flex justify-center items-center py-16">
    <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"/>
    </svg>
  </div>

  <div v-else>
    <div class="space-y-4">
      <NuxtLink
        v-for="event in filteredEvents"
        :key="event.id"
        :to="`/events/${event.id}`"
        class="block"
      >
        <EventCard :event="event" />
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-lg">No se encontraron eventos</div>
      <p class="text-gray-500 mt-2">Prueba con diferentes términos de búsqueda</p>
    </div>
  </div>
</div>


        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Filter by Location -->
          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-4">Filtrar por Ubicación</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  name="location"
                  value=""
                  v-model="selectedLocation"
                  class="text-orange-500"
                />
                <span class="text-gray-300">Usar ubicación actual</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  name="location"
                  value="los angeles"
                  v-model="selectedLocation"
                  class="text-orange-500"
                />
                <span class="text-gray-300">Los Angeles</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  name="location"
                  value="downtown"
                  v-model="selectedLocation"
                  class="text-orange-500"
                />
                <span class="text-gray-300">Downtown</span>
              </label>
            </div>
          </div>

          <!-- Popular Categories -->
          <!-- Categories commented out - only music events for now -->
          <!-- 
          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-4">Categorías</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Música</span>
                <span class="text-sm text-gray-400">{{ filteredEvents.length }}</span>
              </div>
            </div>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Search, Filter, MapPin } from 'lucide-vue-next';

const { filteredEvents, searchQuery, selectedLocation, fetchEventsFromApi, isLoading } = useEvents();

onMounted(() => {
  fetchEventsFromApi();
});
</script>
