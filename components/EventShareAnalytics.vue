<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p class="text-gray-400">Cargando analíticas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900 border border-red-700 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-200">{{ error }}</p>
      </div>
    </div>

    <!-- Analytics Content -->
    <div v-else-if="analytics">
      <!-- Overview Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Total Shares -->
        <div class="bg-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Veces Compartido</span>
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-white">{{ analytics.total_shares }}</div>
        </div>

        <!-- Total Clicks -->
        <div class="bg-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Clics Totales</span>
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-white">{{ analytics.total_clicks }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ analytics.click_rate }} clics/compartido</div>
        </div>

        <!-- Unique Visitors -->
        <div class="bg-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Visitantes Únicos</span>
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-white">{{ analytics.unique_visitors }}</div>
        </div>

        <!-- Interested Count -->
        <div class="bg-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Interesados</span>
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-white">{{ analytics.interested_count }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ analytics.interest_conversion }}% conversión</div>
        </div>
      </div>

      <!-- Conversion Funnel -->
      <div class="bg-gray-700 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Embudo de Conversión
        </h3>
        
        <div class="space-y-3">
          <!-- Clicks -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-300">Clics</span>
              <span class="text-white font-semibold">{{ analytics.total_clicks }}</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-3">
              <div class="bg-blue-500 h-3 rounded-full" :style="{ width: '100%' }"></div>
            </div>
          </div>

          <!-- Interest -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-300">Mostraron Interés</span>
              <span class="text-white font-semibold">{{ analytics.interested_count }} ({{ analytics.interest_conversion }}%)</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-3">
              <div class="bg-red-500 h-3 rounded-full transition-all duration-500" 
                   :style="{ width: analytics.total_clicks > 0 ? `${(analytics.interested_count / analytics.total_clicks) * 100}%` : '0%' }">
              </div>
            </div>
          </div>

          <!-- Purchases -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-300">Compraron Tickets</span>
              <span class="text-white font-semibold">{{ analytics.purchased_count }} ({{ analytics.purchase_conversion }}%)</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-3">
              <div class="bg-green-500 h-3 rounded-full transition-all duration-500"
                   :style="{ width: analytics.total_clicks > 0 ? `${(analytics.purchased_count / analytics.total_clicks) * 100}%` : '0%' }">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Chart -->
      <div v-if="analytics.timeline && analytics.timeline.length > 0" class="bg-gray-700 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Clics en los Últimos 30 Días
        </h3>
        
        <div class="space-y-2">
          <div v-for="(day, index) in analytics.timeline" :key="index" class="flex items-center space-x-3">
            <div class="text-xs text-gray-400 w-24 text-right">{{ formatDate(day.date) }}</div>
            <div class="flex-1 bg-gray-800 rounded-full h-6 relative">
              <div 
                class="bg-orange-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                :style="{ width: `${getBarWidth(day.clicks, analytics.timeline)}%` }"
              >
                <span class="text-white text-xs font-semibold" v-if="day.clicks > 0">{{ day.clicks }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Sharers -->
      <div v-if="analytics.top_sharers && analytics.top_sharers.length > 0" class="bg-gray-700 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Mejores Compartidores
        </h3>
        
        <div class="space-y-3">
          <div v-for="(sharer, index) in analytics.top_sharers" :key="sharer.user_id" 
               class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-white font-medium">{{ sharer.user_name }}</p>
                <p class="text-xs text-gray-400">{{ sharer.clicks }} clics</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center space-x-2 text-xs">
                <span class="text-red-400">{{ sharer.conversions.interest }} ❤️</span>
                <span class="text-green-400">{{ sharer.conversions.purchase }} 🎟️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div v-if="analytics.total_shares === 0" class="bg-gray-700 rounded-lg p-8 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">Aún no hay datos de compartición</h3>
        <p class="text-gray-400 text-sm">
          Comparte tu evento usando el botón "Compartir" en la página del evento para empezar a rastrear las estadísticas.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useEventShareAnalytics } from '~/composables/useEventShareAnalytics';
import type { TimelineData } from '~/composables/types/types';

const props = defineProps<{
  eventId: number;
}>();

const { analytics, loading, error, fetchAnalytics } = useEventShareAnalytics();

onMounted(async () => {
  try {
    await fetchAnalytics(props.eventId);
  } catch (e) {
    // Error is already set in the composable
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
};

const getBarWidth = (clicks: number, timeline: TimelineData[]) => {
  const maxClicks = Math.max(...timeline.map(d => d.clicks), 1);
  return Math.max((clicks / maxClicks) * 100, 5); // Minimum 5% for visibility
};
</script>

