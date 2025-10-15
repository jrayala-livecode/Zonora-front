import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  // Make Pusher available globally for Echo
  ;(window as any).Pusher = Pusher

  const echo = new Echo({
    broadcaster: 'pusher',
    key: config.public.reverbAppKey || 'undergroundvenues',
    wsHost: config.public.reverbHost || 'localhost',
    wsPort: config.public.reverbPort || 8080,
    wssPort: config.public.reverbPort || 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: 'mt1',
    auth: {
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json',
      },
    },
    authEndpoint: `${config.public.apiBaseUrl || 'http://localhost:8000'}/broadcasting/auth`,
  })

  return {
    provide: {
      echo,
    },
  }
})

