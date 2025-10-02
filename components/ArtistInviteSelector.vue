<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Invitar Artistas</h3>
    
    <!-- Search Input -->
    <div class="mb-4">
      <label for="artist-search" class="block text-sm font-medium text-gray-300 mb-2">
        Buscar Artistas
      </label>
      <div class="relative">
        <input
          id="artist-search"
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Escribe el nombre del artista..."
          class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-300 mb-3">Resultados de búsqueda</h4>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="artist in searchResults"
          :key="artist.id"
          class="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="$convertImageUrl(artist.profile_picture_url) || 'https://www.gravatar.com/avatar/default?d=identicon&s=64'"
              :alt="artist.stage_name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h5 class="text-white font-medium">{{ artist.stage_name }}</h5>
              <p class="text-sm text-gray-400">{{ artist.genres?.join(', ') || 'Sin géneros' }}</p>
            </div>
          </div>
          <button
            @click="addArtist(artist)"
            :disabled="isArtistSelected(artist.id) || isAdding"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {{ isArtistSelected(artist.id) ? 'Agregado' : 'Agregar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Artists -->
    <div v-if="selectedArtists.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-300 mb-3">Artistas seleccionados ({{ selectedArtists.length }})</h4>
      <div class="space-y-2">
        <div
          v-for="artist in selectedArtists"
          :key="artist.id"
          class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="$convertImageUrl(artist.profile_picture_url) || 'https://www.gravatar.com/avatar/default?d=identicon&s=64'"
              :alt="artist.stage_name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h5 class="text-white font-medium">{{ artist.stage_name }}</h5>
              <p class="text-sm text-gray-400">{{ artist.genres?.join(', ') || 'Sin géneros' }}</p>
            </div>
          </div>
          <button
            @click="removeArtist(artist.id)"
            class="text-red-400 hover:text-red-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Invitation Message -->
    <div class="mb-6">
      <label for="invitation-message" class="block text-sm font-medium text-gray-300 mb-2">
        Mensaje de invitación (opcional)
      </label>
      <textarea
        id="invitation-message"
        v-model="invitationMessage"
        rows="3"
        placeholder="Escribe un mensaje personalizado para los artistas..."
        class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
      ></textarea>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-400">
        {{ selectedArtists.length }} artista{{ selectedArtists.length !== 1 ? 's' : '' }} seleccionado{{ selectedArtists.length !== 1 ? 's' : '' }}
      </div>
      <div class="flex space-x-3">
        <button
          @click="clearSelection"
          :disabled="selectedArtists.length === 0"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          Limpiar
        </button>
        <button
          @click="sendInvitations"
          :disabled="selectedArtists.length === 0 || isSending"
          class="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {{ isSending ? 'Enviando...' : `Enviar ${selectedArtists.length} invitación${selectedArtists.length !== 1 ? 'es' : ''}` }}
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
      <p class="text-red-200 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useArtistSearch } from '~/composables/useArtistSearch'
import { useInvitations } from '~/composables/useInvitations'

interface Artist {
  id: number
  stage_name: string
  genres: string[]
  profile_picture_url: string | null
}

interface Props {
  eventId: number
  onInvitationsSent?: () => void
}

const props = defineProps<Props>()

const { searchQuery, searchResults, isLoading, searchArtists, clearSearch } = useArtistSearch()
const { sendMultipleInvitations, error, isLoading: isInvitationLoading } = useInvitations()

const selectedArtists = ref<Artist[]>([])
const invitationMessage = ref('')
const isSending = ref(false)
const isAdding = ref(false)

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchArtists(searchQuery.value)
    } else {
      clearSearch()
    }
  }, 300)
}

const isArtistSelected = (artistId: number) => {
  return selectedArtists.value.some(artist => artist.id === artistId)
}

const addArtist = (artist: Artist) => {
  if (!isArtistSelected(artist.id)) {
    isAdding.value = true
    setTimeout(() => {
      selectedArtists.value.push(artist)
      isAdding.value = false
    }, 100)
  }
}

const removeArtist = (artistId: number) => {
  selectedArtists.value = selectedArtists.value.filter(artist => artist.id !== artistId)
}

const clearSelection = () => {
  selectedArtists.value = []
  invitationMessage.value = ''
}

const sendInvitations = async () => {
  if (selectedArtists.value.length === 0) return

  try {
    isSending.value = true
    const artistIds = selectedArtists.value.map(artist => artist.id)
    
    const result = await sendMultipleInvitations(
      props.eventId,
      artistIds,
      invitationMessage.value
    )
    
    // Show success message
    
    // Clear selection
    clearSelection()
    clearSearch()
    
    // Notify parent component
    if (props.onInvitationsSent) {
      props.onInvitationsSent()
    }
  } catch (err: any) {
    console.error('Error sending invitations:', err)
    
    // Show error modal that auto-closes after 2 seconds
    const { showError } = useModal()
    showError('Error al enviar invitaciones', err.message || 'Ocurrió un error inesperado')
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      const modal = document.querySelector('.modal-overlay')
      if (modal) {
        modal.remove()
      }
    }, 2000)
  } finally {
    isSending.value = false
  }
}

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    clearSearch()
  }
})
</script>
