<template>
  <div ref="mapRef" class="w-full h-64 rounded-lg" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
const props = defineProps<{
  lat: number;
  lng: number;
}>();

const mapRef = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;

onMounted(async () => {
  const L = await import('leaflet');

  // Arreglo para íconos en producción (Vercel)
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  if (!mapRef.value) return;
  
  map = L.map(mapRef.value).setView([props.lat, props.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.marker([props.lat, props.lng]).addTo(map);
});

onBeforeUnmount(() => {
  if (map) map.remove();
});
</script>

<style scoped>
div {
  height: 100%;
}
</style>
