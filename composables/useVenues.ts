import { ref, computed } from 'vue'

interface Venue {
  id: number
  name: string
  address: string
  description?: string
  latitude?: number
  longitude?: number
  interest_links?: string[]
  hashtags?: string[]
  commune_id?: number
  user_id: number
  venue_admin_id?: number
  is_visible: boolean
  subscription_required: boolean
  created_at: string
  updated_at: string
  comuna?: {
    id: number
    nombre: string
  }
  user?: {
    id: number
    name: string
    email: string
  }
  events?: any[]
}

interface VenueSearchParams {
  search?: string
  commune_id?: number
  user_id?: number
  per_page?: number
  page?: number
}

interface VenuePagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

interface VenueResponse {
  data: Venue[]
  pagination: VenuePagination
}

export const useVenues = () => {
  const venues = ref<Venue[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<VenuePagination | null>(null)

  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

  // Fetch venues with optional search parameters
  const fetchVenues = async (params: VenueSearchParams = {}) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      if (params.search) queryParams.append('search', params.search)
      if (params.commune_id) queryParams.append('commune_id', params.commune_id.toString())
      if (params.user_id) queryParams.append('user_id', params.user_id.toString())
      if (params.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params.page) queryParams.append('page', params.page.toString())

      const response = await $fetch<VenueResponse>('/venues', {
        baseURL: apiBaseUrl,
        query: Object.fromEntries(queryParams)
      })

      venues.value = response.data
      pagination.value = response.pagination

    } catch (err: any) {
      error.value = err.data?.message || 'Error fetching venues'
      console.error('Error fetching venues:', err)
    } finally {
      loading.value = false
    }
  }

  // Search venues
  const searchVenues = async (query: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ data: Venue[], query: string, results_count: number }>('/venues/search', {
        baseURL: apiBaseUrl,
        query: { query }
      })

      venues.value = response.data
      pagination.value = null // Search doesn't return pagination

    } catch (err: any) {
      error.value = err.data?.message || 'Error searching venues'
      console.error('Error searching venues:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single venue
  const getVenue = async (id: number): Promise<Venue | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ data: Venue }>(`/venues/${id}`, {
        baseURL: apiBaseUrl
      })

      return response.data

    } catch (err: any) {
      error.value = err.data?.message || 'Error fetching venue'
      console.error('Error fetching venue:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Get user's venues (authenticated)
  const getMyVenues = async () => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('auth_token')
      const response = await $fetch<{ data: Venue[], stats: any }>('/venues/my-venues', {
        baseURL: apiBaseUrl,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      venues.value = response.data
      pagination.value = null

    } catch (err: any) {
      error.value = err.data?.message || 'Error fetching user venues'
      console.error('Error fetching user venues:', err)
    } finally {
      loading.value = false
    }
  }

  // Get venue events (public)
  const getVenueEvents = async (venueId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ data: any[], venue: any, events_count: number }>(`/venues/${venueId}/events`, {
        baseURL: apiBaseUrl
      })

      return response

    } catch (err: any) {
      error.value = err.data?.message || 'Error fetching venue events'
      console.error('Error fetching venue events:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create venue (authenticated)
  const createVenue = async (venueData: Partial<Venue>): Promise<Venue | null> => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('auth_token')
      const response = await $fetch<{ data: Venue, message: string }>('/venues', {
        baseURL: apiBaseUrl,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: venueData
      })

      // Add new venue to the list
      venues.value.unshift(response.data)

      return response.data

    } catch (err: any) {
      error.value = err.data?.message || 'Error creating venue'
      console.error('Error creating venue:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update venue (authenticated)
  const updateVenue = async (id: number, venueData: Partial<Venue>): Promise<Venue | null> => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('auth_token')
      const response = await $fetch<{ data: Venue, message: string }>(`/venues/${id}`, {
        baseURL: apiBaseUrl,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: venueData
      })

      // Update venue in the list
      const index = venues.value.findIndex(v => v.id === id)
      if (index !== -1) {
        venues.value[index] = response.data
      }

      return response.data

    } catch (err: any) {
      error.value = err.data?.message || 'Error updating venue'
      console.error('Error updating venue:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete venue (authenticated)
  const deleteVenue = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('auth_token')
      await $fetch(`/venues/${id}`, {
        baseURL: apiBaseUrl,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Remove venue from the list
      const index = venues.value.findIndex(v => v.id === id)
      if (index !== -1) {
        venues.value.splice(index, 1)
      }

      return true

    } catch (err: any) {
      error.value = err.data?.message || 'Error deleting venue'
      console.error('Error deleting venue:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Toggle venue visibility (authenticated)
  const toggleVenueVisibility = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('auth_token')
      const response = await $fetch<{ data: any, message: string }>(`/venues/${id}/toggle-visibility`, {
        baseURL: apiBaseUrl,
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update venue visibility in the list
      const index = venues.value.findIndex(v => v.id === id)
      if (index !== -1) {
        venues.value[index].is_visible = response.data.is_visible
      }

      return true

    } catch (err: any) {
      error.value = err.data?.message || 'Error toggling venue visibility'
      console.error('Error toggling venue visibility:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const visibleVenues = computed(() => venues.value.filter(v => v.is_visible))
  const hasVenues = computed(() => venues.value.length > 0)
  const totalPages = computed(() => pagination.value?.last_page || 1)
  const currentPage = computed(() => pagination.value?.current_page || 1)
  const totalVenues = computed(() => pagination.value?.total || venues.value.length)

  return {
    // State
    venues: readonly(venues),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),

    // Actions
    fetchVenues,
    searchVenues,
    getVenue,
    getMyVenues,
    getVenueEvents,
    createVenue,
    updateVenue,
    deleteVenue,
    toggleVenueVisibility,

    // Computed
    visibleVenues,
    hasVenues,
    totalPages,
    currentPage,
    totalVenues
  }
}
