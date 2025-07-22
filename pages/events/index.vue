<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Todos los Eventos</h1>

        <!-- Search and Filters -->
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-center">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar eventos..."
                class="input-field w-full pl-10"
                v-model="searchQuery"
              />
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
            </div>

            <div class="flex items-center space-x-6">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="locationFilter"
                  :checked="!useCurrentLocation"
                  @change="handleUseCurrentLocation(false)"
                  class="text-orange-500"
                />
                <span class="text-gray-300">Todos los eventos</span>
              </label>

              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="locationFilter"
                  :checked="useCurrentLocation"
                  @change="handleUseCurrentLocation(true)"
                  class="text-orange-500"
                />
                <span class="text-gray-300">Usar ubicación actual</span>
              </label>
            </div>
          </div>
          <div v-if="useCurrentLocation && locationError" class="mt-2 text-red-400">
            {{ locationError }}
          </div>
          <div
            v-if="useCurrentLocation && !locationError"
            class="text-sm text-gray-400 mt-2"
          >
            Mostrando eventos cercanos a tu ubicación (±200km)
          </div>
        </div>

        <!-- Map -->
        <div class="bg-gray-800 rounded-lg p-4 mb-6">
          <div class="text-gray-600 text-center">
            <MapView />
          </div>
        </div>
      </div>

      <!-- Events List -->
       
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold text-white mb-6">Próximos Eventos</h2>
         <!-- Loading para eventos cercanos -->
<div v-if="useCurrentLocation && loadingNearby" class="text-center py-12 text-gray-400 text-lg">
  Cargando eventos cercanos...
</div>

<!-- Loading general cuando no usa ubicación actual -->
<div v-else-if="!useCurrentLocation && isLoading" class="text-center py-12 text-gray-400 text-lg">
  Cargando eventos...
</div>

<!-- Lista eventos solo si no está cargando -->
<div v-else class="space-y-4">
  <NuxtLink
    v-for="event in filteredEvents"
    :key="event.id"
    :to="`/events/${event.id}`"
    class="block"
  >
    <EventCard :event="event" />
  </NuxtLink>
</div>


          <div v-if="filteredEvents.length === 0" class="text-center py-12">
            <div class="text-gray-400 text-lg">No se encontraron eventos</div>
            <p class="text-gray-500 mt-2">Prueba con diferentes términos de búsqueda</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import MapView from '~/components/MapView.vue';
import { useEvents } from '~/composables/useEvents';

const {
  events,
  fetchEventsFromApi,
  searchQuery,
  isLoading,
} = useEvents();

const useCurrentLocation = ref(false);
const userPosition = ref<{ latitude: number; longitude: number } | null>(null);
const locationError = ref<string | null>(null);
const loadingNearby = ref(false);  // NUEVO loading para cercanos
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

const fetchEventsNearby = async () => {
  if (!userPosition.value) {
    locationError.value = 'Ubicación no disponible';
    return;
  }
  loadingNearby.value = true;
  try {
    const response = await fetch(`${apiBaseUrl}/events/scan-close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: userPosition.value.latitude,
        longitude: userPosition.value.longitude,
        radius: 200,
        limit: 20,
        include_hidden_locations: false,
        date_from: '2025-07-01',
        date_to: '2025-12-31',
      }),
    });

    if (!response.ok) {
      locationError.value = `Error al obtener eventos: ${response.statusText}`;
      loadingNearby.value = false;
      return;
    }

    const data = await response.json();
    events.value = data.data.map((e: any) => {
      return {
        id: e.id.toString(),
        title: e.name,
        description: e.description,
        date: e.date,
        time: new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: e.venue?.name || `Lat: ${e.latitude}, Lng: ${e.longitude}`,
        address: e.venue?.address || '',
        image_url: e.image_url || '',
        category: (Array.isArray(e.hashtags) ? e.hashtags[0] : '') || '',
        lat: e.latitude,
        lng: e.longitude,
      };
    });
    locationError.value = null;
  } catch (error) {
    locationError.value = 'Error al conectar con el servidor.';
  } finally {
    loadingNearby.value = false;
  }
};

const handleUseCurrentLocation = async (enable: boolean) => {
  useCurrentLocation.value = enable;
  if (enable) {
    if (!navigator.geolocation) {
      locationError.value = 'Geolocalización no soportada por el navegador.';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        userPosition.value = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        locationError.value = null;
        await fetchEventsNearby();
      },
      (error) => {
        locationError.value = 'No se pudo obtener la ubicación: ' + error.message;
      }
    );
  } else {
    await fetchEventsFromApi();
    locationError.value = null;
  }
};

const filteredEvents = computed(() => {
  if (!searchQuery.value) return events.value;

  const q = searchQuery.value.toLowerCase();
  return events.value.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
  );
});

// Carga inicial
await fetchEventsFromApi();
</script>

