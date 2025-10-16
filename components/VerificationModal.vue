<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verificación de Organizador
          </h2>
          <button 
            @click="close"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-400 mt-2">
          Para crear eventos con compra directa en la app, necesitas verificar tu identidad.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmitVerification" class="p-6 space-y-6">
        <!-- Personal Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-white">Información Personal</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="rut" class="block text-sm font-medium text-gray-300 mb-2">RUT *</label>
              <input 
                id="rut"
                v-model="form.rut"
                type="text" 
                placeholder="12.345.678-9"
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <label for="full_name" class="block text-sm font-medium text-gray-300 mb-2">Nombre Completo *</label>
              <input 
                id="full_name"
                v-model="form.full_name"
                type="text" 
                placeholder="Juan Pérez González"
                class="input-field w-full"
                required
              />
            </div>
          </div>
        </div>

        <!-- Banking Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-white">Información Bancaria</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="bank_account" class="block text-sm font-medium text-gray-300 mb-2">Número de Cuenta *</label>
              <input 
                id="bank_account"
                v-model="form.bank_account"
                type="text" 
                placeholder="12345678901"
                class="input-field w-full"
                required
              />
            </div>

            <div>
              <label for="account_type" class="block text-sm font-medium text-gray-300 mb-2">Tipo de Cuenta *</label>
              <select 
                id="account_type"
                v-model="form.account_type" 
                class="input-field w-full"
                required
              >
                <option value="">Selecciona tipo de cuenta</option>
                <option value="cuenta_vista">Cuenta Vista</option>
                <option value="cuenta_rut">Cuenta RUT</option>
                <option value="cuenta_corriente">Cuenta Corriente</option>
              </select>
            </div>
          </div>

          <div>
            <label for="bank_name" class="block text-sm font-medium text-gray-300 mb-2">Nombre del Banco *</label>
            <input 
              id="bank_name"
              v-model="form.bank_name"
              type="text" 
              placeholder="Banco de Chile, Santander, etc."
              class="input-field w-full"
              required
            />
          </div>
        </div>

        <!-- Document Uploads -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-white">Documentos de Identificación</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="id_front" class="block text-sm font-medium text-gray-300 mb-2">Cédula de Identidad - Frente *</label>
              <input 
                id="id_front"
                @change="handleFileChange('id_front', $event)"
                type="file" 
                accept="image/*"
                class="input-field w-full"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Formato: JPG, PNG. Máximo 2MB</p>
            </div>

            <div>
              <label for="id_back" class="block text-sm font-medium text-gray-300 mb-2">Cédula de Identidad - Reverso *</label>
              <input 
                id="id_back"
                @change="handleFileChange('id_back', $event)"
                type="file" 
                accept="image/*"
                class="input-field w-full"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Formato: JPG, PNG. Máximo 2MB</p>
            </div>
          </div>

          <div>
            <label for="face_photo" class="block text-sm font-medium text-gray-300 mb-2">Foto de Rostro *</label>
            <input 
              id="face_photo"
              @change="handleFileChange('face_photo', $event)"
              type="file" 
              accept="image/*"
              capture="user"
              class="input-field w-full"
              required
            />
            <p class="text-xs text-gray-500 mt-1">Toma una foto directa de tu rostro. Formato: JPG, PNG. Máximo 2MB</p>
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="p-4 bg-gray-700 rounded-lg">
          <h4 class="text-sm font-semibold text-orange-400 mb-2">Información Importante</h4>
          <ul class="text-xs text-gray-300 space-y-1">
            <li>• La verificación es necesaria para verificar tu identidad y asegurar que eres el organizador del evento.</li>
            <li>• Tus documentos se almacenan de forma segura en nuestros servidores</li>
            <li>• La verificación puede tomar entre 1-3 días hábiles</li>
            <li>• Una vez verificada, tu cuenta podrá crear eventos con compra directa</li>
            <li>• Esta información es confidencial y no se comparte con terceros</li>
            <li>• Tu información será borrada una vez verificada.</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button 
            type="button"
            @click="close"
            class="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
          >
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ isSubmitting ? 'Enviando...' : 'Enviar Verificación' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useVerification, type VerificationForm } from '~/composables/useVerification'
import { useModal } from '~/composables/useModal'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  verified: []
}>()

const { submitVerification, isLoading: isVerificationLoading } = useVerification()
const { showSuccess, showError } = useModal()

const isSubmitting = ref(false)

const form = reactive<VerificationForm>({
  rut: '',
  full_name: '',
  bank_account: '',
  account_type: '' as any,
  bank_name: '',
  id_front: null,
  id_back: null,
  face_photo: null,
})

const close = () => {
  emit('close')
}

const handleFileChange = (field: keyof Pick<VerificationForm, 'id_front' | 'id_back' | 'face_photo'>, event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    form[field] = input.files[0]
  }
}

const handleSubmitVerification = async () => {
  if (!form.id_front || !form.id_back || !form.face_photo) {
    showError('Error', 'Debes subir todos los documentos requeridos')
    return
  }

  isSubmitting.value = true
  
  try {
    const formData = new FormData()
    formData.append('rut', form.rut)
    formData.append('full_name', form.full_name)
    formData.append('bank_account', form.bank_account)
    formData.append('account_type', form.account_type)
    formData.append('bank_name', form.bank_name)
    formData.append('id_front', form.id_front)
    formData.append('id_back', form.id_back)
    formData.append('face_photo', form.face_photo)

    await submitVerification(formData)
    
    showSuccess(
      'Verificación Enviada',
      'Tu solicitud de verificación ha sido enviada. Recibirás una respuesta en 1-3 días hábiles.'
    )
    
    emit('verified')
    close()
  } catch (error) {
    showError('Error', 'No se pudo enviar la verificación. Inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
