<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Event List View -->
      <div v-if="!isEditing">
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
                  @click="startEditing(event)"
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
        </div>
      </div>

      <!-- Edit Form View -->
      <div v-else>
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <button
              @click="cancelEditing"
              class="flex items-center text-orange-500 hover:text-orange-400 transition-colors duration-200 mb-2"
            >
              <ArrowLeft class="w-4 h-4 mr-2" />
              Volver a Mis Eventos
            </button>
            <h1 class="text-4xl font-bold text-white">Editar Evento</h1>
            <p class="text-gray-400 mt-2">Modifica los detalles de tu evento musical</p>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="message.text" class="mb-6">
          <div 
            :class="[
              'rounded-lg p-4 border-l-4',
              message.type === 'success' 
                ? 'bg-green-900/20 border-green-500 text-green-300' 
                : 'bg-red-900/20 border-red-500 text-red-300'
            ]"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg v-if="message.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">{{ message.text }}</p>
              </div>
              <div class="ml-auto pl-3">
                <button @click="clearMessage" class="inline-flex text-current opacity-70 hover:opacity-100">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="saveEvent" class="space-y-8" novalidate aria-label="Formulario de edición de evento">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Información Básica -->
            <section class="card" aria-labelledby="basic-info-heading">
              <h2 id="basic-info-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                  <span class="text-white font-bold">1</span>
                </div>
                Información Básica
              </h2>
              
              <div class="space-y-4">
                <div>
                  <label for="event-name" class="block text-sm font-medium text-gray-300 mb-2">Nombre del Evento *</label>
                  <input 
                    id="event-name"
                    v-model="editingEvent.name" 
                    type="text" 
                    placeholder="Ej: Festival de Rock 2024" 
                    class="input-field w-full" 
                    required 
                    aria-describedby="event-name-help"
                  />
                  <div id="event-name-help" class="sr-only">Ingresa el nombre que aparecerá como título del evento</div>
                </div>

                <div>
                  <label for="event-description" class="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
                  <textarea 
                    id="event-description"
                    v-model="editingEvent.description" 
                    rows="4" 
                    placeholder="Describe tu evento musical..." 
                    class="input-field w-full resize-none" 
                    required
                    aria-describedby="event-description-help"
                  ></textarea>
                  <div id="event-description-help" class="sr-only">Proporciona una descripción detallada del evento</div>
                </div>

                <div>
                  <label for="event-hashtags" class="block text-sm font-medium text-gray-300 mb-2">Hashtags</label>
                  <input 
                    id="event-hashtags"
                    v-model="editingEvent.hashtags" 
                    type="text" 
                    placeholder="Ej: #rock #festival #musica" 
                    class="input-field w-full"
                    aria-describedby="hashtags-help"
                  />
                  <p id="hashtags-help" class="text-xs text-gray-500 mt-1">Separa los hashtags con espacios</p>
                </div>

                <div>
                  <label for="event-links" class="block text-sm font-medium text-gray-300 mb-2">Enlaces de Información</label>
                  <input 
                    id="event-links"
                    v-model="editingEvent.information_links" 
                    type="url" 
                    placeholder="https://ejemplo.com" 
                    class="input-field w-full"
                    aria-describedby="links-help"
                  />
                  <div id="links-help" class="sr-only">Agrega enlaces adicionales con información del evento</div>
                </div>
              </div>
            </section>

            <!-- Fecha y Hora -->
            <section class="card" aria-labelledby="datetime-heading">
              <h2 id="datetime-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                  <span class="text-white font-bold">2</span>
                </div>
                Fecha y Hora
              </h2>
              
              <div class="space-y-4">
                <div>
                  <label for="event-date" class="block text-sm font-medium text-gray-300 mb-2">Fecha del Evento *</label>
                  <input 
                    id="event-date"
                    v-model="editingEvent.date" 
                    type="date" 
                    class="input-field w-full" 
                    required 
                    :min="new Date().toISOString().split('T')[0]"
                    aria-describedby="event-date-help"
                  />
                  <div id="event-date-help" class="sr-only">Selecciona la fecha en que se realizará el evento</div>
                </div>

                <div>
                  <label for="event-time" class="block text-sm font-medium text-gray-300 mb-2">Hora de Inicio *</label>
                  <input 
                    id="event-time"
                    v-model="editingEvent.time" 
                    type="time" 
                    class="input-field w-full" 
                    required
                    aria-describedby="event-time-help"
                  />
                  <div id="event-time-help" class="sr-only">Especifica la hora de inicio del evento</div>
                </div>

                <div>
                  <label for="publish-date" class="block text-sm font-medium text-gray-300 mb-2">Fecha de Publicación</label>
                  <input 
                    id="publish-date"
                    v-model="editingEvent.publish_date" 
                    type="datetime-local" 
                    class="input-field w-full"
                    aria-describedby="publish-date-help"
                  />
                  <p id="publish-date-help" class="text-xs text-gray-500 mt-1">Deja vacío para publicar inmediatamente</p>
                </div>
              </div>
            </section>

            <!-- Ubicación -->
            <section class="card lg:col-span-2" aria-labelledby="location-heading">
              <h2 id="location-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                  <span class="text-white font-bold">3</span>
                </div>
                Ubicación
              </h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label for="venue-name" class="block text-sm font-medium text-gray-300 mb-2">Nombre del Lugar *</label>
                    <input 
                      id="venue-name"
                      v-model="editingEvent.location" 
                      type="text" 
                      placeholder="Ej: Teatro Nacional" 
                      class="input-field w-full" 
                      required
                      aria-describedby="venue-name-help"
                    />
                    <div id="venue-name-help" class="sr-only">Ingresa el nombre del lugar donde se realizará el evento</div>
                  </div>

                  <div>
                    <label for="venue-address" class="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
                    <input 
                      id="venue-address"
                      v-model="editingEvent.address" 
                      type="text" 
                      placeholder="Dirección completa" 
                      class="input-field w-full" 
                      required
                      aria-describedby="venue-address-help"
                    />
                    <div id="venue-address-help" class="sr-only">Proporciona la dirección completa del lugar</div>
                  </div>

                  <fieldset class="space-y-3">
                    <legend class="sr-only">Opciones de ubicación</legend>
                    <label class="flex items-center space-x-3">
                      <input 
                        v-model="editingEvent.hidden_location" 
                        type="checkbox" 
                        class="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                        aria-describedby="hidden-location-help"
                      />
                      <span class="text-gray-300">Ocultar ubicación hasta revelarla</span>
                    </label>
                    <div id="hidden-location-help" class="sr-only">Marca esta opción si quieres mantener la ubicación oculta hasta una fecha específica</div>

                    <div v-if="editingEvent.hidden_location" class="ml-7">
                      <label for="reveal-date" class="block text-sm font-medium text-gray-300 mb-2">Revelar ubicación el:</label>
                      <input 
                        id="reveal-date"
                        v-model="editingEvent.reveal_location_at" 
                        type="datetime-local" 
                        class="input-field w-full"
                        aria-describedby="reveal-date-help"
                      />
                      <div id="reveal-date-help" class="sr-only">Selecciona cuándo se revelará la ubicación del evento</div>
                    </div>
                  </fieldset>
                </div>
                <ClientOnly>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Seleccionar en el Mapa</label>
                    <MapSelector v-model="selectedMapLocation" aria-label="Selector de ubicación en mapa" />
                  </div>
                </ClientOnly>
              </div>
            </section>

            <!-- Imagen del Evento -->
            <section class="card" aria-labelledby="image-heading">
              <h2 id="image-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                  <span class="text-white font-bold">4</span>
                </div>
                Imagen del Evento
              </h2>
              
              <div class="space-y-4">
                <div v-if="imagePreview" class="relative">
                  <img :src="imagePreview" alt="Vista previa de la imagen del evento" class="w-full h-48 object-cover rounded-lg" />
                  <button 
                    @click="removeImage" 
                    type="button" 
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    aria-label="Eliminar imagen seleccionada"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>

                <div v-else class="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-600">
                  <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
                  <p class="text-gray-400 mb-4">Sube una nueva imagen o mantén la actual</p>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="onImageSelected" 
                    class="mx-auto mb-4"
                    aria-label="Seleccionar archivo de imagen"
                  />
                </div>
              </div>
            </section>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-8">
            <button
              type="button"
              @click="cancelEditing"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              :disabled="isSubmitting"
            >
              <X class="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

