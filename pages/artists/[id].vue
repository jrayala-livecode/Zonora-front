<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span class="ml-3 text-gray-400 text-lg">Cargando artista...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-red-400 mb-2">Error al cargar artista</h3>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="loadArtist"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Intentar de nuevo
          </button>
          <NuxtLink
            to="/artists"
            class="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
          >
            Volver a artistas
          </NuxtLink>
        </div>
      </div>

      <!-- Artist Content -->
      <div v-else-if="artist">
        <!-- Back Button -->
        <div class="mb-6">
          <NuxtLink
            to="/artists"
            class="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a artistas
          </NuxtLink>
        </div>

        <!-- Artist Header -->
        <div class="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
          <!-- Hero Image -->
          <div class="relative h-64 md:h-80 bg-gradient-to-br from-orange-500 to-red-600">
            <img
              v-if="artist.profile_picture_url"
              :src="$convertImageUrl(artist.profile_picture_url)"
              :alt="artist.stage_name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            
            <!-- Status Badges -->
            <div class="absolute top-4 right-4 flex flex-col space-y-2">
              <span 
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  artist.is_public 
                    ? 'bg-green-900/80 text-green-200' 
                    : 'bg-red-900/80 text-red-200'
                ]"
              >
                {{ artist.is_public ? 'Público' : 'Privado' }}
              </span>
              <span v-if="artist.has_active_subscription" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-900/80 text-orange-200">
                Activo
              </span>
            </div>
          </div>

          <!-- Artist Info -->
          <div class="p-8">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between">
              <div class="flex-1">
                <h1 class="text-4xl font-bold text-white mb-2">{{ artist.stage_name }}</h1>
                <p v-if="artist.user" class="text-xl text-gray-400 mb-4">{{ artist.user.name }}</p>
                
                <!-- Genres -->
                <div v-if="artist.genres && artist.genres.length > 0" class="mb-6">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="genre in artist.genres" 
                      :key="genre"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-900/20 text-orange-300 border border-orange-700/30"
                    >
                      {{ genre }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <button
                  v-if="artist.social_links && artist.social_links.length > 0"
                  @click="showSocialLinks = !showSocialLinks"
                  class="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Enlaces
                </button>
                
                <button
                  class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Seguir
                </button>
              </div>
            </div>

            <!-- Social Links Dropdown -->
            <div v-if="showSocialLinks && artist.social_links && artist.social_links.length > 0" class="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 class="text-lg font-semibold text-white mb-3">Enlaces Sociales</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  v-for="(link, index) in artist.social_links"
                  :key="index"
                  :href="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {{ link }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Bio Section -->
        <div v-if="artist.bio" class="bg-gray-800 rounded-xl shadow-xl mb-8">
          <div class="p-8">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Biografía
            </h2>
            <p class="text-gray-300 leading-relaxed">{{ artist.bio }}</p>
          </div>
        </div>

        <!-- Gallery Section -->
        <div v-if="artist.image_ids && artist.image_ids.length > 0" class="bg-gray-800 rounded-xl shadow-xl mb-8">
          <div class="p-8">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Galería
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(imageId, index) in artist.image_ids" 
                :key="index" 
                class="relative group cursor-pointer" 
                @click="openImageModal(imageId)"
              >
                <img 
                  :src="getImageUrl(imageId)" 
                  :alt="`${artist.stage_name} - Imagen ${index + 1}`"
                  class="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Links Section -->
        <!-- Artist Links Section -->
        <div v-if="artistLinks.length > 0" class="bg-gray-800 rounded-xl shadow-xl mb-8">
          <div class="p-8">
            <ArtistLinks :links="artistLinks" />
          </div>
        </div>

        <!-- Profile Information Section -->
        <div class="bg-gray-800 rounded-xl shadow-xl mb-8">
          <div class="p-8">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información del Perfil
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Profile Status -->
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <span class="text-gray-300">Estado del Perfil</span>
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    artist.is_public 
                      ? 'bg-green-900/20 text-green-300 border border-green-700/30' 
                      : 'bg-red-900/20 text-red-300 border border-red-700/30'
                  ]">
                    {{ artist.is_public ? 'Público' : 'Privado' }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <span class="text-gray-300">Suscripción</span>
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    artist.has_active_subscription 
                      ? 'bg-orange-900/20 text-orange-300 border border-orange-700/30' 
                      : 'bg-gray-900/20 text-gray-300 border border-gray-700/30'
                  ]">
                    {{ artist.has_active_subscription ? 'Activa' : 'Inactiva' }}
                  </span>
                </div>
              </div>

              <!-- Profile Details -->
              <div class="space-y-4">
                <div class="p-4 bg-gray-700 rounded-lg">
                  <span class="text-gray-300 block mb-2">Nombre Artístico</span>
                  <span class="text-white font-medium">{{ artist.stage_name }}</span>
                </div>
                
                <div v-if="artist.user" class="p-4 bg-gray-700 rounded-lg">
                  <span class="text-gray-300 block mb-2">Usuario</span>
                  <span class="text-white font-medium">{{ artist.user.name }}</span>
                </div>
                
                <div v-if="artist.genres && artist.genres.length > 0" class="p-4 bg-gray-700 rounded-lg">
                  <span class="text-gray-300 block mb-2">Géneros</span>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span 
                      v-for="genre in artist.genres" 
                      :key="genre"
                      class="px-2 py-1 bg-orange-900/20 text-orange-300 text-xs rounded-full border border-orange-700/30"
                    >
                      {{ genre }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeImageModal">
        <div class="relative max-w-4xl max-h-full p-4">
          <button 
            @click="closeImageModal" 
            class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            :src="selectedImage" 
            :alt="`${artist?.stage_name} - Imagen ampliada`"
            class="max-w-full max-h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const route = useRoute();
const { getArtist } = useArtists();

// Artist links functionality
const { links: artistLinks, getLinks } = useArtistLinks();

// State
const artist = ref<any>(null);
const loading = ref(true);
const error = ref('');
const showSocialLinks = ref(false);
const selectedImage = ref('');

// Methods
const loadArtist = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    artist.value = await getArtist(route.params.id as string);
    
    // Load artist links
    if (artist.value) {
      await getLinks(parseInt(route.params.id as string));
    }
  } catch (err: any) {
    error.value = err.message || 'Error al cargar artista';
    console.error('Error loading artist:', err);
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

const getImageUrl = (imageId: string) => {
  // Convert to proxy URL to avoid rate limiting
  const { convertToProxyUrl } = useImageProxy();
  return convertToProxyUrl(`https://gateway.pinata.cloud/ipfs/${imageId}`);
};

const openImageModal = (imageId: string) => {
  selectedImage.value = getImageUrl(imageId);
};

const closeImageModal = () => {
  selectedImage.value = '';
};

// Lifecycle
onMounted(() => {
  loadArtist();
});

// SEO
useHead(() => ({
  title: artist.value ? `${artist.value.stage_name} - Zonora` : 'Artista - Zonora',
  meta: [
    { 
      name: 'description', 
      content: artist.value?.bio || 'Perfil del artista en Zonora' 
    }
  ]
}));
</script>