<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="closeModal">
        <div :class="['modal-content', `modal-${size}`]" @click.stop>
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Content -->
          <div class="mb-6">
            <!-- Custom content slot -->
            <slot v-if="$slots.default" />
            
            <!-- Default message content -->
            <div v-else-if="message">
              <div v-if="type === 'success'" class="flex items-center space-x-3 text-green-400">
                <CheckCircle class="w-6 h-6" />
                <p>{{ message }}</p>
              </div>
              <div v-else-if="type === 'error'" class="flex items-center space-x-3 text-red-400">
                <AlertCircle class="w-6 h-6" />
                <p>{{ message }}</p>
              </div>
              <div v-else-if="type === 'warning'" class="flex items-center space-x-3 text-yellow-400">
                <AlertTriangle class="w-6 h-6" />
                <p>{{ message }}</p>
              </div>
              <div v-else class="flex items-center space-x-3 text-blue-400">
                <Info class="w-6 h-6" />
                <p>{{ message }}</p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div v-if="!$slots.default" class="flex justify-end space-x-3">
            <button
              v-if="showCancel"
              @click="closeModal"
              class="btn-secondary"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirmAction"
              class="btn-primary"
            >
              {{ confirmText }}
            </button>
          </div>
          
          <!-- Custom actions slot -->
          <div v-else-if="$slots.actions" class="flex justify-end space-x-3">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next';

interface Props {
  modelValue?: boolean;
  show?: boolean;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  show: false,
  type: 'info',
  showCancel: false,
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  size: 'md'
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
  confirm: [];
}>();

// Use modelValue if provided, otherwise fall back to show prop
const isVisible = computed(() => props.modelValue || props.show);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};

const confirmAction = () => {
  emit('confirm');
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto;
}

.modal-sm {
  @apply w-full max-w-sm;
}

.modal-md {
  @apply w-full max-w-md;
}

.modal-lg {
  @apply w-full max-w-2xl;
}

.modal-xl {
  @apply w-full max-w-4xl;
}

.btn-primary {
  @apply bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>