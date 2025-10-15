<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Todos los Eventos</h1>

        <!-- Search and Filters -->
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Search Input -->
            <div class="lg:col-span-4 relative">
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

            <!-- Venue Filter -->
            <div class="lg:col-span-3">
              <select
                v-model="venueFilter"
                @change="handleFilterChange"
                class="input-field w-full"
              >
                <option value="">Todos los venues</option>
                <option value="no_venue">Sin venue</option>
                <option
                  v-for="venue in venues"
                  :key="venue.id"
                  :value="venue.id"
                >
                  {{ venue.name }}
                </option>
              </select>
            </div>

            <!-- Hashtag Filter -->
            <div class="lg:col-span-3 relative">
              <input
                type="text"
                placeholder="Filtrar por hashtag..."
                class="input-field w-full pl-8"
                v-model="hashtagFilter"
                @input="handleSearch"
              />
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">#</span>
            </div>

            <!-- Today Switch -->
            <div class="lg:col-span-2 flex items-center justify-center bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="todayFilter"
                  @change="handleFilterChange"
                  class="sr-only peer"
                />
                <div class="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                <span class="ml-3 text-sm font-medium text-gray-300">Solo hoy</span>
              </label>
            </div>
          </div>

          <!-- Second Row: Date Picker (hidden when Today filter is active) -->
          <div v-if="!todayFilter" class="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <!-- Date Picker -->
            <div class="lg:col-span-3 relative">
              <input
                type="date"
                v-model="dateFilter"
                @change="handleFilterChange"
                class="input-field w-full"
                placeholder="Filtrar por fecha..."
              />
            </div>

            <!-- Clear Date Button -->
            <div class="lg:col-span-2">
              <button
                v-if="dateFilter"
                @click="clearDateFilter"
                class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm border border-gray-600"
              >
                Limpiar fecha
              </button>
            </div>

            <!-- Spacer -->
            <div class="lg:col-span-7"></div>
          </div>

          <!-- Clear All Filters Button -->
          <div v-if="hasActiveFilters" class="mt-4 flex justify-end">
            <button
              @click="clearFilters"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Limpiar todos los filtros
            </button>
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
import { Search, X } from "lucide-vue-next";
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

// Filter states
const venueFilter = ref('');
const hashtagFilter = ref('');
const todayFilter = ref(false);
const dateFilter = ref('');
const venues = ref<Array<{ id: number; name: string }>>([]);

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

// Build filter object
const buildFilters = () => {
  const filters: any = {};
  
  if (searchQuery.value) filters.search = searchQuery.value;
  if (venueFilter.value === 'no_venue') filters.no_venue = true;
  else if (venueFilter.value) filters.venue_id = venueFilter.value;
  if (todayFilter.value) filters.today = true;
  if (dateFilter.value) filters.date = dateFilter.value;
  if (hashtagFilter.value) filters.hashtag = hashtagFilter.value.replace(/^#/, '');
  
  return filters;
};

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value || venueFilter.value || hashtagFilter.value || todayFilter.value || dateFilter.value;
});

// Clear date filter only
const clearDateFilter = async () => {
  dateFilter.value = '';
  todayFilter.value = false; // Also clear today filter since they conflict
  currentPage.value = 1;
  await fetchEventsFromApiPaginated(1, limit.value, buildFilters());
};

// Clear all filters
const clearFilters = async () => {
  searchQuery.value = '';
  venueFilter.value = '';
  hashtagFilter.value = '';
  todayFilter.value = false;
  dateFilter.value = '';
  currentPage.value = 1;
  await fetchEventsFromApiPaginated(1, limit.value);
};

// Pagination handlers
const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  
  currentPage.value = page;
  await fetchEventsFromApiPaginated(page, limit.value, buildFilters());
  
  // Scroll to top of events list
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSearch = async () => {
  currentPage.value = 1;
  await fetchEventsFromApiPaginated(1, limit.value, buildFilters());
};

const handleFilterChange = async () => {
  currentPage.value = 1;
  await fetchEventsFromApiPaginated(1, limit.value, buildFilters());
};

const handleUseCurrentLocation = async (useLocation: boolean) => {
  useCurrentLocation.value = useLocation;
  currentPage.value = 1;
  
  if (useLocation) {
    loadingNearby.value = true;
    // Implement nearby events logic here
    loadingNearby.value = false;
  } else {
    await fetchEventsFromApiPaginated(1, limit.value, buildFilters());
  }
};

const isMounted = ref(false);

// Fetch venues for the dropdown
const fetchVenues = async () => {
  try {
    const res = await fetch(`${apiBaseUrl}/venues?per_page=100`);
    if (!res.ok) throw new Error('Error fetching venues');
    
    const json = await res.json();
    venues.value = json.data.map((v: any) => ({ id: v.id, name: v.name }));
  } catch (error) {
    console.error('Error fetching venues:', error);
    venues.value = [];
  }
};

onMounted(() => {
  isMounted.value = true;
  fetchVenues();
  fetchEventsFromApiPaginated(1, limit.value).catch((error) => {
    console.error("Error fetching events:", error);
  });
});

// Filtered events are handled by the API, so we just use currentEvents
const filteredEvents = computed(() => {
  return currentEvents.value;
});

// Watch for today filter - if enabled, clear date filter
watch(todayFilter, (newValue) => {
  if (newValue && dateFilter.value) {
    dateFilter.value = '';
  }
});

// Watch for date filter - if set, clear today filter
watch(dateFilter, (newValue) => {
  if (newValue && todayFilter.value) {
    todayFilter.value = false;
  }
});
</script>

