<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-2xl">Z</span>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-white">Iniciar Sesión en Zonora</h2>
      </div>

      <!-- Login Form -->
      <div class="bg-gray-800 rounded-lg p-8 shadow-lg">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username -->
          <div>
            <input
              v-model="form.username"
              type="text"
              placeholder="Usuario"
              class="input-field w-full"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="input-field w-full"
              required
            />
          </div>

          <!-- hCaptcha -->
          <div>
            <div class="bg-gray-700 rounded-lg p-4 text-center">
              <div class="text-gray-400 text-sm">hCaptcha</div>
              <div class="text-xs text-gray-500 mt-1">Verificación de seguridad</div>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Iniciando sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>

          <!-- Divider -->
          <div class="text-center">
            <span class="text-gray-400 text-sm">o</span>
          </div>

          <!-- Social Login -->
          <button
            type="button"
            class="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
          </button>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="text-gray-400 text-sm">
              ¿No tienes una cuenta?
              <NuxtLink to="/register" class="text-orange-500 hover:text-orange-400">
                Regístrate
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout configuration
definePageMeta({
  layout: false
});

const { login } = useAuth();

const form = reactive({
  username: '',
  email: '',
});

const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  
  try {
    await login({
      email: form.email,
      password: 'password' // En un app real, sería form.password
    });
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

// SEO
useHead({
  title: 'Iniciar Sesión - Zonora',
  meta: [
    { name: 'description', content: 'Inicia sesión en Zonora para acceder a todas las funcionalidades' }
  ]
});
</script>