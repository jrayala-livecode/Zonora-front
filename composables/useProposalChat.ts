import { ref } from 'vue'
import type { ProposalChatMessage } from './types/types'

export const useProposalChat = () => {
  const apiClient = useApiClient()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const messages = ref<ProposalChatMessage[]>([])
  const unreadCount = ref(0)
  const participants = ref<any[]>([])

  const fetchMessages = async (proposalId: number, page = 1, perPage = 50) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get<{ data: ProposalChatMessage[] }>(
        `/event-proposals/${proposalId}/chat/messages?page=${page}&per_page=${perPage}`
      )
      messages.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (proposalId: number, message: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post<{ data: ProposalChatMessage }>(
        `/event-proposals/${proposalId}/chat/messages`,
        { message }
      )
      messages.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send message'
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (proposalId: number) => {
    try {
      await apiClient.post(`/event-proposals/${proposalId}/chat/mark-read`)
      unreadCount.value = 0
    } catch (err: any) {
      console.error('Failed to mark as read:', err)
    }
  }

  const fetchUnreadCount = async (proposalId: number) => {
    try {
      const response = await apiClient.get<{ unread_count: number }>(
        `/event-proposals/${proposalId}/chat/unread-count`
      )
      unreadCount.value = response.unread_count
      return response.unread_count
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err)
      return 0
    }
  }

  const fetchParticipants = async (proposalId: number) => {
    try {
      const response = await apiClient.get<{ data: any[] }>(
        `/event-proposals/${proposalId}/chat/participants`
      )
      participants.value = response.data
      return response.data
    } catch (err: any) {
      console.error('Failed to fetch participants:', err)
      return []
    }
  }

  const addMessageToList = (message: ProposalChatMessage) => {
    messages.value.push(message)
  }

  return {
    loading,
    error,
    messages,
    unreadCount,
    participants,
    fetchMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount,
    fetchParticipants,
    addMessageToList,
  }
}

