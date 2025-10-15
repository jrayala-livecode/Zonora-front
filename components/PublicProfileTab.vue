<template>
  <div class="space-y-6">
    
    <!-- Preview Link -->
    <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-blue-400 font-medium">Vista previa de tu perfil público</p>
          <p class="text-sm text-gray-400 mt-1">
            Así verán otros usuarios tu perfil
          </p>
        </div>
        <NuxtLink
          :to="`/users/${user?.id}`"
          target="_blank"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
        >
          Ver Perfil
        </NuxtLink>
      </div>
    </div>

    <!-- Basic Info Section -->
    <div class="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 class="text-xl font-semibold text-white mb-4">Información Pública</h2>
      
      <div class="space-y-4">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Nombre de Usuario
          </label>
          <input
            v-model="form.username"
            type="text"
            placeholder="@username (3-20 caracteres)"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-400 mt-1">
            Solo letras, números y guiones bajos. URL: /users/<span class="text-blue-400">{{ form.username || user?.id }}</span>
          </p>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Ubicación
          </label>
          <input
            v-model="form.location"
            type="text"
            placeholder="Ciudad, País"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Biografía Pública
          </label>
          <textarea
            v-model="form.bio"
            rows="4"
            maxlength="500"
            placeholder="Cuéntanos sobre ti, tus intereses musicales..."
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          <p class="text-xs text-gray-400 mt-1">{{ form.bio?.length || 0 }}/500 caracteres (diferente a la descripción de cuenta)</p>
        </div>

        <!-- Privacy Toggle -->
        <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <p class="text-white font-medium">Perfil Público</p>
            <p class="text-sm text-gray-400">Permitir que otros usuarios vean tu perfil</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="form.profile_public"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Social Links Section -->
    <div class="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 class="text-xl font-semibold text-white mb-4">Redes Sociales</h2>
      
      <div class="space-y-4">
        <div v-for="(link, index) in form.social_links" :key="index" class="flex items-center space-x-3">
          <select
            v-model="link.platform"
            class="w-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="instagram">📷 Instagram</option>
            <option value="twitter">🐦 Twitter</option>
            <option value="facebook">📘 Facebook</option>
            <option value="tiktok">🎵 TikTok</option>
            <option value="youtube">📺 YouTube</option>
            <option value="spotify">🎧 Spotify</option>
            <option value="soundcloud">🎶 SoundCloud</option>
          </select>
          
          <input
            v-model="link.url"
            type="url"
            placeholder="https://..."
            class="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="button"
            @click="removeSocialLink(index)"
            class="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            title="Eliminar enlace"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <button
          v-if="form.social_links.length < 5"
          type="button"
          @click="addSocialLink"
          class="w-full py-3 border-2 border-dashed border-gray-600 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-lg transition"
        >
          + Agregar Red Social
        </button>
        <p v-else class="text-xs text-gray-400 text-center">Máximo 5 enlaces permitidos</p>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="handleSave"
        :disabled="isSaving"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSaving">Guardando...</span>
        <span v-else>Guardar Perfil Público</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { SocialLink } from '~/composables/types/types';

const emit = defineEmits<{
  success: [message: string];
  error: [message: string];
}>();

const { updateProfileSettings, updateSocialLinks } = useUserProfile();
const { user } = useAuth();

const isSaving = ref(false);

const form = reactive({
  username: '',
  location: '',
  bio: '',
  profile_public: true,
  social_links: [] as SocialLink[],
});

onMounted(() => {
  if (user.value) {
    form.username = user.value.username || '';
    form.location = user.value.location || '';
    form.bio = user.value.bio || '';
    form.profile_public = user.value.profile_public !== false;
    form.social_links = user.value.social_links ? [...user.value.social_links] : [];
  }
});

const addSocialLink = () => {
  if (form.social_links.length < 5) {
    form.social_links.push({
      platform: 'instagram',
      url: ''
    });
  }
};

const removeSocialLink = (index: number) => {
  form.social_links.splice(index, 1);
};

const handleSave = async () => {
  isSaving.value = true;

  try {
    // Update settings
    await updateProfileSettings({
      username: form.username || undefined,
      location: form.location || undefined,
      bio: form.bio || undefined,
      profile_public: form.profile_public,
    });

    // Update social links separately
    const filteredLinks = form.social_links.filter(link => link.url.trim() !== '');
    await updateSocialLinks(filteredLinks);

    emit('success', '¡Perfil público actualizado exitosamente!');
  } catch (error: any) {
    emit('error', error.message || 'Error al actualizar el perfil público');
  } finally {
    isSaving.value = false;
  }
};
</script>

