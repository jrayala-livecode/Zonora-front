<template>
  <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
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
          <NuxtLink to="/explore" class="nav-link transform hover:scale-110 transition-all duration-300">Explorar</NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/create" class="nav-link transform hover:scale-110 transition-all duration-300">Crear</NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/my-events" class="nav-link transform hover:scale-110 transition-all duration-300">Mis Eventos</NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="hidden md:flex relative">
            <input
              type="text"
              placeholder="Buscar..."
              class="input-field w-64 pl-10"
              v-model="searchQuery"
            />
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

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
                :src="user?.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400'"
                :alt="user?.name"
                class="w-8 h-8 rounded-full"
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
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Search, Bell, ChevronDown } from 'lucide-vue-next';

const { user, isAuthenticated, logout } = useAuth();
const { searchQuery } = useEvents();
const showUserMenu = ref(false);
</script>