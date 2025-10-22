<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Mis Reclamos de Venue</h1>
        <p class="text-gray-400">Gestiona tus solicitudes de reclamo de venues</p>
      </div>

      <!-- Filter Section -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Filter class="w-5 h-5 text-gray-400" />
            <select
              v-model="selectedStatus"
              class="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          
          <div class="text-sm text-gray-400">
            {{ filteredClaims.length }} reclamo{{ filteredClaims.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
          <p class="text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Claims List -->
      <div v-else-if="filteredClaims.length > 0" class="space-y-4">
        <div
          v-for="claim in filteredClaims"
          :key="claim.id"
          class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 hover:border-gray-600 transition-colors"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-white mb-2">
                {{ claim.venue?.name || 'Venue' }}
              </h3>
              <p v-if="claim.venue?.address" class="text-gray-400 text-sm flex items-center">
                <MapPin class="w-4 h-4 mr-1" />
                {{ claim.venue.address }}
              </p>
            </div>

            <!-- Status Badge -->
            <span
              :class="[
                'px-3 py-1 text-sm font-medium rounded-full',
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
            <p class="text-gray-400 text-sm mb-2">Documentos subidos:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(doc, index) in claim.document_paths"
                :key="index"
                class="inline-flex items-center bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-gray-300"
              >
                <FileText class="w-4 h-4 mr-1" />
                Documento {{ index + 1 }}
              </span>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="claim.notes" class="mb-4">
            <p class="text-gray-400 text-sm mb-1">Notas:</p>
            <p class="text-gray-300 text-sm bg-gray-700 border border-gray-600 rounded p-3">
              {{ claim.notes }}
            </p>
          </div>

          <!-- Rejection Reason -->
          <div v-if="claim.claim_status === 'rejected' && claim.rejection_reason" class="mb-4">
            <p class="text-red-400 text-sm mb-1 font-medium">Motivo de rechazo:</p>
            <p class="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded p-3">
              {{ claim.rejection_reason }}
            </p>
          </div>

          <!-- Meta Info -->
          <div class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-700">
            <div class="flex items-center space-x-4">
              <span class="flex items-center">
                <Calendar class="w-4 h-4 mr-1" />
                {{ formatDate(claim.created_at) }}
              </span>
              <span v-if="claim.reviewed_at" class="flex items-center">
                <CheckCircle class="w-4 h-4 mr-1" />
                Revisado {{ formatDate(claim.reviewed_at) }}
              </span>
            </div>

            <!-- Cancel Button (only for pending) -->
            <button
              v-if="claim.claim_status === 'pending'"
              @click="handleCancelClaim(claim.id)"
              :disabled="cancelingId === claim.id"
              class="flex items-center text-red-400 hover:text-red-300 hover:bg-red-900/20 px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X class="w-4 h-4 mr-1" />
              <span v-if="cancelingId === claim.id">Cancelando...</span>
              <span v-else>Cancelar Reclamo</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-12 text-center">
        <Building class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-400 mb-2">No tienes reclamos</h3>
        <p class="text-gray-500 mb-6">
          {{ selectedStatus === 'all' 
            ? 'Aún no has reclamado ningún venue. Busca un venue sin asignar y reclámalo.' 
            : `No tienes reclamos en estado "${getStatusLabel(selectedStatus)}".`
          }}
        </p>
        <NuxtLink
          to="/venues"
          class="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Building class="w-5 h-5 mr-2" />
          Explorar Venues
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Filter, MapPin, FileText, Calendar, CheckCircle, X, AlertCircle, Building } from 'lucide-vue-next'
import type { VenueClaim } from '~/composables/types/types'

definePageMeta({
  middleware: 'auth',
  title: 'Mis Reclamos de Venue'
})

const { getMyClaims, cancelClaim } = useVenueClaims()

const claims = ref<VenueClaim[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedStatus = ref<string>('all')
const cancelingId = ref<number | null>(null)

// Fetch claims on mount
onMounted(async () => {
  try {
    const data = await getMyClaims()
    claims.value = data || []
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los reclamos'
  } finally {
    isLoading.value = false
  }
})

// Filter claims by status
const filteredClaims = computed(() => {
  if (selectedStatus.value === 'all') {
    return claims.value
  }
  return claims.value.filter(claim => claim.claim_status === selectedStatus.value)
})

// Get status label in Spanish
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    all: 'Todos'
  }
  return labels[status] || status
}

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Handle cancel claim
const handleCancelClaim = async (claimId: number) => {
  if (!confirm('¿Estás seguro de que deseas cancelar este reclamo?')) {
    return
  }

  cancelingId.value = claimId

  try {
    const result = await cancelClaim(claimId)
    
    if (result.success) {
      // Remove from local list
      claims.value = claims.value.filter(c => c.id !== claimId)
    } else {
      alert(result.error || 'Error al cancelar el reclamo')
    }
  } catch (err: any) {
    alert(err.message || 'Error al cancelar el reclamo')
  } finally {
    cancelingId.value = null
  }
}
</script>


