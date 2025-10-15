<template>
  <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <!-- Textarea -->
      <div>
        <textarea
          v-model="content"
          placeholder="Escribe un comentario..."
          rows="3"
          maxlength="1000"
          class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
          :disabled="isSubmitting"
        ></textarea>
        <div class="flex justify-between items-center mt-2">
          <span class="text-sm text-gray-400">
            {{ content.length }}/1000 caracteres
          </span>
        </div>
      </div>

      <!-- hCaptcha Container -->
      <div v-if="showCaptcha" id="post-hcaptcha-container" class="my-4"></div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isSubmitting || !content.trim() || (showCaptcha && !captchaToken)"
          class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Publicando...</span>
          <span v-else>Publicar Comentario</span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
        <p class="text-red-400 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
        <p class="text-green-400 text-sm">{{ successMessage }}</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

declare global {
  interface Window {
    hcaptcha: any;
  }
}

const props = defineProps<{
  postableType: 'venue' | 'artist' | 'event';
  postableId: number;
}>();

const { createPost, requiresCaptcha, fetchPosts } = usePosts();

// State
const content = ref('');
const isSubmitting = ref(false);
const showCaptcha = ref(false);
const captchaToken = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const hcaptchaWidgetId = ref<string | null>(null);

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || process.dev || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

// Load hCaptcha script
function loadHCaptchaScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.hcaptcha) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

// Render hCaptcha widget
function renderHCaptcha() {
  if (typeof window === 'undefined' || !window.hcaptcha) return;
  
  const container = document.getElementById('post-hcaptcha-container');
  if (!container) return;

  // Clear any existing widget
  container.innerHTML = '';

  try {
    hcaptchaWidgetId.value = window.hcaptcha.render('post-hcaptcha-container', {
      sitekey: 'a19acdc8-2292-45d2-bc3e-c5644102f500',
      callback: (token: string) => {
        captchaToken.value = token;
      },
      'expired-callback': () => {
        captchaToken.value = '';
      },
    });
  } catch (error) {
    console.error('Error rendering hCaptcha:', error);
  }
}

// Watch for requiresCaptcha changes
watch(requiresCaptcha, (newValue) => {
  if (newValue) {
    showCaptcha.value = true;
    // Wait for next tick to ensure DOM is updated
    setTimeout(() => {
      renderHCaptcha();
    }, 100);
  }
});

// Handle form submission
const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!content.value.trim()) {
    errorMessage.value = 'El comentario no puede estar vacío';
    return;
  }

  isSubmitting.value = true;

  try {
    // Use dev bypass token in development if captcha is shown
    const tokenToUse = isDev && showCaptcha.value && !captchaToken.value 
      ? 'dev-bypass-token' 
      : captchaToken.value;

    await createPost(
      props.postableType,
      props.postableId,
      content.value,
      tokenToUse || undefined
    );

    // Success
    successMessage.value = '¡Comentario publicado exitosamente!';
    content.value = '';
    captchaToken.value = '';
    showCaptcha.value = false;

    // Reset hCaptcha if it was shown
    if (typeof window !== 'undefined' && window.hcaptcha && hcaptchaWidgetId.value !== null) {
      try {
        window.hcaptcha.reset(hcaptchaWidgetId.value);
      } catch (e) {
        // Ignore reset errors
      }
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

    // Refresh posts list
    await fetchPosts(props.postableType, props.postableId);
  } catch (error: any) {
    errorMessage.value = error.message || 'Error al publicar el comentario';
    
    // If captcha is required and not shown, show it
    if (requiresCaptcha.value && !showCaptcha.value) {
      showCaptcha.value = true;
      setTimeout(() => {
        renderHCaptcha();
      }, 100);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Load hCaptcha on mount
onMounted(async () => {
  await loadHCaptchaScript();
});
</script>

