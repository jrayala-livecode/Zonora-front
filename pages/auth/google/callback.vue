<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const route = useRoute();
const router = useRouter();
const { loginWithGoogle } = useAuth();

onMounted(async () => {
  const code = route.query.code as string;

  if (!code) {
    console.error('Código no proporcionado');
    return;
  }

  try {
    await loginWithGoogle(code);
  } catch (err) {
    console.error('Error al iniciar sesión con Google:', err);
    // Podés redirigir a /login con un mensaje si querés
    router.push('/login');
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="text-center">
      <div class="text-lg font-semibold mb-2">Iniciando sesión con Google...</div>
      <div class="animate-pulse text-sm text-gray-400">Por favor espera unos segundos.</div>
    </div>
  </div>
</template>
