<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-400 text-lg">Cargando perfil...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-red-400 mb-2">Error al cargar perfil</h3>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <button
          @click="loadProfile"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- User Profile Content -->
      <div v-else-if="userProfile" class="space-y-6">
        
        <!-- Hero Section with Cover Image -->
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <!-- Cover Image -->
          <div class="relative h-48 md:h-56 bg-gradient-to-br from-orange-500 to-red-600">
            <img
              v-if="userProfile.cover_image_url"
              :src="userProfile.cover_image_url"
              alt="Cover"
              class="w-full h-full object-cover"
            />
            
            <!-- Privacy Badge -->
            <div class="absolute top-3 right-3">
              <span class="px-3 py-1 text-xs bg-gray-900/80 text-white rounded-full">
                {{ userProfile.profile_public ? '🌐 Público' : '🔒 Privado' }}
              </span>
            </div>

            <!-- Edit Button (for own profile) -->
            <div v-if="isOwnProfile" class="absolute bottom-3 right-3">
              <NuxtLink
                to="/profile"
                class="px-4 py-2 bg-white/90 hover:bg-white text-gray-900 text-sm font-medium rounded-lg transition shadow-lg"
              >
                Editar Perfil
              </NuxtLink>
            </div>

            <!-- Avatar positioned over the gradient -->
            <div class="absolute -bottom-12 left-6">
              <img
                :src="userProfile.avatar_url"
                :alt="userProfile.name"
                class="w-24 h-24 rounded-full border-4 border-gray-800 shadow-xl"
              />
            </div>
          </div>

          <!-- Profile Info -->
          <div class="p-6 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 pt-16">
            
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-white">
                {{ userProfile.name }}
              </h1>
              <p v-if="userProfile.username" class="text-gray-400 text-sm mt-1">
                @{{ userProfile.username }}
              </p>
              <p v-if="userProfile.location" class="text-gray-400 text-sm flex items-center mt-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ userProfile.location }}
              </p>
              <p v-if="userProfile.stats" class="text-gray-500 text-xs mt-1">
                Miembro {{ userProfile.stats.member_since }}
              </p>
            </div>

            <!-- Message Button -->
            <button
              v-if="!isOwnProfile && user"
              @click="startConversation"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-lg"
            >
              💬 Enviar Mensaje
            </button>
          </div>
        </div>

        <!-- Bio Section -->
        <div v-if="userProfile.bio" class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 class="text-sm font-semibold text-white mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Acerca de
          </h3>
          <p class="text-gray-300 text-sm leading-relaxed">{{ userProfile.bio }}</p>
        </div>

        <!-- Stats Grid -->
        <div v-if="userProfile.stats" class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div class="bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-700 hover:border-blue-500 transition">
            <div class="text-3xl font-bold text-blue-400">
              {{ userProfile.stats.artists_count }}
            </div>
            <div class="text-xs text-gray-400 mt-1">Artistas</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-700 hover:border-purple-500 transition">
            <div class="text-3xl font-bold text-purple-400">
              {{ userProfile.stats.events_organized }}
            </div>
            <div class="text-xs text-gray-400 mt-1">Eventos</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-700 hover:border-green-500 transition">
            <div class="text-3xl font-bold text-green-400">
              {{ userProfile.stats.events_interested }}
            </div>
            <div class="text-xs text-gray-400 mt-1">Interesados</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-700 hover:border-orange-500 transition">
            <div class="text-3xl font-bold text-orange-400">
              {{ userProfile.stats.artists_following }}
            </div>
            <div class="text-xs text-gray-400 mt-1">Siguiendo</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4 text-center shadow-lg border border-gray-700 hover:border-pink-500 transition">
            <div class="text-3xl font-bold text-pink-400">
              {{ userProfile.stats.posts_count }}
            </div>
            <div class="text-xs text-gray-400 mt-1">Comentarios</div>
          </div>
        </div>

        <!-- User's Events -->
        <div v-if="userProfile.events" class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 class="text-lg font-semibold text-white mb-4 md:mb-0 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Eventos Organizados ({{ userProfile.events.length }})
            </h3>
            
            <!-- Filter Toggle -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-400">Mostrar:</span>
              <button
                @click="showPastEvents = false"
                :class="[
                  'px-3 py-1 text-xs rounded-full transition',
                  !showPastEvents 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                Próximos
              </button>
              <button
                @click="showPastEvents = true"
                :class="[
                  'px-3 py-1 text-xs rounded-full transition',
                  showPastEvents 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                Pasados
              </button>
            </div>
          </div>

          <!-- Events Grid -->
          <div v-if="userProfile.events.length > 0" class="space-y-4">
            <NuxtLink
              v-for="event in paginatedEvents"
              :key="event.id"
              :to="`/events/${event.id}`"
              class="block bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div class="flex items-start space-x-4">
                <!-- Event Image -->
                <div class="flex-shrink-0">
                  <img
                    v-if="event.image_url && !imageErrors[event.id]"
                    :src="event.image_url"
                    :alt="event.name"
                    class="w-16 h-16 rounded-lg object-cover"
                    @error="handleImageError(event.id)"
                  />
                  <div v-else class="w-16 h-16 rounded-lg bg-orange-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <!-- Event Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-white truncate">{{ event.name }}</h4>
                  <p class="text-sm text-gray-400 mt-1">{{ formatEventDate(event.date) }}</p>
                  <p v-if="event.venue" class="text-sm text-gray-400">{{ event.venue.name }}</p>
                  <p v-if="event.description" class="text-sm text-gray-300 mt-2 line-clamp-2">{{ event.description }}</p>
                </div>

                <!-- Event Status -->
                <div class="flex-shrink-0">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      isEventPast(event.date)
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-green-600 text-green-100'
                    ]"
                  >
                    {{ isEventPast(event.date) ? 'Finalizado' : 'Próximo' }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- No Events Message -->
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-400 mb-2">No hay eventos</h3>
            <p class="text-gray-500">Este usuario no ha organizado ningún evento aún.</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-400">
              Mostrando {{ (currentPage - 1) * 5 + 1 }} - {{ Math.min(currentPage * 5, filteredEvents.length) }} de {{ filteredEvents.length }} eventos
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                :class="[
                  'px-3 py-1 text-sm rounded-lg transition',
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                ]"
              >
                Anterior
              </button>
              <span class="text-sm text-gray-400">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                :class="[
                  'px-3 py-1 text-sm rounded-lg transition',
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                ]"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div v-if="userProfile.social_links && userProfile.social_links.length > 0" class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 class="text-sm font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Redes Sociales
          </h3>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="link in userProfile.social_links"
              :key="link.platform"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition shadow"
            >
              <span class="text-xl">{{ getSocialIcon(link.platform) }}</span>
              <span class="text-white text-sm capitalize">{{ link.platform }}</span>
            </a>
          </div>
        </div>

        <!-- User's Artists -->
        <div v-if="userProfile.artists && userProfile.artists.length > 0" class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            Sus Artistas
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="artist in userProfile.artists"
              :key="artist.id"
              :to="`/artists/${artist.id}`"
              class="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              <img
                v-if="artist.profile_picture_url"
                :src="artist.profile_picture_url"
                :alt="artist.stage_name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div v-else class="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                {{ artist.stage_name?.[0] }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-white truncate">{{ artist.stage_name }}</p>
                <p class="text-xs text-gray-400">{{ artist.view_count || 0 }} vistas</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Following Artists -->
        <div v-if="userProfile.followed_artists && userProfile.followed_artists.length > 0" class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Artistas que Sigue
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <NuxtLink
              v-for="artist in userProfile.followed_artists"
              :key="artist.id"
              :to="`/artists/${artist.id}`"
              class="flex flex-col items-center space-y-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-center"
            >
              <img
                v-if="artist.profile_picture_url"
                :src="artist.profile_picture_url"
                :alt="artist.stage_name"
                class="w-16 h-16 rounded-full object-cover"
              />
              <div v-else class="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xl">
                {{ artist.stage_name?.[0] }}
              </div>
              <p class="font-medium text-white text-sm truncate w-full">{{ artist.stage_name }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { fetchUserProfile, fetchUserEvents, userProfile, isLoading, error, clearProfile } = useUserProfile();
const { user } = useAuth();

const idOrUsername = computed(() => route.params.id as string);

const isOwnProfile = computed(() => {
  return user.value && userProfile.value && user.value.id === userProfile.value.id;
});

// Events pagination and filtering
const showPastEvents = ref(false);
const currentPage = ref(1);
const eventsPerPage = 5;
const imageErrors = ref<Record<string, boolean>>({});

const filteredEvents = computed(() => {
  if (!userProfile.value?.events) return [];
  
  const now = new Date();
  return userProfile.value.events.filter(event => {
    const eventDate = new Date(event.date);
    return showPastEvents.value ? eventDate < now : eventDate >= now;
  });
});

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * eventsPerPage;
  const end = start + eventsPerPage;
  return filteredEvents.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / eventsPerPage);
});

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isEventPast = (dateString: string) => {
  return new Date(dateString) < new Date();
};

