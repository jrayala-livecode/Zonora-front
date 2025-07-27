<template>
  <div class="relative space-y-2">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="debouncedFetchSuggestions"
        @keydown.enter.prevent="handleFirstSuggestion"
        @focus="showSuggestionsIfAvailable"
        @blur="hideSuggestionsDelayed"
        type="text"
        placeholder="Buscar ubicación..."
        class="w-full px-3 py-2 rounded border border-gray-300 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <!-- Loading indicator -->
      <div
        v-if="isLoading"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
      <!-- Suggestions -->
      <ul
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute z-10 w-full bg-white border border-gray-300 rounded shadow mt-1 max-h-48 overflow-y-auto text-black text-sm"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @mousedown="selectSuggestion(suggestion)"
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
      v-if="selectedLat !== null && selectedLng !== null"
      class="absolute bottom-2 right-2 bg-white text-black text-xs px-2 py-1 rounded shadow"
    >
      📍 {{ selectedLat.toFixed(5) }}, {{ selectedLng.toFixed(5) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  defineProps,
  defineEmits,
} from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

// Arreglo para íconos en producción (Vercel)

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const props = defineProps<{
  modelValue: { lat: number; lng: number } | null;
}>();
const emit = defineEmits(["update:modelValue"]);

const selectedLat = ref<number | null>(null);
const selectedLng = ref<number | null>(null);
const searchQuery = ref("");
const suggestions = ref<any[]>([]);
const isLoading = ref(false);
const showSuggestions = ref(false);
let map: L.Map;
let marker: L.Marker | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  if (typeof window === "undefined") return;

  // Usar ubicación del usuario si es posible
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        initializeMap(position.coords.latitude, position.coords.longitude);
      },
      () => {
        // Si falla la geolocalización, usar ubicación por defecto o props
        const lat = props.modelValue?.lat ?? -33.4489;
        const lng = props.modelValue?.lng ?? -70.6693;
        initializeMap(lat, lng);
      }
    );
  } else {
    const lat = props.modelValue?.lat ?? -33.4489;
    const lng = props.modelValue?.lng ?? -70.6693;
    initializeMap(lat, lng);
  }
});

function initializeMap(lat: number, lng: number) {
  selectedLat.value = lat;
  selectedLng.value = lng;

  map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  marker = L.marker([lat, lng], { draggable: true }).addTo(map);
  marker.on("dragend", onMarkerDrag);
  map.on("click", onMapClick);

  emit("update:modelValue", { lat, lng });
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
  if (lat === selectedLat.value && lng === selectedLng.value) return;

  selectedLat.value = lat;
  selectedLng.value = lng;

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", onMarkerDrag);
  }
  map.setView([lat, lng], 13);
  emit("update:modelValue", { lat, lng });
}

async function fetchSuggestions() {
  if (!searchQuery.value.trim()) {
    suggestions.value = [];
    isLoading.value = false;
    showSuggestions.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchQuery.value
    )}&addressdetails=1&limit=5`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    suggestions.value = data;
    showSuggestions.value = data.length > 0;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    suggestions.value = [];
    showSuggestions.value = false;
  } finally {
    isLoading.value = false;
  }
}

function debouncedFetchSuggestions() {
  // Clear the previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  // If search is empty, clear suggestions immediately
  if (!searchQuery.value.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    isLoading.value = false;
    return;
  }

  // Set loading state immediately for user feedback
  isLoading.value = true;

  // Set a new timer
  debounceTimer = setTimeout(() => {
    fetchSuggestions();
    debounceTimer = null;
  }, 1000); // 1 second delay
}

function selectSuggestion(suggestion: any) {
  searchQuery.value = suggestion.display_name;
  suggestions.value = [];
  showSuggestions.value = false;
  isLoading.value = false;

  const lat = parseFloat(suggestion.lat);
  const lon = parseFloat(suggestion.lon);
  setLocation(lat, lon);
}

function handleFirstSuggestion() {
  if (suggestions.value.length > 0) {
    selectSuggestion(suggestions.value[0]);
  } else if (searchQuery.value.trim()) {
    // If no suggestions but there's a query, trigger immediate search
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    fetchSuggestions();
  }
}

function showSuggestionsIfAvailable() {
  if (suggestions.value.length > 0) {
    showSuggestions.value = true;
  }
}

function hideSuggestionsDelayed() {
  if (hideTimer) {
    clearTimeout(hideTimer);
  }

  hideTimer = setTimeout(() => {
    showSuggestions.value = false;
    hideTimer = null;
  }, 150);
}

onBeforeUnmount(() => {
  // Clean up all timers when component is destroyed
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (map) {
    map.remove();
  }
});

// Watch for changes in search query to manage suggestion visibility
watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    isLoading.value = false;
    // Clear debounce timer if search is empty
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }
});
</script>

<style scoped>
#map {
  height: 16rem;
  border-radius: 0.5rem;
}
</style>
