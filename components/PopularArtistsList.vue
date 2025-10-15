<template>
  <div class="bg-gray-800 rounded-xl shadow-xl p-6">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-white mb-2">Artistas Populares</h2>
      <p class="text-gray-400">Los artistas más vistos esta semana</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="flex items-center space-x-4 animate-pulse">
        <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
        <div class="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div class="w-20 h-8 bg-gray-700 rounded"></div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <svg class="mx-auto h-8 w-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(artist, index) in popularArtists" 
        :key="artist.id"
        class="flex items-center space-x-4 p-4 hover:bg-gray-700 rounded-lg transition-colors duration-200"
      >
        <div class="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
          {{ index + 1 }}
        </div>
        
        <div class="flex-shrink-0">
          <img
            v-if="artist.profile_picture_url && !imageLoadFailed[artist.id]"
            :src="artist.profile_picture_url"
            :alt="artist.stage_name"
            class="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            @error="() => onArtistImageError(artist.id)"
          />
          <div
            v-else
            class="w-12 h-12 rounded-full border-2 border-gray-600 bg-gray-700 text-gray-300 flex items-center justify-center text-center text-[10px] uppercase tracking-wide"
            aria-label="Sin imagen"
            role="img"
          >
            Sin Imagen
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-white truncate">{{ artist.stage_name }}</h3>
          <p class="text-sm text-gray-400">
            {{ formatNumber(artist.view_count) }} visualizaciones
          </p>
        </div>
        
        <div class="flex-shrink-0">
          <NuxtLink 
            :to="`/artists/${artist.id}`"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
          >
            Ver Perfil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Artist } from '~/composables/types/types';

const popularArtists = ref<Artist[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const imageLoadFailed = ref<Record<number, boolean>>({});

const onArtistImageError = (artistId: number) => {
  imageLoadFailed.value[artistId] = true;
};

const fetchPopularArtists = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const config = useRuntimeConfig();
    const apiBaseUrl = config.public.apiBaseUrl || 'http://127.0.0.1:8000/api';
    
    const response = await fetch(`${apiBaseUrl}/artists/popular?limit=10`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch popular artists');
    }
    
    popularArtists.value = data.data;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch popular artists';
    console.error('Error fetching popular artists:', err);
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

onMounted(() => {
  fetchPopularArtists();
});
</script>

<style scoped>
/* All styles are now handled by Tailwind classes in the template */
</style>
