<template>
  <div id="map" class="w-full h-64 rounded-lg"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, computed } from "vue";

import { getUserLocation, getLocationFromIP } from "~/utils/getUserLocation";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import redMarkerIcon from "~/components/assets/marker-icon-red.png"; // Add this line
import type { Event } from "~/composables/useEvents";
import "leaflet/dist/leaflet.css";

let map: L.Map;
let markersGroup: L.LayerGroup;

onMounted(async () => {
  const L = await import("leaflet");

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  initMap();
  await getMyLocation();
});

let userLatitude = ref(0);
let userLongitude = ref(0);

async function getMyLocation() {
  try {
    const position = await getUserLocation();
    userLatitude.value = position.coords.latitude;
    userLongitude.value = position.coords.longitude;
  } catch (error) {
    getLocationFromIP()
      .then((location) => {
        if (location) {
          userLatitude.value = location.coords.latitude;
          userLongitude.value = location.coords.longitude;
        } else {
          console.error("No se pudo obtener la ubicación del usuario");
        }
      })
      .catch((err) => {
        console.error("Error al obtener la ubicación del usuario:", err);
      });
  }
}

function initMap() {
  if (typeof window === "undefined") {
    return;
  }

  map = L.map("map").setView([userLatitude.value, userLongitude.value], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Add click event listener to map
  map.on("dblclick", function (e) {
    changeMyLocation(e.latlng.lat, e.latlng.lng);
  });


  // Create layer groups
  markersGroup = L.layerGroup().addTo(map);
  addUserLocationMarker();
  addEventMarkers(props.events);
}

function refreshMapMarkers() {
  markersGroup.clearLayers(); // Clear existing markers
  addUserLocationMarker();
  addEventMarkers(props.events);
}

function changeMyLocation(lat: number, lng: number) {
  userLatitude.value = lat;
  userLongitude.value = lng;

  markersGroup.clearLayers(); // Clear existing markers
  addUserLocationMarker();
  addEventMarkers(props.events);
}

function addUserLocationMarker() {
  const userMarker = L.marker([userLatitude.value, userLongitude.value], {
    icon: new L.Icon({
      iconUrl: redMarkerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: markerShadow,
      shadowSize: [41, 41],
    }),
  });

  userMarker.bindPopup("Tu ubicación actual");

  userMarker.addTo(markersGroup);
  userMarker.openPopup();
}

function addEventMarker(
  lat: number,
  lng: number,
  event: Event
) {
  const eventMarker = L.marker([lat, lng], {
    icon: new L.Icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: markerShadow,
      shadowSize: [41, 41],
    }),
  });

  const popupContent = `
    <div class="event-popup" style="min-width: 250px;">
      <div style="margin-bottom: 10px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">
          ${event.title}
        </h3>
        <div style="margin-bottom: 8px;">
          <strong>Fecha:</strong> ${
            event.date
              ? new Date(event.date).toLocaleDateString()
              : "No especificada"
          }
        </div>
        <div style="margin-bottom: 8px;">
          <strong>Hora:</strong> ${event.time || "No especificada"}
        </div>
        <div style="margin-bottom: 8px;">
          <strong>Ubicación:</strong> ${event.location || "No especificada"}
        </div>
        ${
          event.description
            ? `
          <div style="margin-bottom: 12px;">
            <strong>Descripción:</strong><br>
            <span style="color: #666;">${event.description.substring(0, 100)}${
                event.description.length > 100 ? "..." : ""
              }</span>
          </div>
        `
            : ""
        }
        <div style="text-align: center;">
          <a href="/events/${event.id}" 
             style="display: inline-block; padding: 8px 16px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">
            Ver detalles completos
          </a>
        </div>
      </div>
    </div>
  `;

  eventMarker.bindPopup(popupContent, {
    maxWidth: 300,
    className: "custom-popup",
  });


  eventMarker.addTo(markersGroup);
}

function addEventMarkers(events: Event[]) {
  markersGroup.clearLayers(); // Clear existing markers

  events.forEach((event: Event) => {
    if (
      event.latitude === undefined ||
      event.longitude === undefined ||
      event.latitude === null ||
      event.longitude === null
    ) {
      return;
    }

    let latitude = parseFloat(
      event.latitude !== undefined ? String(event.latitude) : "0"
    );
    let longitude = parseFloat(
      event.longitude !== undefined ? String(event.longitude) : "0"
    );

    addEventMarker(latitude, longitude, event);
  });

  addUserLocationMarker();
}

const props = withDefaults(defineProps<Props>(), {
  events: () => [],
});

watch(
  () => props.events,
  (newEvents) => {

    addEventMarkers(newEvents);
  },
  { deep: true }
);

watch(
  [userLatitude, userLongitude],
  () => {
    if (map) {
      map.setView([userLatitude.value, userLongitude.value], 13);
      refreshMapMarkers();
    }
  },
  { immediate: true }
);

// Props
interface Props {
  events?: Array<Event>;
}

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
#map {
  height: 20rem; /* 64 (h-64) es 16rem */
  border-radius: 0.5rem; /* para que coincida con tu diseño rounded-lg */
}

.blue-marker {
  position: relative;
}
</style>
