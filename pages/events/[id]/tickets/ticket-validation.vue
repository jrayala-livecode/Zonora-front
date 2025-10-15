<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button 
          @click="router.back()" 
          class="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Mis Eventos
        </button>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Validación de Tickets</h1>
            <p class="text-gray-400">{{ event?.name }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(event?.date) }}</p>
          </div>
          
          <div class="text-right">
            <div class="text-2xl font-bold text-orange-400">{{ totalTickets }}</div>
            <div class="text-sm text-gray-400">Total Tickets</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="text-orange-400 text-xl animate-pulse">Cargando tickets...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-800 rounded-lg p-6">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-400">{{ stats.validated }}</div>
            <div class="text-sm text-gray-400">Validados</div>
          </div>
          <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div class="text-2xl font-bold text-yellow-400">{{ stats.pending }}</div>
            <div class="text-sm text-gray-400">Pendientes</div>
          </div>
          <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-400">{{ stats.used }}</div>
            <div class="text-sm text-gray-400">Usados</div>
          </div>
          <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div class="text-2xl font-bold text-red-400">{{ stats.rejected }}</div>
            <div class="text-sm text-gray-400">Rechazados</div>
          </div>
        </div>

        <!-- QR Scanner Button -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <button
            @click="openQrScanner"
            class="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Escanear Código QR</span>
          </button>
        </div>

        <!-- Search and Filter -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Email Search -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-300 mb-2">Buscar por Email</label>
              <div class="flex gap-2">
                <input
                  v-model="emailSearch"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  @keyup.enter="searchByEmail"
                />
                <button
                  @click="searchByEmail"
                  class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>

            <!-- Status Filter -->
            <div class="md:w-48">
              <label class="block text-sm font-medium text-gray-300 mb-2">Filtrar por Estado</label>
              <select
                v-model="statusFilter"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="validated">Validados</option>
                <option value="rejected">Rechazados</option>
                <option value="used">Usados</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tickets List -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white">Tickets del Evento</h2>
          </div>

          <div v-if="filteredTickets.length === 0" class="p-8 text-center text-gray-400">
            <p>No hay tickets que coincidan con los filtros</p>
          </div>

          <div v-else class="divide-y divide-gray-700">
            <div
              v-for="ticket in filteredTickets"
              :key="ticket.id"
              class="p-6 hover:bg-gray-750 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <!-- QR Code -->
                  <div class="w-16 h-16 bg-white p-2 rounded-lg">
                    <img 
                      :src="getQrCodeUrl(ticket.id)" 
                      alt="QR Code"
                      class="w-full h-full"
                      @error="qrError = true"
                    />
                  </div>

                  <!-- Ticket Info -->
                  <div>
                    <h3 class="font-semibold text-white">Ticket #{{ ticket.ticket_number }}</h3>
                    <p class="text-sm text-gray-400">{{ ticket.user?.name }}</p>
                    <p class="text-sm text-gray-400">{{ ticket.user?.email }}</p>
                    <p class="text-sm text-gray-400">
                      {{ formatDate(ticket.purchased_at) }}
                    </p>
                  </div>
                </div>

                <!-- Status and Actions -->
                <div class="flex items-center space-x-4">
                  <!-- Status Badge -->
                  <div :class="getStatusBadgeClass(ticket)" class="px-3 py-1 rounded-lg text-sm font-medium">
                    {{ getStatusLabel(ticket) }}
                  </div>

                  <!-- Actions -->
                  <div class="flex space-x-2">
                    <!-- Validate Receipt (only for pending) -->
                    <button
                      v-if="ticket.receipt_validation_status === 'pending'"
                      @click="validateReceipt(ticket.id)"
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                    >
                      Validar Recibo
                    </button>

                    <!-- Reject Receipt (only for pending) -->
                    <button
                      v-if="ticket.receipt_validation_status === 'pending'"
                      @click="showRejectModal(ticket)"
                      class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                    >
                      Rechazar
                    </button>

                    <!-- Mark as Used (only for validated) -->
                    <button
                      v-if="ticket.receipt_validation_status === 'validated' && ticket.status === 'active'"
                      @click="markAsUsed(ticket.id)"
                      class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                    >
                      Marcar como Usado
                    </button>

                    <!-- View Receipt -->
                    <button
                      v-if="ticket.metadata?.receipt_url"
                      @click="viewReceipt(ticket.metadata.receipt_url)"
                      class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                    >
                      Ver Recibo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Scanner Modal -->
    <div v-if="showQrScanner" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Escanear Código QR</h3>
          <button
            @click="closeQrScanner"
            class="text-gray-400 hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scanner View -->
        <div v-if="!scannedTicket" class="space-y-4">
          <!-- Camera Selection -->
          <div v-if="availableCameras.length > 0" class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">Seleccionar Cámara</label>
            <select
              v-model="selectedCamera"
              @change="switchCamera"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option v-for="camera in availableCameras" :key="camera.deviceId" :value="camera.deviceId">
                {{ camera.label || `Cámara ${camera.deviceId.substring(0, 8)}...` }}
              </option>
            </select>
          </div>

          <div class="bg-gray-700 rounded-lg p-4 aspect-square flex items-center justify-center overflow-hidden">
            <ClientOnly>
              <QrcodeStream
                :key="selectedCamera || 'default'"
                @detect="onDetect"
                @error="onError"
                :constraints="cameraConstraints"
                class="w-full h-full rounded-lg"
              />
            </ClientOnly>
          </div>
          <p class="text-center text-gray-400 text-sm">
            Apunta la cámara al código QR del ticket
          </p>
          <p v-if="scannerError" class="text-center text-red-400 text-sm">
            {{ scannerError }}
          </p>
        </div>

        <!-- Scanned Ticket Result -->
        <div v-else class="space-y-4">
          <div class="bg-gray-700 rounded-lg p-6">
            <div class="text-center mb-4">
              <div v-if="scannedTicket.can_be_used" class="text-green-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div v-else-if="scannedTicket.ticket?.status === 'used'" class="text-yellow-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div v-else class="text-red-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-white mb-2">{{ scannedTicket.ticket?.ticket_number || 'N/A' }}</h4>
              <p class="text-gray-300">{{ scannedTicket.holder?.name }}</p>
              <p class="text-gray-400 text-sm">{{ scannedTicket.holder?.email }}</p>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Estado:</span>
                <span :class="{
                  'text-green-400': scannedTicket.can_be_used,
                  'text-yellow-400': scannedTicket.ticket?.status === 'used',
                  'text-red-400': !scannedTicket.can_be_used && scannedTicket.ticket?.status !== 'used'
                }">
                  {{ scannedTicket.ticket?.status?.toUpperCase() || 'DESCONOCIDO' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Precio:</span>
                <span class="text-white">{{ scannedTicket.ticket?.price_paid || scannedTicket.ticket?.formatted_price || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Comprado:</span>
                <span class="text-white">{{ formatDate(scannedTicket.ticket?.purchased_at) }}</span>
              </div>
              <div v-if="scannedTicket.ticket?.used_at" class="flex justify-between">
                <span class="text-gray-400">Usado:</span>
                <span class="text-white">{{ formatDate(scannedTicket.ticket?.used_at) }}</span>
              </div>
            </div>

            <!-- Warning message for used tickets -->
            <div v-if="scannedTicket.ticket?.status === 'used'" class="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-yellow-200 text-sm">
                  Este ticket ya fue utilizado anteriormente. El usuario puede reingresar al evento.
                </p>
              </div>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              v-if="scannedTicket.can_be_used"
              @click="markScannedTicketAsUsed"
              class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Marcar como Usado
            </button>
            <button
              @click="scanAnother"
              class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Escanear Otro
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModalFlag" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-white mb-4">Rechazar Recibo</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">Motivo del Rechazo</label>
          <textarea
            v-model="rejectionReason"
            rows="3"
            placeholder="Explica por qué se rechaza este recibo..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelReject"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmReject"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket, EventTicketsResponse } from '~/composables/types/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const eventId = computed(() => parseInt(route.params.id as string))

const { getEventTickets, validateReceipt: validateTicketReceipt, rejectReceipt: rejectTicketReceipt, markTicketAsUsed, verifyTicket } = useTickets()

const event = ref<any>(null)
const tickets = ref<Ticket[]>([])
const stats = ref({
  total: 0,
  pending: 0,
  validated: 0,
  used: 0,
  rejected: 0
})
const isLoading = ref(true)
const error = ref('')
const emailSearch = ref('')
const statusFilter = ref('')
const showRejectModalFlag = ref(false)
const selectedTicket = ref<Ticket | null>(null)
const rejectionReason = ref('')
const qrError = ref(false)

// QR Scanner state
const showQrScanner = ref(false)
const scannedTicket = ref<any>(null)
const scannerError = ref('')
const availableCameras = ref<MediaDeviceInfo[]>([])
const selectedCamera = ref<string>('')

const totalTickets = computed(() => stats.value.total)

const cameraConstraints = computed(() => {
  if (selectedCamera.value) {
    return { 
      deviceId: { exact: selectedCamera.value } 
    }
  }
  return { 
    facingMode: 'environment' 
  }
})

const filteredTickets = computed(() => {
  let filtered = tickets.value

  // Filter by status
  if (statusFilter.value) {
    if (statusFilter.value === 'used') {
      filtered = filtered.filter(t => t.status === 'used')
    } else {
      filtered = filtered.filter(t => t.receipt_validation_status === statusFilter.value)
    }
  }

  return filtered
})

const getQrCodeUrl = (ticketId: number) => {
  return `${config.public.apiUrl}/qr-ticket/${ticketId}`
}

const getStatusBadgeClass = (ticket: Ticket) => {
  if (ticket.payment_method === 'free') {
    return 'bg-green-900 text-green-300 border border-green-700'
  }
  
  if (ticket.receipt_validation_status === 'pending') {
    return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
  }
  
  if (ticket.receipt_validation_status === 'rejected') {
    return 'bg-red-900 text-red-300 border border-red-700'
  }
  
  if (ticket.status === 'used') {
    return 'bg-gray-700 text-gray-300 border border-gray-600'
  }
  
  if (ticket.receipt_validation_status === 'validated') {
    return 'bg-green-900 text-green-300 border border-green-700'
  }
  
  return 'bg-gray-700 text-gray-300 border border-gray-600'
}

const getStatusLabel = (ticket: Ticket) => {
  if (ticket.payment_method === 'free') {
    return 'GRATIS'
  }
  
  if (ticket.receipt_validation_status === 'pending') {
    return 'PENDIENTE'
  }
  
  if (ticket.receipt_validation_status === 'rejected') {
    return 'RECHAZADO'
  }
  
  if (ticket.status === 'used') {
    return 'USADO'
  }
  
  if (ticket.receipt_validation_status === 'validated') {
    return 'VALIDADO'
  }
  
  return ticket.status.toUpperCase()
}

const searchByEmail = async () => {
  if (!emailSearch.value.trim()) return
  
  try {
    isLoading.value = true
    const searchResults = await useTickets().searchTicketsByEmail(eventId.value, emailSearch.value)
    
    if (searchResults && searchResults.length > 0) {
      tickets.value = searchResults
      updateStats()
    } else {
      // Show no results message
      tickets.value = []
    }
  } catch (err: any) {
    error.value = err.message || 'Error al buscar tickets'
  } finally {
    isLoading.value = false
  }
}

const validateReceipt = async (ticketId: number) => {
  try {
    await validateTicketReceipt(ticketId)
    
    // Update local state instead of reloading
    const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex].receipt_validation_status = 'validated'
      tickets.value[ticketIndex].receipt_validated_at = new Date().toISOString()
      tickets.value[ticketIndex].updated_at = new Date().toISOString()
      updateStats()
    }
  } catch (err: any) {
    error.value = err.message || 'Error al validar el recibo'
  }
}

const showRejectModal = (ticket: Ticket) => {
  selectedTicket.value = ticket
  rejectionReason.value = ''
  showRejectModalFlag.value = true
}

const cancelReject = () => {
  showRejectModalFlag.value = false
  selectedTicket.value = null
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!selectedTicket.value) return
  
  try {
    await rejectTicketReceipt(selectedTicket.value.id, rejectionReason.value)
    
    // Update local state instead of reloading
    const ticketIndex = tickets.value.findIndex(t => t.id === selectedTicket.value!.id)
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex].receipt_validation_status = 'rejected'
      tickets.value[ticketIndex].rejection_reason = rejectionReason.value
      tickets.value[ticketIndex].receipt_rejected_at = new Date().toISOString()
      tickets.value[ticketIndex].updated_at = new Date().toISOString()
      updateStats()
    }
    
    cancelReject()
  } catch (err: any) {
    error.value = err.message || 'Error al rechazar el recibo'
  }
}

