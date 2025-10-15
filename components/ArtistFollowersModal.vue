<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="close">
    <div class="bg-gray-800 rounded-lg max-w-md w-full mx-4 max-h-[80vh] flex flex-col" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-lg font-semibold text-white">
          Seguidores ({{ totalFollowers }})
        </h3>
        <button @click="close" class="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>

        <div v-else-if="followers.length === 0" class="text-center py-8 text-gray-400">
          No hay seguidores aún
        </div>

        <div v-else class="space-y-3">
          <div v-for="follower in followers" :key="follower.id" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <img 
              v-if="follower.avatar_url"
              :src="follower.avatar_url"
              :alt="follower.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div v-else class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <span class="text-white font-medium">{{ follower.name }}</span>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMorePages && !loading" class="mt-4 text-center">
          <button 
            @click="loadMore"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Cargar más
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Follower {
  id: number;
  name: string;
  avatar_url?: string;
}

interface Props {
  isOpen: boolean;
  artistId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const { getFollowers } = useArtistFollowers();

const followers = ref<Follower[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalFollowers = ref(0);
const hasMorePages = ref(false);

const close = () => emit('close');

const loadFollowers = async (page = 1) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const data = await getFollowers(props.artistId, page);
    if (page === 1) {
      followers.value = data.data;
    } else {
      followers.value.push(...data.data);
    }
    totalFollowers.value = data.pagination.total;
    hasMorePages.value = data.pagination.has_more_pages;
    currentPage.value = page;
  } catch (error) {
    console.error('Error loading followers:', error);
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (hasMorePages.value) {
    loadFollowers(currentPage.value + 1);
  }
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadFollowers(1);
  } else {
    followers.value = [];
    currentPage.value = 1;
  }
});
</script>

