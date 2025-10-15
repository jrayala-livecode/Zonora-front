<template>
  <div v-if="isOpen && event" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-75">
    <div class="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
      <!-- Header -->
      <div class="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 z-10">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-white">Comprar Tickets</h2>
            <p class="text-gray-400 mt-1">{{ event?.name || event?.title }}</p>
          </div>
          <button 
            @click="close" 
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Event Summary -->
        <div class="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Fecha:</span>
              <p class="text-white font-semibold">{{ formatDate(event?.date) }}</p>
            </div>
            <div>
              <span class="text-gray-400">Lugar:</span>
              <p class="text-white font-semibold">{{ event?.venue?.name || 'Por definir' }}</p>
            </div>
          </div>
        </div>

        <!-- Step 1: Purchase Details -->
        <div v-if="currentStep === 1">
          <!-- Price Info -->
          <div class="space-y-2 mb-6">
            <label class="block text-white font-semibold">Precio</label>
            <div class="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">{{ activePrice?.name }}</span>
                <span class="text-2xl font-bold text-orange-400">
                  {{ isFree ? 'GRATIS' : formatPrice(activePrice?.price) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quantity Field (ALWAYS VISIBLE) -->
          <div class="space-y-2 mb-6">
            <label class="block text-white font-semibold">
              Cantidad de Tickets
              <span class="text-red-400">*</span>
            </label>
            <input
              v-model.number="quantity"
              type="number"
              :min="1"
              :max="isFree ? 1 : 10"
              :disabled="isFree"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p class="text-gray-400 text-sm">
              {{ isFree ? 'Eventos gratuitos: 1 ticket por persona' : 'Máximo 10 tickets por compra' }}
            </p>
          </div>

          <!-- Total (only for paid events) -->
          <div v-if="!isFree" class="bg-orange-900/20 border border-orange-800 rounded-lg p-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-white font-semibold text-lg">Total a Pagar:</span>
              <span class="text-3xl font-bold text-orange-400">
                {{ formatPrice(total) }}
              </span>
            </div>
          </div>

          <!-- Bank Transfer Info (only for paid events) -->
          <div v-if="!isFree" class="space-y-4 mb-6">
          <h3 class="text-xl font-bold text-white">Información de Transferencia</h3>
          
          <div class="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Titular:</span>
              <span class="text-white font-semibold">Nombre del Titular</span>
            </div>
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Banco:</span>
              <span class="text-white font-semibold">Banco de Chile</span>
            </div>
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">Número de Cuenta:</span>
              <span class="text-white font-mono">1234567890</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">RUT:</span>
              <span class="text-white font-mono">12.345.678-9</span>
            </div>
          </div>

          <div class="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
            <p class="text-yellow-300 text-sm">
              <strong>Importante:</strong> Realiza la transferencia y sube el comprobante para obtener tus tickets.
            </p>
          </div>

          <!-- Receipt Upload -->
          <div class="space-y-2">
            <label class="block text-white font-semibold">Comprobante de Transferencia</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*,.pdf"
              @change="handleFileSelect"
              class="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-500 file:text-white
                hover:file:bg-orange-600
                file:cursor-pointer cursor-pointer"
            />
            <p class="text-gray-400 text-sm">Formatos: JPG, PNG, PDF (máx. 5MB)</p>
            <p v-if="receiptFile" class="text-green-400 text-sm">✓ Archivo seleccionado: {{ receiptFile.name }}</p>
          </div>
        </div>

          <!-- Free Event Info -->
          <div v-if="isFree" class="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <p class="text-green-300">
              <strong>Evento Gratuito:</strong> Obtendrás 1 ticket gratis. El código QR estará disponible inmediatamente.
            </p>
          </div>
        </div>

        <!-- Step 2: Confirmation -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
            <h3 class="text-2xl font-bold text-white mb-4 text-center">Confirmar Compra</h3>
            <p class="text-gray-300 text-center mb-6">Por favor revisa los detalles antes de confirmar</p>
            
            <div class="space-y-4">
              <div class="flex justify-between border-b border-gray-700 pb-3">
                <span class="text-gray-400">Evento:</span>
                <span class="text-white font-semibold">{{ event?.name || event?.title }}</span>
              </div>
              
              <div class="flex justify-between border-b border-gray-700 pb-3">
                <span class="text-gray-400">Cantidad de Tickets:</span>
                <span class="text-white font-semibold">{{ quantity }} ticket{{ quantity !== 1 ? 's' : '' }}</span>
              </div>
              
              <div class="flex justify-between border-b border-gray-700 pb-3">
                <span class="text-gray-400">Precio por Ticket:</span>
                <span class="text-white font-semibold">{{ isFree ? 'GRATIS' : formatPrice(activePrice?.price) }}</span>
              </div>
              
              <div v-if="!isFree" class="flex justify-between border-b border-gray-700 pb-3">
                <span class="text-gray-400">Comprobante:</span>
                <span class="text-white font-semibold">{{ receiptFile?.name || 'No subido' }}</span>
              </div>
              
              <div class="flex justify-between pt-3">
                <span class="text-white font-bold text-xl">Total:</span>
                <span class="text-orange-400 font-bold text-2xl">
                  {{ isFree ? 'GRATIS' : formatPrice(total) }}
                </span>
              </div>
            </div>

            <div v-if="!isFree" class="mt-6 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p class="text-yellow-300 text-sm">
                <strong>Nota:</strong> Tu compra quedará pendiente de validación hasta que el organizador confirme tu comprobante de pago.
              </p>
              <p class="text-yellow-300 text-sm">
                No podrás enviar nuevas compras hasta que el organizador confirme tu comprobante de pago.
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p class="text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-900/20 border border-green-800 rounded-lg p-4">
          <p class="text-green-400">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 flex gap-4">
        <!-- Step 1 Buttons -->
        <template v-if="currentStep === 1">
          <button
            @click="close"
            class="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            :disabled="isLoading"
          >
            Cancelar
          </button>
          <button
            @click="goToConfirmation"
            class="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canProceedToConfirmation"
          >
            Continuar
          </button>
        </template>

        <!-- Step 2 Buttons -->
        <template v-if="currentStep === 2">
          <button
            @click="currentStep = 1"
            class="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            :disabled="isLoading"
          >
            Volver
          </button>
          <button
            @click="handlePurchase"
            class="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Procesando...' : 'Confirmar Compra' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  event: any
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const { purchaseTicket, isLoading } = useTickets()

const currentStep = ref(1)
const quantity = ref(1)
const receiptFile = ref<File | null>(null)
const errorMessage = ref('')
const successMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const activePrice = computed(() => {
  if (!props.event?.prices) return null
  return props.event.prices.find((p: any) => p.active === true)
})

const isFree = computed(() => {
  return activePrice.value?.price === 0 || activePrice.value?.price === '0'
})

const total = computed(() => {
  if (isFree.value) return 0
  return (activePrice.value?.price || 0) * quantity.value
})

const canProceedToConfirmation = computed(() => {
  // For free events, just need quantity
  if (isFree.value) {
    return quantity.value === 1
  }
  // For paid events, need quantity and receipt
  return quantity.value >= 1 && quantity.value <= 10 && receiptFile.value !== null
})

// Watch for free event changes to enforce quantity = 1
watch(isFree, (newIsFree) => {
  if (newIsFree) {
    quantity.value = 1
  }
})

const formatPrice = (price: number | undefined) => {
  if (!price) return '$0'
  return `$${price.toLocaleString('es-CL')}`
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Fecha no disponible'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'El archivo es demasiado grande. Máximo 5MB.'
      return
    }
    
    receiptFile.value = file
    errorMessage.value = ''
  }
}

