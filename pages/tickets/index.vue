<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Mis Tickets</h1>
        <p class="text-gray-400">Administra todos tus tickets de eventos</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && tickets.length === 0" class="flex justify-center items-center py-20">
        <div class="text-orange-400 text-xl animate-pulse">Cargando tickets...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-800 rounded-lg p-6 mb-6">
        <p class="text-red-400">{{ error }}</p>
        <button 
          @click="loadTickets" 
          class="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0" class="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">No tienes tickets</h3>
        <p class="text-gray-400 mb-6">Compra tickets para eventos y aparecerán aquí</p>
        <NuxtLink 
          to="/events" 
          class="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Explorar Eventos
        </NuxtLink>
      </div>

      <!-- Tickets List -->
      <div v-else class="space-y-4">
        <!-- Filter Tabs -->
        <div class="flex gap-4 mb-6 overflow-x-auto">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            @click="selectedFilter = tab.value"
            :class="[
              'px-4 py-2 rounded-lg whitespace-nowrap transition-colors',
              selectedFilter === tab.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ tab.label }} ({{ getFilteredCount(tab.value) }})
          </button>
        </div>

        <!-- Ticket Cards -->
        <div 
          v-for="ticket in filteredTickets" 
          :key="ticket.id"
          class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:border-orange-500 transition-colors"
        >
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <!-- Ticket Info -->
              <div class="flex-1">
                <div class="flex items-start gap-4">
                  <!-- Status Badge -->
                  <div 
                    :class="getStatusBadgeClass(ticket)"
                    class="px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap"
                  >
                    {{ getStatusLabel(ticket) }}
                  </div>

                  <!-- Details -->
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-white mb-1">
                      {{ ticket.event?.name || 'Evento' }}
                    </h3>
                    <p class="text-gray-400 text-sm mb-2">
                      Ticket #{{ ticket.ticket_number }}
                    </p>
                    
                    <div class="flex flex-wrap gap-4 text-sm">
                      <div class="text-gray-300">
                        <span class="text-gray-500">Fecha:</span>
                        {{ formatDate(ticket.event?.date) }}
                      </div>
                      <div class="text-gray-300">
                        <span class="text-gray-500">Lugar:</span>
                        {{ ticket.event?.venue?.name || 'Por definir' }}
                      </div>
                      <div class="text-gray-300">
                        <span class="text-gray-500">Precio:</span>
                        {{ ticket.formatted_price }}
                      </div>
                    </div>

                    <!-- Rejection Reason -->
                    <div v-if="ticket.receipt_validation_status === 'rejected' && ticket.rejection_reason" 
                         class="mt-3 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                      <p class="text-red-400 text-sm">
                        <strong>Motivo de rechazo:</strong> {{ ticket.rejection_reason }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2 sm:flex-row">
                <!-- View QR Code (only for validated active/used tickets) -->
                <NuxtLink
                  v-if="ticket.receipt_validation_status === 'validated' && ['active', 'used'].includes(ticket.status)"
                  :to="`/tickets/${ticket.id}`"
                  class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-center transition-colors whitespace-nowrap"
                >
                  Ver QR
                </NuxtLink>

                <!-- View Details -->
                <NuxtLink
                  :to="`/tickets/${ticket.id}`"
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center transition-colors whitespace-nowrap"
                >
                  Detalles
                </NuxtLink>
              </div>
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

const { myTickets: tickets, isLoading, error, fetchMyTickets } = useTickets()

const selectedFilter = ref('all')

const filterTabs = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'active' },
  { label: 'Usados', value: 'used' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Rechazados', value: 'rejected' }
]

const filteredTickets = computed(() => {
  if (selectedFilter.value === 'all') return tickets.value

  return tickets.value.filter(ticket => {
    switch (selectedFilter.value) {
      case 'active':
        return ticket.status === 'active' && ticket.receipt_validation_status === 'validated'
      case 'used':
        return ticket.status === 'used'
      case 'pending':
        return ticket.receipt_validation_status === 'pending'
      case 'rejected':
        return ticket.receipt_validation_status === 'rejected'
      default:
        return true
    }
  })
})

const getFilteredCount = (filter: string) => {
  if (filter === 'all') return tickets.value.length
  
  return tickets.value.filter(ticket => {
    switch (filter) {
      case 'active':
        return ticket.status === 'active' && ticket.receipt_validation_status === 'validated'
      case 'used':
        return ticket.status === 'used'
      case 'pending':
        return ticket.receipt_validation_status === 'pending'
      case 'rejected':
        return ticket.receipt_validation_status === 'rejected'
      default:
        return true
    }
  }).length
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

const loadTickets = async () => {
  try {
    await fetchMyTickets()
  } catch (err) {
    console.error('Error loading tickets:', err)
  }
}

// Load tickets on mount
onMounted(() => {
  loadTickets()
})
</script>

