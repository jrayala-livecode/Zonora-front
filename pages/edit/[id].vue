<template>
  <div class="py-8 max-w-3xl mx-auto px-4">
    <h1 class="text-3xl font-bold mb-6 text-white">Editar Evento</h1>

    <form @submit.prevent="saveEvent" class="space-y-4">
      <div>
        <label class="block text-white mb-1" for="name">Nombre</label>
        <input v-model="event.name" id="name" class="input" required />
      </div>

      <div>
        <label class="block text-white mb-1" for="date">Fecha</label>
        <input v-model="event.date" id="date" type="date" class="input" required />
      </div>

      <div>
        <label class="block text-white mb-1" for="venue">Lugar</label>
        <input v-model="event.venue.name" id="venue" class="input" />
      </div>

      <div>
        <label class="block text-white mb-1" for="image_url">URL Imagen</label>
        <input v-model="event.image_url" id="image_url" type="url" class="input" />
      </div>

      <button type="submit" class="btn-primary">Guardar Cambios</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRuntimeConfig, useCookie } from '#app';

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const token = useCookie('token');
const router = useRouter();
const route = useRoute();

const event = ref<any>({
  name: '',
  date: '',
  venue: { name: '' },
  image_url: '',
});

const eventId = Number(route.params.id);

const fetchEvent = async () => {
  try {
    const res = await fetch(`${apiBaseUrl}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const json = await res.json();
    if (res.ok) {
      event.value = json.data;
    } else {
      alert('No se pudo cargar el evento');
      router.push('/');
    }
  } catch (error) {
    console.error(error);
    alert('Error al cargar el evento');
    router.push('/');
  }
};

const saveEvent = async () => {
  try {
    const res = await fetch(`${apiBaseUrl}/events/${eventId}`, {
      method: 'PUT', // o PATCH según tu API
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(event.value),
    });

    if (res.ok) {
      alert('Evento actualizado con éxito');
      router.push('/'); // o a donde quieras
    } else {
      alert('Error al guardar el evento');
    }
  } catch (error) {
    console.error(error);
    alert('Error al guardar el evento');
  }
};

onMounted(fetchEvent);
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #ccc;
  background-color: #222;
  color: white;
}
.input:focus {
  outline: none;
  border-color: #d4af37;
}
</style>
