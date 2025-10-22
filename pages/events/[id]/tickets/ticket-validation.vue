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

        <!-- Grouped Tickets List -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-700">
            <h2 class="text-xl font-semibold text-white">Tickets del Evento</h2>
          </div>

          <div v-if="filteredGroups.length === 0" class="p-8 text-center text-gray-400">
            <p>No hay tickets que coincidan con los filtros</p>
          </div>

          <div v-else class="divide-y divide-gray-700">
            <!-- Iterate over ticket groups -->
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              class="transition-all"
              :class="getGroupBorderClass(group)"
            >
              <!-- GROUP HEADER -->
              <div class="p-6 hover:bg-gray-750 transition-colors">
                <div class="flex items-start justify-between">
                  <!-- Left: Group Info -->
                  <div class="flex-1">
                    <!-- Group or Single Ticket Title -->
                    <div class="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 class="text-lg font-semibold text-white">
                <span v-if="group.isGroup">
                  🎫 Compra Grupal #{{ group.groupId?.substring(0, 8) }}
                </span>
                        <span v-else>
                          🎫 Ticket #{{ group.tickets[0].ticket_number }}
                        </span>
                      </h3>
                      
                      <!-- Badge: Group size -->
                      <span v-if="group.isGroup" class="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                        {{ group.tickets.length }} tickets
                      </span>
                      
                      <!-- Status Badge -->
                      <span :class="getGroupStatusBadge(group)" class="px-3 py-1 rounded text-sm font-medium">
                        {{ getGroupStatusLabel(group) }}
                      </span>
                    </div>

                    <!-- User Info -->
                    <div class="space-y-1 text-sm text-gray-400 mb-3">
                      <p>
                        <span class="text-gray-500">Usuario:</span>
                        <span class="text-gray-300">{{ group.tickets[0].user?.name }}</span>
                        ({{ group.tickets[0].user?.email }})
                      </p>
                      
                      <!-- Total or Price -->
                      <p v-if="group.isGroup">
                        <span class="text-gray-500">Total:</span>
                        <span class="text-white font-semibold">
                          ${{ formatPrice(group.totalAmount.toString()) }}
                        </span>
                        <span class="text-gray-400">
                          ({{ group.tickets.length }} × ${{ formatPrice(group.tickets[0].price_paid.toString()) }})
                        </span>
                      </p>
                      <p v-else>
                        <span class="text-gray-500">Precio:</span>
                        <span class="text-white font-semibold">${{ formatPrice(group.tickets[0].price_paid.toString()) }}</span>
                      </p>
                      
                      <p>
                        <span class="text-gray-500">Comprado:</span>
                        {{ formatDate(group.tickets[0].purchased_at) }}
                      </p>
                    </div>

                    <!-- Expandable section for grouped tickets -->
                    <div v-if="group.isGroup" class="mt-3">
                      <button
                        @click="toggleGroupExpanded(group.id)"
                        class="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-2"
                      >
                        <svg 
                          class="w-4 h-4 transform transition-transform" 
                          :class="{ 'rotate-180': expandedGroups[group.id] }"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>{{ expandedGroups[group.id] ? 'Ocultar' : 'Ver' }} tickets individuales</span>
                      </button>

                      <!-- Expanded individual tickets -->
                      <div v-if="expandedGroups[group.id]" class="mt-3 space-y-2 pl-6 border-l-2 border-gray-700">
                        <div
                          v-for="ticket in group.tickets"
                          :key="ticket.id"
                          class="p-3 bg-gray-750 rounded border border-gray-600 flex items-center justify-between"
                        >
                          <div class="flex items-center gap-3">
                            <!-- Mini QR Code -->
                            <div class="w-12 h-12 bg-white p-1 rounded">
                              <img 
                                :src="getQrCodeUrl(ticket.id)" 
                                alt="QR"
                                class="w-full h-full"
                              />
                            </div>
                            <div>
                              <p class="text-white font-medium">{{ ticket.ticket_number }}</p>
                              <p class="text-xs text-gray-400">{{ getStatusLabel(ticket) }}</p>
                            </div>
                          </div>
                          <div class="flex gap-2">
                            <!-- Mark as Used (only for validated) -->
                            <button
                              v-if="ticket.receipt_validation_status === 'validated' && ticket.status === 'active'"
                              @click="markAsUsed(ticket.id)"
                              class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                            >
                              Usar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Actions -->
                  <div class="flex flex-col gap-2 ml-4">
                    <!-- GROUP ACTIONS (for multi-ticket purchases) -->
                    <template v-if="group.isGroup && group.tickets[0].receipt_validation_status === 'pending'">
                      <button
                        @click="showGroupReceiptValidationModal(group)"
                        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Validación Pendiente ({{ group.tickets.length }} tickets)
                      </button>
                    </template>

                    <!-- SINGLE TICKET ACTIONS -->
                    <template v-if="!group.isGroup">
                      <!-- Single "Validación Pendiente" button for pending receipts -->
                      <button
                        v-if="group.tickets[0].receipt_validation_status === 'pending'"
                        @click="showReceiptValidationModal(group.tickets[0])"
                        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
                      >
                        Validación Pendiente
                      </button>
                      <button
                        v-if="group.tickets[0].receipt_validation_status === 'validated' && group.tickets[0].status === 'active'"
                        @click="markAsUsed(group.tickets[0].id)"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                      >
                        Marcar como Usado
                      </button>
                    </template>
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

    <!-- Reject Single Ticket Modal -->
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

    <!-- Reject Group Modal -->
    <div v-if="showRejectGroupModalFlag" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-white mb-4">Rechazar Grupo de Tickets</h3>
        
        <div class="mb-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded">
          <p class="text-yellow-200 text-sm">
            Se rechazarán {{ selectedGroup?.tickets.length }} tickets de esta compra grupal.
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">Motivo del Rechazo</label>
          <textarea
            v-model="rejectionReason"
            rows="3"
            placeholder="Explica por qué se rechaza este grupo..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelRejectGroup"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmRejectGroup"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Rechazar Todos
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Validation Modal -->
    <div v-if="showReceiptValidationModalFlag" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
      <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">Validación de Recibo</h3>
          <button
            @click="closeReceiptValidationModal"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Ticket Info -->
        <div class="mb-6 p-4 bg-gray-700 rounded-lg">
          <div class="flex items-center gap-4 mb-3">
            <!-- Mini QR Code -->
            <div class="w-16 h-16 bg-white p-1 rounded">
              <img 
                :src="getQrCodeUrl(selectedTicketForValidation?.id || 0)" 
                alt="QR"
                class="w-full h-full"
              />
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white">
                <span v-if="selectedGroupForValidation?.isGroup">
                  🎫 Compra Grupal #{{ selectedGroupForValidation?.groupId?.substring(0, 8) }}
                </span>
                <span v-else>
                  🎫 Ticket #{{ selectedTicketForValidation?.ticket_number }}
                </span>
              </h4>
              <p class="text-gray-300">{{ selectedTicketForValidation?.user?.name }}</p>
              <p class="text-gray-400 text-sm">{{ selectedTicketForValidation?.user?.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Precio:</span>
              <span class="text-white font-semibold ml-2">
                ${{ formatPrice(selectedTicketForValidation?.price_paid?.toString() || '0') }}
              </span>
            </div>
            <div>
              <span class="text-gray-400">Comprado:</span>
              <span class="text-white ml-2">{{ formatDate(selectedTicketForValidation?.purchased_at) }}</span>
            </div>
            <div v-if="selectedGroupForValidation?.isGroup" class="col-span-2">
              <span class="text-gray-400">Total:</span>
              <span class="text-white font-semibold ml-2">
                ${{ formatPrice(selectedGroupForValidation?.totalAmount?.toString() || '0') }}
              </span>
              <span class="text-gray-400 ml-2">
                ({{ selectedGroupForValidation?.tickets.length }} tickets)
              </span>
            </div>
          </div>
        </div>

        <!-- Receipt Image -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-3">Recibo de Pago</h4>
          <div class="relative">
            <img
              v-if="selectedTicketForValidation?.metadata?.receipt_url"
              :src="selectedTicketForValidation.metadata.receipt_url"
              alt="Recibo de pago"
              class="w-full max-h-96 object-contain bg-gray-700 rounded-lg border border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
              @click="viewReceipt(selectedTicketForValidation.metadata.receipt_url)"
              @error="handleImageError"
            />
            <div v-else class="w-full h-64 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center">
              <div class="text-center text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No hay imagen de recibo disponible</p>
              </div>
            </div>
            <div v-if="selectedTicketForValidation?.metadata?.receipt_url" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Click para abrir en nueva ventana
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4">
          <button
            @click="validateFromModal"
            class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            :disabled="isValidating"
          >
            <svg v-if="isValidating" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ isValidating ? 'Validando...' : 'Validar' }}
          </button>
          
          <button
            @click="showRejectFromModal"
            class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            :disabled="isValidating"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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

