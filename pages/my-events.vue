<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white">Mis Eventos</h1>
        <NuxtLink to="/create" class="btn-primary">Crear Nuevo Evento</NuxtLink>
      </div>

      <!-- Lista de eventos -->
      <div class="space-y-4" v-if="userEvents.length > 0">
        <div
          v-for="event in userEvents"
          :key="event.id"
          class="card hover:bg-gray-750 transition-colors duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img
                :src="event.image_url"
                :alt="event.name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 class="font-semibold text-white">{{ event.name }}</h3>
                <p class="text-sm text-gray-400">{{ formatDate(event.date) }}</p>
                <p class="text-sm text-gray-400">
                  {{ event.venue?.name || 'Ubicación oculta' }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="openEditModal(event)"
                class="btn-secondary"
              >
                Editar
              </button>
              <button
                @click="deleteEvent(event.id)"
                class="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-lg">No tienes eventos creados</div>
        <!--
        <NuxtLink to="/create" class="btn-primary mt-4">Crear tu primer evento</NuxtLink>
        -->
      </div>
      
    </div>

    <!-- Modal Edición -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div class="bg-gray-900 rounded-lg p-6 w-full max-w-lg relative">
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
          @click="closeEditModal"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <h2 class="text-2xl font-bold mb-4 text-white">Editar Evento</h2>

        <form @submit.prevent="saveEvent" class="space-y-4">
          <div>
            <label class="block text-white mb-1" for="name">Nombre</label>
            <input
              v-model="editingEvent.name"
              id="name"
              type="text"
              class="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-yellow-400"
              required
            />
          </div>

          <div>
            <label class="block text-white mb-1" for="date">Fecha</label>
            <input
              v-model="editingEvent.date"
              id="date"
              type="date"
              class="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-yellow-400"
              required
            />
          </div>

          <div>
            <label class="block text-white mb-1" for="venue">Lugar</label>
            <input
              v-model="editingEvent.venue.name"
              id="venue"
              type="text"
              class="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label class="block text-white mb-1" for="image_url">URL Imagen</label>
            <input
              v-model="editingEvent.image_url"
              id="image_url"
              type="url"
              class="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeEditModal"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { useRuntimeConfig, useCookie } from '#app';

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const token = useCookie('token');

const userEvents = ref<any[]>([]);

const showModal = ref(false);
const editingEvent = reactive<any>({
  id: null,
  name: '',
  date: '',
  venue: { name: '' },
  image_url: '',
});

const fetchUserEvents = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/events/my-events`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const json = await response.json();
    userEvents.value = json.data?.data || [];
  } catch (error) {
    console.error('Error cargando los eventos:', error);
  }
};

const deleteEvent = async (id: number) => {
  const confirmDelete = confirm('¿Estás seguro de eliminar este evento?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${apiBaseUrl}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (response.ok) {
      userEvents.value = userEvents.value.filter(event => event.id !== id);
    } else {
      console.error('Error al eliminar el evento');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
};

const openEditModal = (event: any) => {
  editingEvent.id = event.id;
  editingEvent.name = event.name;
  editingEvent.date = event.date.split('T')[0];
  editingEvent.venue = { name: event.venue?.name || '' };
  editingEvent.image_url = event.image_url;
  showModal.value = true;
};

const closeEditModal = () => {
  showModal.value = false;
};

const saveEvent = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/events/${editingEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(editingEvent),
    });

    if (response.ok) {
      const index = userEvents.value.findIndex(e => e.id === editingEvent.id);
      if (index !== -1) {
        userEvents.value[index] = { ...editingEvent };
      }
      alert('Evento actualizado con éxito');
      closeEditModal();
    } else {
      alert('Error al guardar el evento');
    }
  } catch (error) {
    console.error(error);
    alert('Error al guardar el evento');
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(fetchUserEvents);
</script>
