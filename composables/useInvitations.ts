import { ref } from 'vue'
import { useApiClient } from './useApiClient'

export const useInvitations = () => {
  const { apiRequestJson, apiRequest } = useApiClient()
  
  const isLoading = ref(false)
  const error = ref(null)

  // Send invitation
  const sendInvitation = async (eventId: number, artistId: number, message?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequestJson('/event-invitations/send', {
        method: 'POST',
        body: JSON.stringify({
          event_id: eventId,
          artist_id: artistId,
          message: message || ''
        })
      })
      
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Send multiple invitations
  const sendMultipleInvitations = async (eventId: number, artistIds: number[], message?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const promises = artistIds.map(artistId => 
        sendInvitation(eventId, artistId, message)
      )
      
      const results = await Promise.allSettled(promises)
      
      return {
        successful: results.filter(r => r.status === 'fulfilled').map(r => (r as any).value),
        failed: results.filter(r => r.status === 'rejected').map(r => (r as any).reason)
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get my invitations
  const getMyInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequestJson('/event-invitations/my-invitations')
      
      // Handle different response structures
      const data = response.data || response || []
      const invitationsData = Array.isArray(data) ? data : []
      
      return invitationsData
    } catch (err: any) {
      console.error('Error fetching invitations:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Accept invitation
  const acceptInvitation = async (invitationId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequestJson('/event-invitations/accept', {
        method: 'POST',
        body: JSON.stringify({
          invitation_id: invitationId
        })
      })
      
      return response.data
    } catch (err: any) {
      console.error('Error accepting invitation:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Reject invitation
  const rejectInvitation = async (invitationId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequestJson('/event-invitations/reject', {
        method: 'POST',
        body: JSON.stringify({
          invitation_id: invitationId
        })
      })
      
      return response.data
    } catch (err: any) {
      console.error('Error rejecting invitation:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get event invitations (for event organizer)
  const getEventInvitations = async (eventId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequestJson(`/event-invitations/event/${eventId}`)
      
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Cancel invitation
  const cancelInvitation = async (invitationId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRequest(`/event-invitations/${invitationId}`, {
        method: 'DELETE'
      })
      
      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    sendInvitation,
    sendMultipleInvitations,
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
    getEventInvitations,
    cancelInvitation
  }
}
