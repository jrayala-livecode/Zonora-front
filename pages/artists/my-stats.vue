<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          Mis Estadísticas de Artista
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Rastrea el rendimiento y analiza el crecimiento de tus artistas
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span class="ml-3 text-gray-400 text-lg">Cargando estadísticas...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-red-400 mb-2">Error al cargar estadísticas</h3>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <button 
          @click="fetchMyArtistStats"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Intentar de nuevo
        </button>
      </div>

      <div v-else-if="stats" class="space-y-8">
        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gray-800 rounded-xl shadow-xl p-6 text-center">
            <div class="text-3xl font-bold text-white mb-2">{{ stats?.total_artists || 0 }}</div>
            <div class="text-sm text-gray-400">Total Artistas</div>
          </div>
          
          <div class="bg-gray-800 rounded-xl shadow-xl p-6 text-center">
            <div class="text-3xl font-bold text-orange-500 mb-2">{{ formatNumber(stats?.total_views) }}</div>
            <div class="text-sm text-gray-400">Total Visualizaciones</div>
          </div>
          
          <div class="bg-gray-800 rounded-xl shadow-xl p-6 text-center">
            <div class="text-3xl font-bold text-green-500 mb-2">{{ formatNumber(stats?.total_follows) }}</div>
            <div class="text-sm text-gray-400">Total Seguidores</div>
          </div>
          
          <div class="bg-gray-800 rounded-xl shadow-xl p-6 text-center">
            <div class="text-3xl font-bold text-blue-500 mb-2">{{ formatNumber(stats?.average_views_per_artist) }}</div>
            <div class="text-sm text-gray-400">Promedio por Artista</div>
          </div>
        </div>

        <!-- Most Viewed Artist -->
        <div v-if="stats?.most_viewed_artist" class="bg-gray-800 rounded-xl shadow-xl p-6">
          <h3 class="text-xl font-bold text-white mb-4">Artista Más Visto</h3>
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-semibold text-white mb-1">{{ stats.most_viewed_artist.stage_name }}</h4>
              <p class="text-orange-500 font-medium">{{ formatNumber(stats.most_viewed_artist.view_count) }} visualizaciones</p>
            </div>
            <NuxtLink 
              :to="`/artists/${stats.most_viewed_artist.id}`"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
            >
              Ver Perfil
            </NuxtLink>
          </div>
        </div>

        <!-- All Artists Performance -->
        <div class="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div class="p-6 border-b border-gray-700">
            <h3 class="text-xl font-bold text-white">Rendimiento de Todos los Artistas</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre del Artista</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Visualizaciones</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seguidores</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-gray-800 divide-y divide-gray-700">
                <tr 
                  v-for="artist in stats?.artists || []" 
                  :key="artist.id"
                  class="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">{{ artist.stage_name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">{{ formatNumber(artist.view_count) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">{{ formatNumber(artist.follow_count) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        artist.is_public 
                          ? 'bg-green-900/80 text-green-200' 
                          : 'bg-red-900/80 text-red-200'
                      ]"
                    >
                      {{ artist.is_public ? 'Público' : 'Privado' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <NuxtLink 
                      :to="`/artists/${artist.id}`"
                      class="text-orange-500 hover:text-orange-400 transition-colors duration-200"
                    >
                      Ver
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArtistMetrics } from '~/composables/useArtistMetrics';

const { stats, loading, error, fetchMyArtistStats } = useArtistMetrics();

onMounted(() => {
  fetchMyArtistStats();
});

const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
</script>

<style scoped>
/* All styles are now handled by Tailwind classes in the template */
</style>
