import { ref, computed } from 'vue'

export const useEventInterest = () => {
  const isInterested = ref(false)
  const interestedCount = ref(0)
  const interestedUsers = ref([])
  const loading = ref(false)

  const config = useRuntimeConfig()
  const { $fetch } = useNuxtApp()

  const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'

  /**
   * Check if user is interested in an event
   */
  const checkInterest = async (eventId: number) => {
    try {
      loading.value = true
      const response = await $fetch(`${baseUrl}/api/events/${eventId}/interest/check`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`
        }
      })
      
      isInterested.value = response.interested
      interestedCount.value = response.interested_count
      return response
    } catch (error) {
      console.error('Error checking interest:', error)
      return { interested: false, interested_count: 0 }
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle interest in an event
   */
  const toggleInterest = async (eventId: number) => {
    try {
      loading.value = true
      const response = await $fetch(`${baseUrl}/api/events/${eventId}/toggle-interest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      isInterested.value = response.interested
      interestedCount.value = response.interested_count
      return response
    } catch (error) {
      console.error('Error toggling interest:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Add interest to an event
   */
  const addInterest = async (eventId: number) => {
    try {
      loading.value = true
      const response = await $fetch(`${baseUrl}/api/events/${eventId}/interest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      isInterested.value = response.interested
      interestedCount.value = response.interested_count
      return response
    } catch (error) {
      console.error('Error adding interest:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove interest from an event
   */
  const removeInterest = async (eventId: number) => {
    try {
      loading.value = true
      const response = await $fetch(`${baseUrl}/api/events/${eventId}/interest`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('zonora_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      isInterested.value = response.interested
      interestedCount.value = response.interested_count
      return response
    } catch (error) {
      console.error('Error removing interest:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Get interested users for an event
   */
  const getInterestedUsers = async (eventId: number) => {
    try {
      loading.value = true
      const response = await $fetch(`${baseUrl}/api/events/${eventId}/interested-users`)
      
      interestedUsers.value = response.data
      interestedCount.value = response.count
      return response
    } catch (error) {
      console.error('Error getting interested users:', error)
      return { data: [], count: 0 }
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset the state
   */
  const reset = () => {
    isInterested.value = false
    interestedCount.value = 0
    interestedUsers.value = []
    loading.value = false
  }

  return {
    isInterested: computed(() => isInterested.value),
    interestedCount: computed(() => interestedCount.value),
    interestedUsers: computed(() => interestedUsers.value),
    loading: computed(() => loading.value),
    checkInterest,
    toggleInterest,
    addInterest,
    removeInterest,
    getInterestedUsers,
    reset
  }
}
