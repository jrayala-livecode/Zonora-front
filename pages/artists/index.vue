<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-white mb-2">
          Artistas
        </h1>
        <p class="text-sm text-gray-400 max-w-xl mx-auto">
          Descubre talentos increíbles y conecta con artistas de todos los géneros musicales
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-gray-800 rounded-lg shadow-lg mb-4">
        <div class="p-4">
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Buscar artistas..."
                  class="block w-full pl-8 pr-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <!-- Genre Filter -->
            <div class="md:w-48">
              <select
                v-model="selectedGenre"
                @change="applyFilters"
                class="block w-full px-2.5 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Todos los géneros</option>
                <option v-for="genre in availableGenres" :key="genre" :value="genre">
                  {{ genre }}
                </option>
              </select>
            </div>

            <!-- Proficiency Filter (only show if proficiencies exist) -->
            <div v-if="proficiencies.length > 0" class="md:w-48">
              <select
                v-model="selectedProficiencyId"
                @change="applyFilters"
                class="block w-full px-2.5 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Todos los instrumentos</option>
                <option v-for="proficiency in proficiencies" :key="proficiency.id" :value="proficiency.id">
                  {{ proficiency.proficiency }}
                </option>
              </select>
            </div>

            <!-- Sort Options -->
            <div class="md:w-40">
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="block w-full px-2.5 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name">Por nombre</option>
                <option value="newest">Recientes</option>
                <option value="oldest">Antiguos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span class="ml-3 text-gray-400 text-lg">Cargando artistas...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-red-400 mb-2">Error al cargar artistas</h3>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <button
          @click="loadArtists"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Intentar de nuevo
        </button>
      </div>

      <!-- No Results State -->
      <div v-else-if="!loading && artists.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">
          {{ searchQuery || selectedGenre ? 'No se encontraron artistas' : 'No hay artistas disponibles' }}
        </h3>
        <p class="text-gray-400 mb-6">
          {{ searchQuery || selectedGenre 
            ? 'Intenta ajustar tus filtros de búsqueda' 
            : 'Aún no hay artistas registrados en la plataforma' 
          }}
        </p>
        <button
          v-if="searchQuery || selectedGenre"
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
        >
          Limpiar filtros
        </button>
      </div>

      <!-- Artists Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <ArtistCard
          v-for="artist in artists"
          :key="artist.id"
          :artist="artist"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center mt-6">
        <nav class="flex items-center space-x-1.5">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-2 py-1.5 rounded text-xs font-medium transition-colors duration-200',
              currentPage === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            Anterior
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-2 py-1.5 rounded text-xs font-medium transition-colors duration-200',
                currentPage === page
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-2 py-1.5 rounded text-xs font-medium transition-colors duration-200',
              currentPage === totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            Siguiente
          </button>
        </nav>
      </div>

      <!-- Results Count -->
      <div v-if="totalArtists > 0" class="text-center mt-4">
        <p class="text-gray-400 text-xs">
          Mostrando {{ pagination?.from || 0 }} - 
          {{ pagination?.to || 0 }} 
          de {{ totalArtists }} artistas
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { debounce } from 'lodash-es';

const { getArtists, searchArtists } = useArtists();
const { fetchProficiencies, searchArtistsByProficiency, proficiencies } = useProficiencies();

// State
const artists = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const selectedGenre = ref('');
const selectedProficiencyId = ref('');
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(12);
const pagination = ref(null);
const totalArtists = ref(0);

// Computed
const availableGenres = computed(() => {
  const genres = new Set();
  artists.value.forEach(artist => {
    if (artist.genres && Array.isArray(artist.genres)) {
      artist.genres.forEach(genre => genres.add(genre));
    }
  });
  return Array.from(genres).sort();
});

const totalPages = computed(() => {
  return pagination.value ? pagination.value.last_page : 1;
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const loadArtists = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // If proficiency filter is selected, use proficiency search
    if (selectedProficiencyId.value) {
      const result = await searchArtistsByProficiency(
        parseInt(selectedProficiencyId.value), 
        currentPage.value, 
        itemsPerPage.value
      );
      artists.value = result.data;
      pagination.value = result.pagination;
      totalArtists.value = result.pagination?.total || 0;
    } else {
      const params = {
        page: currentPage.value,
        per_page: itemsPerPage.value,
        sort_by: sortBy.value,
        genre: selectedGenre.value || undefined
      };

      let result;
      if (searchQuery.value.trim()) {
        result = await searchArtists(searchQuery.value.trim(), params);
      } else {
        result = await getArtists(params);
      }

      artists.value = result.data;
      pagination.value = result.pagination;
      totalArtists.value = result.pagination?.total || 0;
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar artistas';
    console.error('Error loading artists:', err);
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  loadArtists();
}, 500);

const applyFilters = () => {
  currentPage.value = 1;
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedGenre.value = '';
  selectedProficiencyId.value = '';
  sortBy.value = 'name';
  currentPage.value = 1;
  loadArtists();
};

// Watch for filter changes
watch([selectedGenre, selectedProficiencyId, sortBy], () => {
  applyFilters();
});

// Watch for page changes
watch(currentPage, () => {
  loadArtists();
});

// Lifecycle
onMounted(async () => {
  // Load proficiencies for filter dropdown (silently fails if none exist)
  try {
    await fetchProficiencies();
  } catch (err) {
    // Silently fail - proficiencies are optional
  }
  // Load artists
  loadArtists();
});

// SEO
useHead({
  title: 'Artistas - Zonora',
  meta: [
    { name: 'description', content: 'Descubre talentos increíbles y conecta con artistas de todos los géneros musicales en Zonora' }
  ]
});
</script>
