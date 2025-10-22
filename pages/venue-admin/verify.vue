<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/profile"
          class="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Volver al Perfil
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white mb-2">Verificación de Identidad</h1>
        <p class="text-gray-400">Verifica tu identidad para reclamar venues</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader class="w-8 h-8 animate-spin text-orange-400" />
      </div>

      <!-- Verification Status Display (if exists) -->
      <div v-else-if="verification">
        <!-- Pending Status -->
        <div v-if="verification.verification_status === 'pending'" class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
          <div class="flex items-start">
            <Clock class="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 class="text-yellow-400 font-semibold text-lg mb-2">Verificación en Proceso</h3>
              <p class="text-gray-300 mb-2">
                Tu verificación está siendo revisada por nuestro equipo. Te notificaremos cuando esté lista.
              </p>
              <p class="text-sm text-gray-400">
                Enviada el {{ formatDate(verification.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Approved Status -->
        <div v-else-if="verification.verification_status === 'approved'" class="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
          <div class="flex items-start">
            <CheckCircle class="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 class="text-green-400 font-semibold text-lg mb-2">Identidad Verificada ✓</h3>
              <p class="text-gray-300 mb-2">
                Tu identidad ha sido verificada exitosamente. Ya puedes reclamar venues.
              </p>
              <p class="text-sm text-gray-400 mb-4">
                Aprobada el {{ formatDate(verification.reviewed_at!) }}
              </p>
              <NuxtLink
                to="/venues"
                class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Building class="w-5 h-5 mr-2" />
                Explorar Venues para Reclamar
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Rejected Status -->
        <div v-else-if="verification.verification_status === 'rejected'" class="space-y-6">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <div class="flex items-start">
              <AlertCircle class="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 class="text-red-400 font-semibold text-lg mb-2">Verificación Rechazada</h3>
                <p class="text-gray-300 mb-2">
                  Tu verificación fue rechazada. Por favor revisa el motivo y envía una nueva solicitud.
                </p>
                <div class="bg-red-900/30 border border-red-500/20 rounded p-3 mt-3">
                  <p class="text-sm text-red-300 font-medium mb-1">Motivo:</p>
                  <p class="text-sm text-red-200">{{ verification.rejection_reason }}</p>
                </div>
                <p class="text-sm text-gray-400 mt-3">
                  Rechazada el {{ formatDate(verification.reviewed_at!) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Allow re-submission for rejected verifications -->
          <p class="text-center text-gray-400">Puedes enviar una nueva solicitud de verificación abajo:</p>
        </div>
      </div>

      <!-- Verification Form (show if no verification or rejected) -->
      <div v-if="!isLoading && (!verification || verification.verification_status === 'rejected')" class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
        <div class="mb-6">
          <div class="flex items-start mb-4">
            <ShieldCheck class="w-8 h-8 text-orange-400 mr-3 flex-shrink-0" />
            <div>
              <h3 class="text-xl font-bold text-white mb-2">Requisitos de Verificación</h3>
              <p class="text-gray-400 text-sm">
                Necesitamos verificar tu identidad para garantizar la seguridad de la plataforma.
              </p>
            </div>
          </div>
          
          <ul class="space-y-2 text-sm text-gray-300">
            <li class="flex items-start">
              <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>Fotografía del frente de tu cédula de identidad</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>Fotografía del reverso de tu cédula de identidad</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>Fotografía de tu rostro (selfie)</span>
            </li>
          </ul>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- RUT -->
          <div>
            <label class="block text-gray-300 font-medium mb-2">
              RUT <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.rut"
              type="text"
              required
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="12.345.678-9"
            />
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-gray-300 font-medium mb-2">
              Nombre Completo <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formData.full_name"
              type="text"
              required
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Juan Pérez García"
            />
          </div>

          <!-- ID Front Photo -->
          <div>
            <label class="block text-gray-300 font-medium mb-2">
              Foto Frente Cédula <span class="text-red-400">*</span>
            </label>
            <div class="space-y-2">
              <label
                class="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-gray-750 transition-colors"
              >
                <div class="text-center">
                  <Upload class="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <span class="text-gray-300">
                    {{ idFrontFile ? idFrontFile.name : 'Seleccionar imagen' }}
                  </span>
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG (máx. 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  class="hidden"
                  @change="(e) => handleFileSelect(e, 'id_front')"
                  :disabled="isSubmitting"
                  required
                />
              </label>
            </div>
          </div>

          <!-- ID Back Photo -->
          <div>
            <label class="block text-gray-300 font-medium mb-2">
              Foto Reverso Cédula <span class="text-red-400">*</span>
            </label>
            <div class="space-y-2">
              <label
                class="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-gray-750 transition-colors"
              >
                <div class="text-center">
                  <Upload class="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <span class="text-gray-300">
                    {{ idBackFile ? idBackFile.name : 'Seleccionar imagen' }}
                  </span>
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG (máx. 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  class="hidden"
                  @change="(e) => handleFileSelect(e, 'id_back')"
                  :disabled="isSubmitting"
                  required
                />
              </label>
            </div>
          </div>

          <!-- Face Photo -->
          <div>
            <label class="block text-gray-300 font-medium mb-2">
              Foto de Rostro (Selfie) <span class="text-red-400">*</span>
            </label>
            <div class="space-y-2">
              <label
                class="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-gray-750 transition-colors"
              >
                <div class="text-center">
                  <Upload class="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <span class="text-gray-300">
                    {{ facePhotoFile ? facePhotoFile.name : 'Seleccionar imagen' }}
                  </span>
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG (máx. 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  class="hidden"
                  @change="(e) => handleFileSelect(e, 'face_photo')"
                  :disabled="isSubmitting"
                  required
                />
              </label>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div class="flex items-center">
              <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
              <p class="text-red-400">{{ error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting || !canSubmit"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!isSubmitting">Enviar Verificación</span>
            <span v-else class="flex items-center">
              <Loader class="w-5 h-5 mr-2 animate-spin" />
              Enviando...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Upload, ShieldCheck, CheckCircle, Clock, AlertCircle, Loader, Building } from 'lucide-vue-next'

definePageMeta({
  middleware: 'auth',
  title: 'Verificación de Identidad'
})

const router = useRouter()
const { submitVerification, getVerificationStatus } = useVenueAdminVerification()

const verification = ref<any>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const formData = ref({
  rut: '',
  full_name: ''
})

const idFrontFile = ref<File | null>(null)
const idBackFile = ref<File | null>(null)
const facePhotoFile = ref<File | null>(null)

// Check verification status on mount
onMounted(async () => {
  verification.value = await getVerificationStatus()
  isLoading.value = false
})

const canSubmit = computed(() => {
  return formData.value.rut && 
         formData.value.full_name && 
         idFrontFile.value && 
         idBackFile.value && 
         facePhotoFile.value
})

const handleFileSelect = (event: Event, type: 'id_front' | 'id_back' | 'face_photo') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'La imagen es demasiado grande (máx. 10MB)'
    return
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validTypes.includes(file.type)) {
    error.value = 'Formato inválido. Usa JPG o PNG'
    return
  }

  // Clear error
  error.value = null

  // Assign file
  if (type === 'id_front') {
    idFrontFile.value = file
  } else if (type === 'id_back') {
    idBackFile.value = file
  } else if (type === 'face_photo') {
    facePhotoFile.value = file
  }
}

const handleSubmit = async () => {
  error.value = null
  isSubmitting.value = true

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('rut', formData.value.rut)
    formDataToSend.append('full_name', formData.value.full_name)
    formDataToSend.append('id_front', idFrontFile.value!)
    formDataToSend.append('id_back', idBackFile.value!)
    formDataToSend.append('face_photo', facePhotoFile.value!)

    const result = await submitVerification(formDataToSend)

    if (result.success) {
      // Update verification state
      verification.value = result.data
      
      // Show success and redirect after delay
      setTimeout(() => {
        router.push('/profile?tab=venue-admin')
      }, 3000)
    } else {
      error.value = result.error || 'Error al enviar la verificación'
    }
  } catch (err: any) {
    error.value = err.message || 'Error inesperado'
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>

