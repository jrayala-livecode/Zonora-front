<template>
  <div v-if="links.length > 0" class="space-y-3">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <div class="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center mr-3">
        <span class="text-white font-bold text-sm">🔗</span>
      </div>
      Enlaces
    </h3>
    
    <div class="space-y-2">
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
      >
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <i :class="getIconClass(link.icon)" class="text-white text-lg"></i>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-medium truncate group-hover:text-orange-400 transition-colors duration-200">
            {{ link.title }}
          </p>
          <p class="text-gray-400 text-sm truncate">
            {{ formatUrl(link.url) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <svg class="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
      </a>
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
