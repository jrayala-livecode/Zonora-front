<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const { loginWithGoogle } = useAuth();

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const code = route.query.code as string | undefined;

  if (!code) {
    console.error('Código de autorización no encontrado en la URL');
    return router.push('/login');
  }

  try {
    await loginWithGoogle(code);
    router.push('/');
  } catch (error) {
    console.error('Error durante login con Google:', error);
    router.push('/login');
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="text-center">
      <div class="text-lg font-semibold mb-2">Procesando acceso con Google...</div>
      <div class="animate-pulse text-sm text-gray-400">Por favor espera unos segundos.</div>
    </div>
  </div>
</template>
