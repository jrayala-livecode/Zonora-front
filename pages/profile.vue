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

          <button
            @click="activeTab = 'event-organizer'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === 'event-organizer'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Organizador</span>
            </span>
          </button>

          <button
            @click="activeTab = 'venue-admin'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === 'venue-admin'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Venue Admin</span>
            </span>
          </button>

          <button
            @click="activeTab = 'stage-worker'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === 'stage-worker'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Técnico</span>
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

        <!-- Tab 4: Event Organizer -->
        <div v-show="activeTab === 'event-organizer'">
          <EventOrganizerTab
            @success="handleSuccess"
            @error="handleError"
          />
        </div>

        <!-- Tab 5: Venue Admin -->
        <div v-show="activeTab === 'venue-admin'">
          <VenueAdminTab
            @success="handleSuccess"
            @error="handleError"
          />
        </div>

        <!-- Tab 6: Stage Worker -->
        <div v-show="activeTab === 'stage-worker'">
          <StageWorkerTab
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
const activeTab = ref<'account' | 'public' | 'artists' | 'event-organizer' | 'venue-admin' | 'stage-worker'>('account');

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
