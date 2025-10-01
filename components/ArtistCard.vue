<template>
  <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
    <!-- Artist Image -->
    <div class="relative h-32 bg-gradient-to-br from-orange-500 to-red-600">
      <img
        v-if="artist.profile_picture_url"
        :src="$convertImageUrl(artist.profile_picture_url)"
        :alt="artist.stage_name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-10 h-10 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-2 right-2">
        <span 
          :class="[
            'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
            artist.is_public 
              ? 'bg-green-900/80 text-green-200' 
              : 'bg-red-900/80 text-red-200'
          ]"
        >
          {{ artist.is_public ? 'Público' : 'Privado' }}
        </span>
      </div>

      <!-- Subscription Badge -->
      <div v-if="artist.has_active_subscription" class="absolute top-2 left-2">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-900/80 text-orange-200">
          Activo
        </span>
      </div>
    </div>

    <!-- Artist Info -->
    <div class="p-3">
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <h3 class="text-sm font-bold text-white mb-0.5">{{ artist.stage_name }}</h3>
          <p v-if="artist.user" class="text-gray-400 text-xs">{{ artist.user.name }}</p>
        </div>
      </div>

      <!-- Bio -->
      <p class="text-gray-300 text-xs mb-2 line-clamp-2">
        {{ artist.bio || 'Sin biografía disponible' }}
      </p>

      <!-- Genres -->
      <div v-if="artist.genres && artist.genres.length > 0" class="mb-2">
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="genre in artist.genres.slice(0, 2)" 
            :key="genre"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300"
          >
            {{ genre }}
          </span>
          <span v-if="artist.genres.length > 2" class="text-gray-500 text-xs">
            +{{ artist.genres.length - 2 }}
          </span>
        </div>
      </div>

      <!-- Social Links -->
      <div v-if="artist.social_links && artist.social_links.length > 0" class="mb-2">
        <div class="flex space-x-1.5">
          <a 
            v-for="(link, index) in artist.social_links.slice(0, 2)" 
            :key="index"
            :href="link" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-orange-500 hover:text-orange-400 transition-colors duration-200"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Action Button -->
      <NuxtLink
        :to="`/artists/${artist.id}`"
        class="w-full inline-flex items-center justify-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded transition-colors duration-200"
      >
        Ver Perfil
        <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Artist {
  id: string;
  stage_name: string;
  bio?: string;
  genres?: string[];
  social_links?: string[];
  profile_picture_url?: string;
  is_public: boolean;
  has_active_subscription?: boolean;
  user?: {
    name: string;
    email: string;
  };
}

defineProps<{
  artist: Artist;
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