const markAsUsed = async (ticketId: number) => {
  try {
    await markTicketAsUsed(ticketId)
    
    // Update local state instead of reloading
    const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex].status = 'used'
      tickets.value[ticketIndex].used_at = new Date().toISOString()
      tickets.value[ticketIndex].updated_at = new Date().toISOString()
      updateStats()
    }
  } catch (err: any) {
    error.value = err.message || 'Error al marcar como usado'
  }
}

const viewReceipt = (receiptUrl: string) => {
  window.open(receiptUrl, '_blank')
}

const loadTickets = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response: EventTicketsResponse = await getEventTickets(eventId.value)
    tickets.value = response.tickets
    event.value = response.event
    
    updateStats()
  } catch (err: any) {
    error.value = err.message || 'Error al cargar los tickets'
  } finally {
    isLoading.value = false
  }
}

const updateStats = () => {
  stats.value = {
    total: tickets.value.length,
    pending: tickets.value.filter(t => t.receipt_validation_status === 'pending').length,
    validated: tickets.value.filter(t => t.receipt_validation_status === 'validated').length,
    used: tickets.value.filter(t => t.status === 'used').length,
    rejected: tickets.value.filter(t => t.receipt_validation_status === 'rejected').length
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Fecha no disponible'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// QR Scanner methods - SIMPLIFIED
const openQrScanner = async () => {
  showQrScanner.value = true
  scannedTicket.value = null
  scannerError.value = ''
  availableCameras.value = []
  selectedCamera.value = ''
  
  // Simple: just enumerate devices after a brief delay for permissions
  setTimeout(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      availableCameras.value = devices.filter(device => device.kind === 'videoinput')
      console.log('Available cameras:', availableCameras.value.map(c => ({ label: c.label, id: c.deviceId.substring(0, 20) })))
    } catch (err) {
      console.error('Could not enumerate devices:', err)
    }
  }, 1000)
}