import { ref, reactive, onMounted, computed, watch } from 'vue';
import { Trash2, ArrowLeft, X, Upload } from 'lucide-vue-next';
import { useRuntimeConfig, useCookie } from '#app';

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const token = useCookie('token');

const userEvents = ref<any[]>([]);
const isEditing = ref(false);
const isSubmitting = ref(false);
const imagePreview = ref<string | null>(null);
const selectedMapLocation = ref<any>(null);

// UI state
const message = reactive({
  text: '',
  type: 'success' as 'success' | 'error'
});

const editingEvent = reactive<any>({
  id: null,
  name: '',
  description: '',
  date: '',
  time: '',
  location: '',
  address: '',
  hashtags: '',
  information_links: '',
  hidden_location: false,
  reveal_location_at: '',
  publish_date: '',
  image_url: '',
  latitude: null,
  longitude: null,
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

const startEditing = (event: any) => {
  // Reset form
  Object.keys(editingEvent).forEach(key => {
    editingEvent[key] = null;
  });

  // Populate form with event data
  editingEvent.id = event.id;
  editingEvent.name = event.name || '';
  editingEvent.description = event.description || '';
  editingEvent.date = event.date ? event.date.split('T')[0] : '';
  editingEvent.time = event.time || '';
  editingEvent.location = event.venue?.name || '';
  editingEvent.address = event.venue?.address || '';
  editingEvent.hashtags = Array.isArray(event.hashtags) ? event.hashtags.join(' ') : (event.hashtags || '');
  editingEvent.information_links = Array.isArray(event.information_links) ? event.information_links[0] || '' : (event.information_links || '');
  editingEvent.hidden_location = event.hidden_location || false;
  editingEvent.reveal_location_at = event.reveal_location_at || '';
  editingEvent.publish_date = event.publish_date || '';
  editingEvent.image_url = event.image_url || '';
  editingEvent.latitude = event.latitude || null;
  editingEvent.longitude = event.longitude || null;

  // Set map location if coordinates exist
  if (event.latitude && event.longitude) {
    selectedMapLocation.value = {
      lat: event.latitude,
      lng: event.longitude
    };
  }

  // Set image preview
  if (event.image_url) {
    imagePreview.value = event.image_url;
  }

  isEditing.value = true;
  clearMessage();
};

const cancelEditing = () => {
  isEditing.value = false;
  imagePreview.value = null;
  selectedMapLocation.value = null;
  clearMessage();
};

// Message handling
const showMessage = (text: string, type: 'success' | 'error') => {
  message.text = text;
  message.type = type;
  if (type === 'success') {
    setTimeout(() => {
      clearMessage();
    }, 5000);
  }
};

const clearMessage = () => {
  message.text = '';
};

// Image handling
const onImageSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  editingEvent.image_url = '';
};

// Map handling
const updateMapLocation = (location: any) => {
  if (location) {
    editingEvent.latitude = location.lat;
    editingEvent.longitude = location.lng;
  }
};

// Watch map location changes
watch(selectedMapLocation, updateMapLocation);

const saveEvent = async () => {
  isSubmitting.value = true;
  clearMessage();

  try {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(editingEvent).forEach(key => {
      if (editingEvent[key] !== null && editingEvent[key] !== '') {
        formData.append(key, editingEvent[key]);
      }
    });

    // Handle image upload if new image selected
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append('image', fileInput.files[0]);
    }

    const response = await fetch(`${apiBaseUrl}/events/${editingEvent.id}`, {
      method: 'POST', // Use POST with _method for Laravel
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update the event in the list
      const index = userEvents.value.findIndex(e => e.id === editingEvent.id);
      if (index !== -1) {
        userEvents.value[index] = { ...userEvents.value[index], ...data.data };
      }
      
      showMessage('Evento actualizado con éxito', 'success');
      
      // Return to list view after a short delay
      setTimeout(() => {
        cancelEditing();
        fetchUserEvents(); // Refresh the list
      }, 2000);
    } else {
      const error = await response.json();
      showMessage(error.message || 'Error al guardar el evento', 'error');
    }
  } catch (error) {
    console.error('Error saving event:', error);
    showMessage('Error al guardar el evento. Inténtalo de nuevo.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(fetchUserEvents);
</script>
