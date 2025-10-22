<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Verificaciones de Venue Admin</h1>
        <p class="text-gray-400">Revisa y aprueba solicitudes de verificación de identidad</p>
      </div>

      <!-- Filters -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Filter class="w-5 h-5 text-gray-400" />
            <select
              v-model="selectedStatus"
              @change="fetchVerifications"
              class="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
          
          <div class="text-sm text-gray-400">
            {{ verifications.length }} verificacion{{ verifications.length !== 1 ? 'es' : '' }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader class="w-8 h-8 animate-spin text-orange-400" />
      </div>

      <!-- Verifications List -->
      <div v-else-if="verifications.length > 0" class="space-y-4">
        <div
          v-for="verification in verifications"
          :key="verification.id"
          class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-semibold text-white mb-1">
                {{ verification.full_name }}
              </h3>
              <p class="text-gray-400 text-sm">RUT: {{ verification.rut }}</p>
              <p class="text-gray-400 text-sm">
                Usuario: {{ verification.user?.name }} ({{ verification.user?.email }})
              </p>
              <p class="text-gray-500 text-xs mt-1">
                Enviada el {{ formatDate(verification.created_at) }}
              </p>
            </div>

            <span
              :class="[
                'px-3 py-1 text-sm font-medium rounded-full',
                verification.verification_status === 'pending'
                  ? 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                  : verification.verification_status === 'approved'
                  ? 'bg-green-900 text-green-300 border border-green-700'
                  : 'bg-red-900 text-red-300 border border-red-700'
              ]"
            >
              {{ getStatusLabel(verification.verification_status) }}
            </span>
          </div>

          <!-- ID Photos -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-gray-400 text-sm mb-2">Frente Cédula</p>
              <img
                :src="getPinataUrl(verification.id_front_path)"
                alt="ID Front"
                class="w-full h-32 object-cover rounded-lg border border-gray-600 cursor-pointer hover:opacity-75 transition-opacity"
                @click="openImage(getPinataUrl(verification.id_front_path))"
              />
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-2">Reverso Cédula</p>
              <img
                :src="getPinataUrl(verification.id_back_path)"
                alt="ID Back"
                class="w-full h-32 object-cover rounded-lg border border-gray-600 cursor-pointer hover:opacity-75 transition-opacity"
                @click="openImage(getPinataUrl(verification.id_back_path))"
              />
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-2">Foto Rostro</p>
              <img
                :src="getPinataUrl(verification.face_photo_path)"
                alt="Face Photo"
                class="w-full h-32 object-cover rounded-lg border border-gray-600 cursor-pointer hover:opacity-75 transition-opacity"
                @click="openImage(getPinataUrl(verification.face_photo_path))"
              />
            </div>
          </div>

          <!-- Rejection Reason (if rejected) -->
          <div v-if="verification.verification_status === 'rejected' && verification.rejection_reason" class="mb-4">
            <p class="text-red-400 text-sm font-medium mb-1">Motivo de rechazo:</p>
            <p class="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded p-3">
              {{ verification.rejection_reason }}
            </p>
          </div>

          <!-- Review Info (if reviewed) -->
          <div v-if="verification.reviewed_at" class="text-sm text-gray-500 mb-4">
            Revisado por {{ verification.reviewer?.name }} el {{ formatDate(verification.reviewed_at) }}
          </div>

          <!-- Actions (only for pending) -->
          <div v-if="verification.verification_status === 'pending'" class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              @click="handleReject(verification.id)"
              :disabled="processingId === verification.id"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <X class="w-4 h-4 mr-1" />
              Rechazar
            </button>
            <button
              @click="handleApprove(verification.id)"
              :disabled="processingId === verification.id"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <CheckCircle class="w-4 h-4 mr-1" />
              Aprobar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-12 text-center">
        <ShieldCheck class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-400 mb-2">No hay verificaciones</h3>
        <p class="text-gray-500">
          {{ selectedStatus ? `No hay verificaciones en estado "${getStatusLabel(selectedStatus)}"` : 'No hay verificaciones para revisar' }}
        </p>
      </div>
    </div>

    <!-- Image Modal -->
    <Teleport to="body">
      <div
        v-if="selectedImage"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        @click="selectedImage = null"
      >
        <img
          :src="selectedImage"
          alt="Preview"
          class="max-w-full max-h-full object-contain"
        />
        <button
          class="absolute top-4 right-4 text-white hover:text-gray-300"
          @click="selectedImage = null"
        >
          <X class="w-8 h-8" />
        </button>
      </div>
    </Teleport>

    <!-- Rejection Modal -->
    <Teleport to="body">
      <div
        v-if="showRejectModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showRejectModal = false"
      >
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-xl font-bold text-white mb-4">Rechazar Verificación</h3>
          <p class="text-gray-400 mb-4">Proporciona un motivo para el rechazo:</p>
          
          <textarea
            v-model="rejectReason"
            rows="4"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            placeholder="Ej: Las fotos están borrosas, el RUT no coincide..."
            required
          ></textarea>

          <div class="flex items-center justify-end space-x-3">
            <button
              @click="showRejectModal = false"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="confirmReject"
              :disabled="!rejectReason || processingId !== null"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Confirmar Rechazo
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Filter, ShieldCheck, CheckCircle, Clock, AlertCircle, Loader, X } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth', 'admin'],
  title: 'Verificaciones de Venue Admin'
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:8000/api'

const verifications = ref<any[]>([])
const selectedStatus = ref('')
const isLoading = ref(true)
const processingId = ref<number | null>(null)
const selectedImage = ref<string | null>(null)
const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectingId = ref<number | null>(null)

const fetchVerifications = async () => {
  isLoading.value = true
  
  try {
    const { apiRequest } = useApiClient()
    const url = selectedStatus.value 
      ? `/admin/venue-admin-verifications?status=${selectedStatus.value}`
      : '/admin/venue-admin-verifications'
    
    const response = await apiRequest(url)
    
    if (response.ok) {
      const data = await response.json()
      verifications.value = data.data.data || data.data
    }
  } catch (err) {
    console.error('Error fetching verifications:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchVerifications()
})

const getPinataUrl = (cid: string): string => {
  return `${apiBase}/pinata/${cid}`
}

const openImage = (url: string) => {
  selectedImage.value = url
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobada',
    rejected: 'Rechazada'
  }
  return labels[status] || status
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

const handleApprove = async (id: number) => {
  if (!confirm('¿Aprobar esta verificación?')) return

  processingId.value = id

  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest(`/admin/venue-admin-verifications/${id}/approve`, {
      method: 'POST'
    })

    if (response.ok) {
      // Refresh list
      await fetchVerifications()
    } else {
      const errorData = await response.json()
      alert(errorData.message || 'Error al aprobar')
    }
  } catch (err) {
    alert('Error al aprobar la verificación')
  } finally {
    processingId.value = null
  }
}

const handleReject = (id: number) => {
  rejectingId.value = id
  rejectReason.value = ''
  showRejectModal.value = true
}

const confirmReject = async () => {
  if (!rejectingId.value || !rejectReason.value) return

  processingId.value = rejectingId.value

  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest(`/admin/venue-admin-verifications/${rejectingId.value}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason: rejectReason.value })
    })

    if (response.ok) {
      showRejectModal.value = false
      rejectReason.value = ''
      rejectingId.value = null
      // Refresh list
      await fetchVerifications()
    } else {
      const errorData = await response.json()
      alert(errorData.message || 'Error al rechazar')
    }
  } catch (err) {
    alert('Error al rechazar la verificación')
  } finally {
    processingId.value = null
  }
}
</script>

