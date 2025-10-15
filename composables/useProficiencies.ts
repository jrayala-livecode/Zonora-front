import { ref } from 'vue'
import type { Proficiency } from './types/types'

// Singleton state (outside composable function for shared state)
const proficiencies = ref<Proficiency[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useProficiencies = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  /**
   * Fetch all proficiencies
   * Returns empty array if no proficiencies exist or on error
   */
  const fetchProficiencies = async (): Promise<Proficiency[]> => {
    if (proficiencies.value.length > 0) {
      // Return cached proficiencies
      return proficiencies.value
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/proficiencies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Don't throw error - just return empty array
        // This allows the app to work even if proficiencies endpoint fails
        proficiencies.value = []
        return proficiencies.value
      }

      const result = await response.json()
      proficiencies.value = result.data || []
      return proficiencies.value
    } catch (err: any) {
      // Log error but don't throw - return empty array
      // This prevents breaking the page when proficiencies can't be loaded
      error.value = err.message || 'Failed to fetch proficiencies'
      proficiencies.value = []
      return proficiencies.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Assign proficiency to an artist
   */
  const assignProficiency = async (artistId: number, proficiencyId: number): Promise<void> => {
    const { apiRequest } = useApiClient()
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/artists/${artistId}/proficiency`, {
        method: 'POST',
        body: JSON.stringify({ proficiency_id: proficiencyId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign proficiency')
      }

      return await response.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to assign proficiency'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Remove proficiency from an artist
   */
  const removeProficiency = async (artistId: number, proficiencyId: number): Promise<void> => {
    const { apiRequest } = useApiClient()
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/artists/${artistId}/proficiency`, {
        method: 'DELETE',
        body: JSON.stringify({ proficiency_id: proficiencyId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove proficiency')
      }

      return await response.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to remove proficiency'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Search artists by proficiency
   */
  const searchArtistsByProficiency = async (proficiencyId: number, page: number = 1, perPage: number = 12) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${API_URL}/proficiencies/${proficiencyId}/artists?page=${page}&per_page=${perPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to search artists by proficiency')
      }

      return await response.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to search artists'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get proficiency name by ID
   */
  const getProficiencyName = (proficiencyId: number): string => {
    const proficiency = proficiencies.value.find(p => p.id === proficiencyId)
    return proficiency?.proficiency || 'Unknown'
  }

  return {
    proficiencies,
    isLoading,
    error,
    fetchProficiencies,
    assignProficiency,
    removeProficiency,
    searchArtistsByProficiency,
    getProficiencyName,
  }
}

