<template>
  <div class="py-4">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
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
      <div v-else-if="artist" class="space-y-4">
        <!-- Back Button -->
        <div class="mb-4">
          <NuxtLink
            to="/artists"
            class="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors duration-200 text-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a artistas
          </NuxtLink>
        </div>

        <!-- Compact Grid Layout -->
        <div class="space-y-3">
          <!-- Row 1: Main Card -->
          <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <!-- Hero Image -->
            <div class="relative h-48 md:h-56 bg-gradient-to-br from-orange-500 to-red-600">
              <img
                v-if="artist.profile_picture_url"
                :src="getImageUrl(artist.profile_picture_url)"
                :alt="artist.stage_name"
                class="w-full h-full object-cover object-center"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-10 h-10 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              
              <!-- Status Badges -->
              <div class="absolute top-2 right-2 flex space-x-1">
                <span 
                  :class="[
                    'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                    artist.is_public 
                      ? 'bg-green-900/80 text-green-200' 
                      : 'bg-red-900/80 text-red-200'
                  ]"
                >
                  {{ artist.is_public ? 'Público' : 'Privado' }}
                </span>
                <span v-if="artist.has_active_subscription" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-900/80 text-orange-200">
                  Activo
                </span>
              </div>

              <!-- Message Button -->
              <div v-if="!isOwner" class="absolute bottom-3 right-3">
                <button
                  @click="startConversation"
                  class="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors duration-200 shadow-lg"
                >
                  <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Enviar Mensaje
                </button>
              </div>
            </div>

            <!-- Compact Info -->
            <div class="p-3">
              <h1 class="text-lg font-bold text-white mb-0.5">{{ artist.stage_name }}</h1>
              <p v-if="artist.user" class="text-xs text-gray-400 mb-2">{{ artist.user.name }}</p>
              
              <!-- Genres -->
              <div v-if="artist.genres && artist.genres.length > 0" class="mb-2">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="genre in artist.genres.slice(0, 3)" 
                    :key="genre"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-900/20 text-orange-300 border border-orange-700/30"
                  >
                    {{ genre }}
                  </span>
                  <span v-if="artist.genres.length > 3" class="text-xs text-gray-400">
                    +{{ artist.genres.length - 3 }} más
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <FollowButton 
                  :artist-id="artist.id" 
                  :initial-follow-status="artist.follow_status?.is_following"
                  @follow-changed="handleFollowChanged"
                />
                <button class="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors duration-200">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Compartir
                </button>
              </div>
            </div>
          </div>

          <!-- Row 2: Bio, Genres, Links -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Bio Card -->
            <div v-if="artist.bio" class="bg-gray-800 rounded-lg shadow-lg p-3">
              <h3 class="text-xs font-semibold text-white mb-1.5 flex items-center">
                <div class="w-4 h-4 bg-orange-500 rounded flex items-center justify-center mr-1.5">
                  <span class="text-white font-bold text-xs">📝</span>
                </div>
                Biografía
              </h3>
              <p class="text-gray-300 text-xs leading-relaxed line-clamp-3">{{ artist.bio }}</p>
            </div>

            <!-- Genres Card -->
            <div v-if="artist.genres && artist.genres.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-3">
              <h3 class="text-xs font-semibold text-white mb-2 flex items-center">
                <div class="w-4 h-4 bg-orange-500 rounded flex items-center justify-center mr-1.5">
                  <span class="text-white font-bold text-xs">🎵</span>
                </div>
                Géneros
              </h3>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="genre in artist.genres.slice(0, 4)" 
                  :key="genre"
                  class="px-1.5 py-0.5 bg-orange-900/20 text-orange-300 text-xs rounded border border-orange-700/30"
                >
                  {{ genre }}
                </span>
                <span v-if="artist.genres.length > 4" class="text-xs text-gray-400">
                  +{{ artist.genres.length - 4 }}
                </span>
              </div>
            </div>

            <!-- Artist Links Card -->
            <div class="bg-gray-800 rounded-lg shadow-lg p-3">
              <ArtistLinks :links="artistLinks" />
            </div>
          </div>

          <!-- Followed Artists Card -->
          <div v-if="artist.following && artist.following.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 class="text-sm font-semibold text-white mb-3 flex items-center">
              <div class="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2">
                <span class="text-white font-bold text-xs">👥</span>
              </div>
              Artistas que sigue ({{ artist.following.length }})
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <NuxtLink 
                v-for="followedArtist in artist.following.slice(0, 6)" 
                :key="followedArtist.id"
                :to="`/artists/${followedArtist.id}`"
                class="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <img 
                  v-if="followedArtist.profile_picture_url"
                  :src="getImageUrl(followedArtist.profile_picture_url)"
                  :alt="followedArtist.stage_name"
                  class="w-10 h-10 rounded-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">{{ followedArtist.stage_name }}</p>
                  <p v-if="followedArtist.genres && followedArtist.genres.length > 0" class="text-xs text-gray-400 truncate">
                    {{ followedArtist.genres.slice(0, 2).join(', ') }}
                  </p>
                </div>
              </NuxtLink>
            </div>
            <div v-if="artist.following.length > 6" class="mt-3 text-center">
              <button class="text-xs text-orange-400 hover:text-orange-300">
                Ver {{ artist.following.length - 6 }} más
              </button>
            </div>
          </div>

          <!-- Metrics Section (for artist owners) -->
          <div v-if="isOwner && metrics" class="space-y-4">
            <ArtistMetricsCard :metrics="metrics" />
            
            <div v-if="metrics.historical_metrics && metrics.historical_metrics.length > 0">
              <ArtistMetricsChart :historical-metrics="metrics.historical_metrics" />
            </div>
          </div>

          <!-- Gallery Card (if exists) -->
          <div v-if="artist.image_ids && artist.image_ids.length > 0" class="bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 class="text-sm font-semibold text-white mb-3 flex items-center">
              <div class="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2">
                <span class="text-white font-bold text-xs">🖼️</span>
              </div>
              Galería ({{ artist.image_ids.length }})
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div 
                v-for="(imageId, index) in artist.image_ids.slice(0, 8)" 
                :key="index" 
                class="relative group cursor-pointer" 
                @click="openImageModal(imageId)"
              >
                <img 
                  :src="getImageUrl(imageId)" 
                  :alt="`${artist.stage_name} - Imagen ${index + 1}`"
                  class="w-full h-20 object-cover rounded transition-transform duration-200 group-hover:scale-105"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
            <div v-if="artist.image_ids.length > 8" class="mt-2 text-center">
              <button 
                @click="openImageModal(artist.image_ids[0])"
                class="text-xs text-orange-400 hover:text-orange-300"
              >
                Ver {{ artist.image_ids.length - 8 }} más
              </button>
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
import { ref, onMounted, computed, watchEffect } from 'vue';

const route = useRoute();
const { getArtist } = useArtists();
const { user } = useAuth();

// Artist links functionality
const { links: artistLinks, getLinks } = useArtistLinks();

// Artist metrics functionality
const { metrics, fetchArtistMetrics } = useArtistMetrics();

// State
const artist = ref<any>(null);
const loading = ref(true);
const error = ref('');
const showSocialLinks = ref(false);
const selectedImage = ref('');

// Computed
const isOwner = computed(() => {
  return user.value && artist.value && artist.value.user_id === user.value.id;
});

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

const handleFollowChanged = (isFollowing: boolean) => {
  // Update the artist's follow status in the local state
  if (artist.value && artist.value.follow_status) {
    artist.value.follow_status.is_following = isFollowing;
  }
};

const startConversation = () => {
  if (!artist.value || !artist.value.user) return;
  
  // Navigate to chat with the artist's user ID
  navigateTo(`/chat/${artist.value.user.id}`);
};

// Watch for artist changes to fetch metrics
watchEffect(() => {
  if (isOwner.value && artist.value) {
    fetchArtistMetrics(artist.value.id);
  }
});

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