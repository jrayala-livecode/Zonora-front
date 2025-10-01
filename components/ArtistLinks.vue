<template>
  <div class="space-y-2">
    <h3 class="text-sm font-semibold text-white mb-2 flex items-center">
      <div class="w-5 h-5 bg-orange-500 rounded flex items-center justify-center mr-2">
        <span class="text-white font-bold text-xs">🔗</span>
      </div>
      Enlaces ({{ links.length }})
    </h3>
    
    <div v-if="links.length > 0" class="space-y-1">
      <a
        v-for="link in links.slice(0, 3)"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors duration-200 group"
      >
        <div class="flex-shrink-0">
          <div class="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
            <i :class="getIconClass(link.icon)" class="text-white text-sm"></i>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white text-xs font-medium truncate group-hover:text-orange-400 transition-colors duration-200">
            {{ link.title }}
          </p>
          <p class="text-gray-400 text-xs truncate">
            {{ formatUrl(link.url) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <svg class="w-3 h-3 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
      </a>
      <div v-if="links.length > 3" class="text-center pt-1">
        <span class="text-xs text-gray-400">+{{ links.length - 3 }} más</span>
      </div>
    </div>
    
    <div v-else class="text-center py-4">
      <div class="text-gray-400 text-sm mb-1">🔗</div>
      <p class="text-gray-400 text-xs">No hay enlaces</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArtistLink } from '~/composables/useArtistLinks'

interface Props {
  links: ArtistLink[]
}

const props = defineProps<Props>()

/**
 * Get the appropriate icon class for the link
 */
const getIconClass = (icon: string) => {
  // If it's already a Material Design Icon class, return it
  if (icon.startsWith('mdi-')) {
    return `mdi ${icon}`
  }
  
  // Default to link icon
  return 'mdi mdi-link'
}

/**
 * Format URL for display (remove protocol and www)
 */
const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    let hostname = urlObj.hostname
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4)
    }
    return hostname + urlObj.pathname
  } catch {
    return url
  }
}
</script>

<style>
/* Material Design Icons - you might need to include the MDI font */
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css');
</style>
