export default defineNuxtConfig({
  ssr: false, // ⚠️ desactiva SSR (puro SPA)
  // target ya no se usa en Nuxt 3, pero no hace daño si lo dejás
  // target: 'static',

  // ❌ Quitar esto completamente si es SPA estática
  target: 'static',

  generate: {
    fallback: true // Necesario para que Netlify sirva index.html en rutas desconocidas
  },

  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
    }
  },

  app: {
    head: {
      title: 'Zonora - Descubre Eventos Increíbles',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Descubre y crea eventos increíbles en Zonora' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      appName: 'Zonora'
    }
  }
})
