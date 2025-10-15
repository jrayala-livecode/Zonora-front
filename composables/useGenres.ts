import { ref } from 'vue'

export interface Genre {
  id: number
  name: string
}

// Singleton state (outside composable function for shared state)
const genres = ref<Genre[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useGenres = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  /**
   * Fetch all genres (public endpoint, no auth required)
   * Returns cached genres if already fetched
   */
  const fetchGenres = async (): Promise<Genre[]> => {
    if (genres.value.length > 0) {
      // Return cached genres
      return genres.value
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/genres`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Don't throw error - just return empty array
        // This allows the app to work even if genres endpoint fails
        genres.value = []
        return genres.value
      }

      const result = await response.json()
      genres.value = result.data || []
      return genres.value
    } catch (err: any) {
      // Log error but don't throw - return empty array
      error.value = err.message || 'Failed to fetch genres'
      genres.value = []
      return genres.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Search genres by name (client-side filtering)
   */
  const searchGenres = (query: string): Genre[] => {
    if (!query) return genres.value

    const lowerQuery = query.toLowerCase()
    return genres.value.filter(genre => 
      genre.name.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Refresh genres from server (force reload)
   */
  const refreshGenres = async (): Promise<Genre[]> => {
    genres.value = [] // Clear cache
    return fetchGenres()
  }

  /**
   * Check if a genre exists by name (case-insensitive)
   */
  const genreExists = (name: string): boolean => {
    const lowerName = name.toLowerCase()
    return genres.value.some(genre => 
      genre.name.toLowerCase() === lowerName
    )
  }

  /**
   * Get genre suggestions based on partial input
   */
  const getSuggestions = (input: string, limit: number = 10): Genre[] => {
    if (!input || input.length < 1) return genres.value.slice(0, limit)

    const results = searchGenres(input)
    return results.slice(0, limit)
  }

  return {
    // State
    genres,
    isLoading,
    error,
    
    // Methods
    fetchGenres,
    searchGenres,
    refreshGenres,
    genreExists,
    getSuggestions,
  }
}

