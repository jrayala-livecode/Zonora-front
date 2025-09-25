<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          Política de Privacidad
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Cómo recopilamos, usamos y protegemos tu información personal
        </p>
      </div>

      <!-- Content -->
      <div class="bg-gray-800 rounded-xl shadow-xl p-8">
        <div class="prose prose-invert max-w-none">
          <h2 class="text-2xl font-bold text-white mb-6">1. Información que Recopilamos</h2>
          <p class="text-gray-300 mb-6">
            Recopilamos información que nos proporcionas directamente, como:
          </p>
          <ul class="text-gray-300 mb-6 list-disc list-inside space-y-2">
            <li>Nombre y dirección de correo electrónico</li>
            <li>Información de perfil y preferencias</li>
            <li>Contenido que publicas en la plataforma</li>
            <li>Información de eventos que creas o en los que participas</li>
          </ul>

          <h2 class="text-2xl font-bold text-white mb-6">2. Cómo Usamos tu Información</h2>
          <p class="text-gray-300 mb-6">
            Utilizamos tu información para:
          </p>
          <ul class="text-gray-300 mb-6 list-disc list-inside space-y-2">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Comunicarnos contigo sobre eventos y actualizaciones</li>
            <li>Personalizar tu experiencia en la plataforma</li>
            <li>Garantizar la seguridad y prevenir fraudes</li>
          </ul>

          <h2 class="text-2xl font-bold text-white mb-6">3. Compartir Información</h2>
          <p class="text-gray-300 mb-6">
            No vendemos ni compartimos tu información personal con terceros, excepto cuando:
          </p>
          <ul class="text-gray-300 mb-6 list-disc list-inside space-y-2">
            <li>Sea necesario para proporcionar nuestros servicios</li>
            <li>Tengas tu consentimiento explícito</li>
            <li>Sea requerido por ley</li>
          </ul>

          <h2 class="text-2xl font-bold text-white mb-6">4. Seguridad de los Datos</h2>
          <p class="text-gray-300 mb-6">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
          </p>

          <h2 class="text-2xl font-bold text-white mb-6">5. Tus Derechos</h2>
          <p class="text-gray-300 mb-6">
            Tienes derecho a:
          </p>
          <ul class="text-gray-300 mb-6 list-disc list-inside space-y-2">
            <li>Acceder a tu información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de tu cuenta</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
          </ul>

          <h2 class="text-2xl font-bold text-white mb-6">6. Cookies y Tecnologías Similares</h2>
          <p class="text-gray-300 mb-6">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de nuestro servicio y personalizar el contenido.
          </p>

          <h2 class="text-2xl font-bold text-white mb-6">7. Contacto</h2>
          <p class="text-gray-300 mb-6">
            Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de nuestro sistema de soporte.
          </p>

          <p class="text-gray-400 text-sm mt-8">
            Última actualización: {{ new Date().toLocaleDateString('es-ES') }}
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
  title: 'Política de Privacidad - Zonora',
  meta: [
    { name: 'description', content: 'Política de privacidad de la plataforma Zonora' }
  ]
});
</script>
