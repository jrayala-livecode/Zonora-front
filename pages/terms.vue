<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          Términos de Servicio
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Los términos y condiciones que rigen el uso de Zonora
        </p>
      </div>

      <!-- Content -->
      <div class="bg-gray-800 rounded-xl shadow-xl p-8">
        <div class="prose prose-invert max-w-none">
          <h2 class="text-2xl font-bold text-white mb-6">1. Aceptación de los Términos</h2>
          <p class="text-gray-300 mb-6">
            Al acceder y usar Zonora, aceptas estar sujeto a estos términos de servicio y todas las leyes y regulaciones aplicables.
          </p>

          <h2 class="text-2xl font-bold text-white mb-6">2. Uso del Servicio</h2>
          <p class="text-gray-300 mb-6">
            Zonora es una plataforma para la gestión y promoción de eventos musicales. Al usar nuestro servicio, te comprometes a:
          </p>
          <ul class="text-gray-300 mb-6 list-disc list-inside space-y-2">
            <li>Proporcionar información veraz y actualizada</li>
            <li>Respetar los derechos de otros usuarios</li>
            <li>No utilizar el servicio para actividades ilegales</li>
            <li>Mantener la seguridad de tu cuenta</li>
          </ul>

          <h2 class="text-2xl font-bold text-white mb-6">3. Contenido del Usuario</h2>
          <p class="text-gray-300 mb-6">
            Eres responsable del contenido que publiques en Zonora. Nos reservamos el derecho de moderar y eliminar contenido que viole estos términos.
          </p>

          <h2 class="text-2xl font-bold text-white mb-6">4. Privacidad</h2>
          <p class="text-gray-300 mb-6">
            Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para entender cómo recopilamos y usamos tu información.
          </p>

          <h2 class="text-2xl font-bold text-white mb-6">5. Modificaciones</h2>
          <p class="text-gray-300 mb-6">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.
          </p>

          <h2 class="text-2xl font-bold text-white mb-6">6. Contacto</h2>
          <p class="text-gray-300 mb-6">
            Si tienes preguntas sobre estos términos, puedes contactarnos a través de nuestro sistema de soporte.
          </p>
        </div>
      </div>

      <!-- Back Button -->
      <div class="text-center mt-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'Términos de Servicio - Zonora',
  meta: [
    { name: 'description', content: 'Términos y condiciones de uso de la plataforma Zonora' }
  ]
});
</script>
