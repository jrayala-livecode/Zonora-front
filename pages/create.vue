<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-white mb-8">Crear Evento</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form -->
        <div class="space-y-6">
          <!-- Event Image -->
          <div class="card">
            <h2 class="text-lg font-semibold text-white mb-4">Imagen del Evento</h2>
            <div class="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-600">
              <div class="mb-4">
                <Upload class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-400">Sube una imagen o arrastra aquí</p>
              </div>
              <button class="btn-secondary">Seleccionar Imagen</button>
            </div>
          </div>

          <!-- Event Details -->
          <div class="card">
            <h2 class="text-lg font-semibold text-white mb-4">Detalles del Evento</h2>
            <p class="text-gray-400 mb-6">
              Completa la información de tu evento. Estos detalles son los que verán los asistentes para decidir si quieren participar.
            </p>
            
            <form @submit.prevent="createEvent" class="space-y-4">
              <!-- Event Title -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Título del Evento
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Ingresa el título del evento"
                  class="input-field w-full"
                  required
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="Describe tu evento..."
                  class="input-field w-full resize-none"
                  required
                ></textarea>
              </div>

              <!-- Date and Time -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Fecha
                  </label>
                  <input
                    v-model="form.date"
                    type="date"
                    class="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Hora
                  </label>
                  <input
                    v-model="form.time"
                    type="time"
                    class="input-field w-full"
                    required
                  />
                </div>
              </div>

              <!-- Location -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Ubicación
                </label>
                <input
                  v-model="form.location"
                  type="text"
                  placeholder="Nombre del lugar"
                  class="input-field w-full"
                  required
                />
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Dirección
                </label>
                <input
                  v-model="form.address"
                  type="text"
                  placeholder="Dirección completa"
                  class="input-field w-full"
                  required
                />
              </div>

              <!-- Category -->
              <!-- Category - Only Music for now -->
             <input type="hidden" :value="form.category" name="category" />


              <!-- Submit Button -->
              <button
                type="submit"
                class="btn-primary w-full"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Creando evento...</span>
                <span v-else>Crear Evento</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Map -->
        <div class="card">
          <h2 class="text-lg font-semibold text-white mb-4">Ubicación Seleccionada</h2>
          <div class="bg-blue-200 rounded-lg h-96 flex items-center justify-center">
            <div class="text-gray-600 text-center">
              <MapPin class="w-8 h-8 mx-auto mb-2" />
              <p>Mapa interactivo</p>
              <p class="text-sm">{{ form.address || 'Selecciona una ubicación' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, MapPin } from 'lucide-vue-next';

const { isAuthenticated } = useAuth();

const form = reactive({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  address: '',
  category: 'Música', // Only music events for now
  image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800'
});

const isSubmitting = ref(false);

const createEventHandler = async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/login');
    return;
  }

  isSubmitting.value = true;
  
  try {
    await createEvent(form);
    await navigateTo('/events');
  } catch (error) {
    console.error('Error creating event:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// SEO
useHead({
  title: 'Crear Evento - Zonora',
  meta: [
    { name: 'description', content: 'Crea tu propio evento en Zonora' }
  ]
});
</script>