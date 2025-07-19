<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useCookie, useRuntimeConfig } from '#app';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const userStore = useUserStore();

onMounted(async () => {
  const token = route.query.token as string | undefined;

  if (!token) {
    console.error('Token no proporcionado');
    return router.push('/login');
  }

  useCookie('token', { maxAge: 60 * 60 }).value = token;

  const userParam = route.query.user as string | undefined;

  if (userParam) {
    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      userStore.setUser(user);
      userStore.setToken(token);
      return router.push('/dashboard');
    } catch (e) {
      console.error('Error al parsear usuario:', e);
    }
  }

  // Si no vino user en el query param, pedilo al backend con el token
  try {
    const user = await $fetch('/me', {
      baseURL: config.public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    userStore.setUser(user);
    userStore.setToken(token);
    return router.push('/');
  } catch (e) {
    console.error('Error al obtener datos de usuario desde API:', e);
    return router.push('/login');
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
