<template>
  <div class="py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Crear Evento</h1>
        <p class="text-gray-400">Completa todos los campos para crear tu evento musical</p>
      </header>

      <form @submit.prevent="createEventHandler" class="space-y-8" novalidate aria-label="Formulario de creación de evento">
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
                  v-model="form.name" 
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
                  v-model="form.description" 
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
                  v-model="form.hashtags" 
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
                  v-model="form.information_links" 
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
                  v-model="form.date" 
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
                  v-model="form.time" 
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
                  v-model="form.publish_date" 
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
                    v-model="form.location" 
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
                    v-model="form.address" 
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
                      v-model="form.hidden_location" 
                      type="checkbox" 
                      class="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                      aria-describedby="hidden-location-help"
                    />
                    <span class="text-gray-300">Ocultar ubicación hasta revelarla</span>
                  </label>
                  <div id="hidden-location-help" class="sr-only">Marca esta opción si quieres mantener la ubicación oculta hasta una fecha específica</div>

                  <div v-if="form.hidden_location" class="ml-7">
                    <label for="reveal-date" class="block text-sm font-medium text-gray-300 mb-2">Revelar ubicación el:</label>
                    <input 
                      id="reveal-date"
                      v-model="form.reveal_location_at" 
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
                <p class="text-gray-400 mb-4">Sube una imagen o selecciona una predeterminada</p>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="onImageSelected" 
                  class="mx-auto mb-4"
                  aria-label="Seleccionar archivo de imagen"
                />

                <div class="grid grid-cols-3 gap-2 mb-4">
                  
                </div>
              </div>
            </div>
          </section>

          <!-- Precios -->
          <section class="card" aria-labelledby="pricing-heading">
            <h2 id="pricing-heading" class="text-xl font-semibold text-white mb-6 flex items-center">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span class="text-white font-bold">5</span>
              </div>
              Precios
            </h2>
            
            <div class="space-y-6">
              <!-- Publicar Precios Toggle -->
              <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 class="text-lg font-medium text-white mb-1">Publicar Precios</h3>
                  <p class="text-sm text-gray-400">Permite a los usuarios ver los precios del evento</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="form.show_prices" 
                    type="checkbox" 
                    class="sr-only peer"
                    aria-describedby="pricing-toggle-help"
                  />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div id="pricing-toggle-help" class="sr-only">Activa esta opción para mostrar los precios públicamente</div>

              <!-- Precios del Evento -->
              <div v-if="form.show_prices" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Precio General -->
                  <div>
                    <label for="general-price" class="block text-sm font-medium text-gray-300 mb-2">
                      Precio General ({{ currencyName }})
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{{ currencySymbol }}</span>
                      <input 
                        id="general-price"
                        v-model="form.general_price" 
                        type="number" 
                        min="0" 
                        step="0.01"
                        :placeholder="currencyPlaceholder" 
                        class="input-field w-full pl-8" 
                        aria-describedby="general-price-help"
                      />
                    </div>
                    <p id="general-price-help" class="text-xs text-gray-500 mt-1">Precio estándar para el evento</p>
                  </div>

                  <!-- Precio VIP -->
                  <div>
                    <label for="vip-price" class="block text-sm font-medium text-gray-300 mb-2">
                      Precio VIP (Opcional) ({{ currencyName }})
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{{ currencySymbol }}</span>
                      <input 
                        id="vip-price"
                        v-model="form.vip_price" 
                        type="number" 
                        min="0" 
                        step="0.01"
                        :placeholder="currencyPlaceholder" 
                        class="input-field w-full pl-8"
                        aria-describedby="vip-price-help"
                      />
                    </div>
                    <p id="vip-price-help" class="text-xs text-gray-500 mt-1">Precio especial para área VIP</p>
                  </div>
                </div>

                <!-- Precio Estudiantil -->
                <div>
                  <label for="student-price" class="block text-sm font-medium text-gray-300 mb-2">
                    Precio Estudiantil (Opcional) ({{ currencyName }})
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{{ currencySymbol }}</span>
                    <input 
                      id="student-price"
                      v-model="form.student_price" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      :placeholder="currencyPlaceholder" 
                      class="input-field w-full pl-8"
                      aria-describedby="student-price-help"
                    />
                  </div>
                  <p id="student-price-help" class="text-xs text-gray-500 mt-1">Descuento para estudiantes con credencial</p>
                </div>

                <!-- Información de Precios -->
                <div>
                  <label for="pricing-info" class="block text-sm font-medium text-gray-300 mb-2">Información Adicional de Precios</label>
                  <textarea 
                    id="pricing-info"
                    v-model="form.pricing_info" 
                    rows="3" 
                    placeholder="Ej: Incluye una bebida, Descuento por compra anticipada, etc." 
                    class="input-field w-full resize-none"
                    aria-describedby="pricing-info-help"
                  ></textarea>
                  <p id="pricing-info-help" class="text-xs text-gray-500 mt-1">Información adicional sobre precios, descuentos o promociones</p>
                </div>

                <!-- Moneda -->
                <div>
                  <label for="currency" class="block text-sm font-medium text-gray-300 mb-2">
                    Moneda ({{ currencySymbol }} {{ form.currency }})
                  </label>
                  <select 
                    id="currency"
                    v-model="form.currency" 
                    class="input-field w-full"
                    aria-describedby="currency-help"
                  >
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="CLP">CLP - Peso Chileno</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="PEN">PEN - Sol Peruano</option>
                  </select>
                  <p id="currency-help" class="text-xs text-gray-500 mt-1">Selecciona la moneda para los precios</p>
                </div>
              </div>

              <!-- Mensaje cuando no se publican precios -->
              <div v-else class="p-4 bg-gray-700 rounded-lg text-center">
                <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p class="text-gray-400">Los precios no se mostrarán públicamente</p>
                <p class="text-sm text-gray-500 mt-1">Los usuarios podrán contactarte para información de precios</p>
              </div>
            </div>
          </section>

        </div>

        <div class="flex justify-center pt-8">
          <button 
            type="submit" 
            class="btn-primary text-lg px-12 py-4" 
            :disabled="isSubmitting"
            :aria-label="isSubmitting ? 'Creando evento, por favor espera' : 'Crear evento musical'"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
              Creando evento...
            </span>
            <span v-else class="flex items-center">
              <Calendar class="w-5 h-5 mr-2" aria-hidden="true" />
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
const token = useUserStore().token;
const config = useRuntimeConfig();

