<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-white text-center">
      <h1 class="text-2xl font-bold mb-4">Auth Test Page</h1>
      <p>If you can see this page, the auth middleware is working!</p>
      <p class="text-sm text-gray-400 mt-2">Check console for middleware logs</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
</script>


