<template>
  <div class="bg-gray-800 rounded-xl shadow-xl p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-white">Métricas de Rendimiento</h3>
      <div class="text-sm text-gray-400">Actualizado: {{ lastUpdated }}</div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Views -->
      <div class="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
        <div class="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
          <Icon name="heroicons:eye" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xl font-semibold text-white">{{ formatNumber(totalViews) }}</div>
          <div class="text-sm text-gray-400">Total Visualizaciones</div>
        </div>
      </div>

      <!-- Views Today -->
      <div class="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
        <div class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Icon name="heroicons:calendar-days" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xl font-semibold text-white">{{ formatNumber(viewsToday) }}</div>
          <div class="text-sm text-gray-400">Visualizaciones Hoy</div>
        </div>
      </div>

      <!-- Unique Viewers Today -->
      <div class="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
        <div class="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
          <Icon name="heroicons:users" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xl font-semibold text-white">{{ formatNumber(uniqueViewersToday) }}</div>
          <div class="text-sm text-gray-400">Visitantes Únicos</div>
        </div>
      </div>

      <!-- Total Follows -->
      <div class="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
        <div class="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <Icon name="heroicons:heart" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xl font-semibold text-white">{{ formatNumber(totalFollows) }}</div>
          <div class="text-sm text-gray-400">Total Seguidores</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArtistMetrics } from '~/composables/types/types';

interface Props {
  metrics: ArtistMetrics | null;
}

const props = defineProps<Props>();

const totalViews = computed(() => props.metrics?.total_views || 0);
const totalFollows = computed(() => props.metrics?.total_follows || 0);
const viewsToday = computed(() => props.metrics?.current_metrics.views_today || 0);
const uniqueViewersToday = computed(() => props.metrics?.current_metrics.unique_viewers_today || 0);

const lastUpdated = computed(() => {
  return new Date().toLocaleString();
});

const formatNumber = (num: number): string => {
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