const closeQrScanner = () => {
  showQrScanner.value = false
  scannedTicket.value = null
  scannerError.value = ''
  availableCameras.value = []
  selectedCamera.value = ''
}

const switchCamera = () => {
  // Just update the selected camera - component will reinitialize with :key binding
  console.log('Switching to camera:', selectedCamera.value)
}

const onError = (error: Error) => {
  console.error('QR Scanner error:', error)
  scannerError.value = error.message || 'Error al inicializar la cámara'
}

const onDetect = async (detectedCodes: any[]) => {
  if (detectedCodes && detectedCodes.length > 0) {
    const result = detectedCodes[0].rawValue
    
    try {
      // Extract token and qr parameters from the scanned URL
      const url = new URL(result)
      const token = url.searchParams.get('token')
      const qr = url.searchParams.get('qr')
      
      if (!token || !qr) {
        scannerError.value = 'Código QR inválido'
        return
      }
      
      // Verify the ticket
      const verificationResult = await verifyTicket(token, qr)
      scannedTicket.value = verificationResult
      
      // Update local state instead of reloading all tickets
      updateLocalTicketState(verificationResult)
    } catch (err: any) {
      scannerError.value = err.message || 'Error al verificar el ticket'
    }
  }
}

const markScannedTicketAsUsed = async () => {
  if (!scannedTicket.value) return
  
  try {
    // Extract ticket ID from the scanned ticket data
    const ticketId = scannedTicket.value.ticket?.id || scannedTicket.value.ticket_id
    
    if (!ticketId) {
      error.value = 'No se pudo identificar el ticket'
      return
    }
    
    await markAsUsed(ticketId)
    
    // Update local state instead of reloading all tickets
    updateLocalTicketAfterMarkAsUsed(ticketId)
    
    // Update the scanned ticket data
    if (scannedTicket.value.ticket) {
      scannedTicket.value.ticket.status = 'used'
      scannedTicket.value.ticket.used_at = new Date().toISOString()
    }
    scannedTicket.value.can_be_used = false
  } catch (err: any) {
    error.value = err.message || 'Error al marcar como usado'
  }
}

