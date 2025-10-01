<template>
  <div class="flex-1 overflow-y-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-6">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
      <span class="ml-2 text-gray-400 text-sm">Cargando...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="conversations.length === 0" class="p-6 text-center">
      <svg class="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <h3 class="text-base font-medium text-gray-300 mb-1">No hay conversaciones</h3>
      <p class="text-gray-400 text-xs">
        Tus conversaciones aparecerán aquí cuando recibas mensajes
      </p>
    </div>

    <!-- Conversations List -->
    <div v-else class="divide-y divide-gray-700">
      <button
        v-for="conversation in conversations"
        :key="conversation.user.id"
        @click="$emit('selectConversation', conversation)"
        class="w-full p-3 text-left hover:bg-gray-700 transition-colors duration-200"
        :class="{
          'bg-gray-700': selectedUserId === conversation.user.id
        }"
      >
        <div class="flex items-center space-x-2.5">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              :src="conversation.user.avatar_url || 'https://www.gravatar.com/avatar/default?d=identicon&s=32'"
              :alt="conversation.user.name"
              class="w-8 h-8 rounded-full border border-gray-600"
              @error="handleAvatarError"
            />
          </div>
          
          <!-- Conversation Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-white truncate">
                {{ conversation.user.name }}
              </h3>
              <span class="text-xs text-gray-400">
                {{ formatMessageTime(conversation.lastMessage.created_at) }}
              </span>
            </div>
            
            <p class="text-xs text-gray-400 truncate mt-0.5">
              <span v-if="conversation.lastMessage.subject" class="font-medium">{{ conversation.lastMessage.subject }}: </span>
              {{ conversation.lastMessage.message }}
            </p>
            
            <!-- Message Count Badge -->
            <div v-if="conversation.messages.length > 1" class="flex items-center mt-0.5">
              <span class="text-xs text-gray-500">
                {{ conversation.messages.length }} mensajes
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-3 border-t border-gray-700">
      <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-2.5">
        <div class="flex items-center">
          <svg class="w-3.5 h-3.5 text-red-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <p class="text-red-400 text-xs">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Conversation {
  user: any;
  messages: any[];
  lastMessage: any;
}

interface Props {
  conversations: Conversation[]
  loading?: boolean
  error?: string | null
  selectedUserId?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  selectedUserId: undefined
})

defineEmits<{
  selectConversation: [conversation: Conversation]
}>()

// Format message time for display
const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Ahora'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d`
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    })
  }
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.src.includes('gravatar.com')) {
    img.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=40'
  }
}
</script>
