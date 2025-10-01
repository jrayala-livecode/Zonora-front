<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">Buscar Artista para Chatear</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-400 text-sm mt-2">Encuentra un artista para iniciar una conversación</p>
      </div>

      <!-- Search Input -->
      <div class="p-6 border-b border-gray-700">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre de artista..."
            class="w-full px-4 py-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            @input="handleSearch"
          />
          <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Results -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          <span class="ml-3 text-gray-400">Buscando artistas...</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="!searchQuery.trim()" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-300 mb-2">Buscar Artistas</h3>
          <p class="text-gray-400 text-sm">
            Escribe el nombre de un artista para encontrar su perfil
          </p>
        </div>

        <!-- No Results -->
        <div v-else-if="artists.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6H9m6 0V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0v2a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0H9" />
          </svg>
          <h3 class="text-lg font-medium text-gray-300 mb-2">No se encontraron artistas</h3>
          <p class="text-gray-400 text-sm">
            No hay artistas que coincidan con tu búsqueda
          </p>
        </div>

        <!-- Artists List -->
        <div v-else class="space-y-3">
          <div
            v-for="artist in artists"
            :key="artist.id"
            class="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <!-- Avatar -->
            <img
              :src="artist.profile_picture_url || 'https://www.gravatar.com/avatar/default?d=identicon&s=40'"
              :alt="artist.stage_name"
              class="w-10 h-10 rounded-full border border-gray-600"
              @error="handleAvatarError"
            />
            
            <!-- Artist Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-white truncate">
                {{ artist.stage_name }}
              </h3>
              <p v-if="artist.user" class="text-xs text-gray-400 truncate">
                {{ artist.user.name }}
              </p>
              <div v-if="artist.genres && artist.genres.length > 0" class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="genre in artist.genres.slice(0, 2)"
                  :key="genre"
                  class="px-1.5 py-0.5 bg-orange-900/20 text-orange-300 text-xs rounded"
                >
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Chat Button -->
            <button
              @click="startChatWithArtist(artist)"
              class="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chatear
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-6 border-t border-gray-700">
        <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Artist {
  id: number;
  stage_name: string;
  profile_picture_url?: string;
  user?: {
    id: number;
    name: string;
  };
  genres?: string[];
}

const emit = defineEmits<{
  close: []
  startChat: [artist: Artist]
}>()

const searchQuery = ref('')
const artists = ref<Artist[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!searchQuery.value.trim()) {
    artists.value = []
    return
  }

  searchTimeout = setTimeout(() => {
    searchArtists()
  }, 300) // Debounce search
}

const searchArtists = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  error.value = null

  try {
    const { getArtists } = useArtists()
    const response = await getArtists({
      search: searchQuery.value,
      per_page: 10
    })

    artists.value = response.data || []
  } catch (err: any) {
    error.value = err.message || 'Error al buscar artistas'
    console.error('Error searching artists:', err)
  } finally {
    loading.value = false
  }
}

const startChatWithArtist = (artist: Artist) => {
  if (artist.user) {
    emit('startChat', artist)
    closeModal()
  }
}

const closeModal = () => {
  emit('close')
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.src.includes('gravatar.com')) {
    img.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=40'
  }
}

// Clear search when modal opens
watch(() => searchQuery.value, (newValue) => {
  if (!newValue.trim()) {
    artists.value = []
  }
})
</script>
