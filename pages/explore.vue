<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">Explorar Eventos</h1>
        <p class="text-xl text-gray-300">Descubre nuevos eventos y experiencias</p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.name"
          class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
        >
          <div class="text-4xl mb-4">{{ category.icon }}</div>
          <h3 class="text-xl font-semibold text-white mb-2">{{ category.name }}</h3>
          <p class="text-gray-400 mb-4">{{ category.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ category.count }} eventos</span>
            <NuxtLink to="/events" class="text-orange-500 hover:text-orange-400 text-sm">
              Ver más →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { events } = useEvents();

const musicEventsCount = computed(() => events.value.length);

// Categories commented out - only music events for now
// const categories = [
//   {
//     name: 'Música',
//     icon: '🎵',
//     description: 'Conciertos, festivales y espectáculos musicales',
//     count: musicEventsCount.value
//   }
// ];

// SEO
useHead({
  title: 'Explorar - Zonora',
  meta: [
    { name: 'description', content: 'Explora diferentes categorías de eventos en Zonora' }
  ]
});
</script>