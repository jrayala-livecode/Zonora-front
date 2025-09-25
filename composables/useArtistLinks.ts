import { ref, computed } from 'vue'

export interface ArtistLink {
  id: number
  title: string
  url: string
  icon: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useArtistLinks = () => {
  const links = ref<ArtistLink[]>([])
  const loading = ref(false)

  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
  
  // Ensure baseUrl doesn't already end with /api to avoid double /api
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace('/api', '')
  }

  /**
   * Get artist links
   */
  const getLinks = async (artistId: number) => {
    try {
      loading.value = true
      const response = await fetch(`${baseUrl}/api/artists/${artistId}/links`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      links.value = data.data
      return data
    } catch (error) {
      console.error('Error getting artist links:', error)
      return { data: [] }
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a new link
   */
  const addLink = async (artistId: number, linkData: { title: string; url: string; icon?: string; order?: number }) => {
    try {
      loading.value = true
      const response = await fetch(`${baseUrl}/api/artists/${artistId}/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      links.value.push(data.data)
      return data
    } catch (error) {
      console.error('Error adding link:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Update a link
   */
  const updateLink = async (artistId: number, linkId: number, linkData: Partial<ArtistLink>) => {
    try {
      loading.value = true
      const response = await fetch(`${baseUrl}/api/artists/${artistId}/links/${linkId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const index = links.value.findIndex(link => link.id === linkId)
      if (index !== -1) {
        links.value[index] = data.data
      }
      return data
    } catch (error) {
      console.error('Error updating link:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a link
   */
  const deleteLink = async (artistId: number, linkId: number) => {
    try {
      loading.value = true
      const response = await fetch(`${baseUrl}/api/artists/${artistId}/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      links.value = links.value.filter(link => link.id !== linkId)
      return { message: 'Link deleted successfully' }
    } catch (error) {
      console.error('Error deleting link:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Reorder links
   */
  const reorderLinks = async (artistId: number, linksData: { id: number; order: number }[]) => {
    try {
      loading.value = true
      const response = await fetch(`${baseUrl}/api/artists/${artistId}/links/reorder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ links: linksData })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return { message: 'Links reordered successfully' }
    } catch (error) {
      console.error('Error reordering links:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset the state
   */
  const reset = () => {
    links.value = []
    loading.value = false
  }

  return {
    links: computed(() => links.value),
    loading: computed(() => loading.value),
    getLinks,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    reset
  }
}