const { 
  getEventTickets, 
  validateReceipt: validateTicketReceipt, 
  rejectReceipt: rejectTicketReceipt, 
  validateReceiptGroup,
  rejectReceiptGroup,
  markTicketAsUsed, 
  verifyTicket 
} = useTickets()

// State
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
const showRejectGroupModalFlag = ref(false)
const showReceiptValidationModalFlag = ref(false)
const selectedTicket = ref<Ticket | null>(null)
const selectedGroup = ref<any | null>(null)
const selectedTicketForValidation = ref<Ticket | null>(null)
const selectedGroupForValidation = ref<any | null>(null)
const rejectionReason = ref('')
const qrError = ref(false)
const expandedGroups = ref<Record<string, boolean>>({})
const isValidating = ref(false)

// QR Scanner state
const showQrScanner = ref(false)
const scannedTicket = ref<any>(null)
const scannerError = ref('')
const availableCameras = ref<MediaDeviceInfo[]>([])
const selectedCamera = ref<string>('')

// Computed
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

// Group tickets by purchase_group_id
interface TicketGroup {
  id: string
  groupId: string | null
  isGroup: boolean
  tickets: Ticket[]
  totalAmount: number
  status: string
}

const groupedTickets = computed((): TicketGroup[] => {
  const groups: Record<string, Ticket[]> = {}
  const singles: Ticket[] = []

  // Separate tickets into groups and singles
  tickets.value.forEach(ticket => {
    if (ticket.purchase_group_id) {
      if (!groups[ticket.purchase_group_id]) {
        groups[ticket.purchase_group_id] = []
      }
      groups[ticket.purchase_group_id].push(ticket)
    } else {
      singles.push(ticket)
    }
  })

  const result: TicketGroup[] = []

  // Add grouped tickets
  Object.entries(groups).forEach(([groupId, groupTickets]) => {
    const totalAmount = groupTickets.reduce((sum, t) => sum + t.price_paid, 0)
    
    // Determine group status (all tickets should have same status in a group)
    const statuses = groupTickets.map(t => t.receipt_validation_status || t.status)
    const uniqueStatuses = [...new Set(statuses)]
    const groupStatus = uniqueStatuses.length === 1 ? uniqueStatuses[0] : 'mixed'

    result.push({
      id: groupId,
      groupId: groupId,
      isGroup: true,
      tickets: groupTickets.sort((a, b) => a.id - b.id),
      totalAmount,
      status: groupStatus
    })
  })

  // Add single tickets
  singles.forEach(ticket => {
    result.push({
      id: `single-${ticket.id}`,
      groupId: null,
      isGroup: false,
      tickets: [ticket],
      totalAmount: ticket.price_paid,
      status: ticket.receipt_validation_status || ticket.status
    })
  })

  // Sort by purchased_at date (newest first)
  return result.sort((a, b) => {
    const dateA = new Date(a.tickets[0].purchased_at).getTime()
    const dateB = new Date(b.tickets[0].purchased_at).getTime()
    return dateB - dateA
  })
})

