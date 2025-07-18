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
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt'
  ],
  
  // CSS Configuration
  css: ['~/assets/css/main.css'],
  
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
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
  
    }
  }
})