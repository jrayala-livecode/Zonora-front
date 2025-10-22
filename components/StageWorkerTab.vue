<template>
  <div class="space-y-6">
    <!-- No Profile - Show Creation Form -->
    <div v-if="!stageWorker" class="space-y-6">
      <div class="text-center mb-6">
        <Wrench class="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-white mb-2">Crear Perfil de Trabajador de Escenario</h3>
        <p class="text-gray-400">Crea tu perfil para ofrecer servicios técnicos</p>
      </div>

      <form @submit.prevent="handleCreateProfile" class="space-y-4">
        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Nombre Profesional <span class="text-red-400">*</span>
          </label>
          <input
            v-model="profileForm.worker_name"
            type="text"
            required
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: Juan Pérez - Técnico de Audio"
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
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="contacto@tecnico.com"
          />
        </div>

        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Teléfono
          </label>
          <input
            v-model="profileForm.phone"
            type="tel"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="+56 9 1234 5678"
          />
        </div>

        <div>
          <label class="block text-gray-300 font-medium mb-2">
            Especialidades / Habilidades
          </label>
          <textarea
            v-model="profileForm.bio"
            rows="3"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: Técnico de sonido con 10 años de experiencia, especializado en audio en vivo..."
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            v-model="profileForm.is_public"
            type="checkbox"
            id="is_public_worker"
            class="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label for="is_public_worker" class="ml-2 text-gray-300">
            Hacer mi perfil público (visible para organizadores)
          </label>
        </div>

        <div v-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="!isSubmitting">Crear Perfil</span>
          <span v-else class="flex items-center">
            <Loader class="w-5 h-5 mr-2 animate-spin" />
            Creando...
          </span>
        </button>
      </form>
    </div>

    <!-- Not Subscribed to Stage Worker - Show Paywall -->
    <div v-else-if="!stageWorker.has_active_subscription" class="text-center py-12">
      <Wrench class="w-16 h-16 text-purple-400 mx-auto mb-4" />
      <h3 class="text-2xl font-bold text-white mb-2">Suscripción de Técnico Requerida</h3>
      <p class="text-gray-400 mb-6 max-w-xl mx-auto">
        Activa tu suscripción de Trabajador de Escenario para ofrecer tus servicios.
      </p>
      
      <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 max-w-xl mx-auto mb-6">
        <h4 class="text-purple-400 font-semibold mb-3">Con la suscripción de Técnico:</h4>
        <ul class="text-gray-300 text-left space-y-2">
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Perfil profesional visible para organizadores</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Muestra tu experiencia y habilidades técnicas</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Recibe invitaciones de trabajo</span>
          </li>
          <li class="flex items-start">
            <CheckCircle class="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Gestiona tus colaboraciones en eventos</span>
          </li>
        </ul>
      </div>

      <button
        @click="subscribeToStageWorker"
        :disabled="isSubscribing"
        class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
      >
        <Sparkles class="w-5 h-5 mr-2" />
        <span v-if="!isSubscribing">Suscribirse a Técnico</span>
        <span v-else>Suscribiendo...</span>
      </button>
    </div>

    <!-- Dashboard - Profile Active -->
    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">{{ stageWorker.worker_name }}</h3>
            <p class="text-gray-400">{{ stageWorker.contact_email }}</p>
            <p v-if="stageWorker.phone" class="text-gray-400">{{ stageWorker.phone }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              stageWorker.has_active_subscription
                ? 'bg-green-900 text-green-300 border border-green-700'
                : 'bg-red-900 text-red-300 border border-red-700'
            ]"
          >
            {{ stageWorker.has_active_subscription ? 'Suscripción Activa' : 'Suscripción Expirada' }}
          </span>
        </div>
        
        <p v-if="stageWorker.bio" class="text-gray-300 mb-4">{{ stageWorker.bio }}</p>

        <div class="flex items-center space-x-4">
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              stageWorker.is_public
                ? 'bg-purple-900 text-purple-300 border border-purple-700'
                : 'bg-gray-700 text-gray-400 border border-gray-600'
            ]"
          >
            {{ stageWorker.is_public ? 'Perfil Público' : 'Perfil Privado' }}
          </span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          to="/events"
          class="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors group"
        >
          <Calendar class="w-8 h-8 text-purple-400 mb-2" />
          <h4 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
            Explorar Eventos
          </h4>
          <p class="text-gray-400 text-sm">Buscar oportunidades de trabajo</p>
        </NuxtLink>

        <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 opacity-75">
          <Users class="w-8 h-8 text-purple-400 mb-2" />
          <h4 class="text-lg font-semibold text-white">
            Mis Colaboraciones
          </h4>
          <p class="text-gray-400 text-sm">Próximamente</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Wrench, CheckCircle, Sparkles, Loader, Calendar, Users } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'success', message: string): void
  (e: 'error', message: string): void
}>()

const { user, fetchUser } = useAuth()

// Use stage worker data directly from user object (loaded by /api/me)
const stageWorker = computed(() => (user.value as any)?.stageWorker || null)
const isSubmitting = ref(false)
const isSubscribing = ref(false)
const error = ref<string | null>(null)

const profileForm = ref({
  worker_name: '',
  contact_email: user.value?.email || '',
  phone: '',
  bio: '',
  is_public: false
})

const subscribeToStageWorker = async () => {
  isSubscribing.value = true
  
  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest('/stage-worker/subscribe', {
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
    
    emit('success', 'Suscripción de Trabajador de Escenario activada exitosamente')
  } catch (err: any) {
    emit('error', err.message || 'Error al suscribirse a Trabajador de Escenario')
  } finally {
    isSubscribing.value = false
  }
}

const handleCreateProfile = async () => {
  error.value = null
  isSubmitting.value = true

  try {
    const { apiRequest } = useApiClient()
    const response = await apiRequest('/stage-worker', {
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
      
      emit('success', 'Perfil de trabajador de escenario creado exitosamente')
  } catch (err: any) {
    error.value = err.message
    emit('error', err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

