<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
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
          
          <!-- Actions -->
          <div class="flex justify-end space-x-3">
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next';

interface Props {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  showCancel: false,
  confirmText: 'Aceptar',
  cancelText: 'Cancelar'
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const closeModal = () => {
  emit('close');
};

const confirmAction = () => {
  emit('confirm');
  closeModal();
};
</script>