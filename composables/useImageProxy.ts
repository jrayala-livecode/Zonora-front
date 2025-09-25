import { useRuntimeConfig } from '#app'

export const useImageProxy = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get proxy URL for an image CID
   * @param cid - The IPFS CID
   * @returns The proxy URL
   */
  const getProxyUrl = (cid: string): string => {
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
    // Ensure we use the correct API URL with port 8000
    const apiUrl = baseUrl.includes(':8000') ? baseUrl : 'http://localhost:8000'
    return `${apiUrl}/api/pinata/${cid}`
  }
  
  /**
   * Extract CID from a Pinata URL
   * @param url - The Pinata URL
   * @returns The CID or null if not found
   */
  const extractCidFromUrl = (url: string): string | null => {
    if (!url) return null
    
    // Check if it's already a proxy URL
    if (url.includes('/api/pinata/')) {
      const match = url.match(/\/api\/pinata\/([a-zA-Z0-9]+)/)
      return match ? match[1] : null
    }
    
    // Extract from Pinata gateway URL
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }
  
  /**
   * Convert any image URL to proxy URL
   * @param url - The original image URL
   * @returns The proxy URL
   */
  const convertToProxyUrl = (url: string): string => {
    if (!url) return ''
    
    // If it's already a proxy URL, return as is
    if (url.includes('/api/pinata/')) {
      return url
    }
    
    // Extract CID and convert to proxy URL
    const cid = extractCidFromUrl(url)
    if (cid) {
      return getProxyUrl(cid)
    }
    
    // If no CID found, return original URL
    return url
  }
  
  /**
   * Pre-cache images for an artist
   * @param artistId - The artist ID
   * @returns Promise with cache results
   */
  const precacheArtistImages = async (artistId: string): Promise<any> => {
    try {
      const baseUrl = config.public.apiBaseUrl || 'http://localhost:8000'
      // Ensure we use the correct API URL with port 8000
      const apiUrl = baseUrl.includes(':8000') ? baseUrl : 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/pinata/precache/${artistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error precaching artist images:', error)
      throw error
    }
  }
  
  return {
    getProxyUrl,
    extractCidFromUrl,
    convertToProxyUrl,
    precacheArtistImages
  }
}