const handleImageError = (eventId: string) => {
  imageErrors.value[eventId] = true;
};

const loadProfile = async () => {
  await fetchUserProfile(idOrUsername.value);
  
  // Also fetch user events if profile was loaded successfully
  if (userProfile.value) {
    try {
      const eventsResponse = await fetchUserEvents(idOrUsername.value);
      console.log('Events response:', eventsResponse);
      if (eventsResponse && eventsResponse.data) {
        // Add events to the user profile
        userProfile.value.events = eventsResponse.data;
        console.log('Events added to profile:', userProfile.value.events);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  }
};

const startConversation = () => {
  if (userProfile.value) {
    router.push(`/chat/${userProfile.value.id}`);
  }
};

const getSocialIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    instagram: '📷',
    twitter: '🐦',
    facebook: '📘',
    tiktok: '🎵',
    youtube: '📺',
    spotify: '🎧',
    soundcloud: '🎶',
  };
  return icons[platform] || '🔗';
};

// Reset pagination when filter changes
watch(showPastEvents, () => {
  currentPage.value = 1;
});

onMounted(() => {
  clearProfile();
  loadProfile();
});

// SEO
useHead(() => ({
  title: userProfile.value 
    ? `${userProfile.value.name}${userProfile.value.username ? ` (@${userProfile.value.username})` : ''} - Zonora`
    : 'Perfil de Usuario - Zonora',
  meta: [
    {
      name: 'description',
      content: userProfile.value?.bio || `Perfil de ${userProfile.value?.name || 'usuario'} en Zonora`
    }
  ]
}));
</script>

