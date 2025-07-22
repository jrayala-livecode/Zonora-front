<template>
  <div class="py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Crear Evento</h1>
        <p class="text-gray-400">Completa todos los campos para crear tu evento musical</p>
      </div>

      <form @submit.prevent="createEventHandler" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Información Básica -->
          <div class="card">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white font-bold">1</span>
              </div>
              Información Básica
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Evento *</label>
                <input v-model="form.name" type="text" placeholder="Ej: Festival de Rock 2024" class="input-field w-full" required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
                <textarea v-model="form.description" rows="4" placeholder="Describe tu evento musical..." class="input-field w-full resize-none" required></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Hashtags</label>
                <input v-model="form.hashtags" type="text" placeholder="Ej: #rock #festival #musica" class="input-field w-full" />
                <p class="text-xs text-gray-500 mt-1">Separa los hashtags con espacios</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Enlaces de Información</label>
                <input v-model="form.information_links" type="url" placeholder="https://ejemplo.com" class="input-field w-full" />
              </div>
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="card">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white font-bold">2</span>
              </div>
              Fecha y Hora
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Fecha del Evento *</label>
                <input v-model="form.date" type="date" class="input-field w-full" required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Hora de Inicio *</label>
                <input v-model="form.time" type="time" class="input-field w-full" required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Fecha de Publicación</label>
                <input v-model="form.publish_date" type="datetime-local" class="input-field w-full" />
                <p class="text-xs text-gray-500 mt-1">Deja vacío para publicar inmediatamente</p>
              </div>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="card lg:col-span-2">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white font-bold">3</span>
              </div>
              Ubicación
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Nombre del Lugar *</label>
                  <input v-model="form.location" type="text" placeholder="Ej: Teatro Nacional" class="input-field w-full" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
                  <input v-model="form.address" type="text" placeholder="Dirección completa" class="input-field w-full" required />
                </div>

                <div class="space-y-3">
                  <label class="flex items-center space-x-3">
                    <input v-model="form.hidden_location" type="checkbox" class="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500" />
                    <span class="text-gray-300">Ocultar ubicación hasta revelarla</span>
                  </label>

                  <div v-if="form.hidden_location" class="ml-7">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Revelar ubicación el:</label>
                    <input v-model="form.reveal_location_at" type="datetime-local" class="input-field w-full" />
                  </div>
                </div>
              </div>
              <ClientOnly>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Seleccionar en el Mapa</label>
                  <MapSelector v-model="selectedMapLocation" />
                </div>
              </ClientOnly>
            </div>
          </div>

          <!-- Imagen del Evento -->
          <div class="card">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white font-bold">4</span>
              </div>
              Imagen del Evento
            </h2>
            
            <div class="space-y-4">
              <div v-if="imagePreview" class="relative">
                <img :src="imagePreview" alt="Preview" class="w-full h-48 object-cover rounded-lg" />
                <button @click="removeImage" type="button" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full">
                  <X class="w-4 h-4" />
                </button>
              </div>

              <div v-else class="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-600">
                <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-400 mb-4">Sube una imagen o selecciona una predeterminada</p>
                
                <input type="file" accept="image/*" @change="onImageSelected" class="mx-auto mb-4" />

                <div class="grid grid-cols-3 gap-2 mb-4">
                  
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración Adicional -->
          <div class="card">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white font-bold">5</span>
              </div>
              Configuración
            </h2>
            
            <div class="space-y-4">
            <!--
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">ID del Venue</label>
                <input v-model.number="form.venue_id" type="number" placeholder="107" class="input-field w-full" />
              </div>
-->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Estado del Evento</label>
                <select v-model.number="form.status_id" class="input-field w-full">
                  <option value="1">Borrador</option>
                  <option value="2">Publicado</option>
                  <option value="3">Cancelado</option>
                  <option value="4">Finalizado</option>
                  <option value="5">Activo</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">ID de Comuna</label>
                <input v-model.number="form.commune_id" type="number" placeholder="Opcional" class="input-field w-full" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-8">
          <button type="submit" class="btn-primary text-lg px-12 py-4" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="flex items-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creando evento...
            </span>
            <span v-else class="flex items-center">
              <Calendar class="w-5 h-5 mr-2" />
              Crear Evento
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false
});

import MapSelector from '~/components/MapSelector.vue';
import { Upload, X, Calendar } from 'lucide-vue-next';
import { reactive, ref, watch } from 'vue';
import { useEvents } from '~/composables/useEvents';
import { useModal } from '~/composables/useModal';
import { useUserStore } from '~/store/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isAuthenticated } = useAuth();
const { createEvent } = useEvents();
const token = useUserStore().token; // asegúrate que token esté accesible aquí
const config = useRuntimeConfig();

if (!isAuthenticated.value) {
  router.push('/events');
}

const form = reactive({
  name: '',
  description: '',
  date: '',
  time: '',
  location: '',
  address: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  hidden_location: false,
  reveal_location_at: '',
  image: '',
  hashtags: '',
  information_links: '',
  publish_date: '',
 // venue_id: undefined as number | undefined,
  status_id: 5,
  commune_id: undefined as number | undefined,
  category: 'Música',
});

const selectedMapLocation = ref<{ lat: number; lng: number } | null>(null)

watch(selectedMapLocation, (location) => {
  if (location) {
    form.latitude = location.lat
    form.longitude = location.lng
  }
})
const isSubmitting = ref(false);

const selectedFile = ref<File | null>(null);
const imagePreview = ref(form.image || '');
/*
const defaultImages = [
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800'
];

if (!form.image) {
  form.image = defaultImages[0];
  imagePreview.value = defaultImages[0];
}
*/


const onImageSelected = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    imagePreview.value = URL.createObjectURL(selectedFile.value);
    form.image = ''; // limpiar url porque hay archivo
  }
};

const selectDefaultImage = (img: string) => {
  form.image = img;
  imagePreview.value = img;
  selectedFile.value = null;
};

const removeImage = () => {
  selectedFile.value = null;
  form.image = '';
  imagePreview.value = '';
};

const createEventHandler = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('title', form.name);
    formData.append('description', form.description);
    formData.append('date', form.date);
    formData.append('time', form.time);
    formData.append('location', form.location);
    formData.append('address', form.address);
    formData.append('latitude', form.latitude?.toString() || '');
    formData.append('longitude', form.longitude?.toString() || '');
    formData.append('hidden_location', form.hidden_location ? '1' : '0');
    formData.append('reveal_location_at', form.reveal_location_at || '');
  //  formData.append('hashtags', form.hashtags);
    form.hashtags
  .split(' ')
  .filter(tag => tag.trim() !== '')
  .forEach(tag => formData.append('hashtags[]', tag));

form.information_links
  .split(',')
  .map(link => link.trim())
  .filter(link => link !== '')
  .forEach(link => formData.append('information_links[]', link));

  //  formData.append('venue_id', form.venue_id ? form.venue_id.toString() : '');
    formData.append('status_id', form.status_id.toString());
    formData.append('commune_id', form.commune_id ? form.commune_id.toString() : '');
    formData.append('category', form.category);

    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    } else if (form.image) {
      formData.append('image_url', form.image);
    }

    await createEvent(formData);

    useModal().showSuccess(
      '¡Evento creado exitosamente!',
      `${form.name} ha sido creado y ${form.hidden_location ? 'la ubicación se revelará según configuraste.' : 'está disponible para todos.'}`
    );

    router.push('/events');
  } catch (error) {
    console.error(error);
    useModal().showError('Error al crear evento', 'Por favor verifica los datos e inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
