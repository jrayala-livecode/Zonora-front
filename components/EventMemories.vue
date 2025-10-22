<template>
  <!-- Only render if event has passed -->
  <div v-if="hasEventPassed" class="space-y-6">
    <!-- Image Carousel (only show if there are images) -->
    <div v-if="images.length > 0" class="card">
      <h2 class="text-2xl font-semibold text-white mb-6 flex items-center">
        <svg class="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Recuerdos del Evento
      </h2>
      
      <!-- Carousel -->
      <div class="relative">
        <div class="overflow-hidden rounded-lg">
          <div class="relative aspect-video bg-gray-900">
            <img 
              v-if="images[currentImageIndex]"
              :src="images[currentImageIndex].picture_url" 
              :alt="`Foto del evento compartida por ${images[currentImageIndex].user?.name}`"
              class="w-full h-full object-contain"
              @click="openImageModal(currentImageIndex)"
            />
            
            <!-- User avatar overlay -->
            <div v-if="images[currentImageIndex]?.user" class="absolute bottom-4 left-4 flex items-center space-x-2 bg-black bg-opacity-60 rounded-lg px-3 py-2">
              <img 
                v-if="images[currentImageIndex].user.avatar_url"
                :src="images[currentImageIndex].user.avatar_url" 
                :alt="images[currentImageIndex].user.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div v-else class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                {{ images[currentImageIndex].user.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-white text-sm font-medium">{{ images[currentImageIndex].user.name }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation buttons -->
        <button 
          v-if="images.length > 1"
          @click="previousImage"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all"
          aria-label="Imagen anterior"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          v-if="images.length > 1"
          @click="nextImage"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all"
          aria-label="Siguiente imagen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Image counter -->
        <div v-if="images.length > 1" class="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-lg">
          {{ currentImageIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>

    <!-- Links List (only show if there are links) -->
    <div v-if="links.length > 0" class="card">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Enlaces Compartidos
      </h2>
      
      <div class="space-y-3">
        <a 
          v-for="link in links" 
          :key="link.id"
          :href="link.link" 
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
        >
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <!-- Platform icon -->
            <div class="flex-shrink-0">
              <svg v-if="getPlatform(link.link) === 'instagram'" class="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              </svg>
              <svg v-else-if="getPlatform(link.link) === 'youtube'" class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <svg v-else-if="getPlatform(link.link) === 'facebook'" class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            
            <!-- Link preview -->
            <div class="flex-1 min-w-0">
              <div class="text-white font-medium truncate group-hover:text-orange-400 transition-colors">
                {{ getPlatformLabel(link.link) }}
              </div>
              <div class="text-gray-400 text-sm truncate">{{ link.link }}</div>
            </div>
          </div>
          
          <!-- User avatar on the right -->
          <div v-if="link.user" class="flex-shrink-0 ml-4">
            <img 
              v-if="link.user.avatar_url"
              :src="link.user.avatar_url" 
              :alt="link.user.name"
              :title="`Compartido por ${link.user.name}`"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div v-else class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm" :title="`Compartido por ${link.user.name}`">
              {{ link.user.name.charAt(0).toUpperCase() }}
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- Upload Section (only for eligible users) -->
    <div v-if="canUpload" class="card">
      <h2 class="text-xl font-semibold text-white mb-4">Comparte tu Experiencia</h2>
      
      <!-- Tab selection -->
      <div class="flex space-x-2 mb-4">
        <button 
          @click="uploadType = 'image'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
            uploadType === 'image' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          ]"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Subir Foto
        </button>
        <button 
          @click="uploadType = 'link'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
            uploadType === 'link' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          ]"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Compartir Enlace
        </button>
      </div>

      <!-- Image upload -->
      <div v-if="uploadType === 'image'" class="space-y-4">
        <div class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <!-- Preview or upload prompt -->
          <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-300 mb-1">Haz clic para seleccionar una foto</p>
            <p class="text-gray-500 text-sm">JPG, PNG, GIF, WEBP hasta 10MB</p>
          </div>
          
          <div v-else class="space-y-3">
            <img :src="imagePreview" alt="Vista previa" class="max-h-64 mx-auto rounded-lg" />
            <button 
              @click.stop="clearFile"
              class="text-red-400 hover:text-red-300 text-sm"
            >
              Cambiar imagen
            </button>
          </div>
        </div>
        
        <button 
          @click="uploadMedia"
          :disabled="!selectedFile || uploading"
          class="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <span v-if="uploading">Subiendo...</span>
          <span v-else>Subir Foto</span>
        </button>
      </div>

      <!-- Link upload -->
      <div v-else class="space-y-4">
        <input 
          v-model="linkInput"
          type="url"
          placeholder="https://instagram.com/..., https://youtube.com/..., https://facebook.com/..."
          class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
        />
        <button 
          @click="uploadMedia"
          :disabled="!linkInput || uploading"
          class="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <span v-if="uploading">Compartiendo...</span>
          <span v-else>Compartir Enlace</span>
        </button>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
        {{ error }}
      </div>

      <!-- Success message -->
      <div v-if="success" class="mt-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { EventMedia } from '~/composables/types/types';
import { useEventMedia } from '~/composables/useEventMedia';
import { useUserStore } from '~/store/user';

const props = defineProps<{
  eventId: number;
  eventDate: string;
}>();

const { user } = useUserStore();
const { uploadEventMedia, getEventMedia, deleteEventMedia, loading, error: apiError } = useEventMedia();

const mediaList = ref<EventMedia[]>([]);
const currentImageIndex = ref(0);
const uploadType = ref<'image' | 'link'>('image');
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const linkInput = ref('');
const uploading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Check if event has passed
const hasEventPassed = computed(() => {
  return new Date(props.eventDate) < new Date();
});

// Separate images and links
const images = computed(() => mediaList.value.filter(m => m.type === 'image'));
const links = computed(() => mediaList.value.filter(m => m.type === 'link'));

// Check if user can upload (has ticket or showed interest before event)
const canUpload = computed(() => {
  // This would need to be passed from the parent or fetched
  // For now, just check if user is logged in and event has passed
  return user && hasEventPassed.value;
});

// Load media
const loadMedia = async () => {
  try {
    const result = await getEventMedia(props.eventId);
    if (result) {
      mediaList.value = result.data;
    }
  } catch (e) {
    console.error('Error loading media:', e);
  }
};

// Carousel navigation
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
};

const previousImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length;
};

const openImageModal = (index: number) => {
  // TODO: Implement full-screen image viewer
  console.log('Open image modal', index);
};

// File handling
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const clearFile = () => {
  selectedFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Upload media
const uploadMedia = async () => {
  error.value = null;
  success.value = null;
  uploading.value = true;

  try {
    if (uploadType.value === 'image' && selectedFile.value) {
      await uploadEventMedia(props.eventId, 'image', selectedFile.value);
      success.value = 'Foto subida exitosamente';
      clearFile();
    } else if (uploadType.value === 'link' && linkInput.value) {
      await uploadEventMedia(props.eventId, 'link', undefined, linkInput.value);
      success.value = 'Enlace compartido exitosamente';
      linkInput.value = '';
    }
    
    // Reload media
    await loadMedia();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = null;
    }, 3000);
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Error al subir';
  } finally {
    uploading.value = false;
  }
};

// Get platform from URL
const getPlatform = (url: string): string => {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
  return 'other';
};

const getPlatformLabel = (url: string): string => {
  const platform = getPlatform(url);
  const labels: Record<string, string> = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
    other: 'Enlace'
  };
  return labels[platform];
};

onMounted(() => {
  if (hasEventPassed.value) {
    loadMedia();
  }
});
</script>

