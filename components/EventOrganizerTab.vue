<template>
  <div class="space-y-6">
    <!-- No Profile - Show Creation Form -->
    <div v-if="!eventOrganizer" class="space-y-6">
      <div class="text-center mb-6">
        <Calendar class="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-white mb-2">Crear Perfil de Organizador de Eventos</h3>
        <p class="text-gray-400">Crea tu perfil para comenzar a organizar eventos</p>
      </div>

      <form @submit.prevent="handleCreateProfile" class="space-y-4">
        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Nombre del Organizador <span class="text-red-400">*</span>
          </label>
          <input
            v-model="profileForm.organizer_name"
            type="text"
            required
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Producciones Musicales XYZ"
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
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="contacto@organizador.com"
          />
        </div>

        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Teléfono
          </label>
          <input
            v-model="profileForm.phone"
            type="tel"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cuéntanos sobre tu experiencia organizando eventos..."
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            v-model="profileForm.is_public"
            type="checkbox"
            id="is_public"
            class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <label for="is_public" class="ml-2 text-gray-300">
            Hacer mi perfil público (visible para todos)
          </label>
        </div>

        <div v-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="!isSubmitting">Crear Perfil</span>
          <span v-else class="flex items-center">
            <Loader class="w-5 h-5 mr-2 animate-spin" />
            Creando...
          </span>
        </button>
      </form>
    </div>

    <!-- Not Subscribed to Event Organizer - Show Paywall -->
    <div v-else-if="!eventOrganizer.has_active_subscription" class="text-center py-12">
      <Calendar class="w-16 h-16 text-blue-400 mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-white mb-2">Suscripción de Organizador Requerida</h3>
      <p class="text-gray-400 mb-6 max-w-xl mx-auto">
        Activa tu suscripción de Organizador de Eventos para crear y gestionar eventos.
      </p>
      
      <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 max-w-xl mx-auto mb-6">
        <h4 class="text-blue-400 font-semibold mb-3">Con la suscripción de Organizador:</h4>
        <ul class="text-gray-300 text-left space-y-2">
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Crea eventos ilimitados con todos los detalles</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Invita artistas y colaboradores</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Vende entradas y gestiona asistentes</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Perfil público de organizador verificado</span>
          </li>
        </ul>
      </div>

      <button
        @click="subscribeToEventOrganizer"
        :disabled="isSubscribing"
        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
      >
        <Sparkles class="w-5 h-5 mr-2" />
        <span v-if="!isSubscribing">Suscribirse a Organizador</span>
        <span v-else>Suscribiendo...</span>
      </button>
    </div>

    <!-- Dashboard - Profile Active -->
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">{{ eventOrganizer.organizer_name }}</h3>
            <p class="text-gray-400">{{ eventOrganizer.contact_email }}</p>
            <p v-if="eventOrganizer.phone" class="text-gray-400">{{ eventOrganizer.phone }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              eventOrganizer.has_active_subscription
                ? 'bg-green-900 text-green-300 border border-green-700'
                : 'bg-red-900 text-red-300 border border-red-700'
            ]"
          >
            {{ eventOrganizer.has_active_subscription ? 'Suscripción Activa' : 'Suscripción Expirada' }}
          </span>
        </div>
        
        <p v-if="eventOrganizer.bio" class="text-gray-300 mb-4">{{ eventOrganizer.bio }}</p>

        <div class="flex items-center space-x-4">
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              eventOrganizer.is_public
                ? 'bg-blue-900 text-blue-300 border border-blue-700'
                : 'bg-gray-700 text-gray-400 border border-gray-600'
            ]"
          >
            {{ eventOrganizer.is_public ? 'Perfil Público' : 'Perfil Privado' }}
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/create"
          class="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
        >
          <Plus class="w-8 h-8 text-blue-400 mb-2" />
          <h4 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            Crear Evento
          </h4>
          <p class="text-gray-400 text-sm">Organiza un nuevo evento</p>
        </NuxtLink>

        <NuxtLink
          to="/my-events"
          class="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
        >
          <Calendar class="w-8 h-8 text-blue-400 mb-2" />
          <h4 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            Mis Eventos
          </h4>
          <p class="text-gray-400 text-sm">Ver eventos creados</p>
        </NuxtLink>

        <NuxtLink
          to="/invitations"
          class="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-6 transition-colors group"
        >
          <Users class="w-8 h-8 text-blue-400 mb-2" />
          <h4 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            Invitaciones
          </h4>
          <p class="text-gray-400 text-sm">Gestionar invitaciones</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar, CheckCircle, Sparkles, Loader, Plus, Users } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'success', message: string): void
  (e: 'error', message: string): void
}>()

const { user, fetchUser } = useAuth()

// Use event organizer data directly from user object (loaded by /api/me)
const eventOrganizer = computed(() => (user.value as any)?.eventOrganizer || null)
const isSubmitting = ref(false)
const isSubscribing = ref(false)
const error = ref<string | null>(null)

const profileForm = ref({
  organizer_name: '',
  contact_email: user.value?.email || '',
  phone: '',
  bio: '',
  is_public: false
})

const subscribeToEventOrganizer = async () => {
  isSubscribing.value = true
  
  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest('/event-organizer/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ months: 1 })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al suscribirse')
    }

    // Refresh user data to get updated subscription
    await fetchUser()
    
    emit('success', 'Suscripción de Organizador activada exitosamente')
  } catch (err: any) {
    emit('error', err.message || 'Error al suscribirse a Organizador')
  } finally {
    isSubscribing.value = false
  }
}

const handleCreateProfile = async () => {
  error.value = null
  isSubmitting.value = true

  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest('/event-organizer', {
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
      
      emit('success', 'Perfil de organizador de eventos creado exitosamente')
  } catch (err: any) {
    error.value = err.message
    emit('error', err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

