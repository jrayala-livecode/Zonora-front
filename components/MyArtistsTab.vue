<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-white">Mis Perfiles de Artista</h2>
        <p class="text-sm text-gray-400 mt-1">Gestiona tus perfiles de artista y selecciona el activo</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
      >
        + Crear Artista
      </button>
    </div>

    <!-- Active Artist Info -->
    <div v-if="hasActiveArtist" class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-green-400 font-medium">Perfil Activo: {{ activeArtistName }}</p>
          <p class="text-sm text-gray-400">Este perfil se usa cuando creas eventos</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      <span class="ml-3 text-gray-400">Cargando artistas...</span>
    </div>

    <!-- Artists List -->
    <div v-else-if="myArtists.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="artist in myArtists"
        :key="artist.id"
        :class="[
          'bg-gray-800 rounded-lg p-4 transition-all',
          isActiveArtist(artist.id)
            ? 'border-2 border-green-500 shadow-lg shadow-green-500/20'
            : 'border border-gray-700 hover:border-orange-500'
        ]"
      >
        <div class="flex items-start space-x-4">
          <!-- Avatar -->
          <img
            v-if="artist.profile_picture_url"
            :src="artist.profile_picture_url"
            :alt="artist.stage_name"
            class="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
          <div v-else class="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {{ artist.stage_name?.[0] }}
          </div>
          
          <div class="flex-1 min-w-0">
            <!-- Artist Name & Status -->
            <div class="flex items-center space-x-2 mb-1">
              <h3 class="font-semibold text-white truncate">{{ artist.stage_name }}</h3>
              <span
                v-if="isActiveArtist(artist.id)"
                class="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs rounded-full flex items-center space-x-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Activo</span>
              </span>
            </div>

            <!-- Stats -->
            <p class="text-xs text-gray-400 mb-2">
              {{ artist.view_count || 0 }} vistas · 
              <span :class="artist.is_public ? 'text-green-400' : 'text-red-400'">
                {{ artist.is_public ? 'Público' : 'Privado' }}
              </span>
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                v-if="!isActiveArtist(artist.id)"
                @click="handleSetActive(artist)"
                class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition flex items-center space-x-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Activar</span>
              </button>
              
              <button
                @click="openEditModal(artist)"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition flex items-center space-x-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </button>

              <NuxtLink
                :to="`/artists/${artist.id}`"
                class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition"
              >
                Ver Perfil →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
      <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
      <p class="text-gray-400 mb-4">Aún no tienes perfiles de artista</p>
      <button
        @click="showCreateModal = true"
        class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
      >
        Crear Mi Primer Artista
      </button>
    </div>

    <!-- Create Artist Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="closeCreateModal"
    >
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-white">Crear Perfil de Artista</h3>
          <button
            @click="closeCreateModal"
            class="text-gray-400 hover:text-white transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateArtist" class="space-y-4">
          <!-- Stage Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre Artístico *
            </label>
            <input
              v-model="createForm.stage_name"
              type="text"
              placeholder="Nombre del artista"
              required
              maxlength="255"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Biografía *
            </label>
            <textarea
              v-model="createForm.bio"
              rows="4"
              maxlength="1000"
              placeholder="Breve descripción del artista..."
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            ></textarea>
            <p class="text-xs text-gray-400 mt-1">{{ createForm.bio.length }}/1000 caracteres</p>
          </div>

          <!-- Visibility Toggle -->
          <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <p class="text-white font-medium">Perfil Público</p>
              <p class="text-sm text-gray-400">Hacer visible este perfil en búsquedas</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="createForm.is_public"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isCreating"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <span v-if="isCreating">Creando...</span>
              <span v-else>Crear Artista</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Artist Modal -->
    <div
      v-if="showEditModal && editingArtist"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click.self="closeEditModal"
    >
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-white">Editar Artista</h3>
          <button
            @click="closeEditModal"
            class="text-gray-400 hover:text-white transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUpdateArtist" class="space-y-4">
          <!-- Stage Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre Artístico *
            </label>
            <input
              v-model="editForm.stage_name"
              type="text"
              placeholder="Nombre del artista"
              required
              maxlength="255"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Biografía *
            </label>
            <textarea
              v-model="editForm.bio"
              rows="4"
              maxlength="1000"
              placeholder="Biografía del artista..."
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <p class="text-xs text-gray-400 mt-1">{{ (editForm.bio || '').length }}/1000 caracteres</p>
          </div>

          <!-- Genres -->
          <GenreSelector v-model="editForm.genres" />

          <!-- Proficiencies -->
          <ProficiencySelector v-model="editForm.proficiencies" />

          <!-- Profile Picture URL -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              URL de Imagen de Perfil
            </label>
            <input
              v-model="editForm.profile_picture_url"
              type="text"
              placeholder="https://... o IPFS CID"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Social Links Section -->
          <div class="space-y-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h4 class="text-sm font-medium text-gray-300 mb-3">Redes Sociales</h4>
            
            <!-- Instagram -->
            <div>
              <label class="block text-xs text-gray-400 mb-1">Instagram</label>
              <input
                v-model="editForm.social_links.instagram"
                type="url"
                placeholder="https://instagram.com/..."
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Twitter -->
            <div>
              <label class="block text-xs text-gray-400 mb-1">Twitter / X</label>
              <input
                v-model="editForm.social_links.twitter"
                type="url"
                placeholder="https://twitter.com/..."
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Spotify -->
            <div>
              <label class="block text-xs text-gray-400 mb-1">Spotify</label>
              <input
                v-model="editForm.social_links.spotify"
                type="url"
                placeholder="https://open.spotify.com/artist/..."
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- YouTube -->
            <div>
              <label class="block text-xs text-gray-400 mb-1">YouTube</label>
              <input
                v-model="editForm.social_links.youtube"
                type="url"
                placeholder="https://youtube.com/@..."
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Visibility Toggle -->
          <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <p class="text-white font-medium">Perfil Público</p>
              <p class="text-sm text-gray-400">Hacer visible este perfil en búsquedas</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="editForm.is_public"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isUpdating"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <span v-if="isUpdating">Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useActiveArtistStore } from '~/store/activeArtist';

