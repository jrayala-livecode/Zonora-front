<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p class="text-gray-400">Gestiona tu cuenta y configuración</p>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
        <p class="text-green-400">{{ successMessage }}</p>
        <button @click="successMessage = ''" class="text-green-400 hover:text-green-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
                </button>
              </div>

      <div v-if="errorMessage" class="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
        <p class="text-red-400">{{ errorMessage }}</p>
        <button @click="errorMessage = ''" class="text-red-400 hover:text-red-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-gray-800 rounded-t-lg border-b border-gray-700">
        <nav class="flex space-x-1 p-2" aria-label="Tabs">
            <button
            @click="activeTab = 'account'"
              :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === 'account'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Mi Cuenta</span>
            </span>
          </button>

          <button
            @click="activeTab = 'public'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === 'public'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              <span>Perfil Público</span>
            </span>
          </button>

          <button
            @click="activeTab = 'artists'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === 'artists'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>Mis Artistas</span>
            </span>
              </button>
        </nav>
            </div>

      <!-- Tab Content -->
      <div class="bg-gray-900 rounded-b-lg p-6">
        <!-- Tab 1: Account Settings -->
        <div v-show="activeTab === 'account'">
          <AccountSettingsTab
            @success="handleSuccess"
            @error="handleError"
          />
        </div>

        <!-- Tab 2: Public Profile -->
        <div v-show="activeTab === 'public'">
          <PublicProfileTab
            @success="handleSuccess"
            @error="handleError"
                  />
                </div>
                
        <!-- Tab 3: My Artists -->
        <div v-show="activeTab === 'artists'">
          <MyArtistsTab
            @success="handleSuccess"
            @error="handleError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  middleware: 'auth'
});

const { user } = useAuth();

// Tab state
const activeTab = ref<'account' | 'public' | 'artists'>('account');

// Messages
const successMessage = ref('');
const errorMessage = ref('');

const handleSuccess = (message: string) => {
  successMessage.value = message;
  errorMessage.value = '';
  
  // Auto-hide after 5 seconds
    setTimeout(() => {
    successMessage.value = '';
  }, 5000);

  // Scroll to top to see message
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleError = (message: string) => {
  errorMessage.value = message;
  successMessage.value = '';
  
  // Scroll to top to see message
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// SEO
useHead({
  title: 'Mi Perfil - Zonora',
  meta: [
    {
      name: 'description',
      content: 'Gestiona tu perfil de usuario en Zonora'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
});
</script>

<style scoped>
/* Smooth tab transitions */
[v-show] {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