const scanAnother = () => {
  scannedTicket.value = null
  scannerError.value = ''
}

// Helper functions for local state updates
const updateLocalTicketState = (verificationResult: any) => {
  if (!verificationResult?.ticket?.id) return
  
  const ticketId = verificationResult.ticket.id
  const existingTicketIndex = tickets.value.findIndex(t => t.id === ticketId)
  
  if (existingTicketIndex !== -1) {
    // Update existing ticket with latest data from verification
    tickets.value[existingTicketIndex] = {
      ...tickets.value[existingTicketIndex],
      ...verificationResult.ticket,
      user: verificationResult.holder ? {
        name: verificationResult.holder.name,
        email: verificationResult.holder.email
      } : tickets.value[existingTicketIndex].user
    }
  } else {
    // Add new ticket to the list if it doesn't exist
    const newTicket: Ticket = {
      id: verificationResult.ticket.id,
      ticket_number: verificationResult.ticket.ticket_number,
      status: verificationResult.ticket.status,
      price_paid: verificationResult.ticket.price_paid,
      purchased_at: verificationResult.ticket.purchased_at,
      used_at: verificationResult.ticket.used_at,
      receipt_validation_status: verificationResult.ticket.receipt_validation_status,
      payment_method: verificationResult.ticket.payment_method,
      formatted_price: verificationResult.ticket.formatted_price,
      user: verificationResult.holder ? {
        name: verificationResult.holder.name,
        email: verificationResult.holder.email
      } : null,
      // Add other required fields with defaults
      user_id: 0,
      event_id: eventId.value,
      price_tag_name: '',
      original_price: '0.00',
      cancelled_at: null,
      refunded_at: null,
      payment_reference: null,
      payment_status: 'completed',
      rejection_reason: null,
      receipt_validated_at: null,
      receipt_rejected_at: null,
      qr_code: '',
      validation_token: '',
      metadata: null,
      notes: null,
      purchased_by_ip: '',
      user_agent: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    tickets.value.push(newTicket)
  }
  
  // Update stats
  updateStats()
}

const updateLocalTicketAfterMarkAsUsed = (ticketId: number) => {
  const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
  if (ticketIndex !== -1) {
    tickets.value[ticketIndex].status = 'used'
    tickets.value[ticketIndex].used_at = new Date().toISOString()
    tickets.value[ticketIndex].updated_at = new Date().toISOString()
    
    // Update stats
    updateStats()
  }
}

// Load tickets on mount
onMounted(loadTickets)
</script>
