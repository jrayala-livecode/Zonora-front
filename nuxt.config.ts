// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  
  // SSR Configuration
  ssr: true,
  
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
  
  // App Configuration
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
  
  // Runtime Config
  runtimeConfig: {
    public: {
      appName: 'Zonora'
    }
  }
})