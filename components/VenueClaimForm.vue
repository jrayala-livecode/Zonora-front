<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-6">
    <h3 class="text-2xl font-bold text-white mb-4">Reclamar Venue</h3>
    <p class="text-gray-300 mb-6">
      Sube documentos que prueben tu propiedad del venue (cuenta de agua, luz, documento legal, etc.)
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Document Upload Section -->
      <div>
        <label class="block text-gray-300 font-medium mb-2">
          Documentos de Propiedad (1-5 archivos)
          <span class="text-red-400">*</span>
        </label>
        <p class="text-sm text-gray-400 mb-3">
          Formatos: PDF, JPG, PNG. Máximo 10MB por archivo.
        </p>

        <!-- File Input -->
        <div class="mb-4">
          <label
            class="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-gray-750 transition-colors"
          >
            <div class="text-center">
              <UploadCloud class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <span class="text-gray-300">
                Haz clic para seleccionar archivos
              </span>
              <p class="text-sm text-gray-500 mt-1">
                o arrastra y suelta aquí
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              class="hidden"
              @change="handleFileSelect"
              :disabled="isSubmitting"
            />
          </label>
        </div>

        <!-- Selected Files List -->
        <div v-if="selectedFiles.length > 0" class="space-y-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-lg p-3"
          >
            <div class="flex items-center flex-1 min-w-0">
              <FileText class="w-5 h-5 text-orange-400 flex-shrink-0 mr-3" />
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium truncate">{{ file.name }}</p>
                <p class="text-sm text-gray-400">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="removeFile(index)"
              class="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              :disabled="isSubmitting"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Error message for files -->
        <p v-if="fileError" class="text-red-400 text-sm mt-2">
          {{ fileError }}
        </p>
      </div>

      <!-- Notes Section -->
      <div>
        <label class="block text-gray-300 font-medium mb-2">
          Notas Adicionales (Opcional)
        </label>
        <textarea
          v-model="notes"
          rows="4"
          class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          placeholder="Agrega información adicional sobre tu reclamo..."
          :disabled="isSubmitting"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
          <p class="text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <div class="flex items-center">
          <CheckCircle class="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
          <p class="text-green-400">
            Reclamo enviado exitosamente. Será revisado por un administrador.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end space-x-4 pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="isSubmitting || selectedFiles.length === 0"
        >
          <span v-if="!isSubmitting">Enviar Reclamo</span>
          <span v-else class="flex items-center">
            <Loader class="w-5 h-5 mr-2 animate-spin" />
            Enviando...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud, FileText, X, AlertCircle, CheckCircle, Loader } from 'lucide-vue-next'

const props = defineProps<{
  venueId: number
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

const { submitClaim } = useVenueClaims()

const selectedFiles = ref<File[]>([])
const notes = ref('')
const fileError = ref<string | null>(null)
const error = ref<string | null>(null)
const success = ref(false)
const isSubmitting = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  // Reset error
  fileError.value = null

  // Validate file count
  if (selectedFiles.value.length + files.length > 5) {
    fileError.value = 'Máximo 5 archivos permitidos'
    return
  }

  // Validate each file
  for (const file of files) {
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      fileError.value = `El archivo "${file.name}" es demasiado grande (máx. 10MB)`
      return
    }

    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      fileError.value = `El archivo "${file.name}" no es un formato válido (PDF, JPG, PNG)`
      return
    }
  }

  // Add files to selection
  selectedFiles.value.push(...files)
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  fileError.value = null
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleSubmit = async () => {
  // Reset messages
  error.value = null
  success.value = false
  fileError.value = null

  // Validate
  if (selectedFiles.value.length === 0) {
    fileError.value = 'Debes seleccionar al menos un documento'
    return
  }

  if (selectedFiles.value.length > 5) {
    fileError.value = 'Máximo 5 documentos permitidos'
    return
  }

  isSubmitting.value = true

  try {
    const result = await submitClaim(props.venueId, selectedFiles.value, notes.value || undefined)

    if (result.success) {
      success.value = true
      // Reset form
      selectedFiles.value = []
      notes.value = ''
      
      // Emit success after a delay
      setTimeout(() => {
        emit('success')
      }, 2000)
    } else {
      error.value = result.error || 'Error al enviar el reclamo'
    }
  } catch (err: any) {
    error.value = err.message || 'Error inesperado al enviar el reclamo'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>


