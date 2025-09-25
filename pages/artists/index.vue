<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          Artistas
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Descubre talentos increíbles y conecta con artistas de todos los géneros musicales
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-gray-800 rounded-xl shadow-xl mb-8">
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Search Input -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Buscar artistas por nombre, género o biografía..."
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <!-- Genre Filter -->
            <div class="md:w-64">
              <select
                v-model="selectedGenre"
                @change="applyFilters"
                class="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Todos los géneros</option>
                <option v-for="genre in availableGenres" :key="genre" :value="genre">
                  {{ genre }}
                </option>
              </select>
            </div>

            <!-- Sort Options -->
            <div class="md:w-48">
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name">Ordenar por nombre</option>
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
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
      <div v-else-if="!loading && filteredArtists.length === 0" class="text-center py-12">
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
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ArtistCard
          v-for="artist in paginatedArtists"
          :key="artist.id"
          :artist="artist"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center mt-12">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
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
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
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
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
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
      <div v-if="filteredArtists.length > 0" class="text-center mt-8">
        <p class="text-gray-400">
          Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
          {{ Math.min(currentPage * itemsPerPage, filteredArtists.length) }} 
          de {{ filteredArtists.length }} artistas
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { debounce } from 'lodash-es';

const { getArtists, searchArtists } = useArtists();

// State
const artists = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const selectedGenre = ref('');
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Computed
const availableGenres = computed(() => {
  const genres = new Set();
  artists.value.forEach(artist => {
    if (artist.genres) {
      artist.genres.forEach(genre => genres.add(genre));
    }
  });
  return Array.from(genres).sort();
});

const filteredArtists = computed(() => {
  let filtered = [...artists.value];

  // Apply genre filter
  if (selectedGenre.value) {
    filtered = filtered.filter(artist => 
      artist.genres && artist.genres.includes(selectedGenre.value)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.stage_name.localeCompare(b.stage_name);
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'oldest':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredArtists.value.length / itemsPerPage.value));

const paginatedArtists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredArtists.value.slice(start, end);
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
    if (searchQuery.value.trim()) {
      artists.value = await searchArtists(searchQuery.value.trim());
    } else {
      artists.value = await getArtists();
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
  sortBy.value = 'name';
  currentPage.value = 1;
  loadArtists();
};

// Watch for filter changes
watch([selectedGenre, sortBy], () => {
  applyFilters();
});

// Lifecycle
onMounted(() => {
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
