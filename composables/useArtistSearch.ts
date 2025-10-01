import { ref } from 'vue'
import { useApiClient } from './useApiClient'

export const useArtistSearch = () => {
  const { apiRequestJson } = useApiClient()
  
  const searchResults = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // Search for artists
  const searchArtists = async (query: string, limit = 20) => {
    if (!query.trim()) {
      searchResults.value = []
      return []
    }

    try {
      isLoading.value = true
      error.value = null
      searchQuery.value = query
      
      const response = await apiRequestJson(`/artists?search=${encodeURIComponent(query)}&limit=${limit}`)
      searchResults.value = response.data || []
      
      return searchResults.value
    } catch (err: any) {
      error.value = err.message
      searchResults.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Clear search results
  const clearSearch = () => {
    searchResults.value = []
    searchQuery.value = ''
    error.value = null
  }

  return {
    searchResults,
    isLoading,
    error,
    searchQuery,
    searchArtists,
    clearSearch
  }
}
