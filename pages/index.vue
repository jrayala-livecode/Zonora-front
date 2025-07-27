<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Descubre Eventos
          <span class="text-orange-500">Increíbles</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses.
        </p>
        <nav class="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Navegación principal">
          <NuxtLink to="/events" class="btn-primary text-lg px-8 py-4 animate-pulse" aria-label="Explorar todos los eventos disponibles">
            Explorar Eventos
          </NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/create" class="btn-secondary text-lg px-8 py-4" aria-label="Crear un nuevo evento">
            Crear Evento
          </NuxtLink>
        </nav>
      </div>
    </section>

    <!-- Featured Events -->
    <section class="py-16 bg-gray-900 animate-fade-in" aria-labelledby="featured-events-heading">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="flex justify-between items-center mb-8">
          <h2 id="featured-events-heading" class="text-3xl font-bold text-white">Eventos Destacados</h2>
          <NuxtLink to="/events" class="text-orange-500 hover:text-orange-400 font-medium" aria-label="Ver todos los eventos">
            Ver todos →
          </NuxtLink>
        </header>
        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center py-20" role="status" aria-live="polite">
          <div class="text-orange-400 text-lg animate-pulse">Cargando eventos...</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation" role="list">
          <article
            v-for="event in featuredEvents"
            :key="event.id"
            class="group transform transition-all duration-300 hover:scale-105"
            role="listitem"
          >
            <NuxtLink
              :to="`/events/${event.id}`"
              :aria-label="`Ver detalles del evento ${event.title} el ${formatDate(event.date)} en ${event.location}`"
              class="block"
            >
              <div class="bg-gray-800 rounded-sm overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:shadow-2xl">
                <img
                  v-if="!imageLoadErrors[event.id]"
                  :src="event.image_url"
                  :alt="`Imagen del evento ${event.title} en ${event.location}`"
                  class="w-full h-56 object-cover group-hover:scale-101 transition-transform duration-500"
                  @error="handleImageError(event.id)"
                  loading="lazy"
                />
                <!-- Fallback when image fails -->
                <div
                  v-else
                  class="w-full h-56 bg-gray-600 flex items-center justify-center"
                  role="img"
                  :aria-label="`Sin imagen disponible para el evento ${event.title}`"
                >
                  <span class="text-gray-400 text-sm text-center">Sin imagen</span>
                </div>
                <div class="p-6">
                  <h3 class="font-semibold text-white group-hover:text-orange-400 transition-colors duration-300 mb-2">
                    {{ event.title }}
                  </h3>
                  <time class="text-sm text-gray-400 mb-3 block" :datetime="event.date">
                    {{ formatDate(event.date) }} • {{ event.time }}
                  </time>
                  <p class="text-gray-300 text-sm line-clamp-2">
                    {{ event.description }}
                  </p>
                  <address class="flex items-center mt-4 text-sm text-gray-400 transform group-hover:translate-x-2 transition-transform duration-300 not-italic">
                    <MapPin class="w-4 h-4 mr-1" aria-hidden="true" />
                    {{ event.location }}
                  </address>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- Categories Section Commented Out - Only Music Events for now -->
    <!-- 
    <section class="py-16 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-8 text-center">
          Explora por Categorías
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
            <div class="text-4xl mb-4">🎵</div>
            <h3 class="font-semibold text-white">Música</h3>
            <p class="text-sm text-gray-400 mt-1">{{ events.length }} eventos</p>
          </div>
        </div>
      </div>
    </section>
    -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { MapPin } from 'lucide-vue-next';

const { events, fetchEventsFromApi, isLoading } = useEvents();
const { isAuthenticated } = useAuth();

onMounted(() => {
  fetchEventsFromApi();
});

const featuredEvents = computed(() => events.value.slice(0, 6));

const imageLoadErrors = ref<Record<string, boolean>>({});

const handleImageError = (eventId: string) => {
  imageLoadErrors.value[eventId] = true;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    month: 'long',
    day: 'numeric'
  });
};

// Structured data for SEO
const structuredData = computed(() => {
  const events = featuredEvents.value.map(event => ({
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "endDate": event.date,
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": event.location
    },
    "image": event.image_url,
    "url": `${useRuntimeConfig().public.baseUrl}/events/${event.id}`,
    "organizer": {
      "@type": "Organization",
      "name": "Zonora"
    },
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  }));

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Zonora - Descubre Eventos Increíbles",
    "description": "Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses.",
    "url": useRuntimeConfig().public.baseUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": events.map((event, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": event
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zonora",
      "url": useRuntimeConfig().public.baseUrl
    }
  };
});

useHead({
  title: 'Zonora - Descubre Eventos Increíbles en Tu Ciudad',
  meta: [
    {
      name: 'description',
      content: 'Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses. Encuentra conciertos, festivales y eventos culturales cerca de ti.'
    },
    {
      name: 'keywords',
      content: 'eventos, conciertos, festivales, música, entretenimiento, ciudad, cultura, espectáculos'
    },
    {
      name: 'author',
      content: 'Zonora'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      name: 'googlebot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Zonora - Descubre Eventos Increíbles en Tu Ciudad'
    },
    {
      property: 'og:description',
      content: 'Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: useRuntimeConfig().public.baseUrl
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
      content: 'Zonora - Descubre Eventos Increíbles en Tu Ciudad'
    },
    {
      name: 'twitter:description',
      content: 'Explora una amplia variedad de eventos en tu ciudad y conecta con personas que comparten tus intereses.'
    },
    // Additional SEO meta tags
    {
      name: 'theme-color',
      content: '#f97316'
    },
    {
      name: 'msapplication-TileColor',
      content: '#f97316'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: useRuntimeConfig().public.baseUrl
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData.value)
    }
  ]
});

// Set page language
useHead({
  htmlAttrs: {
    lang: 'es'
  }
});
</script>
