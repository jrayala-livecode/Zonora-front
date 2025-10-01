import { ref, computed } from 'vue'

export interface ActiveArtist {
  id: number
  stage_name: string
  profile_picture_url?: string
  bio?: string
  genres?: string[]
  is_public: boolean
  has_active_subscription: boolean
}

// Global reactive state
const activeArtist = ref<ActiveArtist | null>(null)
const loading = ref(false)

// Computed properties
const hasActiveArtist = computed(() => activeArtist.value !== null)
const activeArtistName = computed(() => activeArtist.value?.stage_name || '')
const activeArtistId = computed(() => activeArtist.value?.id || null)

// Get active artist from session storage
const getActiveArtist = (): ActiveArtist | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('active_artist')
    if (stored) {
      const parsed = JSON.parse(stored)
      activeArtist.value = parsed
      return parsed
    }
  } catch (error) {
    console.error('Error loading active artist from storage:', error)
  }
  return null
}

// Set active artist in session storage
const setActiveArtist = (artist: ActiveArtist | null) => {
  activeArtist.value = artist
  
  if (typeof window === 'undefined') return
  
  try {
    if (artist) {
      localStorage.setItem('active_artist', JSON.stringify(artist))
    } else {
      localStorage.removeItem('active_artist')
    }
    
    // Dispatch custom event to notify all components
    window.dispatchEvent(new CustomEvent('activeArtistChanged', { 
      detail: { artist } 
    }))
  } catch (error) {
    console.error('Error saving active artist to storage:', error)
  }
}

// Clear active artist
const clearActiveArtist = () => {
  setActiveArtist(null)
}

// Check if an artist is currently active
const isActiveArtist = (artistId: number): boolean => {
  return activeArtist.value?.id === artistId
}

// Initialize from storage on client-side
if (typeof window !== 'undefined') {
  getActiveArtist()
}

export const useActiveArtistStore = () => {
  return {
    activeArtist: computed(() => activeArtist.value),
    hasActiveArtist,
    activeArtistName,
    activeArtistId,
    loading,
    getActiveArtist,
    setActiveArtist,
    clearActiveArtist,
    isActiveArtist
  }
}
