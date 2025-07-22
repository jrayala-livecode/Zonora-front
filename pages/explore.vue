<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">Explorar Eventos</h1>
        <p class="text-xl text-gray-300">Descubre nuevos eventos y experiencias</p>

        <button
          @click="getUserLocation"
          class="mt-6 px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          :disabled="loading"
        >
          {{ loading ? 'Cargando ubicación...' : 'Mostrar eventos cerca de mí' }}
        </button>

        <p v-if="locationError" class="mt-4 text-red-400">{{ locationError }}</p>
      </div>

      <div v-if="eventsNearby.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="event in eventsNearby"
          :key="event.id"
          :to="`/events/${event.id}`"
          class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 cursor-pointer block"
        >
          <h3 class="text-xl font-semibold text-white mb-2">{{ event.name }}</h3>
          <p class="text-gray-400 mb-4">{{ event.description }}</p>
          <div class="text-sm text-gray-500">{{ new Date(event.date).toLocaleDateString() }}</div>
        </NuxtLink>
      </div>

      <p v-else-if="!loading && userLocation" class="text-gray-400 text-center mt-8">
        No se encontraron eventos cerca de tu ubicación.
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const userLocation = ref<{ latitude: number; longitude: number } | null>(null)
const locationError = ref<string | null>(null)
const eventsNearby = ref<Array<any>>([])
const loading = ref(false)
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
const radius = 200
const limit = 20
const include_hidden_locations = false
const date_from = '2025-07-01'
const date_to = '2025-12-31'

function getUserLocation() {
  locationError.value = null
  loading.value = true

  if (!navigator.geolocation) {
    locationError.value = 'Tu navegador no soporta geolocalización.'
    loading.value = false
    return
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      userLocation.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      await fetchEventsNearby()
      loading.value = false
    },
    error => {
      locationError.value = 'No se pudo obtener la ubicación: ' + error.message
      loading.value = false
    }
  )
}

async function fetchEventsNearby() {
  if (!userLocation.value) return

  try {
    const response = await fetch(`${apiBaseUrl}/events/scan-close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: userLocation.value.latitude,
        longitude: userLocation.value.longitude,
        radius,
        limit,
        include_hidden_locations,
        date_from,
        date_to
      })
    })

    if (!response.ok) {
      locationError.value = `Error al obtener eventos: ${response.statusText}`
      return
    }

    const data = await response.json()
    // Aquí la clave está en acceder a data.data (según respuesta real)
    eventsNearby.value = data.data || []
  } catch (err) {
    locationError.value = 'Error al conectar con el servidor.'
  }
}

// SEO
useHead({
  title: 'Explorar - Zonora',
  meta: [
    { name: 'description', content: 'Explora diferentes categorías de eventos en Zonora' }
  ]
});
</script>