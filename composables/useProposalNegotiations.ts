import { ref } from 'vue'
import type { 
  EventProposalNegotiation, 
  EventProposalNegotiationType,
  EventProposalNegotiationVote 
} from './types/types'

export const useProposalNegotiations = () => {
  const apiClient = useApiClient()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const negotiations = ref<EventProposalNegotiation[]>([])
  const negotiationTypes = ref<EventProposalNegotiationType[]>([])

  const fetchNegotiations = async (proposalId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get<{ data: EventProposalNegotiation[] }>(
        `/event-proposals/${proposalId}/negotiations`
      )
      negotiations.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch negotiations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const submitNegotiation = async (
    proposalId: number,
    data: {
      negotiation_type_id: number
      value_text?: string
      value_number?: number
      value_date?: string
      value_reference_id?: number
      value_json?: any
      message?: string
    }
  ) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post<{ data: EventProposalNegotiation }>(
        `/event-proposals/${proposalId}/negotiations`,
        data
      )
      negotiations.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Failed to submit negotiation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const voteOnNegotiation = async (
    proposalId: number,
    negotiationId: number,
    vote: 'yes' | 'no',
    comment?: string
  ) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post<{ data: EventProposalNegotiationVote }>(
        `/event-proposals/${proposalId}/negotiations/${negotiationId}/vote`,
        { vote, comment }
      )
      
      // Update the negotiation in the list
      await fetchNegotiations(proposalId)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Failed to vote'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelNegotiation = async (proposalId: number, negotiationId: number) => {
    loading.value = true
    error.value = null
    
    try {
      await apiClient.delete(`/event-proposals/${proposalId}/negotiations/${negotiationId}`)
      negotiations.value = negotiations.value.filter(n => n.id !== negotiationId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel negotiation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const hasUserVoted = (negotiation: EventProposalNegotiation, userId: number): boolean => {
    return negotiation.votes?.some(v => v.user_id === userId) || false
  }

  const getUserVote = (negotiation: EventProposalNegotiation, userId: number): EventProposalNegotiationVote | undefined => {
    return negotiation.votes?.find(v => v.user_id === userId)
  }

  const getVoteCount = (negotiation: EventProposalNegotiation): { yes: number, no: number, total: number } => {
    const yesVotes = negotiation.votes?.filter(v => v.vote === 'yes').length || 0
    const noVotes = negotiation.votes?.filter(v => v.vote === 'no').length || 0
    return {
      yes: yesVotes,
      no: noVotes,
      total: yesVotes + noVotes
    }
  }

  const isNegotiationComplete = (negotiation: EventProposalNegotiation): boolean => {
    return negotiation.status === 'approved' || negotiation.status === 'rejected'
  }

  const getActiveNegotiationByType = (typeName: string): EventProposalNegotiation | undefined => {
    return negotiations.value.find(n => 
      n.type?.name === typeName && 
      (n.status === 'pending' || n.status === 'approved')
    )
  }

  const canSubmitNegotiation = (typeName: string): boolean => {
    const existing = getActiveNegotiationByType(typeName)
    return !existing || existing.status !== 'pending'
  }

  return {
    loading,
    error,
    negotiations,
    negotiationTypes,
    submitNegotiation,
    voteOnNegotiation,
    cancelNegotiation,
    fetchNegotiations,
    hasUserVoted,
    getUserVote,
    getVoteCount,
    isNegotiationComplete,
    getActiveNegotiationByType,
    canSubmitNegotiation,
  }
}

