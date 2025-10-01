<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="text-lg font-semibold text-gray-900">Performance Trends</h3>
      <div class="chart-controls">
        <select v-model="selectedMetric" class="chart-select">
          <option value="view_count">Views</option>
          <option value="follow_count">Follows</option>
          <option value="search_count">Searches</option>
        </select>
      </div>
    </div>
    
    <div class="chart-content">
      <canvas ref="chartCanvas" class="w-full h-64"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import type { DailyMetric } from '~/composables/types/types';

interface Props {
  historicalMetrics: DailyMetric[];
}

const props = defineProps<Props>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const selectedMetric = ref('view_count');
let chart: any = null;

const prepareChartData = () => {
  const data = props.historicalMetrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString(),
    value: metric[selectedMetric.value as keyof DailyMetric] as number
  }));

  return {
    labels: data.map(d => d.date),
    datasets: [{
      label: selectedMetric.value.replace('_', ' ').toUpperCase(),
      data: data.map(d => d.value),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
};

const createChart = async () => {
  if (!chartCanvas.value) return;

  // Dynamic import for Chart.js
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  if (chart) {
    chart.destroy();
  }

  const chartData = prepareChartData();

  chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
};

watch(selectedMetric, () => {
  nextTick(() => {
    createChart();
  });
});

onMounted(() => {
  nextTick(() => {
    createChart();
  });
});
</script>

<style scoped>
.chart-container {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.chart-header {
  @apply flex justify-between items-center mb-6;
}

.chart-controls {
  @apply flex space-x-2;
}

.chart-select {
  @apply px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.chart-content {
  @apply relative;
}
</style>
