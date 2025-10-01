<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

    <!-- Modal panel -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <!-- Modal header -->
        <div class="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white" id="modal-title">
              Editar Perfil Artístico
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal body -->
        <form @submit.prevent="updateArtist" class="p-6">
          <div class="space-y-6">
            <!-- Stage Name -->
            <div>
              <label for="edit_stage_name" class="block text-sm font-medium text-gray-300 mb-2">
                Nombre Artístico
              </label>
              <input
                id="edit_stage_name"
                v-model="editForm.stage_name"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Tu nombre artístico"
              />
            </div>

            <!-- Bio -->
            <div>
              <label for="edit_bio" class="block text-sm font-medium text-gray-300 mb-2">
                Biografía
              </label>
              <textarea
                id="edit_bio"
                v-model="editForm.bio"
                rows="3"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Cuéntanos sobre tu música y estilo"
              ></textarea>
            </div>

            <!-- Genres -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Géneros Musicales
              </label>
              
              <!-- Genre Tags Display -->
              <div class="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 bg-gray-700 border border-gray-600 rounded-lg">
                <div
                  v-for="(genre, index) in genreTags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-orange-600 text-white text-sm rounded-full"
                >
                  <span>{{ genre }}</span>
                  <button
                    type="button"
                    @click="removeGenre(index)"
                    class="ml-2 text-orange-200 hover:text-white transition-colors duration-200"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Add Genre Input -->
                <input
                  ref="genreInput"
                  v-model="newGenre"
                  @input="parseGenres"
                  @keydown.enter.prevent="addCurrentGenre"
                  @keydown.comma.prevent="addCurrentGenre"
                  @blur="addCurrentGenre"
                  type="text"
                  class="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Agregar género..."
                  maxlength="100"
                />
              </div>
              
              <p class="text-xs text-gray-500">Presiona Enter o escribe una coma para agregar géneros</p>
            </div>

            <!-- Social Links -->
            <div>
              <label for="edit_social_links" class="block text-sm font-medium text-gray-300 mb-2">
                Enlaces Sociales
              </label>
              <input
                id="edit_social_links"
                v-model="editForm.social_links"
                type="text"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: https://instagram.com/tu_perfil, https://spotify.com/artist/tu_perfil"
              />
              <p class="text-xs text-gray-500 mt-1">Separa los enlaces con comas</p>
            </div>

            <!-- Profile Picture -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Foto de Perfil
              </label>
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <img
                    :src="editForm.profile_picture_url || 'https://www.gravatar.com/avatar/default?d=identicon&s=64'"
                    :alt="editForm.stage_name"
                    class="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    Cambiar Foto
                  </button>
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG hasta 2MB</p>
                </div>
              </div>
            </div>

            <!-- Visibility Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-gray-300">Perfil Público</span>
                <p class="text-xs text-gray-500">Visible para otros usuarios</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="editForm.is_public"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isUpdating"
              class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg
                v-if="isUpdating"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useArtists } from '~/composables/useArtists'
import { useUserStore } from '~/store/user'
import { useRuntimeConfig } from '#app'

interface Artist {
  id: number
  stage_name: string
  bio: string
  genres: string[]
  social_links: string[]
  profile_picture_url?: string
  is_public: boolean
}

interface Props {
  isOpen: boolean
  artist: Artist | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated', artist: Artist): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { updateArtist: updateArtistApi } = useArtists()
const userStore = useUserStore()

const isUpdating = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const editForm = reactive({
  stage_name: '',
  bio: '',
  genres: '',
  social_links: '',
  profile_picture_url: '',
  is_public: true
})

// Genre tags management
const genreTags = ref<string[]>([])
const newGenre = ref('')
const genreInput = ref<HTMLInputElement | null>(null)

// Watch for artist changes to populate form
watch(() => props.artist, (newArtist) => {
  if (newArtist) {
    editForm.stage_name = newArtist.stage_name || ''
    editForm.bio = newArtist.bio || ''
    editForm.genres = Array.isArray(newArtist.genres) ? newArtist.genres.join(', ') : ''
    editForm.social_links = Array.isArray(newArtist.social_links) ? newArtist.social_links.join(', ') : ''
    editForm.profile_picture_url = newArtist.profile_picture_url || ''
    editForm.is_public = newArtist.is_public ?? true
    
    // Populate genre tags
    genreTags.value = Array.isArray(newArtist.genres) ? [...newArtist.genres] : []
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
}

// Genre management functions
const parseGenres = () => {
  const text = newGenre.value
  const parts = text.split(',')
  
  // If we have more than one part, it means there's at least one comma
  if (parts.length > 1) {
    // Add all complete parts (before the last comma) as tags
    for (let i = 0; i < parts.length - 1; i++) {
      const genre = parts[i].trim()
      if (genre && !genreTags.value.includes(genre) && genreTags.value.length < 10) {
        genreTags.value.push(genre)
      }
    }
    
    // Keep only the last part (after the last comma) in the input
    newGenre.value = parts[parts.length - 1].trim()
  }
}

const addCurrentGenre = () => {
  const genre = newGenre.value.trim()
  if (genre && !genreTags.value.includes(genre) && genreTags.value.length < 10) {
    genreTags.value.push(genre)
    newGenre.value = ''
  }
}

const removeGenre = (index: number) => {
  genreTags.value.splice(index, 1)
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 2MB.')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.')
      return
    }
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.profile_picture_url = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const updateArtist = async () => {
  if (!props.artist) return
  
  isUpdating.value = true
  
  try {
    const artistData = {
      stage_name: editForm.stage_name,
      bio: editForm.bio,
      genres: genreTags.value,
      social_links: editForm.social_links ? editForm.social_links.split(',').map(l => l.trim()).filter(l => l) : [],
      is_public: editForm.is_public
    }
    
    const updatedArtist = await updateArtistApi(props.artist.id, artistData)
    
    // Refresh user data from server to ensure local storage is up to date
    await refreshUserData()
    
    emit('updated', updatedArtist)
    closeModal()
  } catch (error) {
    console.error('Error updating artist:', error)
    alert('Error al actualizar el perfil. Por favor, intenta de nuevo.')
  } finally {
    isUpdating.value = false
  }
}

// Function to refresh user data from server
const refreshUserData = async () => {
  try {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl as string
    
    if (!userStore.token) return
    
    const userData = await $fetch('/me', {
      baseURL: apiBaseUrl,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })

    // Update user data with fresh data from server
    const user = (userData as any).user || userData
    const normalizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url || user.avatar || '',
      description: user.description ?? '',
      joinedAt: user.created_at ?? '',
    }

    userStore.setUser(normalizedUser)
  } catch (error) {
    console.error('Error refreshing user data:', error)
  }
}
</script>
