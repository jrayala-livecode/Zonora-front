<template>
  <button
    @click="toggleFollow"
    :disabled="loading || !isAuthenticated"
    :class="[
      'inline-flex items-center px-4 py-2 text-sm font-medium rounded transition-colors',
      isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700',
      (loading || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : 'text-white'
    ]"
  >
    <svg v-if="loading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
    <svg v-else-if="isFollowing" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
    </svg>
    {{ isFollowing ? 'Siguiendo' : 'Seguir' }}
  </button>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user';
import { useArtistFollow } from '~/composables/useArtistFollow';

interface Props {
  artistId: number;
  initialFollowStatus?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ followChanged: [isFollowing: boolean] }>();

const { isAuthenticated } = useUserStore();
const { followArtist, unfollowArtist } = useArtistFollow();

const loading = ref(false);
const isFollowing = ref(props.initialFollowStatus || false);

const toggleFollow = async () => {
  if (!isAuthenticated || loading.value) return;

  loading.value = true;
  try {
    if (isFollowing.value) {
      await unfollowArtist(props.artistId);
      isFollowing.value = false;
    } else {
      await followArtist(props.artistId);
      isFollowing.value = true;
    }
    emit('followChanged', isFollowing.value);
  } catch (error) {
    console.error('Error toggling follow:', error);
  } finally {
    loading.value = false;
  }
};

watch(() => props.initialFollowStatus, (newStatus) => {
  isFollowing.value = newStatus || false;
});
</script>