/*
if (!isAuthenticated.value) {
  router.push('/events');
}
  */

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
  category: 'Música',
  // Pricing fields
  show_prices: false,
  general_price: '',
  vip_price: '',
  student_price: '',
  pricing_info: '',
  currency: 'USD',
});

const selectedMapLocation = ref<{ lat: number; lng: number } | null>(null)

watch(selectedMapLocation, (location) => {
  if (location) {
    form.latitude = location.lat
    form.longitude = location.lng
  }
})

// Currency formatting
const currencySymbol = computed(() => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'CLP': '$',
    'MXN': '$',
    'ARS': '$',
    'COP': '$',
    'PEN': 'S/'
  }
  return symbols[form.currency] || '$'
})

const currencyName = computed(() => {
  const names: Record<string, string> = {
    'USD': 'Dólar Estadounidense',
    'EUR': 'Euro',
    'CLP': 'Peso Chileno',
    'MXN': 'Peso Mexicano',
    'ARS': 'Peso Argentino',
    'COP': 'Peso Colombiano',
    'PEN': 'Sol Peruano'
  }
  return names[form.currency] || 'Dólar Estadounidense'
})

const currencyPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    'USD': '0.00',
    'EUR': '0,00',
    'CLP': '0',
    'MXN': '0.00',
    'ARS': '0.00',
    'COP': '0.00',
    'PEN': '0.00'
  }
  return placeholders[form.currency] || '0.00'
})

const isSubmitting = ref(false);
const selectedFile = ref<File | null>(null);
const imagePreview = ref(form.image || '');


const onImageSelected = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    imagePreview.value = URL.createObjectURL(selectedFile.value);
    form.image = '';
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

    form.hashtags
      .split(' ')
      .filter(tag => tag.trim() !== '')
      .forEach(tag => formData.append('hashtags[]', tag));

    form.information_links
      .split(',')
      .map(link => link.trim())
      .filter(link => link !== '')
      .forEach(link => formData.append('information_links[]', link));

    // status_id and commune_id are handled internally by the system
    formData.append('category', form.category);

    // Pricing data
    formData.append('show_prices', form.show_prices ? '1' : '0');
    if (form.show_prices) {
      if (form.general_price) formData.append('general_price', form.general_price);
      if (form.vip_price) formData.append('vip_price', form.vip_price);
      if (form.student_price) formData.append('student_price', form.student_price);
      if (form.pricing_info) formData.append('pricing_info', form.pricing_info);
      formData.append('currency', form.currency);
    }

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

// SEO and structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Crear Evento Musical - Zonora",
  "description": "Crea y publica tu evento musical en Zonora. Completa el formulario para compartir tu evento con la comunidad.",
  "url": `${config.public.baseUrl}/create`,
  "mainEntity": {
    "@type": "WebApplication",
    "name": "Formulario de Creación de Eventos",
    "applicationCategory": "EventManagement",
    "operatingSystem": "Web Browser"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": config.public.baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Crear Evento",
        "item": `${config.public.baseUrl}/create`
      }
    ]
  }
};

useHead({
  title: 'Crear Evento Musical - Zonora | Publica tu Evento',
  meta: [
    {
      name: 'description',
      content: 'Crea y publica tu evento musical en Zonora. Formulario fácil para organizar conciertos, festivales y eventos culturales. Conecta con tu audiencia.'
    },
    {
      name: 'keywords',
      content: 'crear evento, publicar evento, organizador eventos, conciertos, festivales, música, Zonora'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Crear Evento Musical - Zonora'
    },
    {
      property: 'og:description',
      content: 'Crea y publica tu evento musical en Zonora. Formulario fácil para organizar conciertos, festivales y eventos culturales.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${config.public.baseUrl}/create`
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: 'Crear Evento Musical - Zonora'
    },
    {
      name: 'twitter:description',
      content: 'Crea y publica tu evento musical en Zonora. Formulario fácil para organizar conciertos y festivales.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${config.public.baseUrl}/create`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData)
    }
  ]
});
</script>
