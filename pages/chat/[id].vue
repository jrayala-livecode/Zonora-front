<template>
  <div class="bg-gray-900 flex overflow-hidden" style="height: calc(100vh - 64px);">
    <!-- Back Button -->
    <div class="absolute top-3 left-3 z-10">
      <NuxtLink 
        to="/chat" 
        class="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 bg-gray-800 px-2.5 py-1.5 rounded-md text-sm"
      >
        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Volver
      </NuxtLink>
    </div>

    <!-- Chat with Specific User -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Chat Header -->
      <div class="bg-gray-800 border-b border-gray-700 p-3">
        <div class="flex items-center space-x-2.5">
          <img
            :src="userInfo?.avatar_url || 'https://www.gravatar.com/avatar/default?d=identicon&s=32'"
            :alt="userInfo?.name || 'Usuario'"
            class="w-7 h-7 rounded-full border border-gray-600"
            @error="handleAvatarError"
          />
          <div>
            <h3 class="text-base font-semibold text-white">{{ userInfo?.name || 'Usuario' }}</h3>
            <p class="text-xs text-gray-400">Chat directo</p>
          </div>
        </div>
      </div>

        <!-- Messages Area -->
        <div class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 min-h-0">
            <MessageList
              :messages="messagesWithUser"
              :loading="loading"
              :error="error"
              :current-user-id="currentUserId"
            />
          </div>

          <!-- Message Input -->
          <div class="flex-shrink-0">
            <MessageInput
              :receiver-id="userId"
              @message-sent="handleMessageSent"
            />
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Get route params
const route = useRoute()
const userId = computed(() => parseInt(route.params.id as string))

// Set page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Set page title
useHead({
  title: `Chat - Underground Venues`
})

const { user } = useAuth()
const { getMyMessages, messages, loading, error } = useChat()

const userInfo = ref<any>(null)
const currentUserId = computed(() => user.value?.id || 0)

// Get messages with specific user
const messagesWithUser = computed(() => {
  return messages.value.filter(message => 
    (message.from_user.id === userId.value || message.to_user.id === userId.value)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
})

// Handle new message sent
const handleMessageSent = (message: any) => {
  // Refresh messages to get updated list
  loadMessages()
}

// Load messages
const loadMessages = async () => {
  try {
    await getMyMessages()
    
    // Find user info from messages
    const userMessage = messages.value.find(message => 
      message.from_user.id === userId.value || message.to_user.id === userId.value
    )
    
    if (userMessage) {
      // Show the "other" user (not the current user)
      userInfo.value = userMessage.from_user.id === currentUserId.value ? userMessage.to_user : userMessage.from_user
    }
  } catch (err) {
    console.error('Error loading messages:', err)
  }
}

// Handle avatar error
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.src.includes('gravatar.com')) {
    img.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=40'
  }
}

// Load messages on mount
onMounted(() => {
  loadMessages()
})
</script>