const filteredGroups = computed(() => {
  if (!statusFilter.value) {
    return groupedTickets.value
  }

  return groupedTickets.value.filter(group => {
    if (statusFilter.value === 'used') {
      return group.tickets.some(t => t.status === 'used')
    } else {
      return group.tickets.some(t => t.receipt_validation_status === statusFilter.value)
    }
  })
})

// Methods
const getQrCodeUrl = (ticketId: number) => {
  return `${config.public.apiUrl}/qr-ticket/${ticketId}`
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice)
}

const getGroupBorderClass = (group: TicketGroup): string => {
  const status = group.status
  if (status === 'pending') return 'border-l-4 border-l-yellow-500'
  if (status === 'validated') return 'border-l-4 border-l-green-500'
  if (status === 'rejected') return 'border-l-4 border-l-red-500'
  return ''
}

const getGroupStatusBadge = (group: TicketGroup): string => {
  const status = group.status
  
  if (group.tickets[0].payment_method === 'free') {
    return 'bg-green-900 text-green-300 border border-green-700'
  }
  
  if (status === 'pending') {
    return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
  }
  
  if (status === 'rejected') {
    return 'bg-red-900 text-red-300 border border-red-700'
  }
  
  if (status === 'used' || group.tickets.some(t => t.status === 'used')) {
    return 'bg-blue-900 text-blue-300 border border-blue-700'
  }
  
  if (status === 'validated') {
    return 'bg-green-900 text-green-300 border border-green-700'
  }
  
  return 'bg-gray-700 text-gray-300 border border-gray-600'
}

