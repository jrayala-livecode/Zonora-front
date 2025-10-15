// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  // SSR Configuration
  ssr: true,
  
  // Page transitions
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Zonora',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Descubre y crea eventos increíbles en Zonora' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],
  
  // CSS Configuration
  css: [
    '~/assets/css/main.css',
    'leaflet/dist/leaflet.css'
  ],
  
  // Build Configuration
  build: {
    transpile: ['chart.js']
  },
  
  // Google Fonts
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
    }
  },
  
  // Runtime Config
  runtimeConfig: {
    public: {
      appName: 'Zonora',    
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      pusherCluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER,
      reverbAppKey: process.env.NUXT_PUBLIC_REVERB_APP_KEY || 'undergroundvenues',
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST || 'localhost',
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT || 8080,
    }
  }
})