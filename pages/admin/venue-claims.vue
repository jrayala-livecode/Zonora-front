<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Reclamos de Venues</h1>
        <p class="text-gray-400">Revisa y aprueba solicitudes de reclamo de venues</p>
      </div>

      <!-- Filters -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Filter class="w-5 h-5 text-gray-400" />
            <select
              v-model="selectedStatus"
              @change="fetchClaims"
              class="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          
          <div class="text-sm text-gray-400">
            {{ claims.length }} reclamo{{ claims.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <Loader class="w-8 h-8 animate-spin text-orange-400" />
      </div>

      <!-- Claims List -->
      <div v-else-if="claims.length > 0" class="space-y-4">
        <div
          v-for="claim in claims"
          :key="claim.id"
          class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-white mb-2">
                {{ claim.venue?.name }}
              </h3>
              <p class="text-gray-400 text-sm flex items-center mb-1">
                <MapPin class="w-4 h-4 mr-1" />
                {{ claim.venue?.address }}
              </p>
              <p class="text-gray-400 text-sm">
                <span class="font-medium">Solicitado por:</span>
                {{ claim.venue_admin?.admin_name || claim.venue_admin?.user?.name }}
                ({{ claim.venue_admin?.user?.email }})
              </p>
              <p class="text-gray-500 text-xs mt-1">
                Enviado el {{ formatDate(claim.created_at) }}
              </p>
            </div>

            <span
              :class="[
                'px-3 py-1 text-sm font-medium rounded-full flex-shrink-0',
                claim.claim_status === 'pending'
                  ? 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                  : claim.claim_status === 'approved'
                  ? 'bg-green-900 text-green-300 border border-green-700'
                  : 'bg-red-900 text-red-300 border border-red-700'
              ]"
            >
              {{ getStatusLabel(claim.claim_status) }}
            </span>
          </div>

          <!-- Documents -->
          <div class="mb-4">
            <p class="text-gray-400 text-sm font-medium mb-3">Documentos de Propiedad:</p>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div
                v-for="(doc, index) in claim.document_paths"
                :key="index"
                class="group"
              >
                <div
                  class="aspect-square bg-gray-700 border border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-orange-500 transition-colors"
                  @click="openDocument(doc)"
                >
                  <img
                    v-if="isImageDocument(doc)"
                    :src="getPinataUrl(doc)"
                    :alt="`Documento ${index + 1}`"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <FileText class="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <p class="text-xs text-gray-500 text-center mt-1">Documento {{ index + 1 }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="claim.notes" class="mb-4">
            <p class="text-gray-400 text-sm font-medium mb-1">Notas:</p>
            <p class="text-gray-300 text-sm bg-gray-700 border border-gray-600 rounded p-3">
              {{ claim.notes }}
            </p>
          </div>

          <!-- Rejection Reason -->
          <div v-if="claim.claim_status === 'rejected' && claim.rejection_reason" class="mb-4">
            <p class="text-red-400 text-sm font-medium mb-1">Motivo de rechazo:</p>
            <p class="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded p-3">
              {{ claim.rejection_reason }}
            </p>
          </div>

          <!-- Review Info -->
          <div v-if="claim.reviewed_at" class="text-sm text-gray-500 mb-4">
            Revisado por {{ claim.reviewer?.name }} el {{ formatDate(claim.reviewed_at) }}
          </div>

          <!-- Actions (only for pending) -->
          <div v-if="claim.claim_status === 'pending'" class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              @click="handleReject(claim.id)"
              :disabled="processingId === claim.id"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <X class="w-4 h-4 mr-1" />
              Rechazar
            </button>
            <button
              @click="handleApprove(claim.id)"
              :disabled="processingId === claim.id"
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
        <Building class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-400 mb-2">No hay reclamos</h3>
        <p class="text-gray-500">
          {{ selectedStatus ? `No hay reclamos en estado "${getStatusLabel(selectedStatus)}"` : 'No hay reclamos para revisar' }}
        </p>
      </div>
    </div>

    <!-- Document Modal -->
    <Teleport to="body">
      <div
        v-if="selectedDocument"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        @click="selectedDocument = null"
      >
        <div class="max-w-4xl w-full max-h-full flex items-center justify-center">
          <img
            v-if="isImageDocument(selectedDocument)"
            :src="getPinataUrl(selectedDocument)"
            alt="Document Preview"
            class="max-w-full max-h-full object-contain"
          />
          <div v-else class="bg-gray-800 p-8 rounded-lg text-center">
            <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-white mb-4">Documento PDF</p>
            <a
              :href="getPinataUrl(selectedDocument)"
              target="_blank"
              class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg inline-block"
            >
              Abrir en Nueva Pestaña
            </a>
          </div>
        </div>
        <button
          class="absolute top-4 right-4 text-white hover:text-gray-300"
          @click="selectedDocument = null"
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
          <h3 class="text-xl font-bold text-white mb-4">Rechazar Reclamo</h3>
          <p class="text-gray-400 mb-4">Proporciona un motivo para el rechazo:</p>
          
          <textarea
            v-model="rejectReason"
            rows="4"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            placeholder="Ej: Los documentos no son suficientes, la propiedad no está a tu nombre..."
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
import { Filter, Building, MapPin, FileText, CheckCircle, Loader, X } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth', 'admin'],
  title: 'Reclamos de Venues'
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:8000/api'

const claims = ref<any[]>([])
const selectedStatus = ref('')
const isLoading = ref(true)
const processingId = ref<number | null>(null)
const selectedDocument = ref<string | null>(null)
const showRejectModal = ref(false)
const rejectReason = ref('')
const rejectingId = ref<number | null>(null)

const fetchClaims = async () => {
  isLoading.value = true
  
  try {
    const { apiRequest } = useApiClient()
    const url = selectedStatus.value 
      ? `/admin/venue-claims?status=${selectedStatus.value}`
      : '/admin/venue-claims'
    
    const response = await apiRequest(url)
    
    if (response.ok) {
      const data = await response.json()
      claims.value = data.data.data || data.data
    }
  } catch (err) {
    console.error('Error fetching claims:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchClaims()
})

const getPinataUrl = (cid: string): string => {
  return `${apiBase}/pinata/${cid}`
}

const isImageDocument = (filename: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
}

const openDocument = (doc: string) => {
  selectedDocument.value = doc
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado'
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
  if (!confirm('¿Aprobar este reclamo? El venue será asignado al administrador.')) return

  processingId.value = id

  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest(`/admin/venue-claims/${id}/approve`, {
      method: 'POST'
    })

    if (response.ok) {
      // Refresh list
      await fetchClaims()
    } else {
      const errorData = await response.json()
      alert(errorData.message || 'Error al aprobar')
    }
  } catch (err) {
    alert('Error al aprobar el reclamo')
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
    const response = await apiRequest(`/admin/venue-claims/${rejectingId.value}/reject`, {
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
      await fetchClaims()
    } else {
      const errorData = await response.json()
      alert(errorData.message || 'Error al rechazar')
    }
  } catch (err) {
    alert('Error al rechazar el reclamo')
  } finally {
    processingId.value = null
  }
}
</script>

