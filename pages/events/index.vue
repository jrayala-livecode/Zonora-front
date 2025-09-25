<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Todos los Eventos</h1>

        <!-- Search and Filters -->
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-center">
            <div class="flex flex-col lg:flex-row gap-4 items-center">
              <div class="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  class="input-field w-full pl-10"
                  v-model="searchQuery"
                  @input="handleSearch"
                />
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
              </div>

              <div class="w-full lg:w-48">
                <input
                  type="date"
                  class="input-field w-full"
                  v-model="dateFilter"
                />
              </div>

              <div class="flex items-center space-x-6">
                <!-- ...existing radio buttons... -->
              </div>
            </div>
          </div>
          <div
            v-if="useCurrentLocation && locationError"
            class="mt-2 text-red-400"
          >
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
            <MapView v-if="isMounted" :events="currentEvents as any" />
            <div v-else class="w-full h-64 rounded-lg bg-gray-200 flex items-center justify-center">
              <p class="text-gray-500">Cargando mapa...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-3">
          <h2 class="text-2xl font-bold text-white mb-6">Próximos Eventos</h2>
          
          <!-- Top Pagination -->
          <div v-if="paginatedEvents && paginatedEvents.total > limit" class="mb-6">
            <div class="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <div class="text-gray-300 text-sm">
                Mostrando {{ ((currentPage - 1) * limit) + 1 }} - {{ Math.min(currentPage * limit, paginatedEvents.total) }} de {{ paginatedEvents.total }} eventos
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Anterior
                </button>
                
                <div class="flex space-x-1">
                  <button
                    v-for="pageNum in visiblePages"
                    :key="pageNum"
                    @click="goToPage(pageNum)"
                    :class="[
                      'px-3 py-1 rounded transition-colors',
                      pageNum === currentPage
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    ]"
                  >
                    {{ pageNum }}
                  </button>
                </div>
                
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage >= totalPages"
                  class="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <!-- Loading para eventos cercanos -->
          <div
            v-if="useCurrentLocation && loadingNearby"
            class="text-center py-12 text-gray-400 text-lg"
          >
            Cargando eventos cercanos...
          </div>

          <!-- Loading general cuando no usa ubicación actual -->
          <div
            v-else-if="!useCurrentLocation && isLoading"
            class="text-center py-12 text-gray-400 text-lg"
          >
            Cargando eventos...
          </div>

          <!-- Lista eventos solo si no está cargando -->
          <div v-else class="space-y-5">
            <NuxtLink
              v-for="event in filteredEvents"
              :key="event.id"
              :to="`/events/${event.id}`"
              class="block"
            >
              <EventCard :event="event as any" />
            </NuxtLink>
          </div>

          <div v-if="currentEvents.length === 0 && !isLoading && !loadingNearby" class="text-center py-12">
            <div class="text-gray-400 text-lg">No se encontraron eventos</div>
            <p class="text-gray-500 mt-2">
              Prueba con diferentes términos de búsqueda
            </p>
          </div>

          <!-- Bottom Pagination -->
          <div v-if="paginatedEvents && paginatedEvents.total > limit && currentEvents.length > 0" class="mt-6">
            <div class="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <div class="text-gray-300 text-sm">
                Mostrando {{ ((currentPage - 1) * limit) + 1 }} - {{ Math.min(currentPage * limit, paginatedEvents.total) }} de {{ paginatedEvents.total }} eventos
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Anterior
                </button>
                
                <div class="flex space-x-1">
                  <button
                    v-for="pageNum in visiblePages"
                    :key="pageNum"
                    @click="goToPage(pageNum)"
                    :class="[
                      'px-3 py-1 rounded transition-colors',
                      pageNum === currentPage
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    ]"
                  >
                    {{ pageNum }}
                  </button>
                </div>
                
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage >= totalPages"
                  class="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Search } from "lucide-vue-next";
import MapView from "~/components/MapView.vue";
import { useEvents } from "~/composables/useEvents";

const { paginatedEvents, fetchEventsFromApiPaginated, searchQuery, isLoading } = useEvents();

const useCurrentLocation = ref(false);
const userPosition = ref<{ latitude: number; longitude: number } | null>(null);
const locationError = ref<string | null>(null);
const loadingNearby = ref(false);
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

const currentPage = ref(1);
const limit = ref(10);
const dateFilter = ref('');

// Computed properties for pagination
const totalPages = computed(() => {
  if (!paginatedEvents.value) return 0;
  return Math.ceil(paginatedEvents.value.total / limit.value);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  
  let start = Math.max(1, current - delta);
  let end = Math.min(total, current + delta);
  
  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }
  
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const currentEvents = computed(() => {
  if (!paginatedEvents.value || !paginatedEvents.value.data) return [];
  return paginatedEvents.value.data;
});

// Pagination handlers
const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  
  currentPage.value = page;
  await fetchEventsFromApiPaginated(page, limit.value);
  
  // Scroll to top of events list
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSearch = async () => {
  currentPage.value = 1;
  await fetchEventsFromApiPaginated(1, limit.value);
};

const handleUseCurrentLocation = async (useLocation: boolean) => {
  useCurrentLocation.value = useLocation;
  currentPage.value = 1;
  
  if (useLocation) {
    loadingNearby.value = true;
    // Implement nearby events logic here
    loadingNearby.value = false;
  } else {
    await fetchEventsFromApiPaginated(1, limit.value);
  }
};

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
  fetchEventsFromApiPaginated(1, limit.value).catch((error) => {
    console.error("Error fetching events:", error);
  });
});

// Remove incorrect computed usage; if you need a filteredEvents computed property, define it like this:
const filteredEvents = computed(() => {
  if(!searchQuery.value || searchQuery.value.trim() === '') {
    return currentEvents.value;
  }

  if (!paginatedEvents.value || !paginatedEvents.value.data) return [];

  return paginatedEvents.value.data.filter(event => event.title.toLowerCase().includes(
    searchQuery.value.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Watch for date filter changes
watch(dateFilter, async () => {
  currentPage.value = 1;
  await fetchEventsFromApiPaginated(1, limit.value);
});
</script>

