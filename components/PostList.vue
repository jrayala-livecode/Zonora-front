<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      <span class="ml-3 text-gray-400">Cargando comentarios...</span>
    </div>

    <!-- Posts List -->
    <div v-else-if="posts.length > 0" class="space-y-3">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
      >
        <!-- Post Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-3">
            <!-- Author Avatar -->
            <div class="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
              <span class="text-white font-semibold text-sm">
                {{ getInitials(post.author.name) }}
              </span>
            </div>
            
            <!-- Author Info -->
            <div>
              <p class="text-white font-semibold">{{ post.author.name }}</p>
              <p class="text-gray-400 text-xs" :title="formatFullDate(post.created_at)">
                {{ formatRelativeTime(post.created_at) }}
              </p>
            </div>
          </div>

          <!-- Delete Button (only for own posts) -->
          <button
            v-if="canDelete(post)"
            @click="handleDelete(post.id)"
            :disabled="deletingPostId === post.id"
            class="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-gray-700"
            title="Eliminar comentario"
          >
            <svg v-if="deletingPostId === post.id" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v2m0 12v2m8-8h-2M6 12H4m12.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Post Content -->
        <div class="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
          {{ post.content }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
      <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p class="text-gray-400 text-sm">No hay comentarios aún</p>
      <p class="text-gray-500 text-xs mt-1">¡Sé el primero en comentar!</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
      <p class="text-red-400 text-sm">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Post } from '~/composables/types/types';

const props = defineProps<{
  postableType: 'venue' | 'artist' | 'event';
  postableId: number;
}>();

const { posts, isLoading, fetchPosts, deletePost } = usePosts();
const { user } = useAuth();

// State
const errorMessage = ref('');
const deletingPostId = ref<number | null>(null);

// Load posts on mount
onMounted(async () => {
  try {
    await fetchPosts(props.postableType, props.postableId);
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al cargar los comentarios';
  }
});

// Get user initials
const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Check if current user can delete a post
const canDelete = (post: Post): boolean => {
  return user.value !== null && user.value.id === post.user_id;
};

// Format relative time (e.g., "2 minutes ago")
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Justo ahora';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `Hace ${years} año${years > 1 ? 's' : ''}`;
  }
};

// Format full date for tooltip
const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Handle post deletion
const handleDelete = async (postId: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
    return;
  }

  deletingPostId.value = postId;
  errorMessage.value = '';

  try {
    await deletePost(postId);
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al eliminar el comentario';
  } finally {
    deletingPostId.value = null;
  }
};
</script>

