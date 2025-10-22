<template>
  <div class="space-y-6">
    <!-- No Profile - Show Profile Creation (Anyone can create) -->
    <div v-if="!venueAdmin" class="space-y-6">
      <Building class="w-16 h-16 text-orange-400 mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-white mb-2">Administrador de Venue</h3>
      <p class="text-gray-400 mb-6 max-w-xl mx-auto">
        Reclama y gestiona venues reales. Actualiza información, imágenes y detalles de tu lugar.
      </p>
      
      <div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6 max-w-xl mx-auto mb-6">
        <h4 class="text-orange-400 font-semibold mb-3">Suscríbete ahora para estas funcionalidades:</h4>
        <ul class="text-gray-300 text-left space-y-2">
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Reclama venues existentes subiendo documentos de propiedad</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Edita nombre, descripción, imágenes y enlaces</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Gestiona la información de tu venue</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Perfil verificado con revisión administrativa</span>
          </li>
        </ul>
      </div>

      <button
        @click="goToSubscription"
        class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
      >
        <Sparkles class="w-5 h-5 mr-2" />
        Suscribirse Ahora
      </button>
    </div>

    <!-- No Profile - Show Creation Form -->
    <div v-else-if="!venueAdmin" class="space-y-6">
      <div class="text-center mb-6">
        <Building class="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-white mb-2">Crear Perfil de Administrador de Venue</h3>
        <p class="text-gray-400">Crea tu perfil para comenzar a gestionar venues</p>
      </div>

      <form @submit.prevent="handleCreateProfile" class="space-y-4">
        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Nombre Administrativo <span class="text-red-400">*</span>
          </label>
          <input
            v-model="profileForm.admin_name"
            type="text"
            required
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ej: Juan Pérez - Administrador"
          />
        </div>

        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Email de Contacto <span class="text-red-400">*</span>
          </label>
          <input
            v-model="profileForm.contact_email"
            type="email"
            required
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="contacto@venue.com"
          />
        </div>

        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Teléfono
          </label>
          <input
            v-model="profileForm.phone"
            type="tel"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="+56 9 1234 5678"
          />
        </div>

        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Biografía
          </label>
          <textarea
            v-model="profileForm.bio"
            rows="3"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Cuéntanos sobre tu experiencia..."
          ></textarea>
        </div>

        <div v-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="!isSubmitting">Crear Perfil</span>
          <span v-else class="flex items-center">
            <Loader class="w-5 h-5 mr-2 animate-spin" />
            Creando...
          </span>
        </button>
      </form>
    </div>

    <!-- Not Subscribed to Venue Admin - Show Paywall -->
    <div v-else-if="!venueAdmin.has_active_subscription" class="text-center py-12">
      <Building class="w-16 h-16 text-orange-400 mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-white mb-2">Suscripción de Venue Admin Requerida</h3>
      <p class="text-gray-400 mb-6 max-w-xl mx-auto">
        Activa tu suscripción de Venue Admin para acceder a todas las funcionalidades.
      </p>
      
      <div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6 max-w-xl mx-auto mb-6">
        <h4 class="text-orange-400 font-semibold mb-3">Con la suscripción de Venue Admin:</h4>
        <ul class="text-gray-300 text-left space-y-2">
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Reclama venues existentes subiendo documentos de propiedad</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Edita nombre, descripción, imágenes y enlaces</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Gestiona la información de tu venue</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Perfil verificado con revisión administrativa</span>
          </li>
        </ul>
      </div>

      <button
        @click="subscribeToVenueAdmin"
        :disabled="isSubscribing"
        class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
      >
        <Sparkles class="w-5 h-5 mr-2" />
        <span v-if="!isSubscribing">Suscribirse a Venue Admin</span>
        <span v-else>Suscribiendo...</span>
      </button>
    </div>

    <!-- Not Verified - Show Verification Required -->
    <div v-else-if="!user?.is_verified" class="text-center py-12">
      <ShieldAlert class="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-white mb-2">Verificación de Identidad Requerida</h3>
      <p class="text-gray-400 mb-6 max-w-xl mx-auto">
        Para reclamar venues, necesitas verificar tu identidad subiendo tu RUT y fotografías de tu cédula.
      </p>
      
      <NuxtLink
        to="/venue-admin/verify"
        class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
      >
        <ShieldCheck class="w-5 h-5 mr-2" />
        Verificar Identidad
      </NuxtLink>
    </div>

    <!-- Dashboard - Profile Active -->
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">{{ venueAdmin.admin_name }}</h3>
            <p class="text-gray-400">{{ venueAdmin.contact_email }}</p>
            <p v-if="venueAdmin.phone" class="text-gray-400">{{ venueAdmin.phone }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              venueAdmin.has_active_subscription
                ? 'bg-green-900 text-green-300 border border-green-700'
                : 'bg-red-900 text-red-300 border border-red-700'
            ]"
          >
            {{ venueAdmin.has_active_subscription ? 'Suscripción Activa' : 'Suscripción Expirada' }}
          </span>
        </div>
        
        <p v-if="venueAdmin.bio" class="text-gray-300">{{ venueAdmin.bio }}</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p class="text-gray-400 text-sm mb-1">Venues Asignados</p>
          <p class="text-2xl font-bold text-white">{{ venueAdmin.venue_count }}</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p class="text-gray-400 text-sm mb-1">Límite de Venues</p>
          <p class="text-2xl font-bold text-white">1</p>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p class="text-gray-400 text-sm mb-1">Slots Disponibles</p>
          <p class="text-2xl font-bold text-orange-400">
            {{ venueAdmin.can_assign_venue ? '1' : '0' }}
          </p>
        </div>
      </div>

      <!-- Claimed Venue -->
      <div v-if="venueAdmin.venues && venueAdmin.venues.length > 0" class="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h4 class="text-xl font-semibold text-white mb-4">Tu Venue</h4>
        <div
          v-for="venue in venueAdmin.venues"
          :key="venue.id"
          class="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-lg p-4"
        >
          <div>
            <h5 class="text-lg font-semibold text-white">{{ venue.name }}</h5>
            <p class="text-gray-400 text-sm">{{ venue.address }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <NuxtLink
              :to="`/venues/${venue.id}`"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Ver
            </NuxtLink>
            <NuxtLink
              :to="`/venues/${venue.id}/edit`"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              Editar
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          to="/venue-admin/claims"
          class="bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-lg p-6 transition-colors group"
        >
          <FileText class="w-8 h-8 text-orange-400 mb-2" />
          <h4 class="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
            Mis Reclamos
          </h4>
          <p class="text-gray-400 text-sm">Ver estado de reclamos</p>
        </NuxtLink>

        <NuxtLink
          to="/venues"
          class="bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-lg p-6 transition-colors group"
        >
          <Building class="w-8 h-8 text-orange-400 mb-2" />
          <h4 class="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
            Explorar Venues
          </h4>
          <p class="text-gray-400 text-sm">Buscar venues para reclamar</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Building, CheckCircle, Sparkles, Loader, ShieldAlert, ShieldCheck, FileText } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'success', message: string): void
  (e: 'error', message: string): void
}>()

const { user, fetchUser } = useAuth()

// Use venue admin data directly from user object (loaded by /api/me)
const venueAdmin = computed(() => (user.value as any)?.venueAdmin || null)
const isSubmitting = ref(false)
const isSubscribing = ref(false)
const error = ref<string | null>(null)

const profileForm = ref({
  admin_name: '',
  contact_email: user.value?.email || '',
  phone: '',
  bio: ''
})

const subscribeToVenueAdmin = async () => {
  isSubscribing.value = true
  
  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest('/venue-admin/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ months: 1 }) // Subscribe for 1 month
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al suscribirse')
    }

    // Refresh user data to get updated subscription
    await fetchUser()
    
    emit('success', 'Suscripción de Venue Admin activada exitosamente')
  } catch (err: any) {
    emit('error', err.message || 'Error al suscribirse a Venue Admin')
  } finally {
    isSubscribing.value = false
  }
}

const handleCreateProfile = async () => {
  error.value = null
  isSubmitting.value = true

  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest('/venue-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileForm.value)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al crear perfil')
    }

      // Refresh user data to get new profile
      await fetchUser()
      
      emit('success', 'Perfil de administrador de venue creado exitosamente')
  } catch (err: any) {
    error.value = err.message
    emit('error', err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

