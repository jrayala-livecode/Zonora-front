<template>
  <NuxtLink
    :to="to"
    :class="[
      'inline-flex items-center transition-colors duration-200',
      loading ? 'opacity-50 cursor-not-allowed' : '',
      linkClass
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
    
    <!-- Icon (if provided) -->
    <component
      v-if="icon && !loading"
      :is="icon"
      :class="iconClass"
    />
    
    <!-- Content -->
    <span v-if="$slots.default" :class="textClass">
      <slot />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  to: string
  linkClass?: string
  textClass?: string
  icon?: any
  iconClass?: string
  loadingMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  linkClass: '',
  textClass: '',
  iconClass: 'w-4 h-4 mr-2',
  loadingMessage: 'Navegando...'
})

const { showLoading, hideLoading } = useLoading()
const loading = ref(false)
const route = useRoute()

const handleClick = async (event: Event) => {
  if (loading.value) {
    event.preventDefault()
    return
  }

  loading.value = true
  showLoading(props.loadingMessage)

  // Add small delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 150))

  // Let NuxtLink handle the navigation
  // The plugin will manage the loading state during navigation
  
  // Fallback timeout to ensure loading state is reset
  setTimeout(() => {
    loading.value = false
  }, 3000) // 3 second fallback
}

// Watch for route changes to reset loading state
watch(() => route.path, () => {
  loading.value = false
}, { immediate: true })
</script>
