<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useCookie, useRuntimeConfig } from '#app';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const userStore = useUserStore();
const token = useCookie('token');
const user = useState<{
  id: number;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
} | null>('auth.user', () => null);


const loginWithGoogle = async (code: string) => {
  try {
    const response = await $fetch<{ access_token: string; user: any }>(
      '/auth/google/callback',
      {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        body: { code },
      }
    );

    console.log('Respuesta de login con Google:', response);

    if (!response.access_token) {
      throw new Error('Error de autenticación');
    }

    // Guardar token en cookie
    token.value = response.access_token;

    // Si la respuesta no contiene usuario completo, lo pedimos a /me
    let fullUser = response.user;
    if (!fullUser?.avatar_url) {
      fullUser = await $fetch('/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });
    }

    userStore.setToken(response.access_token);
    userStore.setUser({
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      avatar: fullUser.avatar_url ?? '',
      joinedAt: fullUser.created_at ?? '',
    });

    user.value = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      avatar: fullUser.avatar_url ?? '',
      joinedAt: fullUser.created_at ?? '',
    };

    await router.push('/');
  } catch (error) {
    console.error('Error en login con Google:', error);
    await router.push('/login');
  }
};

onMounted(async () => {
  const code = route.query.code as string | undefined;

  if (!code) {
    console.error('No se encontró el parámetro "code" en la URL');
    return router.push('/login');
  }

  await loginWithGoogle(code);
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
