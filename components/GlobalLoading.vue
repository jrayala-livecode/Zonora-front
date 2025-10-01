<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-8 shadow-xl">
      <div class="flex flex-col items-center space-y-4">
        <!-- Loading Spinner -->
        <div class="relative">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <div class="absolute inset-0 rounded-full h-12 w-12 border-2 border-gray-600"></div>
        </div>
        
        <!-- Loading Text -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-white mb-2">Cargando...</h3>
          <p class="text-gray-400 text-sm">
            {{ loadingMessage }}
          </p>
        </div>
        
        <!-- Progress Bar (optional) -->
        <div class="w-48 bg-gray-700 rounded-full h-1">
          <div class="bg-orange-500 h-1 rounded-full animate-pulse" style="width: 60%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  isLoading?: boolean
  loadingMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  loadingMessage: 'Cargando página...'
})

// Global loading state
const globalLoading = ref(false)
const globalLoadingMessage = ref('Cargando...')

// Computed properties
const isLoading = computed(() => props.isLoading || globalLoading.value)
const loadingMessage = computed(() => props.loadingMessage || globalLoadingMessage.value)

// Expose methods for external control
const showLoading = (message: string = 'Cargando...') => {
  globalLoading.value = true
  globalLoadingMessage.value = message
}

const hideLoading = () => {
  globalLoading.value = false
}

// Expose methods globally
defineExpose({
  showLoading,
  hideLoading
})
</script>
