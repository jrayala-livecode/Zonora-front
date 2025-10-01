export default defineNuxtPlugin(() => {
  const router = useRouter()
  
  // Router middleware
  router.beforeEach((to, from, next) => {
    // Add custom logic here
    next()
  })
  
  // Router afterEach
  router.afterEach((to, from) => {
    // Add custom logic here
  })
}) 