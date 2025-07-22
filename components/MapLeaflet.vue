<template>
  <div ref="mapRef" class="w-full h-64 rounded-lg" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  lat: number;
  lng: number;
}>();

const mapRef = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;

onMounted(() => {
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
