<template>
  <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-12">
        <!-- Logo -->
        <div class="flex items-left">
          <NuxtLink to="/" class="flex items-center space-x-1.5">
            <div class="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">Z</span>
            </div>
            <span class="text-lg font-bold text-white">Zonora</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-6">
          <LoadingLink to="/" link-class="nav-link text-sm transform hover:scale-110 transition-all duration-300" loading-message="Cargando inicio...">Inicio</LoadingLink>
          <LoadingLink to="/events" link-class="nav-link text-sm transform hover:scale-110 transition-all duration-300" loading-message="Cargando eventos...">Eventos</LoadingLink>
          <LoadingLink to="/venues" link-class="nav-link text-sm transform hover:scale-110 transition-all duration-300" loading-message="Cargando venues...">Venues</LoadingLink>
          <LoadingLink to="/artists" link-class="nav-link text-sm transform hover:scale-110 transition-all duration-300" loading-message="Cargando artistas...">Artistas</LoadingLink>
          <ClientOnly>
            <LoadingLink v-if="isAuthenticated" to="/create" link-class="nav-link text-sm transform hover:scale-110 transition-all duration-300" loading-message="Cargando creador...">Crear</LoadingLink>
          </ClientOnly>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          @click="showMobileMenu = !showMobileMenu"
          class="md:hidden p-2 text-gray-400 hover:text-white"
        >
          <Menu class="w-6 h-6" />
        </button>

        <!-- Actions -->
        <div class="hidden md:flex items-center space-x-3">
          <ClientOnly>
            <!-- Chat notifications -->
            <LoadingLink v-if="isAuthenticated" to="/chat" link-class="relative p-1.5 text-gray-400 hover:text-white" loading-message="Cargando chat...">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </LoadingLink>

            <!-- User Menu -->
            <div v-if="isAuthenticated" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-1.5 p-1.5 rounded-lg hover:bg-gray-800"
              >
                <img
                  :key="`avatar-${activeArtist?.id || 'user'}`"
                  :src="profilePicture"
                  :alt="displayName"
                  class="w-6 h-6 rounded-full"
                  @error="handleAvatarError"
                />
                <ChevronDown class="w-3 h-3 text-gray-400" />
              </button>

              <!-- User Dropdown -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1.5 z-50"
              >
                <!-- User Info -->
                <div class="px-3 py-1.5 border-b border-gray-700">
                  <div class="text-xs font-medium text-white">{{ displayName }}</div>
                  <div class="text-xs text-gray-400">{{ user?.email }}</div>
                </div>
                
                <!-- Active Artist Info -->
                <div v-if="hasActiveArtist" class="px-3 py-1.5 border-b border-gray-700">
                  <div class="flex items-center space-x-1.5">
                    <span class="text-xs text-orange-300">Perfil Activo:</span>
                    <span class="text-xs text-white font-medium">{{ activeArtist?.stage_name }}</span>
                  </div>
                </div>
                
                <!-- Menu Items -->
                <NuxtLink to="/profile" class="block px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700">
                  Perfil
                </NuxtLink>
                <NuxtLink to="/my-events" class="block px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700">
                  Mis Eventos
                </NuxtLink>
                <NuxtLink to="/artists/my-stats" class="block px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700">
                  Mis Estadísticas
                </NuxtLink>
                <!--            <NuxtLink to="/settings" class="block px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700">
                  Configuración
                </NuxtLink>
                -->
    
                <hr class="border-gray-700 my-1" />
                <button
                  @click="logout"
                  class="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <!-- Login Button -->
            <NuxtLink v-else to="/login" class="btn-primary text-sm px-3 py-1.5">
              Iniciar Sesión
            </NuxtLink>
            <template #fallback>
              <!-- Show login button during SSR -->
              <NuxtLink to="/login" class="btn-primary text-sm px-3 py-1.5">
                Iniciar Sesión
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="md:hidden bg-gray-800 border-t border-gray-700">
      <div class="px-3 py-1.5 space-y-0.5">
        <NuxtLink 
          to="/" 
          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Inicio
        </NuxtLink>
        <NuxtLink 
          to="/events" 
          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Eventos
        </NuxtLink>
        <NuxtLink 
          to="/venues" 
          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Venues
        </NuxtLink>
        <NuxtLink 
          to="/artists" 
          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Artistas
        </NuxtLink>
        <NuxtLink 
          v-if="isAuthenticated"
          to="/chat" 
          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Chat
        </NuxtLink>
        <NuxtLink 
          to="/venues/events" 
          class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Eventos por Venue
        </NuxtLink>
        <ClientOnly>
          <template v-if="isAuthenticated">
            <NuxtLink 
              to="/create" 
              class="block px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              @click="showMobileMenu = false"
            >
              Crear
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="block px-2 py-1.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded-md"
              @click="showMobileMenu = false"
            >
              Iniciar Sesión
            </NuxtLink>
          </template>
          <template #fallback>
            <NuxtLink 
              to="/login" 
              class="block px-2 py-1.5 text-sm text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded-md"
              @click="showMobileMenu = false"
            >
              Iniciar Sesión
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Search, Bell, ChevronDown, Menu } from 'lucide-vue-next';
import { nextTick, onMounted, onUnmounted } from 'vue';
import { useActiveArtistStore } from '~/store/activeArtist';

const { user, isAuthenticated, logout } = useAuth();
const { activeArtist, hasActiveArtist, setActiveArtist, clearActiveArtist } = useActiveArtistStore();
const { convertToProxyUrl } = useImageProxy();
const showUserMenu = ref(false);
const showMobileMenu = ref(false);


// Force reactivity by creating a reactive trigger
const avatarUpdateTrigger = ref(0);

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (!img.src.includes('gravatar.com')) {
    img.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=32';
  }
};

const profilePicture = computed(() => {
  // Access the trigger to force reactivity
  avatarUpdateTrigger.value;
  
  // Force reactivity by accessing the values
  const hasActive = hasActiveArtist.value;
  const active = activeArtist.value;
  const userAvatar = user?.value?.avatar;
  
  if (hasActive && active?.profile_picture_url) {
    const convertedUrl = convertToProxyUrl(active.profile_picture_url);
    return convertedUrl;
  }
  
  return userAvatar || 'https://www.gravatar.com/avatar/default?d=identicon&s=32';
});

const displayName = computed(() => {
  if (hasActiveArtist.value && activeArtist.value?.stage_name) {
    return activeArtist.value.stage_name;
  }
  return user?.value?.name || 'Usuario';
});

// Watch for changes in active artist to force reactivity
watch([activeArtist, hasActiveArtist], (newValues, oldValues) => {
  // Force a re-render by updating the trigger
  avatarUpdateTrigger.value++;
  nextTick(() => {
    // Profile picture updated
  });
}, { deep: true, immediate: true });

// Listen for custom events from other components
onMounted(() => {
  const handleActiveArtistChange = (event: CustomEvent) => {
    avatarUpdateTrigger.value++;
    nextTick(() => {
      // Profile picture updated via event
    });
  };
  
  window.addEventListener('activeArtistChanged', handleActiveArtistChange as EventListener);
  
  onUnmounted(() => {
    window.removeEventListener('activeArtistChanged', handleActiveArtistChange as EventListener);
  });
});
</script>