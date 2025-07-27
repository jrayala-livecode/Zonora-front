<template>
  <div class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="mb-6" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2 text-sm" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <NuxtLink to="/events" class="text-gray-400 hover:text-white" itemprop="item">
            <span itemprop="name">Eventos</span>
          </NuxtLink>
          <meta itemprop="position" content="1" />
        </li>
        <li class="text-gray-400" aria-hidden="true">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span class="text-white" itemprop="name">{{ event?.category || "Evento" }}</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </nav>

    <div v-if="isLoading" class="text-center text-gray-400 py-12" role="status" aria-live="polite">
      <div class="flex items-center justify-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" aria-hidden="true"></div>
        <span>Cargando evento...</span>
      </div>
    </div>

    <article v-else-if="event" class="grid grid-cols-1 lg:grid-cols-3 gap-8" itemscope itemtype="https://schema.org/Event">
      <div class="lg:col-span-2">
        <div class="bg-gray-800 rounded-lg overflow-hidden mb-6">
          <img
            :src="event.image_url"
            :alt="`Imagen del evento ${event.title} en ${event.location}`"
            class="w-full h-64 md:h-96 object-cover"
            itemprop="image"
            loading="eager"
          />
        </div>

        <div class="card mb-6">
          <header>
            <h1 class="text-3xl font-bold text-white mb-4" itemprop="name">{{ event.title }}</h1>
            <div class="flex flex-wrap gap-4 mb-6 text-sm">
              <div class="flex items-center space-x-2">
                <Calendar class="w-4 h-4 text-gray-400" aria-hidden="true" />
                <time class="text-gray-300" :datetime="event.date" itemprop="startDate">{{ formatDate(event.date) }}</time>
              </div>
              <div class="flex items-center space-x-2">
                <Clock class="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span class="text-gray-300">{{ event.time }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <MapPin class="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span class="text-gray-300" itemprop="location" itemscope itemtype="https://schema.org/Place">
                  <span itemprop="name">{{ event.location }}</span>
                </span>
              </div>
              <div v-if="event.attendees" class="flex items-center space-x-2">
                <Users class="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span class="text-gray-300">{{ event.attendees }} asistentes</span>
              </div>
            </div>
          </header>

          <section class="prose prose-invert max-w-none">
            <h2 class="text-xl font-semibold text-white mb-4">
              Acerca del Evento
            </h2>
            <div class="text-gray-300 leading-relaxed" itemprop="description">{{ event.description }}</div>
          </section>
        </div>

        <section class="card" aria-labelledby="location-heading">
          <h2 id="location-heading" class="text-xl font-semibold text-white mb-4">Ubicación</h2>
          <div class="mb-4" itemprop="location" itemscope itemtype="https://schema.org/Place">
            <div class="flex items-center space-x-2 mb-2">
              <MapPin class="w-5 h-5 text-orange-500" aria-hidden="true" />
              <span class="text-white font-medium" itemprop="name">{{ event.location }}</span>
            </div>
            <address class="text-gray-300 ml-7 not-italic" itemprop="address">{{ event.address }}</address>
            <meta itemprop="latitude" :content="event.latitude?.toString()" />
            <meta itemprop="longitude" :content="event.longitude?.toString()" />
          </div>
          <div class="rounded-lg overflow-hidden h-64">
            <MapLeaflet
              v-if="event.latitude && event.longitude"
              :lat="event.latitude"
              :lng="event.longitude"
              :aria-label="`Mapa mostrando la ubicación del evento en ${event.location}`"
            />
            <div
              v-else
              class="bg-gray-700 text-center text-gray-400 py-10 rounded-lg"
              role="img"
              aria-label="Ubicación no disponible en el mapa"
            >
              Ubicación no disponible
            </div>
          </div>
        </section>
      </div>

      <aside class="space-y-6">
        <div class="card">
          <div class="flex space-x-2">
            <button
              class="btn-secondary flex-1 flex items-center justify-center"
              aria-label="Compartir evento en redes sociales"
            >
              <Share2 class="w-4 h-4 mr-2" aria-hidden="true" />
              Compartir
            </button>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-4">
            Información del Evento
          </h3>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-gray-400">Fecha:</dt>
              <dd class="text-white">
                <time :datetime="event.date">{{ formatDate(event.date) }}</time>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-400">Hora:</dt>
              <dd class="text-white">{{ event.time }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-400">Ubicación:</dt>
              <dd class="text-white">{{ event.location }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-400">Categoría:</dt>
              <dd class="text-white">
                <span itemprop="category">{{ event.category }}</span>
              </dd>
            </div>
            <div v-if="event.attendees" class="flex justify-between">
              <dt class="text-gray-400">Asistentes:</dt>
              <dd class="text-white">{{ event.attendees }}</dd>
            </div>
          </dl>
        </div>

        <div v-if="event.organizer" class="card">
          <h3 class="text-lg font-semibold text-white mb-4">Organizador</h3>
          <div class="flex items-center space-x-3" itemprop="organizer" itemscope itemtype="https://schema.org/Person">
            <img
              :src="event.organizer.avatar_url"
              :alt="`Foto de perfil de ${event.organizer.name}`"
              class="w-12 h-12 rounded-full object-cover"
              itemprop="image"
            />
            <div>
              <h4 class="font-medium text-white" itemprop="name">{{ event.organizer.name }}</h4>
              <p class="text-sm text-gray-400">
                Miembro desde {{ event.organizer.member_since }}
              </p>
            </div>
          </div>
        </div>

        <!-- Hidden schema.org data -->
        <div class="sr-only">
          <span itemprop="eventStatus" content="https://schema.org/EventScheduled">Programado</span>
          <span itemprop="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode">Presencial</span>
          <span itemprop="url" :content="`${config.public.baseUrl}/events/${eventId}`">URL del evento</span>
          <time itemprop="endDate" :datetime="event.date">{{ event.date }}</time>
        </div>
      </aside>
    </article>

    <div v-if="event === null && !isLoading" class="text-center py-12" role="alert">
      <div class="text-gray-400 text-lg">Evento no encontrado</div>
      <NuxtLink
        to="/events"
        class="text-orange-500 hover:text-orange-400 mt-2 inline-block"
        aria-label="Volver a la lista de eventos"
      >
        Volver a eventos
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/composables/useEvents";
import { ref, computed, watch, onMounted } from "vue";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Heart,
  Share2,
} from "lucide-vue-next";
import { useRoute } from "vue-router";
import MapLeaflet from "~/components/MapLeaflet.vue";

const event = ref<Event | null | undefined>(null);
const route = useRoute();
const { events, fetchEventsFromApi, getEventById } = useEvents();
const config = useRuntimeConfig();

const eventId = route.params.id as string;
const isLoading = ref(true);

onMounted(async () => {
  const L = await import('leaflet');
  await fetchEvent();
  console.log("Evento cargado:", event.value);
});

const fetchEvent = async () => {
  isLoading.value = true;
  try {
    event.value = await getEventById(eventId);
  } catch (error) {
    console.error("Error al cargar el evento:", error);
    event.value = null;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Structured data for the event
const structuredData = computed(() => {
  if (!event.value) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.value.title,
    "description": event.value.description,
    "startDate": event.value.date,
    "endDate": event.value.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.value.location,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.value.address,
        "addressLocality": event.value.location
      },
      "geo": event.value.latitude && event.value.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": event.value.latitude,
        "longitude": event.value.longitude
      } : undefined
    },
    "image": event.value.image_url,
    "url": `${config.public.baseUrl}/events/${eventId}`,
    "category": event.value.category,
    "organizer": event.value.organizer ? {
      "@type": "Person",
      "name": event.value.organizer.name,
      "image": event.value.organizer.avatar_url
    } : {
      "@type": "Organization",
      "name": "Zonora"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "CLP",
      "url": `${config.public.baseUrl}/events/${eventId}`
    }
  };
});

