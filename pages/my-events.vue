<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white">Mis Eventos</h1>
        <NuxtLink to="/create" class="btn-primary">
          Crear Nuevo Evento
        </NuxtLink>
      </div>

      <!-- Events List -->
      <div class="space-y-4">
        <div
          v-for="event in userEvents"
          :key="event.id"
          class="card hover:bg-gray-750 transition-colors duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 class="font-semibold text-white">{{ event.title }}</h3>
                <p class="text-sm text-gray-400">{{ formatDate(event.date) }} • {{ event.time }}</p>
                <p class="text-sm text-gray-400">{{ event.location }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button class="btn-secondary">Editar</button>
              <button class="text-red-400 hover:text-red-300 p-2">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="userEvents.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg">No tienes eventos creados</div>
        <NuxtLink to="/create" class="btn-primary mt-4">
          Crear tu primer evento
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

const { events } = useEvents();

// En un app real, esto filtraría por usuario
const userEvents = computed(() => events.value.slice(0, 3));

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// SEO
useHead({
  title: 'Mis Eventos - Zonora',
  meta: [
    { name: 'description', content: 'Gestiona tus eventos creados en Zonora' }
  ]
});
</script>