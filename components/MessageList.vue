<template>
  <div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 max-h-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
      <span class="ml-2 text-gray-400 text-sm">Cargando mensajes...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center py-8">
      <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <h3 class="text-base font-medium text-gray-300 mb-1">No hay mensajes aún</h3>
      <p class="text-gray-400 text-center text-sm">
        Envía el primer mensaje para comenzar la conversación
      </p>
    </div>

    <!-- Messages -->
    <div v-else class="space-y-2.5">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.from_user.id === currentUserId ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-xs lg:max-w-sm px-3 py-2 rounded-lg"
          :class="[
            message.from_user.id === currentUserId
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-100'
          ]"
        >
          <!-- Message Subject -->
          <div v-if="message.subject" class="text-xs font-medium mb-1 opacity-80">
            {{ message.subject }}
          </div>
          
          <!-- Message Content -->
          <div 
            class="text-sm whitespace-pre-wrap message-html-content"
            v-html="sanitizeMessage(message.message)"
          ></div>
          
          <!-- Message Metadata -->
          <div
            class="text-xs mt-1 opacity-70"
            :class="message.from_user.id === currentUserId ? 'text-purple-100' : 'text-gray-400'"
          >
            {{ formatMessageTime(message.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-red-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '~/composables/types/types'
import DOMPurify from 'isomorphic-dompurify'

interface Props {
  messages: Message[]
  loading?: boolean
  error?: string | null
  currentUserId?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  currentUserId: 0
})

/**
 * Sanitize all messages - allow safe HTML tags but block dangerous ones
 */
const sanitizeMessage = (html: string): string => {
  if (!html) return ''
  
  // Configure DOMPurify to allow safe HTML tags but block dangerous ones
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'br', 'strong', 'em', 'p', 'div', 'span', 'b', 'i', 'u'],
    ALLOWED_ATTR: ['href', 'style', 'class', 'title'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|#):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'target']
  })
}

// Format message time for display
const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    // Show time if today
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffInHours < 168) { // 7 days
    // Show day of week if within a week
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    // Show full date if older
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Auto-scroll to bottom when new messages arrive
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.overflow-y-auto')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// Watch for new messages and scroll to bottom
watch(() => props.messages.length, scrollToBottom)
</script>
