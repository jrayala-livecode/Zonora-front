<template>
  <div class="relative space-y-2">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="fetchSuggestions"
        @keydown.enter.prevent="handleFirstSuggestion"
        type="text"
        placeholder="Buscar ubicación..."
        class="w-full px-3 py-2 rounded border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <!-- Suggestions -->
      <ul
        v-if="suggestions.length > 0"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded shadow mt-1 max-h-48 overflow-y-auto text-black text-sm"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ suggestion.display_name }}
        </li>
      </ul>
    </div>

    <!-- Map -->
    <div id="map" class="w-full h-64 rounded-lg z-0"></div>

    <!-- Coordenadas -->
    <div
      v-if="selectedLat && selectedLng"
      class="absolute bottom-2 right-2 bg-white text-black text-xs px-2 py-1 rounded shadow"
    >
      📍 {{ selectedLat.toFixed(5) }}, {{ selectedLng.toFixed(5) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, defineEmits, defineProps } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  modelValue: { lat: number; lng: number } | null;
}>();
const emit = defineEmits(['update:modelValue']);

const selectedLat = ref<number | null>(props.modelValue?.lat ?? null);
const selectedLng = ref<number | null>(props.modelValue?.lng ?? null);
const searchQuery = ref('');
const suggestions = ref<any[]>([]);
let map: L.Map;
let marker: L.Marker | null = null;

onMounted(() => {
  // Detectar ubicación inicial
  // Ya no se necesita
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       initializeMap(latitude, longitude);
//     },
//     () => {
//       initializeMap(-33.4489, -70.6693);
//     }
//   );
// } else {
//   initializeMap(-33.4489, -70.6693);
// }
initializeMap(-33.4489, -70.6693);
});

function initializeMap(lat: number, lng: number) {
  selectedLat.value = lat;
  selectedLng.value = lng;

  map = L.map('map').setView([lat, lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  marker = L.marker([lat, lng], { draggable: true }).addTo(map);
  marker.on('dragend', onMarkerDrag);
  map.on('click', onMapClick);

  emit('update:modelValue', { lat, lng });
}

function onMapClick(e: L.LeafletMouseEvent) {
  const { lat, lng } = e.latlng;
  setLocation(lat, lng);
}

function onMarkerDrag(e: L.LeafletEvent) {
  const newLatLng = (e.target as L.Marker).getLatLng();
  setLocation(newLatLng.lat, newLatLng.lng);
}

function setLocation(lat: number, lng: number) {
  selectedLat.value = lat;
  selectedLng.value = lng;

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on('dragend', onMarkerDrag);
  }

  map.setView([lat, lng], 13);
  emit('update:modelValue', { lat, lng });
}

async function fetchSuggestions() {
  if (!searchQuery.value.trim()) {
    suggestions.value = [];
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&addressdetails=1&limit=5`;
  const res = await fetch(url);
  suggestions.value = await res.json();
}

function selectSuggestion(suggestion: any) {
  searchQuery.value = suggestion.display_name;
  suggestions.value = [];
  const lat = parseFloat(suggestion.lat);
  const lon = parseFloat(suggestion.lon);
  setLocation(lat, lon);
}

function handleFirstSuggestion() {
  if (suggestions.value.length > 0) {
    selectSuggestion(suggestions.value[0]);
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      setLocation(newVal.lat, newVal.lng);
    }
  }
);

onBeforeUnmount(() => {
  map.remove();
});
</script>

<style scoped>
#map {
  height: 16rem;
  border-radius: 0.5rem;
}
</style>
