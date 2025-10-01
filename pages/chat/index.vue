<template>
  <div class="bg-gray-900 flex" style="height: calc(100vh - 48px);">
    <!-- Conversations Sidebar -->
    <div class="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <!-- Header with New Chat Button -->
      <div class="p-3 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">Conversaciones</h2>
            <p class="text-gray-400 text-xs mt-0.5">{{ conversations.length }} conversaciones</p>
          </div>
          <button
            @click="showArtistFinder = true"
            class="inline-flex items-center px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
            title="Nueva conversación"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

        <!-- Conversation List -->
        <ConversationList
          :conversations="conversations"
          :loading="loading"
          :error="error"
          :selected-user-id="selectedConversation?.user?.id"
          @select-conversation="selectConversation"
        />
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <!-- Chat Header -->
        <div v-if="selectedConversation" class="bg-gray-800 border-b border-gray-700 p-3">
          <div class="flex items-center space-x-2.5">
            <img
              :src="selectedConversation.user.avatar_url || 'https://www.gravatar.com/avatar/default?d=identicon&s=32'"
              :alt="selectedConversation.user.name"
              class="w-7 h-7 rounded-full border border-gray-600"
              @error="handleAvatarError"
            />
            <div>
              <h3 class="text-base font-semibold text-white">{{ selectedConversation.user.name }}</h3>
              <p class="text-xs text-gray-400">En línea</p>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 flex flex-col">
          <MessageList
            v-if="selectedConversation"
            :messages="currentMessages"
            :loading="loading"
            :error="error"
            :current-user-id="currentUserId"
          />

          <!-- No Conversation Selected -->
          <div v-else class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 class="text-lg font-semibold text-white mb-1">Selecciona una conversación</h3>
              <p class="text-sm text-gray-400">
                Elige una conversación de la lista para comenzar a chatear
              </p>
            </div>
          </div>

          <!-- Message Input -->
          <MessageInput
            v-if="selectedConversation"
            :receiver-id="selectedConversation.user.id"
            @message-sent="handleMessageSent"
          />
        </div>
      </div>

      <!-- Artist Finder Modal -->
      <ArtistFinder
        v-if="showArtistFinder"
        @close="showArtistFinder = false"
        @start-chat="handleStartChat"
      />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Set page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Set page title
useHead({
  title: 'Chat - Underground Venues'
})

const { user } = useAuth()
const { getMyMessages, conversations, loading, error } = useChat()

const selectedConversation = ref<any>(null)
const showArtistFinder = ref(false)

// Get current user ID
const currentUserId = computed(() => user.value?.id || 0)

// Get messages for selected conversation
const currentMessages = computed(() => {
  if (!selectedConversation.value) return []
  return selectedConversation.value.messages.sort((a: any, b: any) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
})

// Select a conversation
const selectConversation = (conversation: any) => {
  selectedConversation.value = conversation
}

// Handle new message sent
const handleMessageSent = (message: any) => {
  // The message will be automatically added to the messages array by the useChat composable
  // We just need to refresh the conversations to update the last message
  loadMessages()
}

// Handle starting chat with artist
const handleStartChat = (artist: any) => {
  if (artist.user) {
    // Navigate to chat with the artist's user ID
    navigateTo(`/chat/${artist.user.id}`)
  }
}

// Load messages
const loadMessages = async () => {
  try {
    await getMyMessages()
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
