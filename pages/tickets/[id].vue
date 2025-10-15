<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <button 
        @click="router.back()" 
        class="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Mis Tickets
      </button>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="text-orange-400 text-xl animate-pulse">Cargando ticket...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !ticket" class="bg-red-900/20 border border-red-800 rounded-lg p-6">
        <p class="text-red-400">{{ error || 'Ticket no encontrado' }}</p>
      </div>

      <!-- Ticket Details -->
      <div v-else class="space-y-6">
        <!-- Status Card -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">{{ ticket.event?.name }}</h1>
              <p class="text-gray-400">Ticket #{{ ticket.ticket_number }}</p>
            </div>
            <div 
              :class="getStatusBadgeClass(ticket)"
              class="px-4 py-2 rounded-lg text-lg font-semibold"
            >
              {{ getStatusLabel(ticket) }}
            </div>
          </div>
        </div>

        <!-- QR Code Card (always shown for active tickets) -->
        <div 
          v-if="['active', 'used'].includes(ticket.status)"
          class="bg-gray-800 border border-gray-700 rounded-lg p-8"
        >
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Código QR</h2>
          
          <div class="flex flex-col items-center">
            <!-- QR Code Image -->
            <div class="bg-white p-4 rounded-lg mb-6">
              <img 
                :src="qrCodeUrl" 
                alt="QR Code"
                class="w-64 h-64"
                @error="qrError = true"
              />
            </div>

            <p v-if="qrError" class="text-red-400 mb-4">Error al cargar el código QR</p>
            
            <p class="text-gray-400 text-center mb-4">
              Muestra este código QR al organizador en la entrada del evento para una verificación rápida
            </p>

            <!-- Download Button -->
            <a 
              :href="qrCodeUrl" 
              :download="`ticket-${ticket.ticket_number}.svg`"
              class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Descargar QR
            </a>
          </div>
        </div>

        <!-- Pending Validation Message -->
        <div v-if="ticket.receipt_validation_status === 'pending'" class="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-yellow-300 mb-2">Pendiente de Validación</h3>
          <p class="text-gray-300">
            Tu recibo está siendo revisado por el organizador. Puedes usar tu código QR para el acceso, pero el organizador validará tu comprobante en la entrada.
          </p>
        </div>

        <!-- Rejected Message -->
        <div v-else-if="ticket.receipt_validation_status === 'rejected'" class="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-red-300 mb-2">Recibo Rechazado</h3>
          <p class="text-gray-300 mb-2">
            Tu recibo fue rechazado por el organizador.
          </p>
          <p v-if="ticket.rejection_reason" class="text-red-400">
            <strong>Motivo:</strong> {{ ticket.rejection_reason }}
          </p>
          <p class="text-gray-400 mt-4">
            Puedes intentar comprar nuevamente con un comprobante válido.
          </p>
        </div>

        <!-- Event Details Card -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 class="text-2xl font-bold text-white mb-4">Detalles del Evento</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Evento:</span>
              <span class="text-white font-semibold">{{ ticket.event?.name }}</span>
            </div>
            
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Fecha:</span>
              <span class="text-white">{{ formatDate(ticket.event?.date) }}</span>
            </div>
            
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Lugar:</span>
              <span class="text-white">{{ ticket.event?.venue?.name || 'Por definir' }}</span>
            </div>
            
            <div v-if="ticket.event?.venue?.address" class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Dirección:</span>
              <span class="text-white">{{ ticket.event.venue.address }}</span>
            </div>
          </div>
        </div>

        <!-- Ticket Details Card -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 class="text-2xl font-bold text-white mb-4">Detalles del Ticket</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Número de Ticket:</span>
              <span class="text-white font-mono">{{ ticket.ticket_number }}</span>
            </div>
            
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Tipo:</span>
              <span class="text-white">{{ ticket.price_tag_name }}</span>
            </div>
            
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Precio:</span>
              <span class="text-white font-semibold">{{ ticket.formatted_price }}</span>
            </div>
            
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Método de Pago:</span>
              <span class="text-white">{{ getPaymentMethodLabel(ticket.payment_method) }}</span>
            </div>
            
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Fecha de Compra:</span>
              <span class="text-white">{{ formatDate(ticket.purchased_at) }}</span>
            </div>
            
            <div v-if="ticket.used_at" class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Fecha de Uso:</span>
              <span class="text-white">{{ formatDate(ticket.used_at) }}</span>
            </div>

            <!-- Receipt Image (if available) -->
            <div v-if="ticket.metadata?.receipt_url" class="pt-4">
              <p class="text-gray-400 mb-2">Comprobante de Pago:</p>
              <a 
                :href="ticket.metadata.receipt_url" 
                target="_blank"
                class="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Ver Comprobante
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from '~/composables/types/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const ticketId = computed(() => parseInt(route.params.id as string))

const { getTicket, isLoading, error } = useTickets()

const ticket = ref<Ticket | null>(null)
const qrError = ref(false)

const qrCodeUrl = computed(() => {
  if (!ticket.value) return ''
  return `${config.public.apiUrl}/qr-ticket/${ticket.value.id}`
})

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
  
  if (ticket.status === 'active') {
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
  
  if (ticket.status === 'active') {
    return 'ACTIVO'
  }
  
  return ticket.status.toUpperCase()
}

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    'free': 'Gratis',
    'bank_transfer': 'Transferencia Bancaria',
    'in_app': 'Pago en Línea'
  }
  return labels[method] || method
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

// Load ticket on mount
onMounted(async () => {
  try {
    ticket.value = await getTicket(ticketId.value)
  } catch (err) {
    console.error('Error loading ticket:', err)
  }
})
</script>

