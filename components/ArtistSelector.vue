<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-white">Artistas del Evento</h3>
      <button
        v-if="!showSelector"
        @click="openSelector"
        type="button"
        class="inline-flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded transition-colors duration-200"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Agregar Artista
      </button>
    </div>

    <!-- Selected Artists -->
    <div v-if="selectedArtists.length > 0" class="space-y-2">
      <div 
        v-for="artist in selectedArtists" 
        :key="artist.id"
        class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <img 
            v-if="artist.profile_picture_url"
            :src="$convertImageUrl(artist.profile_picture_url)"
            :alt="artist.stage_name"
            class="w-10 h-10 rounded-full object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-white">{{ artist.stage_name }}</p>
            <p v-if="artist.genres && artist.genres.length > 0" class="text-xs text-gray-400">
              {{ artist.genres.slice(0, 2).join(', ') }}
            </p>
          </div>
        </div>
        <button
          @click="removeArtist(artist.id)"
          type="button"
          class="text-red-400 hover:text-red-300 transition-colors duration-200"
          :aria-label="`Remover ${artist.stage_name} del evento`"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Artist Selection Modal -->
    <div v-if="showSelector" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeSelector">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Seleccionar Artistas</h3>
          <button
            @click="closeSelector"
            class="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span class="ml-3 text-gray-400">Cargando artistas...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-medium text-red-400 mb-2">Error al cargar artistas</h3>
          <p class="text-gray-400 mb-4">{{ error }}</p>
          <button
            @click="loadArtists"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
          >
            Intentar de nuevo
          </button>
        </div>

        <!-- Artists List -->
        <div v-else-if="availableArtists.length > 0" class="max-h-96 overflow-y-auto space-y-2">
          <div 
            v-for="artist in availableArtists" 
            :key="artist.id"
            @click="selectArtist(artist)"
            class="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors duration-200"
          >
            <img 
              v-if="artist.profile_picture_url"
              :src="$convertImageUrl(artist.profile_picture_url)"
              :alt="artist.stage_name"
              class="w-12 h-12 rounded-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ artist.stage_name }}</p>
              <p v-if="artist.genres && artist.genres.length > 0" class="text-xs text-gray-400">
                {{ artist.genres.slice(0, 3).join(', ') }}
              </p>
            </div>
            <div v-if="isSelected(artist.id)" class="text-orange-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- No Artists State -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h3 class="text-lg font-medium text-gray-400 mb-2">No tienes artistas</h3>
          <p class="text-gray-500 mb-4">Crea un perfil de artista para poder asignarlo a eventos</p>
          <NuxtLink
            to="/profile"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
          >
            Crear Perfil de Artista
          </NuxtLink>
        </div>

        <!-- Action Buttons -->
        <div v-if="availableArtists.length > 0" class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
          <button
            @click="closeSelector"
            type="button"
            class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            @click="confirmSelection"
            type="button"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Confirmar Selección
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useArtists } from '~/composables/useArtists';
import type { Artist } from '~/composables/types/types';

interface Props {
  modelValue: Artist[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [artists: Artist[]];
}>();

const { getMyArtists } = useArtists();

// State
const showSelector = ref(false);
const loading = ref(false);
const error = ref('');
const availableArtists = ref<Artist[]>([]);
const selectedArtists = ref<Artist[]>([]);
const tempSelection = ref<number[]>([]);

// Computed
const isSelected = (artistId: number) => {
  return tempSelection.value.includes(artistId);
};

// Methods
const loadArtists = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    availableArtists.value = await getMyArtists();
  } catch (err: any) {
    console.error('ArtistSelector: Error loading artists:', err);
    error.value = err.message || 'Error al cargar artistas';
  } finally {
    loading.value = false;
  }
};

const selectArtist = (artist: Artist) => {
  const index = tempSelection.value.indexOf(artist.id);
  if (index > -1) {
    tempSelection.value.splice(index, 1);
  } else {
    tempSelection.value.push(artist.id);
  }
};

const confirmSelection = () => {
  const newSelection = availableArtists.value.filter(artist => 
    tempSelection.value.includes(artist.id)
  );
  
  // Merge with existing selection (avoid duplicates)
  const existingIds = selectedArtists.value.map(a => a.id);
  const newArtists = newSelection.filter(artist => !existingIds.includes(artist.id));
  
  selectedArtists.value = [...selectedArtists.value, ...newArtists];
  emit('update:modelValue', selectedArtists.value);
  
  closeSelector();
};

const removeArtist = (artistId: number) => {
  selectedArtists.value = selectedArtists.value.filter(artist => artist.id !== artistId);
  emit('update:modelValue', selectedArtists.value);
};

const closeSelector = () => {
  showSelector.value = false;
  tempSelection.value = [];
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

// Initialize temp selection when opening selector
const openSelector = () => {
  showSelector.value = true;
  tempSelection.value = selectedArtists.value.map(artist => artist.id);
  loadArtists();
};

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  selectedArtists.value = [...newValue];
}, { immediate: true });

// Expose method for parent
defineExpose({
  openSelector
});
</script>
