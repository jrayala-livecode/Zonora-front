export default defineNuxtPlugin(() => {
  const { showLoading, hideLoading } = useLoading()
  const router = useRouter()

  // Show loading on route change start
  router.beforeEach((to, from) => {
    // Don't show loading for same route
    if (to.path === from.path) return

    // Show loading with appropriate message
    const routeName = to.name as string
    let loadingMessage = 'Cargando...'

    // Customize loading message based on route
    if (routeName?.includes('artists')) {
      loadingMessage = 'Cargando artistas...'
    } else if (routeName?.includes('events')) {
      loadingMessage = 'Cargando eventos...'
    } else if (routeName?.includes('venues')) {
      loadingMessage = 'Cargando venues...'
    } else if (routeName?.includes('chat')) {
      loadingMessage = 'Cargando chat...'
    } else if (routeName?.includes('profile')) {
      loadingMessage = 'Cargando perfil...'
    } else if (routeName?.includes('dashboard')) {
      loadingMessage = 'Cargando dashboard...'
    }

    showLoading(loadingMessage)
  })

  // Hide loading on route change complete
  router.afterEach(() => {
    // Add small delay to ensure smooth transition
    setTimeout(() => {
      hideLoading()
    }, 100)
  })

  // Hide loading on route change error
  router.onError(() => {
    hideLoading()
  })
})