const getGroupStatusLabel = (group: TicketGroup): string => {
  if (group.tickets[0].payment_method === 'free') {
    return 'GRATIS'
  }
  
  // Check for used tickets FIRST (before other statuses)
  const usedCount = group.tickets.filter(t => t.status === 'used').length
  if (usedCount > 0) {
    if (usedCount === group.tickets.length) {
      // If all tickets are used, check if it's a single ticket or multiple
      return group.tickets.length === 1 ? 'USADO' : 'TODOS USADOS'
    }
    return `${usedCount}/${group.tickets.length} USADOS`
  }
  
  const status = group.status
  
  if (status === 'pending') return 'PENDIENTE'
  if (status === 'rejected') return 'RECHAZADO'
  if (status === 'validated') return 'VALIDADO'
  if (status === 'mixed') return 'MIXTO'
  
  return status.toUpperCase()
}

const getStatusBadgeClass = (ticket: Ticket) => {
  if (ticket.payment_method === 'free') {
    return 'bg-green-900 text-green-300 border border-green-700'
  }
  
  // Check for used status FIRST (before validation status)
  if (ticket.status === 'used') {
    return 'bg-blue-900 text-blue-300 border border-blue-700'
  }
  
  if (ticket.receipt_validation_status === 'pending') {
    return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
  }
  
  if (ticket.receipt_validation_status === 'rejected') {
    return 'bg-red-900 text-red-300 border border-red-700'
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

const toggleGroupExpanded = (groupId: string) => {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId]
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
      tickets.value = []
    }
  } catch (err: any) {
    error.value = err.message || 'Error al buscar tickets'
  } finally {
    isLoading.value = false
  }
}

