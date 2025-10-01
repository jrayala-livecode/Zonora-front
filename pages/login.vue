<template  v-if="!user">
 
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
      <transition name="fade" mode="out-in">
        <div
         
          :key="formKey"
          class="bg-gray-800 rounded-lg p-8 shadow-lg transition-opacity duration-500"
          :class="{ 'opacity-0 pointer-events-none': isFadingOut }"
        >
          <form @submit.prevent="handleLogin" class="space-y-6">
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

            <!-- Password -->
            <div>
              <input
                v-model="form.password"
                type="password"
                placeholder="Contraseña"
                class="input-field w-full"
                required
              />
            </div>

            <!-- hCaptcha -->
            <div id="hcaptcha-container" class="my-4"></div>

            <!-- Dev Admin Login (only in development) -->
            <div v-if="isDev" class="my-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p class="text-yellow-400 text-sm mb-2">🔧 Development Mode</p>
              <button
                type="button"
                @click="handleDevAdminLogin"
                class="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Iniciando como admin...</span>
                <span v-else>Login como Admin (Dev)</span>
              </button>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              class="btn-primary w-full"
              :disabled="isLoading || (!isDev && !form.hCaptcha)"
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
  @click="redirectToGoogleLogin"
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
      </transition>
    </div>

    <!-- Modal de mensaje -->
    <transition name="fade">
      <div
        v-if="modalMessage"
        class="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-70 h-screen flex items-center justify-center"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm shadow-lg text-center">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Mensaje</h3>
          <p class="text-gray-700 mb-4">{{ modalMessage }}</p>
          <button @click="modalMessage = ''" class="btn-primary">Cerrar</button>
        </div>
      </div>
    </transition>
  </div>
</template>


<script setup lang="ts">
definePageMeta({ layout: false });

import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

declare global {
  interface Window {
    hcaptcha: any;
  }
}
const { login, user } = useAuth();
const router = useRouter();
const config = useRuntimeConfig();
const isLoading = ref(false);
const isFadingOut = ref(false);
const isLoggedIn = ref(false);
const formKey = ref(0);
const modalMessage = ref('');

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || process.dev || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

const form = reactive({
  email: '',
  password: '',
  hCaptcha: '',
});

const redirectToGoogleLogin = async () => {
  try {
    // Get redirect URL from query params
    const route = useRoute();
    const redirectTo = route.query.redirect as string || '/';
    
    // Include redirect parameter in Google auth request
    const response = await fetch(`${config.public.apiBaseUrl}/auth/google?redirect=${encodeURIComponent(redirectTo)}`);
    const data = await response.json();
    if (data.redirect_url) {
      window.location.href = data.redirect_url; // redirige a la URL que el backend devolvió
    } else {
      // manejar error
      alert('No se recibió la URL de redirección');
    }
  } catch (error) {
    console.error(error);
  }
};



function loadHCaptchaScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.hcaptcha) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function renderHCaptcha() {
  window.hcaptcha.render('hcaptcha-container', {
    sitekey: 'a19acdc8-2292-45d2-bc3e-c5644102f500',
    callback: (token: string) => {
      form.hCaptcha = token;
    },
    'expired-callback': () => {
      form.hCaptcha = '';
    },
  });
}

onMounted(async () => {
  await loadHCaptchaScript();
  renderHCaptcha();
  if (user.value) {
    router.push('/');
  }
});

const handleLogin = async () => {
  if (!isDev && !form.hCaptcha) {
    modalMessage.value = 'Por favor completa el captcha.';
    return;
  }

  isLoading.value = true;
  try {
    await login({
      email: form.email,
      password: form.password,
      hcaptchaToken: form.hCaptcha,
    });

    form.email = '';
    form.password = '';
    form.hCaptcha = '';

    if (window.hcaptcha && window.hcaptcha.reset) {
      window.hcaptcha.reset();
    }

    isFadingOut.value = true;
    
    // Get redirect URL from query params
    const route = useRoute();
    const redirectTo = route.query.redirect as string || '/';
    
    setTimeout(() => {
      isLoggedIn.value = true;
      router.push(redirectTo);
    }, 700);
    
  } catch (error) {
    modalMessage.value = 'Error al iniciar sesión. Verifica tus credenciales.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleDevAdminLogin = async () => {
  if (!isDev) {
    modalMessage.value = 'Esta función solo está disponible en modo desarrollo.';
    return;
  }

  isLoading.value = true;
  try {
    // Use a default admin email for development
    // You can change this to any admin email in your database
    await login({
      email: 'admin@dev.local',
      password: 'admin123',
      hcaptchaToken: 'dev-bypass-token', // Bypass token for development
    });

    isFadingOut.value = true;
    setTimeout(() => {
      isLoggedIn.value = true;
      router.push('/');
    }, 700);
    
  } catch (error) {
    console.error('Dev admin login error:', error);
    modalMessage.value = `Error al iniciar sesión como admin: ${error.message || error}`;
  } finally {
    isLoading.value = false;
  }
};


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
