<script setup lang="ts">
import type { User } from '~/composables/types/types';  // Ajustá ruta según corresponda
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useCookie, useRuntimeConfig } from '#app';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const userStore = useUserStore();
const token = useCookie('token');

onMounted(async () => {
  const tokenFromQuery = route.query.token as string | undefined;

  if (!tokenFromQuery) {
    console.error('Token no proporcionado');
    return router.push('/login');
  }

  token.value = tokenFromQuery;

  const userParam = route.query.user as string | undefined;

  if (userParam) {
    try {
      const user = JSON.parse(decodeURIComponent(userParam)) as User;
      userStore.setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? '',
        joinedAt: user.joinedAt ?? '',
      });
      userStore.setToken(tokenFromQuery);
      return router.push('/');
    } catch (e) {
      console.error('Error al parsear usuario:', e);
    }
  }

  try {
    const user = await $fetch<User>('/me', {
      baseURL: config.public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${tokenFromQuery}`,
      },
    });
    userStore.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar ?? '',
      joinedAt: user.joinedAt ?? '',
    });
    userStore.setToken(tokenFromQuery);
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