// Breadcrumb structured data
const breadcrumbData = {
  "@context": "https://schema.org",
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
      "name": "Eventos",
      "item": `${config.public.baseUrl}/events`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": event.value?.title || "Evento",
      "item": `${config.public.baseUrl}/events/${eventId}`
    }
  ]
};

useHead(() => {
  if (!event.value) {
    return {
      title: 'Evento - Zonora',
      meta: [
        {
          name: 'description',
          content: 'Detalles del evento en Zonora'
        },
        {
          name: 'robots',
          content: 'noindex, nofollow'
        }
      ]
    };
  }

  const eventDate = new Date(event.value.date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    title: `${event.value.title} - ${formattedDate} - Zonora`,
    meta: [
      {
        name: 'description',
        content: `${event.value.description.substring(0, 155)}... | Evento en ${event.value.location} el ${formattedDate}. Más información en Zonora.`
      },
      {
        name: 'keywords',
        content: `${event.value.title}, ${event.value.category}, ${event.value.location}, evento, concierto, ${formattedDate}`
      },
      {
        name: 'author',
        content: event.value.organizer?.name || 'Zonora'
      },
      {
        name: 'robots',
        content: 'index, follow'
      },
      // Open Graph
      {
        property: 'og:title',
        content: `${event.value.title} - ${formattedDate}`
      },
      {
        property: 'og:description',
        content: `${event.value.description.substring(0, 155)}...`
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:url',
        content: `${config.public.baseUrl}/events/${eventId}`
      },
      {
        property: 'og:image',
        content: event.value.image_url
      },
      {
        property: 'og:image:alt',
        content: `Imagen del evento ${event.value.title}`
      },
      {
        property: 'og:site_name',
        content: 'Zonora'
      },
      {
        property: 'og:locale',
        content: 'es_ES'
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: `${event.value.title} - ${formattedDate}`
      },
      {
        name: 'twitter:description',
        content: `${event.value.description.substring(0, 155)}...`
      },
      {
        name: 'twitter:image',
        content: event.value.image_url
      },
      {
        name: 'twitter:image:alt',
        content: `Imagen del evento ${event.value.title}`
      },
      // Event specific meta
      {
        name: 'event:start_time',
        content: event.value.date
      },
      {
        name: 'event:location',
        content: event.value.location
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: `${config.public.baseUrl}/events/${eventId}`
      }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(structuredData.value)
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbData)
      }
    ]
  };
});
</script>