const goToConfirmation = () => {
  errorMessage.value = ''
  
  // Validate before proceeding
  if (!canProceedToConfirmation.value) {
    if (isFree.value && quantity.value !== 1) {
      errorMessage.value = 'Los eventos gratuitos solo permiten 1 ticket por persona'
      return
    }
    if (!isFree.value && !receiptFile.value) {
      errorMessage.value = 'Debes subir un comprobante de transferencia'
      return
    }
    if (quantity.value < 1 || quantity.value > 10) {
      errorMessage.value = 'La cantidad debe estar entre 1 y 10'
      return
    }
    return
  }
  
  currentStep.value = 2
}

const handlePurchase = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    console.log('Modal - Event object:', props.event)
    console.log('Modal - Event ID:', props.event?.id)
    console.log('Modal - Quantity:', quantity.value)
    console.log('Modal - Is Free:', isFree.value)
    console.log('Modal - Receipt file:', receiptFile.value)

    if (!props.event?.id) {
      errorMessage.value = 'Evento no válido'
      console.error('Event ID is missing!')
      return
    }

    if (!isFree.value && !receiptFile.value) {
      errorMessage.value = 'Debes subir un comprobante de transferencia'
      return
    }

    const result = await purchaseTicket(
      Number(props.event.id),
      isFree.value ? 1 : quantity.value,
      receiptFile.value || undefined
    )

    successMessage.value = isFree.value 
      ? '¡Ticket gratuito obtenido! Redirigiendo a tus tickets...'
      : '¡Tickets comprados! Pendiente de validación del organizador.'

    setTimeout(() => {
      emit('success')
      close()
    }, 2000)

  } catch (err: any) {
    errorMessage.value = err.message || 'Error al comprar tickets'
  }
}

const close = () => {
  if (!isLoading.value) {
    emit('close')
    // Reset form
    currentStep.value = 1
    quantity.value = 1
    receiptFile.value = null
    errorMessage.value = ''
    successMessage.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

