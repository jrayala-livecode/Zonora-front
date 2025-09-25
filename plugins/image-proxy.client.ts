export default defineNuxtPlugin(() => {
  // Global image URL interceptor to convert Pinata URLs to proxy URLs
  const convertImageUrl = (url: string): string => {
    if (!url) return url
    
    // If it's already a proxy URL, return as is
    if (url.includes('/api/pinata/')) {
      return url
    }
    
    // If it's a direct Pinata URL, convert to proxy
    if (url.includes('gateway.pinata.cloud/ipfs/')) {
      const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/)
      if (match) {
        const cid = match[1]
        const config = useRuntimeConfig()
        const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
        // Ensure we use the correct API URL with port 8000
        const apiUrl = baseUrl.includes(':8000') ? baseUrl : 'http://localhost:8000'
        return `${apiUrl}/api/pinata/${cid}`
      }
    }
    
    return url
  }
  
  // Make it globally available
  return {
    provide: {
      convertImageUrl
    }
  }
})
