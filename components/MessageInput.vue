<template>
  <div class="bg-gray-800 border-t border-gray-700 p-3">
    <form @submit.prevent="handleSendMessage" class="space-y-2">
      <!-- Subject Input -->
      <div class="flex items-center space-x-2">
        <label for="subject" class="text-xs font-medium text-gray-300 min-w-[50px]">Asunto:</label>
        <input
          id="subject"
          v-model="messageSubject"
          type="text"
          placeholder="Asunto del mensaje..."
          class="flex-1 px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
          maxlength="255"
          :disabled="sending"
        />
      </div>
      
      <!-- Message Content -->
      <div class="flex gap-2">
        <div class="flex-1">
          <textarea
            v-model="messageContent"
            placeholder="Escribe tu mensaje..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
            rows="2"
            maxlength="5000"
            :disabled="sending"
            @keydown.enter.prevent="handleSendMessage"
            @keydown.shift.enter.prevent="messageContent += '\n'"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <p class="text-xs text-gray-500">Enter para enviar, Shift+Enter para nueva línea</p>
            <span class="text-xs text-gray-400">{{ messageContent.length }}/5000</span>
          </div>
        </div>
      
        <div class="flex flex-col gap-1">
        <button
          type="submit"
          :disabled="!messageContent.trim() || sending"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors duration-200 flex items-center justify-center min-w-[80px] text-sm"
        >
          <svg v-if="sending" class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {{ sending ? 'Enviando...' : 'Enviar' }}
        </button>
        </div>
      </div>
    </form>
    
    <!-- Error Message -->
    <div v-if="error" class="mt-2 p-2.5 bg-red-900/20 border border-red-500/30 rounded-md">
      <div class="flex items-center">
        <svg class="w-3.5 h-3.5 text-red-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-400 text-xs">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  receiverId: number
  onMessageSent?: (message: any) => void
}

const props = defineProps<Props>()

const { sendMessage } = useChat()

const messageContent = ref('')
const messageSubject = ref('')
const sending = ref(false)
const error = ref<string | null>(null)

const handleSendMessage = async () => {
  if (!messageContent.value.trim() || sending.value) return

  sending.value = true
  error.value = null

  try {
    const message = await sendMessage({
      receiver_id: props.receiverId,
      subject: messageSubject.value.trim() || 'Mensaje',
      content: messageContent.value.trim()
    })

    // Clear the inputs
    messageContent.value = ''
    messageSubject.value = ''
    
    // Call the callback if provided
    if (props.onMessageSent) {
      props.onMessageSent(message)
    }

  } catch (err: any) {
    error.value = err.data?.message || 'Error al enviar el mensaje'
    console.error('Error sending message:', err)
  } finally {
    sending.value = false
  }
}

// Clear error when user starts typing
const clearError = () => {
  if (error.value) {
    error.value = null
  }
}

// Watch for changes in message content to clear errors
watch(messageContent, clearError)
</script>