const emit = defineEmits<{
  success: [message: string];
  error: [message: string];
}>();

const { user } = useAuth();
const { activeArtist, hasActiveArtist, activeArtistName, setActiveArtist, isActiveArtist } = useActiveArtistStore();

// Import composable methods
const { apiRequest } = useApiClient();
const { assignProficiency, removeProficiency } = useProficiencies();

const myArtists = ref<any[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const editingArtist = ref<any>(null);

// Updated create form structure to match API
const createForm = reactive({
  stage_name: '',
  bio: '',
  is_public: true,
});

// Updated edit form structure to match API
const editForm = reactive({
  stage_name: '',
  bio: '',
  profile_picture_url: '',
  is_public: true,
  genres: [] as string[],
  proficiencies: [] as any[],
  social_links: {
    instagram: '',
    twitter: '',
    spotify: '',
    youtube: ''
  }
});

const loadMyArtists = async () => {
  loading.value = true;

  try {
    const response = await apiRequest('/artists/me');
    const data = await response.json();
    myArtists.value = data.data || data || [];
  } catch (error) {
    console.error('Error loading artists:', error);
  } finally {
    loading.value = false;
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createForm.stage_name = '';
  createForm.bio = '';
  createForm.is_public = true;
};

const handleCreateArtist = async () => {
  isCreating.value = true;

  try {
    // Build payload matching API expectations
    const payload: any = {
      stage_name: createForm.stage_name,
      bio: createForm.bio,
      is_public: createForm.is_public,
    };

    // Call the correct endpoint: POST /artists
    const response = await apiRequest('/artists', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create artist');
    }

    emit('success', '¡Artista creado exitosamente!');
    
    // Reset form and close modal
    closeCreateModal();

    // Reload artists list
    await loadMyArtists();
  } catch (error: any) {
    emit('error', error.message || 'Error al crear artista');
  } finally {
    isCreating.value = false;
  }
};

const openEditModal = (artist: any) => {
  editingArtist.value = artist;
  editForm.stage_name = artist.stage_name || '';
  editForm.bio = artist.bio || '';
  editForm.profile_picture_url = artist.profile_picture_url || '';
  editForm.is_public = artist.is_public !== false;
  
  // Handle genres - ensure it's an array
  if (artist.genres && Array.isArray(artist.genres)) {
    editForm.genres = [...artist.genres];
  } else {
    editForm.genres = [];
  }

  // Handle proficiencies - ensure it's an array
  if (artist.proficiencies && Array.isArray(artist.proficiencies)) {
    editForm.proficiencies = [...artist.proficiencies];
  } else {
    editForm.proficiencies = [];
  }

  // Handle social links
  if (artist.social_links && typeof artist.social_links === 'object') {
    editForm.social_links = {
      instagram: artist.social_links.instagram || '',
      twitter: artist.social_links.twitter || '',
      spotify: artist.social_links.spotify || '',
      youtube: artist.social_links.youtube || ''
    };
  } else {
    editForm.social_links = {
      instagram: '',
      twitter: '',
      spotify: '',
      youtube: ''
    };
  }
  
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingArtist.value = null;
};

const handleUpdateArtist = async () => {
  if (!editingArtist.value) return;

  isUpdating.value = true;

  try {
    // Build payload matching API expectations
    const payload: any = {
      id: editingArtist.value.id, // Including ID makes ArtistController::store() do an update
      stage_name: editForm.stage_name,
      bio: editForm.bio,
      is_public: editForm.is_public,
    };

    // Only include optional fields if they have values
    if (editForm.profile_picture_url) {
      payload.profile_picture_url = editForm.profile_picture_url;
    }

    if (editForm.genres.length > 0) {
      payload.genres = editForm.genres;
    }

    // Only include social links if at least one is filled
    const hasSocialLinks = Object.values(editForm.social_links).some(link => link && link.trim() !== '');
    if (hasSocialLinks) {
      // Only include non-empty links
      const socialLinks: any = {};
      if (editForm.social_links.instagram) socialLinks.instagram = editForm.social_links.instagram;
      if (editForm.social_links.twitter) socialLinks.twitter = editForm.social_links.twitter;
      if (editForm.social_links.spotify) socialLinks.spotify = editForm.social_links.spotify;
      if (editForm.social_links.youtube) socialLinks.youtube = editForm.social_links.youtube;
      
      if (Object.keys(socialLinks).length > 0) {
        payload.social_links = socialLinks;
      }
    }

    // Call the correct endpoint: POST /artists (with id for update)
    const response = await apiRequest('/artists', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update artist');
    }

    // Sync proficiencies (compare old vs new)
    const oldProficiencyIds = editingArtist.value.proficiencies?.map((p: any) => p.id) || [];
    const newProficiencyIds = editForm.proficiencies.map((p: any) => p.id);
    
    // Find proficiencies to add
    const toAdd = newProficiencyIds.filter((id: number) => !oldProficiencyIds.includes(id));
    
    // Find proficiencies to remove
    const toRemove = oldProficiencyIds.filter((id: number) => !newProficiencyIds.includes(id));
    
    // Add new proficiencies
    for (const proficiencyId of toAdd) {
      try {
        await assignProficiency(editingArtist.value.id, proficiencyId);
      } catch (error) {
        console.error('Error adding proficiency:', error);
      }
    }
    
    // Remove old proficiencies
    for (const proficiencyId of toRemove) {
      try {
        await removeProficiency(editingArtist.value.id, proficiencyId);
      } catch (error) {
        console.error('Error removing proficiency:', error);
      }
    }

    emit('success', '¡Artista actualizado exitosamente!');
    
    // Close modal
    closeEditModal();

    // Reload artists list
    await loadMyArtists();

    // Update active artist if this was the active one
    if (isActiveArtist(editingArtist.value.id)) {
      const updatedArtist = myArtists.value.find(a => a.id === editingArtist.value.id);
      if (updatedArtist) {
        setActiveArtist(updatedArtist);
      }
    }
  } catch (error: any) {
    emit('error', error.message || 'Error al actualizar artista');
  } finally {
    isUpdating.value = false;
  }
};

const handleSetActive = (artist: any) => {
  setActiveArtist(artist);
  emit('success', `"${artist.stage_name}" establecido como perfil activo`);
};

onMounted(() => {
  loadMyArtists();
});
</script>
