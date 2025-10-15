import { ref } from 'vue'
import type { EventProposal, ProposalInvitation } from './types/types'

export const useEventProposals = () => {
  const apiClient = useApiClient()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const myProposals = ref<EventProposal[]>([])
  const collaboratingProposals = ref<EventProposal[]>([])
  const currentProposal = ref<EventProposal | null>(null)

  const fetchMyProposals = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get<{ data: { my_proposals: EventProposal[], collaborating: EventProposal[] } }>('/event-proposals')
      myProposals.value = response.data.my_proposals
      collaboratingProposals.value = response.data.collaborating
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch proposals'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProposal = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get<{ data: EventProposal }>(`/event-proposals/${id}`)
      currentProposal.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch proposal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProposal = async (data: {
    organizer_artist_id: number
    name: string
    description?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post<{ data: EventProposal }>('/event-proposals', data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create proposal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProposal = async (id: number, data: {
    name?: string
    description?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.put<{ data: EventProposal }>(`/event-proposals/${id}`, data)
      currentProposal.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update proposal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const inviteArtists = async (proposalId: number, artistIds: number[], message?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post(`/event-proposals/${proposalId}/invite`, {
        artist_ids: artistIds,
        message
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to invite artists'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelProposal = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await apiClient.delete(`/event-proposals/${id}`)
      myProposals.value = myProposals.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel proposal'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createEventFromProposal = async (proposalId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post<{ data: any }>(`/event-proposals/${proposalId}/create-event`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Failed to create event'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProposalInvitations = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get<{ data: ProposalInvitation[] }>('/event-proposal-invitations')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch invitations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const acceptInvitation = async (invitationId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post(`/event-proposal-invitations/${invitationId}/accept`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to accept invitation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const declineInvitation = async (invitationId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post(`/event-proposal-invitations/${invitationId}/decline`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to decline invitation'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    myProposals,
    collaboratingProposals,
    currentProposal,
    fetchMyProposals,
    fetchProposal,
    createProposal,
    updateProposal,
    inviteArtists,
    cancelProposal,
    createEventFromProposal,
    fetchProposalInvitations,
    acceptInvitation,
    declineInvitation,
  }
}

