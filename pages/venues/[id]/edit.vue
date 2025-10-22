<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          :to="`/venues/${venueId}`"
          class="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Volver al Venue
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white mb-2">Editar Venue</h1>
        <p class="text-gray-400">Actualiza la información del venue</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
          <p class="text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Edit Form -->
      <form v-else-if="venue" @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <label class="block text-gray-300 font-medium mb-2">
            Nombre del Venue <span class="text-red-400">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nombre del venue"
          />
        </div>

        <!-- Description -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <label class="block text-gray-300 font-medium mb-2">
            Descripción
          </label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Descripción del venue"
          ></textarea>
        </div>

        <!-- Profile Picture -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <label class="block text-gray-300 font-medium mb-2">
            Imagen de Perfil
          </label>
          <p class="text-sm text-gray-400 mb-3">
            Sube una imagen para el venue (máx. 10MB)
          </p>

          <!-- Current Image -->
          <div v-if="venue.profile_picture" class="mb-4">
            <p class="text-sm text-gray-400 mb-2">Imagen actual:</p>
            <img
              :src="venue.profile_picture"
              alt="Imagen actual"
              class="w-48 h-32 object-cover rounded-lg border border-gray-600"
            />
          </div>

          <!-- Upload New Image -->
          <label
            class="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-gray-750 transition-colors"
          >
            <div class="text-center">
              <UploadCloud class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <span class="text-gray-300">
                {{ newImage ? newImage.name : 'Haz clic para seleccionar una imagen' }}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageSelect"
              :disabled="isSubmitting"
            />
          </label>
        </div>

        <!-- Address (Disabled for venue admins) -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 opacity-75">
          <label class="block text-gray-300 font-medium mb-2 flex items-center">
            Dirección
            <Lock class="w-4 h-4 ml-2 text-gray-500" />
          </label>
          <p class="text-sm text-gray-500 mb-3">
            La dirección no puede ser editada por administradores de venue
          </p>
          <input
            :value="venue.address"
            type="text"
            disabled
            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
          />
        </div>

        <!-- Interest Links -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <label class="block text-gray-300 font-medium mb-2">
            Enlaces de Interés
          </label>
          <div class="space-y-3">
            <div v-for="(link, index) in formData.interest_links" :key="index" class="flex items-center space-x-2">
              <input
                v-model="formData.interest_links[index]"
                type="url"
                class="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://..."
              />
              <button
                type="button"
                @click="removeLink(index)"
                class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              @click="addLink"
              class="flex items-center text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Plus class="w-4 h-4 mr-1" />
              Agregar enlace
            </button>
          </div>
        </div>

        <!-- Hashtags -->
        <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <label class="block text-gray-300 font-medium mb-2">
            Hashtags
          </label>
          <div class="space-y-3">
            <div v-for="(tag, index) in formData.hashtags" :key="index" class="flex items-center space-x-2">
              <input
                v-model="formData.hashtags[index]"
                type="text"
                class="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="#hashtag"
              />
              <button
                type="button"
                @click="removeHashtag(index)"
                class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              @click="addHashtag"
              class="flex items-center text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Plus class="w-4 h-4 mr-1" />
              Agregar hashtag
            </button>
          </div>
        </div>

        <!-- Submit Error -->
        <div v-if="submitError" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div class="flex items-center">
            <AlertCircle class="w-5 h-5 text-red-400 mr-2" />
            <p class="text-red-400">{{ submitError }}</p>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div class="flex items-center">
            <CheckCircle class="w-5 h-5 text-green-400 mr-2" />
            <p class="text-green-400">Venue actualizado exitosamente</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-4 pt-4">
          <NuxtLink
            :to="`/venues/${venueId}`"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">Guardar Cambios</span>
            <span v-else class="flex items-center">
              <Loader class="w-5 h-5 mr-2 animate-spin" />
              Guardando...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeft, AlertCircle, UploadCloud, Lock, X, Plus, CheckCircle, Loader } from 'lucide-vue-next'

definePageMeta({
  middleware: 'auth',
  title: 'Editar Venue'
})

const route = useRoute()
const router = useRouter()
const venueId = computed(() => route.params.id as string)

const { getVenue } = useVenues()
const { user } = useAuth()

const venue = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const submitError = ref<string | null>(null)
const success = ref(false)
const isSubmitting = ref(false)
const newImage = ref<File | null>(null)

const formData = ref({
  name: '',
  description: '',
  interest_links: [] as string[],
  hashtags: [] as string[]
})

// Check if user can edit this venue
const canEdit = computed(() => {
  if (!venue.value || !user.value) return false
  
  // Admin can edit any venue
  if ((user.value as any).is_admin) return true
  
  // Venue owner can edit
  if (venue.value.user_id === user.value.id) return true
  
  // Venue admin who has claimed this venue can edit
  const venueAdmin = (user.value as any).venueAdmin
  if (venueAdmin && venue.value.venue_admin_id === venueAdmin.id) {
    return true
  }
  
  return false
})

// Fetch venue on mount
onMounted(async () => {
  try {
    const venueData = await getVenue(parseInt(venueId.value))
    
    if (!venueData) {
      error.value = 'Venue no encontrado'
      return
    }

    venue.value = venueData
    
    // Check authorization
    if (!canEdit.value) {
      error.value = 'No tienes permiso para editar este venue'
      setTimeout(() => {
        router.push(`/venues/${venueId.value}`)
      }, 2000)
      return
    }
    
    // Populate form
    formData.value = {
      name: venueData.name || '',
      description: venueData.description || '',
      interest_links: venueData.interest_links || [],
      hashtags: venueData.hashtags || []
    }
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el venue'
  } finally {
    loading.value = false
  }
})

// Image upload
const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande (máx. 10MB)')
      return
    }
    
    newImage.value = file
  }
}

// Links management
const addLink = () => {
  formData.value.interest_links.push('')
}

const removeLink = (index: number) => {
  formData.value.interest_links.splice(index, 1)
}

// Hashtags management
const addHashtag = () => {
  formData.value.hashtags.push('')
}

const removeHashtag = (index: number) => {
  formData.value.hashtags.splice(index, 1)
}

// Submit form
const handleSubmit = async () => {
  submitError.value = null
  success.value = false
  isSubmitting.value = true

  try {
    const { apiRequest } = useApiClient()
    
    // Create FormData to include file upload
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('description', formData.value.description || '')
    
    // Add new image if selected
    if (newImage.value) {
      formDataToSend.append('profile_picture', newImage.value)
    }
    
    // Filter and add interest links
    const cleanedLinks = formData.value.interest_links.filter(link => link.trim() !== '')
    cleanedLinks.forEach((link, index) => {
      formDataToSend.append(`interest_links[${index}]`, link)
    })
    
    // Filter and add hashtags
    const cleanedHashtags = formData.value.hashtags.filter(tag => tag.trim() !== '')
    cleanedHashtags.forEach((tag, index) => {
      formDataToSend.append(`hashtags[${index}]`, tag)
    })
    
    // Use POST with _method override since FormData with PUT can be problematic
    formDataToSend.append('_method', 'PUT')

    const response = await apiRequest(`/venues/${venueId.value}`, {
      method: 'POST',
      body: formDataToSend
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar el venue')
    }

    success.value = true
    
    // Redirect after success
    setTimeout(() => {
      router.push(`/venues/${venueId.value}`)
    }, 2000)
  } catch (err: any) {
    submitError.value = err.message || 'Error al actualizar el venue'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>


