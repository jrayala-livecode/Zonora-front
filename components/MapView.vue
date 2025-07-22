<template>
  <div id="map" class="w-full h-64 rounded-lg"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';

// Arreglo para íconos en producción (Vercel)

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import 'leaflet/dist/leaflet.css';

let map: L.Map;

onMounted(() => {
  // Inicializa el mapa en el div #map con centro y zoom
  map = L.map('map').setView([34.0522, -118.2437], 13); // Lat/Lng Los Angeles

  // Capa de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Marcador ejemplo
  L.marker([34.0522, -118.2437]).addTo(map).bindPopup('Los Angeles').openPopup();
});

onBeforeUnmount(() => {
  map.remove();
});
</script>

<style scoped>
#map {
  height: 16rem; /* 64 (h-64) es 16rem */
  border-radius: 0.5rem; /* para que coincida con tu diseño rounded-lg */
}
</style>
