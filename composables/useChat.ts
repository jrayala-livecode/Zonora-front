import { ref, computed } from 'vue'
import type { Message, SendMessageRequest, SendMessageResponse } from './types/types'

export const useChat = () => {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sending = ref(false)

  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

  // Get my messages
  const getMyMessages = async () => {
    loading.value = true
    error.value = null

    try {
      const token = localStorage.getItem('zonora_token')
      const response = await $fetch<{ data: Message[] }>('/messages/my_messages', {
        baseURL: apiBaseUrl,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      messages.value = response.data
      return response.data

    } catch (err: any) {
      error.value = err.data?.message || 'Error fetching messages'
      console.error('Error fetching messages:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Send a message
  const sendMessage = async (messageData: SendMessageRequest): Promise<Message> => {
    sending.value = true
    error.value = null

    try {
      const token = localStorage.getItem('zonora_token')
      const response = await $fetch<SendMessageResponse>('/messages/send_message', {
        baseURL: apiBaseUrl,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          to_user_id: messageData.receiver_id,
          subject: messageData.subject,
          message: messageData.content
        }
      })

      // Add the new message to the local messages array
      messages.value.push(response.data)
      
      return response.data

    } catch (err: any) {
      error.value = err.data?.message || 'Error sending message'
      console.error('Error sending message:', err)
      throw err
    } finally {
      sending.value = false
    }
  }

  // Group messages by conversation (sender-receiver pair)
  const conversations = computed(() => {
    const conversationMap = new Map<string, {
      user: any;
      messages: Message[];
      lastMessage: Message;
    }>()

    // Get current user ID from auth
    const { user } = useAuth()
    const currentUserId = user.value?.id

    messages.value.forEach(message => {
      // Create a consistent key for the conversation
      const conversationKey = message.from_user.id < message.to_user.id 
        ? `${message.from_user.id}-${message.to_user.id}`
        : `${message.to_user.id}-${message.from_user.id}`

      if (!conversationMap.has(conversationKey)) {
        // Determine which user is the "other" user (not the current user)
        const otherUser = message.from_user.id === currentUserId ? message.to_user : message.from_user
        
        conversationMap.set(conversationKey, {
          user: otherUser,
          messages: [],
          lastMessage: message
        })
      }

      const conversation = conversationMap.get(conversationKey)!
      conversation.messages.push(message)
      
      // Update last message if this one is newer
      if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message
        // Keep the other user (not current user) as the conversation user
        conversation.user = message.from_user.id === currentUserId ? message.to_user : message.from_user
      }
    })

    // Sort conversations by last message time
    return Array.from(conversationMap.values()).sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    )
  })

  // Get messages between current user and another user
  const getMessagesWithUser = (userId: number) => {
    return messages.value.filter(message => 
      (message.from_user.id === userId || message.to_user.id === userId)
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Clear messages
  const clearMessages = () => {
    messages.value = []
  }

  return {
    // State
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    sending: readonly(sending),
    conversations,

    // Actions
    getMyMessages,
    sendMessage,
    getMessagesWithUser,
    clearError,
    clearMessages
  }
}