// Single ticket validation
const validateReceipt = async (ticketId: number) => {
  try {
    await validateTicketReceipt(ticketId)
    
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

// Group validation
const validateGroup = async (groupId: string) => {
  try {
    isLoading.value = true
    const result = await validateReceiptGroup(groupId)
    
    // Update local state for all tickets in the group
    tickets.value.forEach(ticket => {
      if (ticket.purchase_group_id === groupId) {
        ticket.receipt_validation_status = 'validated'
        ticket.receipt_validated_at = new Date().toISOString()
        ticket.updated_at = new Date().toISOString()
      }
    })
    
    updateStats()
  } catch (err: any) {
    error.value = err.message || 'Error al validar el grupo'
  } finally {
    isLoading.value = false
  }
}

const showRejectModal = (ticket: Ticket) => {
  selectedTicket.value = ticket
  rejectionReason.value = ''
  showRejectModalFlag.value = true
}

const showRejectGroupModal = (group: TicketGroup) => {
  selectedGroup.value = group
  rejectionReason.value = ''
  showRejectGroupModalFlag.value = true
}

const cancelReject = () => {
  showRejectModalFlag.value = false
  selectedTicket.value = null
  rejectionReason.value = ''
}

const cancelRejectGroup = () => {
  showRejectGroupModalFlag.value = false
  selectedGroup.value = null
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!selectedTicket.value) return
  
  try {
    await rejectTicketReceipt(selectedTicket.value.id, rejectionReason.value)
    
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

const confirmRejectGroup = async () => {
  if (!selectedGroup.value) return
  
  try {
    isLoading.value = true
    await rejectReceiptGroup(selectedGroup.value.groupId, rejectionReason.value)
    
    // Update local state for all tickets in the group
    tickets.value.forEach(ticket => {
      if (ticket.purchase_group_id === selectedGroup.value.groupId) {
        ticket.receipt_validation_status = 'rejected'
        ticket.rejection_reason = rejectionReason.value
        ticket.receipt_rejected_at = new Date().toISOString()
        ticket.updated_at = new Date().toISOString()
      }
    })
    
    updateStats()
    cancelRejectGroup()
  } catch (err: any) {
    error.value = err.message || 'Error al rechazar el grupo'
  } finally {
    isLoading.value = false
  }
}

const markAsUsed = async (ticketId: number) => {
  try {
    await markTicketAsUsed(ticketId)
    
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

// New methods for receipt validation modal
const showReceiptValidationModal = (ticket: Ticket) => {
  selectedTicketForValidation.value = ticket
  selectedGroupForValidation.value = null
  showReceiptValidationModalFlag.value = true
}

const showGroupReceiptValidationModal = (group: TicketGroup) => {
  selectedGroupForValidation.value = group
  selectedTicketForValidation.value = group.tickets[0]
  showReceiptValidationModalFlag.value = true
}

const closeReceiptValidationModal = () => {
  showReceiptValidationModalFlag.value = false
  selectedTicketForValidation.value = null
  selectedGroupForValidation.value = null
  isValidating.value = false
}

const validateFromModal = async () => {
  if (!selectedTicketForValidation.value) return
  
  try {
    isValidating.value = true
    
    if (selectedGroupForValidation.value?.isGroup) {
      // Validate entire group
      await validateGroup(selectedGroupForValidation.value.groupId)
    } else {
      // Validate single ticket
      await validateReceipt(selectedTicketForValidation.value.id)
    }
    
    closeReceiptValidationModal()
  } catch (err: any) {
    error.value = err.message || 'Error al validar el recibo'
  } finally {
    isValidating.value = false
  }
}

const showRejectFromModal = () => {
  if (selectedGroupForValidation.value?.isGroup) {
    showRejectGroupModal(selectedGroupForValidation.value)
  } else if (selectedTicketForValidation.value) {
    showRejectModal(selectedTicketForValidation.value)
  }
  closeReceiptValidationModal()
}

const handleImageError = () => {
  console.error('Error loading receipt image')
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

// QR Scanner methods
const openQrScanner = async () => {
  showQrScanner.value = true
  scannedTicket.value = null
  scannerError.value = ''
  availableCameras.value = []
  selectedCamera.value = ''
  
  setTimeout(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      availableCameras.value = devices.filter(device => device.kind === 'videoinput')
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
      const url = new URL(result)
      const token = url.searchParams.get('token')
      const qr = url.searchParams.get('qr')
      
      if (!token || !qr) {
        scannerError.value = 'Código QR inválido'
        return
      }
      
      const verificationResult = await verifyTicket(token, qr)
      scannedTicket.value = verificationResult
      
      updateLocalTicketState(verificationResult)
    } catch (err: any) {
      scannerError.value = err.message || 'Error al verificar el ticket'
    }
  }
}

const markScannedTicketAsUsed = async () => {
  if (!scannedTicket.value) return
  
  try {
    const ticketId = scannedTicket.value.ticket?.id || scannedTicket.value.ticket_id
    
    if (!ticketId) {
      error.value = 'No se pudo identificar el ticket'
      return
    }
    
    await markAsUsed(ticketId)
    
    updateLocalTicketAfterMarkAsUsed(ticketId)
    
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

const updateLocalTicketState = (verificationResult: any) => {
  if (!verificationResult?.ticket?.id) return
  
  const ticketId = verificationResult.ticket.id
  const existingTicketIndex = tickets.value.findIndex(t => t.id === ticketId)
  
  if (existingTicketIndex !== -1) {
    tickets.value[existingTicketIndex] = {
      ...tickets.value[existingTicketIndex],
      ...verificationResult.ticket,
      user: verificationResult.holder ? {
        name: verificationResult.holder.name,
        email: verificationResult.holder.email
      } : tickets.value[existingTicketIndex].user
    }
  }
  
  updateStats()
}

const updateLocalTicketAfterMarkAsUsed = (ticketId: number) => {
  const ticketIndex = tickets.value.findIndex(t => t.id === ticketId)
  if (ticketIndex !== -1) {
    tickets.value[ticketIndex].status = 'used'
    tickets.value[ticketIndex].used_at = new Date().toISOString()
    tickets.value[ticketIndex].updated_at = new Date().toISOString()
    
    updateStats()
  }
}

// Load tickets on mount
onMounted(loadTickets)
</script>
