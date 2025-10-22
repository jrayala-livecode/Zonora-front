<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-75" @click="closeModal"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-gray-800 rounded-lg w-full max-w-md shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir Evento
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-full"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p class="text-gray-400">Generando enlace...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-200">{{ error }}</p>
              </div>
            </div>

            <!-- Share Link -->
            <div v-else-if="shareLink">
              <p class="text-gray-300 text-sm mb-3">
                Comparte este enlace para que otros puedan ver el evento:
              </p>
              
              <div class="bg-gray-700 rounded-lg p-4 mb-4">
                <div class="flex items-center space-x-2">
                  <input 
                    type="text" 
                    :value="shareLink" 
                    readonly 
                    class="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-orange-500"
                    @click="selectAll"
                    ref="linkInput"
                  />
                  <button
                    @click="copyLink"
                    :disabled="copied"
                    class="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-green-600 text-white text-sm font-medium rounded transition-colors flex items-center space-x-2"
                  >
                    <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ copied ? 'Copiado' : 'Copiar' }}</span>
                  </button>
                </div>
              </div>

              <!-- Success Message -->
              <Transition name="fade">
                <div v-if="copied" class="bg-green-900 border border-green-700 rounded-lg p-3 mb-4">
                  <div class="flex items-center text-green-200 text-sm">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enlace copiado al portapapeles
                  </div>
                </div>
              </Transition>

              <p class="text-gray-400 text-xs text-center">
                Podrás ver las estadísticas de este enlace en la página de gestión del evento
              </p>
            </div>

            <!-- No Data State -->
            <div v-else class="text-center py-8">
              <div class="text-gray-400 mb-4">
                <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <p class="text-gray-400 mb-2">No se pudo generar el enlace de compartir</p>
              <button 
                @click="generateShareLink(props.eventId)"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useEventShare } from '~/composables/useEventShare';

const props = defineProps<{
  eventId: number;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { shareLink, loading, error, generateShareLink, copyToClipboard } = useEventShare();
const copied = ref(false);
const linkInput = ref<HTMLInputElement | null>(null);

const closeModal = () => {
  emit('close');
};

const copyLink = async () => {
  if (shareLink.value) {
    const success = await copyToClipboard(shareLink.value);
    if (success) {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 3000);
    }
  }
};

const selectAll = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.select();
};

// Generate share link when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && !shareLink.value) {
    try {
      await generateShareLink(props.eventId);
    } catch (e) {
      // Error is already set in the composable
    }
  }
  
  // Reset copied state when modal closes
  if (!isOpen) {
    copied.value = false;
  }
});

// Generate link on mount if modal is already open
onMounted(async () => {
  if (props.isOpen && !shareLink.value) {
    try {
      await generateShareLink(props.eventId);
    } catch (e) {
      // Error is already set in the composable
    }
  }
});
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative {
  transform: scale(0.95);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

/* Fade transition for success message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

