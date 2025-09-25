<template>
  <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-left">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">Z</span>
            </div>
            <span class="text-xl font-bold text-white">Zonora</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink to="/" class="nav-link transform hover:scale-110 transition-all duration-300">Inicio</NuxtLink>
          <NuxtLink to="/events" class="nav-link transform hover:scale-110 transition-all duration-300">Eventos</NuxtLink>
          <NuxtLink to="/venues" class="nav-link transform hover:scale-110 transition-all duration-300">Venues</NuxtLink>
          <NuxtLink to="/artists" class="nav-link transform hover:scale-110 transition-all duration-300">Artistas</NuxtLink>
          <ClientOnly>
            <NuxtLink v-if="isAuthenticated" to="/create" class="nav-link transform hover:scale-110 transition-all duration-300">Crear</NuxtLink>
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
        <div class="hidden md:flex items-center space-x-4">
          <ClientOnly>
            <!-- Notifications -->
            <button v-if="isAuthenticated" class="relative p-2 text-gray-400 hover:text-white">
              <Bell class="w-5 h-5" />
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            <div v-if="isAuthenticated" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800"
              >
                <img
                  :src="user?.avatar || 'https://www.gravatar.com/avatar/default?d=identicon&s=32'"
                  :alt="user?.name || 'Usuario'"
                  class="w-8 h-8 rounded-full"
                  @error="handleAvatarError"
                />
                <ChevronDown class="w-4 h-4 text-gray-400" />
              </button>

              <!-- User Dropdown -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50"
              >
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Perfil
                </NuxtLink>
                <NuxtLink to="/my-events" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Mis Eventos
                </NuxtLink>
                <!--            <NuxtLink to="/settings" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Configuración
                </NuxtLink>
                -->
    
                <hr class="border-gray-700 my-1" />
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <!-- Login Button -->
            <NuxtLink v-else to="/login" class="btn-primary">
              Iniciar Sesión
            </NuxtLink>
            <template #fallback>
              <!-- Show login button during SSR -->
              <NuxtLink to="/login" class="btn-primary">
                Iniciar Sesión
              </NuxtLink>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="md:hidden bg-gray-800 border-t border-gray-700">
      <div class="px-4 py-2 space-y-1">
        <NuxtLink 
          to="/" 
          class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Inicio
        </NuxtLink>
        <NuxtLink 
          to="/events" 
          class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Eventos
        </NuxtLink>
        <NuxtLink 
          to="/venues" 
          class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Venues
        </NuxtLink>
        <NuxtLink 
          to="/artists" 
          class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Artistas
        </NuxtLink>
        <NuxtLink 
          to="/venues/events" 
          class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
          @click="showMobileMenu = false"
        >
          Eventos por Venue
        </NuxtLink>
        <ClientOnly>
          <template v-if="isAuthenticated">
            <NuxtLink 
              to="/create" 
              class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
              @click="showMobileMenu = false"
            >
              Crear
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="block px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded-md"
              @click="showMobileMenu = false"
            >
              Iniciar Sesión
            </NuxtLink>
          </template>
          <template #fallback>
            <NuxtLink 
              to="/login" 
              class="block px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded-md"
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

const { user, isAuthenticated, logout } = useAuth();
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const handleAvatarError = (event: Event) => {
  console.log('Avatar load error, falling back to Gravatar');
  const img = event.target as HTMLImageElement;
  if (!img.src.includes('gravatar.com')) {
    img.src = 'https://www.gravatar.com/avatar/default?d=identicon&s=32';
  }
};
</script>